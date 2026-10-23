import re
from typing import List, Tuple, Dict, Any, Optional
from models.schemas import LogEvent, Hypothesis, RecommendedAction, IncidentOverview, GitDiffFinding


def analyze_incident_deterministic(
    events: List[LogEvent],
    git_diff_findings: Optional[List[GitDiffFinding]] = None,
    service_context: Optional[str] = None
) -> Tuple[IncidentOverview, List[Hypothesis], List[RecommendedAction]]:
    """
    Analyzes parsed log events to produce:
    1. Incident Overview (primary error, severity, timestamps)
    2. Ranked Root-Cause Hypotheses (with concrete supporting evidence IDs and alternatives)
    3. Categorized Actionable Recommendations
    """
    total_events = len(events)
    error_events = [e for e in events if e.is_error]
    error_count = len(error_events)

    first_time = events[0].timestamp if events and events[0].timestamp else None
    last_time = events[-1].timestamp if events and events[-1].timestamp else None

    # Identify affected components
    components = set()
    for e in events:
        if e.component:
            components.add(e.component)
        # Scan for service keywords
        svc_match = re.search(r'([a-zA-Z0-9_\-]{3,20}-service|[a-zA-Z0-9_\-]{3,20}-api|database|postgres|redis|auth-gateway|auth|http-server)', e.raw_line, re.IGNORECASE)
        if svc_match:
            components.add(svc_match.group(1).lower())
    if service_context:
        components.add(service_context)
    affected_components = sorted(list(components))

    # Identify primary error: Earliest error or critical event in the timeline
    primary_event = error_events[0] if error_events else (events[0] if events else None)
    primary_error_msg = primary_event.message if primary_event else "No clear error detected in supplied logs"

    # Severity determination
    has_critical = any(e.level in ("CRITICAL", "FATAL") for e in events)
    has_500 = any("500" in e.raw_line or "Internal Server Error" in e.raw_line for e in events)
    has_oom = any("outofmemory" in e.raw_line.lower() or "sigkill" in e.raw_line.lower() for e in events)
    has_database_timeout = any("timeout" in e.raw_line.lower() or "connection refused" in e.raw_line.lower() for e in events)
    has_auth_cascade = any("401" in e.raw_line or "unauthorized" in e.raw_line.lower() for e in events)

    if has_critical or has_oom or (has_500 and error_count >= 2):
        severity = "CRITICAL"
        if has_oom:
            severity_reasoning = f"Fatal process termination or OutOfMemory condition detected ({error_count} error events)."
        else:
            severity_reasoning = f"Incident produced fatal cascade with HTTP 500 or critical failures ({error_count} error events detected)."
    elif error_count >= 2 or has_database_timeout or has_auth_cascade:
        severity = "HIGH"
        if has_auth_cascade:
            severity_reasoning = f"Subsystem authorization cascade rejecting client requests ({error_count} error events)."
        else:
            severity_reasoning = f"Multiple cascading errors or subsystem connection failures affecting service availability ({error_count} error events)."
    elif error_count == 1:
        severity = "MEDIUM"
        severity_reasoning = "Isolated error detected without downstream application crash."
    else:
        severity = "LOW"
        severity_reasoning = "No explicit error-level log lines detected. Informational sequence or warning."

    # Incident Overview Summary
    summary_parts = []
    if primary_event:
        summary_parts.append(f"Incident triggered at {primary_event.timestamp or 'initial step'} with '{primary_event.message[:65]}'.")
    if len(error_events) > 1:
        downstream = error_events[-1]
        summary_parts.append(f"Subsequent cascading failure observed at {downstream.timestamp or 'later step'} ('{downstream.message[:50]}').")
    if affected_components:
        summary_parts.append(f"Involved components: {', '.join(affected_components[:3])}.")
    summary = " ".join(summary_parts) if summary_parts else "Log trace inspected; baseline health and status events parsed."

    overview = IncidentOverview(
        summary=summary,
        primary_error=primary_error_msg,
        affected_components=affected_components,
        severity=severity,
        severity_reasoning=severity_reasoning,
        first_event_time=first_time,
        last_event_time=last_time,
        total_events=total_events,
        error_count=error_count
    )

    # Build Hypotheses
    hypotheses: List[Hypothesis] = []
    actions: List[RecommendedAction] = []

    # Pattern 1: Database or Storage Timeout / Unavailability
    db_keywords = ["database", "db", "postgres", "mysql", "mongodb", "redis", "connection timeout", "connection refused", "pool exhausted", "could not acquire connection"]
    matching_db_events = [e for e in events if any(k in e.raw_line.lower() for k in db_keywords) and e.is_error]

    if matching_db_events:
        db_ev_ids = [e.id for e in matching_db_events]
        cascade_events = [e for e in events if e.id not in db_ev_ids and e.is_error]
        supporting_ids = db_ev_ids + [e.id for e in cascade_events[:2]]

        hypotheses.append(Hypothesis(
            id="H-01",
            rank=1,
            title="Database Connection Timeout or Pool Exhaustion",
            confidence_label="High" if len(db_ev_ids) >= 1 else "Moderate",
            confidence_score=0.88 if len(db_ev_ids) >= 1 else 0.70,
            explanation=(
                f"A database connectivity failure was logged ({', '.join(db_ev_ids)}) "
                "prior to application request handling failures. When the database layer becomes unreachable or exhausts its connection pool, "
                "subsequent synchronous operations time out and bubble up as HTTP 500 errors to callers."
            ),
            supporting_evidence_ids=supporting_ids,
            contradictory_evidence_ids=[],
            reason_for_ranking="Chronological precedence: The database error occurred immediately before downstream service and HTTP failures.",
            verification_checks=[
                "Check database server CPU, memory utilization, and active connection count in monitoring metrics.",
                "Verify database connection pool parameters (max_connections, pool_timeout) in service configuration.",
                "Inspect network connectivity and firewall latency between application host and database cluster."
            ],
            missing_evidence=[
                "Database server error logs from the corresponding timestamp.",
                "Database connection pool saturation telemetry at incident time."
            ]
        ))

        actions.append(RecommendedAction(
            id="A-01",
            category="Immediate Check",
            action="Inspect Database Health & Connection Pool Metrics",
            details="Query pg_stat_activity or connection pool metrics to verify if the pool hit its maximum limit during the incident window.",
            relevant_files_or_endpoints=["db-pool", "database.yml", "/metrics"],
            priority="high"
        ))
        actions.append(RecommendedAction(
            id="A-02",
            category="Verification Test",
            action="Run Database Connectivity Test from Application Pod",
            details="Execute a probe or ping test from the application runtime to the database host to verify DNS resolution and latency.",
            relevant_files_or_endpoints=["database host", "db connection string"],
            priority="high"
        ))

    # Pattern 2: Out of Memory / Resource Saturation
    oom_keywords = ["outofmemory", "oom", "heap space", "gc overhead", "killed process", "memory limit", "sigkill", "memory pressure"]
    matching_oom_events = [e for e in events if any(k in e.raw_line.lower() for k in oom_keywords)]

    if matching_oom_events:
        oom_ev_ids = [e.id for e in matching_oom_events]
        rank_pos = len(hypotheses) + 1
        hypotheses.append(Hypothesis(
            id=f"H-0{rank_pos}",
            rank=rank_pos,
            title="JVM / Container Out-of-Memory (OOM) Termination",
            confidence_label="High",
            confidence_score=0.92,
            explanation=(
                f"Log lines ({', '.join(oom_ev_ids)}) document memory limit exhaustion or container termination. "
                "When heap allocations exceed container cgroup thresholds, the kernel OOM killer terminates the process abruptly."
            ),
            supporting_evidence_ids=oom_ev_ids,
            contradictory_evidence_ids=[],
            reason_for_ranking="Explicit memory error logged directly in process output.",
            verification_checks=[
                "Inspect container restart count and exit code (e.g. 137 indicates OOMKilled).",
                "Review heap dump or memory allocation profiles prior to crash."
            ],
            missing_evidence=[
                "Cgroup memory limits and JVM/Node heap flags.",
                "Heap dump artifact or heap growth timeline."
            ]
        ))
        actions.append(RecommendedAction(
            id=f"A-0{len(actions)+1}",
            category="Immediate Check",
            action="Inspect Pod Resource Limits & Exit Code",
            details="Check `kubectl describe pod` for exit code 137 (OOMKilled) and verify whether requests/limits match actual memory demands.",
            relevant_files_or_endpoints=["k8s-deployment.yaml", "Dockerfile"],
            priority="high"
        ))
        actions.append(RecommendedAction(
            id=f"A-0{len(actions)+1}",
            category="Verification Test",
            action="Inspect Garbage Collection Pause Metrics",
            details="Analyze GC logs to determine if pause durations spiked above thresholds before memory exhaustion.",
            relevant_files_or_endpoints=["jvm-gc", "BatchProcessor.java"],
            priority="high"
        ))

    # Pattern 3: Authentication / Token Invalidation / 401/403 Cascade
    auth_keywords = ["unauthorized", "401", "forbidden", "403", "jwt", "token expired", "invalid signature", "permission denied", "token verification"]
    matching_auth_events = [e for e in events if any(k in e.raw_line.lower() for k in auth_keywords) and e.is_error]

    if matching_auth_events:
        auth_ev_ids = [e.id for e in matching_auth_events]
        cascade_events = [e for e in events if e.id not in auth_ev_ids and e.is_error]
        supporting_ids = auth_ev_ids + [e.id for e in cascade_events[:2]]

        rank_pos = len(hypotheses) + 1
        hypotheses.append(Hypothesis(
            id=f"H-0{rank_pos}",
            rank=rank_pos,
            title="Authentication Failure or Token Expiration Cascade",
            confidence_label="Moderate",
            confidence_score=0.82,
            explanation=(
                f"Authorization and token validation failures were logged ({', '.join(auth_ev_ids)}). "
                "This typically occurs after secret rotation, token expiration, or clock skew across nodes during inter-service authentication."
            ),
            supporting_evidence_ids=supporting_ids,
            contradictory_evidence_ids=[],
            reason_for_ranking="Auth validation errors appear prominently as the upstream trigger before downstream user-facing rejections.",
            verification_checks=[
                "Check system clock synchronization (NTP) between client, gateway, and authentication provider.",
                "Verify signing keys or secret rotation logs in IAM/Keycloak."
            ],
            missing_evidence=[
                "Token expiration timestamp and decoded JWT claims.",
                "Auth provider response payload."
            ]
        ))
        actions.append(RecommendedAction(
            id=f"A-0{len(actions)+1}",
            category="Verification Test",
            action="Verify Token Signing Keys & Clock Skew",
            details="Inspect whether signing keys were recently refreshed or if client/server clock drift exceeds acceptable leeway.",
            relevant_files_or_endpoints=["auth-middleware", "jwt.config"],
            priority="high"
        ))
        actions.append(RecommendedAction(
            id=f"A-0{len(actions)+1}",
            category="Immediate Check",
            action="Inspect NTP Clock Synchronization on Auth Gateway",
            details="Run `chronyc sources` or `ntpq -p` on host instances to verify time sync offset is under 50ms.",
            relevant_files_or_endpoints=["auth-gateway", "ntp.conf"],
            priority="medium"
        ))

    # Pattern 4: Code Exception / Null Reference / Unhandled Type Error
    code_exc_keywords = ["nullpointerexception", "typeerror", "keyerror", "attributeerror", "indexoutofrange", "valueerror"]
    matching_code_events = [e for e in events if any(k in e.raw_line.lower() for k in code_exc_keywords) or e.exception_type is not None]

    if matching_code_events and not hypotheses:
        code_ev_ids = [e.id for e in matching_code_events]
        exc_names = list(set([e.exception_type for e in matching_code_events if e.exception_type]))
        exc_str = ", ".join(exc_names) if exc_names else "Unhandled Exception"
        hypotheses.append(Hypothesis(
            id="H-01",
            rank=1,
            title=f"Application Logic Error: {exc_str}",
            confidence_label="Moderate",
            confidence_score=0.82,
            explanation=(
                f"An unhandled application exception ({exc_str}) was thrown during execution ({', '.join(code_ev_ids[:3])}). "
                "This indicates an unexpected input state, null pointer dereference, or missing data field in the payload."
            ),
            supporting_evidence_ids=code_ev_ids[:3],
            contradictory_evidence_ids=[],
            reason_for_ranking="Direct stack trace exception logged in execution output.",
            verification_checks=[
                "Inspect the line number referenced in the stack trace for unhandled null or missing keys.",
                "Replay the request with sanitised test data in local staging environment."
            ],
            missing_evidence=[
                "Incoming request payload or method arguments at the time of the exception."
            ]
        ))
        actions.append(RecommendedAction(
            id="A-01",
            category="Code Inspection",
            action="Inspect Code Around Stack Frame",
            details="Examine the referenced file and line in the stack trace to add defensive null/type guards.",
            relevant_files_or_endpoints=[matching_code_events[0].component or "source_code"],
            priority="high"
        ))

    # Correlate with Git diff if provided (display without declaring it the definitive cause)
    if git_diff_findings:
        high_diffs = [d for d in git_diff_findings if d.relevance_score == "high"]
        if high_diffs and hypotheses:
            first_h = hypotheses[0]
            first_h.explanation += (
                f" Correlated Context: Recent Git commit modified parameters in '{high_diffs[0].file_path}' "
                f"({high_diffs[0].relevance_reason}). This change should be inspected as a plausible factor, "
                "though runtime verification is required to confirm whether it directly caused the degradation."
            )
            actions.append(RecommendedAction(
                id=f"A-0{len(actions)+1}",
                category="Code Inspection",
                action=f"Review Recent Git Changes in {high_diffs[0].file_path}",
                details=f"Verify whether modified lines ({', '.join(high_diffs[0].highlighted_lines[:2])}) reduced timeouts or altered connection limits.",
                relevant_files_or_endpoints=[high_diffs[0].file_path],
                priority="high"
            ))

    # Fallback hypothesis if no specific pattern matched
    if not hypotheses:
        supporting = [e.id for e in error_events] if error_events else ([events[0].id] if events else [])
        hypotheses.append(Hypothesis(
            id="H-01",
            rank=1,
            title="Service Operation Failure during Request Processing",
            confidence_label="Plausible" if error_events else "Preliminary",
            confidence_score=0.65 if error_events else 0.40,
            explanation=(
                f"The log stream records an unexpected service condition ({primary_error_msg[:70]}). "
                "Based on the parsed timeline, this occurred during standard request processing and led to elevated error state."
            ),
            supporting_evidence_ids=supporting[:4],
            contradictory_evidence_ids=[],
            reason_for_ranking="Earliest logged irregularity in the supplied timeline.",
            verification_checks=[
                "Check downstream dependency status and application health endpoint.",
                "Review upstream proxy or load balancer access logs for corresponding request ID."
            ],
            missing_evidence=[
                "Full debug-level logs preceding the incident.",
                "Application configuration and environment variables."
            ]
        ))

    # Add second alternative hypothesis if only 1 exists (Acknowledges alternative possibilities)
    if len(hypotheses) == 1:
        if matching_db_events:
            hypotheses.append(Hypothesis(
                id="H-02",
                rank=2,
                title="Transient Network Partition or Latency Spike to Database Host",
                confidence_label="Plausible",
                confidence_score=0.58,
                explanation=(
                    "Rather than the database daemon itself being down, network transport latency or an intermittent firewall/TCP drop "
                    "may have caused the connection timeout."
                ),
                supporting_evidence_ids=[matching_db_events[0].id],
                contradictory_evidence_ids=[],
                reason_for_ranking="Ranked below primary database failure because no explicit network interface error was logged.",
                verification_checks=[
                    "Check network packet loss and SYN retransmission counters between subnets.",
                    "Inspect cloud provider VPC / NAT gateway connection saturation metrics."
                ],
                missing_evidence=[
                    "Network switch / VPC flow logs for the incident duration."
                ]
            ))
        elif matching_oom_events:
            hypotheses.append(Hypothesis(
                id="H-02",
                rank=2,
                title="Memory Leak in Batch Processing Collection vs Restrictive Container Limits",
                confidence_label="Plausible",
                confidence_score=0.64,
                explanation=(
                    "Rather than sudden payload volume, an object leak retaining batch record instances across runs "
                    "may have steadily accumulated heap until hitting container cgroup ceilings."
                ),
                supporting_evidence_ids=[e.id for e in matching_oom_events[:1]],
                contradictory_evidence_ids=[],
                reason_for_ranking="Ranked as plausible alternative to sudden spike, requiring memory profile to differentiate.",
                verification_checks=[
                    "Inspect JVM survivor space and tenured generation growth trends in APM metrics.",
                    "Compare batch size parameter with heap allocation profile."
                ],
                missing_evidence=[
                    "Heap dump file (.hprof) or garbage collection pause time history."
                ]
            ))
        elif matching_auth_events:
            hypotheses.append(Hypothesis(
                id="H-02",
                rank=2,
                title="System Clock Skew (NTP Drift) Between Gateway and Token Issuer",
                confidence_label="Plausible",
                confidence_score=0.68,
                explanation=(
                    "Tokens validated across microservices rely on synchronized system clocks. "
                    "If client or gateway clocks drift by even a few seconds beyond leeway tolerance, valid tokens are rejected as expired or not yet valid (nbf)."
                ),
                supporting_evidence_ids=[e.id for e in matching_auth_events[:1]],
                contradictory_evidence_ids=[],
                reason_for_ranking="Ranked as plausible alternative when clock skew warnings or intermittent auth drops occur.",
                verification_checks=[
                    "Verify NTP synchronization offset (`chronyc sources` or `ntpq -p`) on auth gateway host.",
                    "Inspect token decoded `exp` and `iat` claims against server system time."
                ],
                missing_evidence=[
                    "NTP time synchronization telemetry across cluster nodes."
                ]
            ))

    if not actions:
        actions.append(RecommendedAction(
            id="A-01",
            category="Immediate Check",
            action="Check Upstream Gateway and Downstream Health Endpoints",
            details="Verify if the service health check /ready and /live are reporting healthy status across all replicas.",
            relevant_files_or_endpoints=["/healthz", "/metrics"],
            priority="medium"
        ))
        actions.append(RecommendedAction(
            id="A-02",
            category="Telemetry Requirement",
            action="Enable Structured JSON Logging with Trace Correlation IDs",
            details="Ensure logs output distributed trace_id and span_id to pinpoint root causes across microservices.",
            relevant_files_or_endpoints=["logger.config"],
            priority="low"
        ))

    return overview, hypotheses, actions
