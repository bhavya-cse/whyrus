import os
import uuid
import datetime
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("whyrus.api")

from models.schemas import (
    AnalysisRequest,
    AnalysisResult,
    GitDiffFinding,
)
from analyzer.redactor import redact_secrets
from analyzer.parser import parse_logs_deterministic
from analyzer.git_diff import parse_git_diff
from analyzer.ranker import analyze_incident_deterministic
from analyzer.ai_engine import run_gemini_analysis

app = FastAPI(
    title="Whyrus Incident Analysis API",
    description="Evidence-grounded root-cause analysis and incident reconstruction engine",
    version="1.0.0"
)

# Explicitly configured origins for development and production environments
ALLOWED_ORIGINS_RAW = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
)
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS_RAW.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Ensures internal stack traces, system paths, and unhandled errors are never leaked to clients.
    Logs full exception trace internally for debugging.
    """
    logger.error("Unhandled exception processing request '%s': %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred while processing the incident. Internal details have been logged safely."}
    )


@app.get("/api/health")
def health_check():
    has_gemini = bool(os.environ.get("GEMINI_API_KEY", "").strip())
    return {
        "status": "healthy",
        "service": "Whyrus Incident Analysis Engine",
        "version": "1.0.0",
        "ai_engine_configured": has_gemini,
        "ai_provider": "Google Gemini" if has_gemini else "None (Deterministic Rule Engine active)",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


@app.get("/api/presets")
def get_incident_presets():
    return [
        {
            "id": "db-cascade",
            "name": "Database Pool Exhaustion Cascade",
            "description": "Connection timeout in database pool triggering order service failure and HTTP 500 error cascade.",
            "service_context": "order-service",
            "raw_logs": (
                "10:42:01 INFO [order-service] Order service started on port 8080\n"
                "10:42:03 INFO [order-service] Connecting to primary database at postgres://app-db:5432/orders\n"
                "10:42:04 ERROR [db-pool] Connection timeout: could not acquire connection after 1000ms\n"
                "10:42:05 ERROR [order-service] Failed to create order #89211: Database unavailable\n"
                "10:42:06 ERROR [http-server] HTTP 500 Internal Server Error - POST /api/v1/orders"
            ),
            "git_diff": (
                "diff --git a/config/database.yml b/config/database.yml\n"
                "--- a/config/database.yml\n"
                "+++ b/config/database.yml\n"
                "@@ -12,4 +12,4 @@\n"
                "-  pool_size: 25\n"
                "-  timeout_ms: 5000\n"
                "+  pool_size: 4\n"
                "+  timeout_ms: 1000\n"
            )
        },
        {
            "id": "oom-spike",
            "name": "JVM Batch Heap Exhaustion (OOMKilled)",
            "description": "Large batch processing triggering memory limit breach, prolonged GC pause, and container SIGKILL.",
            "service_context": "payment-worker",
            "raw_logs": (
                "03:14:10 INFO [payment-worker] Processing batch reconciliation for 25,000 transactions\n"
                "03:14:22 WARN [jvm-gc] High memory pressure detected: GC pause duration 1820ms (> 500ms threshold)\n"
                "03:14:28 ERROR [payment-worker] java.lang.OutOfMemoryError: Java heap space\n"
                "    at java.base/java.util.Arrays.copyOf(Arrays.java:3537)\n"
                "    at com.whyrus.payment.BatchProcessor.loadRecords(BatchProcessor.java:142)\n"
                "    at com.whyrus.payment.Worker.run(Worker.java:58)\n"
                "03:14:29 FATAL [container] Process received signal SIGKILL (cgroup memory limit 2048MB exceeded)"
            ),
            "git_diff": (
                "diff --git a/src/BatchProcessor.java b/src/BatchProcessor.java\n"
                "--- a/src/BatchProcessor.java\n"
                "+++ b/src/BatchProcessor.java\n"
                "@@ -35,2 +35,2 @@\n"
                "-  private static final int BATCH_CHUNK_SIZE = 500;\n"
                "+  private static final int BATCH_CHUNK_SIZE = 25000;\n"
            )
        },
        {
            "id": "jwt-expiry",
            "name": "Clock Skew & Auth Token Invalidation",
            "description": "Microservice authentication token expiration causing 401 Unauthorized cascade across user dashboards.",
            "service_context": "auth-gateway",
            "raw_logs": (
                "14:05:01 INFO [auth-gateway] Initializing token verification filter with issuer https://auth.whyrus.internal\n"
                "14:05:12 WARN [auth-gateway] Token issued in future or expired (nbf/exp verification failure). Skew detected: 120s\n"
                "14:05:13 ERROR [auth-gateway] Unauthorized: TokenExpiredError: jwt expired at 2026-10-24T14:03:00Z\n"
                "14:05:14 ERROR [user-service] HTTP 401 Unauthorized for client request id req_98f12a\n"
                "14:05:15 ERROR [dashboard-ui] Failed to load user profile: 401 Unauthorized"
            ),
            "git_diff": None
        }
    ]


@app.post("/api/redact-preview")
def preview_redaction(payload: dict):
    raw_text = payload.get("text", "")
    redacted_text, count = redact_secrets(raw_text)
    return {
        "original_length": len(raw_text),
        "redacted_text": redacted_text,
        "redactions_count": count
    }


@app.post("/api/analyze", response_model=AnalysisResult)
def analyze_incident(request: AnalysisRequest):
    # 1. Validation of payload size and presence
    if not request.raw_logs or not request.raw_logs.strip():
        raise HTTPException(status_code=400, detail="Log content cannot be empty.")

    if len(request.raw_logs) > 500_000:
        raise HTTPException(
            status_code=413,
            detail="Log payload exceeds safe processing limit (500 KB). Please truncate to the failure window."
        )

    if request.git_diff and len(request.git_diff) > 200_000:
        raise HTTPException(
            status_code=413,
            detail="Git diff exceeds safe processing limit (200 KB). Please supply a focused commit diff."
        )

    # 2. Redact secrets across all user inputs before processing or AI calls
    sanitized_logs, log_redaction_count = redact_secrets(request.raw_logs)
    sanitized_diff, diff_redaction_count = (
        redact_secrets(request.git_diff) if request.git_diff else (None, 0)
    )
    sanitized_context, context_redaction_count = (
        redact_secrets(request.service_context) if request.service_context else (None, 0)
    )
    total_redacted = log_redaction_count + diff_redaction_count + context_redaction_count

    # 3. Parse logs deterministically into timeline events
    events, parsing_warnings = parse_logs_deterministic(sanitized_logs)
    if not events:
        raise HTTPException(status_code=422, detail="Failed to parse any valid events from supplied log input.")

    # 4. Parse git diff if supplied
    git_findings: List[GitDiffFinding] = []
    if sanitized_diff:
        git_findings = parse_git_diff(sanitized_diff, events)

    # 5. Generate deterministic overview, hypotheses, and actions
    overview, det_hypotheses, det_actions = analyze_incident_deterministic(
        events=events,
        git_diff_findings=git_findings,
        service_context=sanitized_context
    )

    # 6. Enrich with Gemini AI if requested and configured
    if request.use_ai:
        hypotheses, actions, engine_used, engine_notes = run_gemini_analysis(
            events=events,
            overview=overview,
            deterministic_hypotheses=det_hypotheses,
            deterministic_actions=det_actions,
            git_diff_findings=git_findings,
            service_context=sanitized_context
        )
    else:
        hypotheses = det_hypotheses
        actions = det_actions
        engine_used = "deterministic-rule-engine"
        engine_notes = "Deterministic analysis performed (AI synthesis toggled off by user request)."

    incident_id = f"inc-{uuid.uuid4().hex[:8]}"
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    return AnalysisResult(
        incident_id=incident_id,
        created_at=created_at,
        overview=overview,
        timeline=events,
        hypotheses=hypotheses,
        recommended_actions=actions,
        git_diff_findings=git_findings,
        redacted_secrets_count=total_redacted,
        analysis_engine_used=engine_used,
        engine_notes=engine_notes,
        parsing_warnings=parsing_warnings
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
