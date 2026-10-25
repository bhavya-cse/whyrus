import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from analyzer.redactor import redact_secrets
from analyzer.parser import parse_logs_deterministic
from analyzer.git_diff import parse_git_diff
from analyzer.ranker import analyze_incident_deterministic
from analyzer.ai_engine import run_gemini_analysis
from models.schemas import AnalysisRequest, LogEvent


class TestAnalyzer(unittest.TestCase):

    def test_secret_redaction_comprehensive(self):
        sample = (
            "Auth: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThisSignature\n"
            "DB: postgres://admin_user:superSecretPassword123@db.prod.internal:5432/orders\n"
            "Redis: redis://:redisSecretPassword456@cache.internal:6379\n"
            "Params: password=MySecretPassword and db_pass=\"quotedPassword\"\n"
            "API Key: api_key=xyz987654321_secret_token_val\n"
            "AWS: AKIAIOSFODNN7EXAMPLE\n"
            "GitHub: ghp_1234567890abcdefghijklmnopqrstuvwxyzAB\n"
        
        redacted, count = redact_secrets(sample)
        self.assertGreaterEqual(count, 7)
        self.assertNotIn("superSecretPassword123", redacted)
        self.assertNotIn("redisSecretPassword456", redacted)
        self.assertNotIn("MySecretPassword", redacted)
        self.assertNotIn("xyz987654321_secret_token_val", redacted)
        self.assertNotIn("AKIAIOSFODNN7EXAMPLE", redacted)
        self.assertNotIn("ghp_1234567890abcdefghijklmnopqrstuvwxyzAB", redacted)
        self.assertNotIn("AIzaSyD1234567890abcdefghijklmnopqrstuv", redacted)
        self.assertIn("[REDACTED_DB_PWD]", redacted)
        self.assertIn("[REDACTED_PASSWORD]", redacted)

    def test_log_parser_and_stack_trace_folding(self):
        raw_logs = (
            "10:42:01 INFO [order-service] Order service started\n"
            "10:42:03 INFO [order-service] Connecting to database\n"
            "10:42:04 ERROR [db-pool] Database connection timeout\n"
            "10:42:05 ERROR [order-service] Failed to create order\n"
            "10:42:06 ERROR [http-server] HTTP 500 Internal Server Error\n"
            "Traceback (most recent call last):\n"
            "  File \"/app/server.py\", line 42, in handle_post\n"
            "    raise ConnectionError('db unreachable')\n"
            "ConnectionError: db unreachable"
        )
        events, warnings = parse_logs_deterministic(raw_logs)
        self.assertEqual(len(events), 5)
        self.assertEqual(events[0].id, "E-01")
        self.assertEqual(events[2].id, "E-03")
        self.assertEqual(events[2].level, "ERROR")
        self.assertIsNotNone(events[4].stack_trace)
        self.assertIn("handle_post", events[4].stack_trace)
        self.assertEqual(events[4].exception_type, "ConnectionError")

    def test_missing_timestamps_fallback(self):
        raw_logs = (
            "INFO [service-a] Starting task\n"
            "ERROR [service-b] File not found\n"
            "WARN [service-a] Retrying after error"
        )
        events, warnings = parse_logs_deterministic(raw_logs)
        self.assertEqual(len(events), 3)
        self.assertEqual(events[0].id, "E-01")
        self.assertIsNone(events[0].timestamp)
        self.assertTrue(any("timestamps" in w.lower() for w in warnings))

    def test_scenario_1_database_cascade(self):
        raw_logs = (
            "10:42:01 INFO [order-service] Order service started on port 8080\n"
            "10:42:03 INFO [order-service] Connecting to primary database at postgres://app-db:5432/orders\n"
            "10:42:04 ERROR [db-pool] Connection timeout: could not acquire connection after 1000ms\n"
            "10:42:05 ERROR [order-service] Failed to create order #89211: Database unavailable\n"
            "10:42:06 ERROR [http-server] HTTP 500 Internal Server Error - POST /api/v1/orders"
        )
        diff = (
            "diff --git a/config/database.yml b/config/database.yml\n"
            "--- a/config/database.yml\n"
            "+++ b/config/database.yml\n"
            "- pool_size: 25\n"
            "+ pool_size: 4\n"
            "- timeout_ms: 5000\n"
            "+ timeout_ms: 1000\n"
        )
        events, _ = parse_logs_deterministic(raw_logs)
        findings = parse_git_diff(diff, events)
        overview, hypotheses, actions = analyze_incident_deterministic(events, git_diff_findings=findings)

        self.assertEqual(overview.severity, "CRITICAL")
        self.assertEqual(overview.error_count, 3)
        self.assertIn("Connection timeout", overview.primary_error)
        self.assertGreaterEqual(len(hypotheses), 2)  # Primary + alternative
        self.assertIn("E-03", hypotheses[0].supporting_evidence_ids)
        # Git diff is displayed neutrally
        self.assertIn("Correlated Context", hypotheses[0].explanation)
        self.assertIn("database.yml", hypotheses[0].explanation)

    def test_scenario_2_jvm_oom(self):
        raw_logs = (
            "03:14:10 INFO [payment-worker] Processing batch reconciliation for 25,000 transactions\n"
            "03:14:22 WARN [jvm-gc] High memory pressure detected: GC pause duration 1820ms (> 500ms threshold)\n"
            "03:14:28 ERROR [payment-worker] java.lang.OutOfMemoryError: Java heap space\n"
            "    at java.base/java.util.Arrays.copyOf(Arrays.java:3537)\n"
            "03:14:29 FATAL [container] Process received signal SIGKILL (cgroup memory limit 2048MB exceeded)"
        )
        events, _ = parse_logs_deterministic(raw_logs)
        overview, hypotheses, actions = analyze_incident_deterministic(events)

        self.assertEqual(overview.severity, "CRITICAL")
        self.assertTrue(any("OutOfMemory" in h.title or "OOM" in h.title for h in hypotheses))
        self.assertGreaterEqual(len(hypotheses), 2)  # Alternative leak vs limit
        self.assertTrue(any("kubectl describe pod" in a.details for a in actions))

    def test_scenario_3_jwt_expiry_and_clock_skew(self):
        raw_logs = (
            "14:05:01 INFO [auth-gateway] Initializing token verification filter with issuer https://auth.whyrus.internal\n"
            "14:05:12 WARN [auth-gateway] Token issued in future or expired (nbf/exp verification failure). Skew detected: 120s\n"
            "14:05:13 ERROR [auth-gateway] Unauthorized: TokenExpiredError: jwt expired at 2026-10-24T14:03:00Z\n"
            "14:05:14 ERROR [user-service] HTTP 401 Unauthorized for client request id req_98f12a\n"
            "14:05:15 ERROR [dashboard-ui] Failed to load user profile: 401 Unauthorized"
        )
        events, _ = parse_logs_deterministic(raw_logs)
        overview, hypotheses, actions = analyze_incident_deterministic(events)

        self.assertEqual(overview.severity, "HIGH")
        self.assertTrue(any("Authentication" in h.title or "Token" in h.title for h in hypotheses))
        self.assertTrue(any("Clock Skew" in h.title or "NTP" in h.title for h in hypotheses))
        self.assertTrue(any("NTP" in a.action or "Signing" in a.action for a in actions))

    def test_ai_fallback_when_unconfigured(self):
        # When GEMINI_API_KEY is unset, run_gemini_analysis should return deterministic hypotheses
        events = [
            LogEvent(
                id="E-01", line_number=1, timestamp="10:00:00", level="ERROR",
                component="app", message="Service crash", raw_line="10:00:00 ERROR [app] Service crash",
                is_error=True
            )
        ]
        overview, det_h, det_a = analyze_incident_deterministic(events)
        
        # Test with empty API key
        old_key = os.environ.get("GEMINI_API_KEY")
        try:
            os.environ["GEMINI_API_KEY"] = ""
            hypotheses, actions, engine, notes = run_gemini_analysis(
                events, overview, det_h, det_a
            )
            self.assertEqual(engine, "deterministic-rule-engine")
            self.assertEqual(len(hypotheses), len(det_h))
            self.assertIn("not configured", notes.lower())
        finally:
            if old_key is not None:
                os.environ["GEMINI_API_KEY"] = old_key


if __name__ == '__main__':
    unittest.main()
