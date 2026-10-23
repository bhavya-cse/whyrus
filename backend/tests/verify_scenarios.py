import unittest
import sys
import os
from starlette.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app


class TestAuditWorkflow(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_scenario_1_database_cascade_and_git_diff(self):
        """Test Scenario 1: Database connection timeout and configuration changes"""
        payload = {
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
            ),
            "service_context": "order-service",
            "use_ai": False
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Overview verification
        self.assertEqual(data["overview"]["severity"], "CRITICAL")
        self.assertEqual(data["overview"]["error_count"], 3)
        self.assertIn("Connection timeout", data["overview"]["primary_error"])
        self.assertEqual(data["overview"]["first_event_time"], "10:42:01")

        # Timeline verification
        self.assertEqual(len(data["timeline"]), 5)
        timeline_ids = [e["id"] for e in data["timeline"]]
        self.assertEqual(timeline_ids, ["E-01", "E-02", "E-03", "E-04", "E-05"])

        # Hypotheses & Evidence ID grounding
        self.assertGreaterEqual(len(data["hypotheses"]), 2)
        top_h = data["hypotheses"][0]
        self.assertIn("Database", top_h["title"])
        for eid in top_h["supporting_evidence_ids"]:
            self.assertIn(eid, timeline_ids, f"Evidence ID {eid} must exist in timeline")
        self.assertIn("E-03", top_h["supporting_evidence_ids"])

        # Git diff correlation without automatically declaring it the cause
        self.assertEqual(len(data["git_diff_findings"]), 1)
        self.assertEqual(data["git_diff_findings"][0]["relevance_score"], "high")
        self.assertIn("Correlated Context", top_h["explanation"])
        self.assertIn("database.yml", top_h["explanation"])

        # Alternative explanation
        alt_h = data["hypotheses"][1]
        self.assertTrue("Network" in alt_h["title"] or "Partition" in alt_h["title"])

        # Recommended actions
        self.assertTrue(any("Database" in a["action"] for a in data["recommended_actions"]))

    def test_scenario_2_jvm_oom_failure(self):
        """Test Scenario 2: JVM out-of-memory failure with stack trace folding"""
        payload = {
            "raw_logs": (
                "03:14:10 INFO [payment-worker] Processing batch reconciliation for 25,000 transactions\n"
                "03:14:22 WARN [jvm-gc] High memory pressure detected: GC pause duration 1820ms (> 500ms threshold)\n"
                "03:14:28 ERROR [payment-worker] java.lang.OutOfMemoryError: Java heap space\n"
                "    at java.base/java.util.Arrays.copyOf(Arrays.java:3537)\n"
                "    at com.whyrus.payment.BatchProcessor.loadRecords(BatchProcessor.java:142)\n"
                "    at com.whyrus.payment.Worker.run(Worker.java:58)\n"
                "03:14:29 FATAL [container] Process received signal SIGKILL (cgroup memory limit 2048MB exceeded)"
            ),
            "service_context": "payment-worker",
            "use_ai": False
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Overview
        self.assertEqual(data["overview"]["severity"], "CRITICAL")
        self.assertIn("OutOfMemory", data["overview"]["severity_reasoning"])

        # Timeline and stack trace association
        self.assertEqual(len(data["timeline"]), 4)
        oom_event = data["timeline"][2]
        self.assertEqual(oom_event["level"], "ERROR")
        self.assertIsNotNone(oom_event["stack_trace"])
        self.assertIn("BatchProcessor.java", oom_event["stack_trace"])

        # Hypotheses
        self.assertTrue(any("OutOfMemory" in h["title"] or "OOM" in h["title"] for h in data["hypotheses"]))
        self.assertTrue(any("Leak" in h["title"] or "Limits" in h["title"] for h in data["hypotheses"]))

        # Actions
        self.assertTrue(any("Pod" in a["action"] or "kubectl" in a["details"] for a in data["recommended_actions"]))

    def test_scenario_3_jwt_expiry_and_clock_skew(self):
        """Test Scenario 3: JWT expiration and authentication failures"""
        payload = {
            "raw_logs": (
                "14:05:01 INFO [auth-gateway] Initializing token verification filter with issuer https://auth.whyrus.internal\n"
                "14:05:12 WARN [auth-gateway] Token issued in future or expired (nbf/exp verification failure). Skew detected: 120s\n"
                "14:05:13 ERROR [auth-gateway] Unauthorized: TokenExpiredError: jwt expired at 2026-10-24T14:03:00Z\n"
                "14:05:14 ERROR [user-service] HTTP 401 Unauthorized for client request id req_98f12a\n"
                "14:05:15 ERROR [dashboard-ui] Failed to load user profile: 401 Unauthorized"
            ),
            "service_context": "auth-gateway",
            "use_ai": False
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Overview
        self.assertEqual(data["overview"]["severity"], "HIGH")
        self.assertIn("authorization", data["overview"]["severity_reasoning"].lower())

        # Hypotheses
        self.assertTrue(any("Authentication" in h["title"] or "Token" in h["title"] for h in data["hypotheses"]))
        # Alternative hypothesis for Clock Skew
        self.assertTrue(any("Clock Skew" in h["title"] or "NTP" in h["title"] for h in data["hypotheses"]))

        # Actions
        self.assertTrue(any("NTP" in a["action"] or "Signing" in a["action"] for a in data["recommended_actions"]))

    def test_edge_cases_and_security(self):
        """Test edge cases: empty input, missing timestamps, oversized payloads, secret scrubbing"""
        # 1. Empty input
        res_empty = self.client.post("/api/analyze", json={"raw_logs": "   "})
        self.assertEqual(res_empty.status_code, 400)

        # 2. Oversized input (> 500KB)
        res_huge = self.client.post("/api/analyze", json={"raw_logs": "10:00:00 INFO Application process heartbeat message\n" * 20000})
        self.assertEqual(res_huge.status_code, 413)

        # 3. Missing timestamps log
        res_notime = self.client.post("/api/analyze", json={
            "raw_logs": "INFO [server] started\nERROR [server] crash\nWARN [server] retry"
        })
        self.assertEqual(res_notime.status_code, 200)
        data_notime = res_notime.json()
        self.assertEqual(len(data_notime["timeline"]), 3)
        self.assertTrue(any("timestamps" in w.lower() for w in data_notime["parsing_warnings"]))

        # 4. Secret scrubbing in logs
        res_secrets = self.client.post("/api/analyze", json={
            "raw_logs": "10:00:00 ERROR [db] Connection to postgres://user:superSecretPassword123@db:5432/orders failed with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.sig"
        })
        self.assertEqual(res_secrets.status_code, 200)
        data_secrets = res_secrets.json()
        self.assertGreaterEqual(data_secrets["redacted_secrets_count"], 1)
        for ev in data_secrets["timeline"]:
            self.assertNotIn("superSecretPassword123", ev["raw_line"])
            self.assertNotIn("superSecretPassword123", ev["message"])


if __name__ == '__main__':
    unittest.main()
