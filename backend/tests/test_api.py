import unittest
import sys
import os
from starlette.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app


class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("service", data)
        self.assertIn("ai_engine_configured", data)

    def test_presets_endpoint(self):
        response = self.client.get("/api/presets")
        self.assertEqual(response.status_code, 200)
        presets = response.json()
        self.assertEqual(len(presets), 3)
        preset_ids = [p["id"] for p in presets]
        self.assertIn("db-cascade", preset_ids)
        self.assertIn("oom-spike", preset_ids)
        self.assertIn("jwt-expiry", preset_ids)

    def test_redact_preview(self):
        payload = {"text": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.sig and pwd=supersecret123 and postgres://u:p@db:5432/test"}
        response = self.client.post("/api/redact-preview", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["redactions_count"], 2)
        self.assertNotIn("supersecret123", data["redacted_text"])
        self.assertNotIn(":p@", data["redacted_text"])

    def test_analyze_empty_payload(self):
        response = self.client.post("/api/analyze", json={"raw_logs": "   "})
        self.assertEqual(response.status_code, 400)
        self.assertIn("empty", response.json()["detail"].lower())

    def test_analyze_oversized_payload(self):
        huge_logs = "10:00:00 INFO Log line\n" * 30000  # > 600KB
        response = self.client.post("/api/analyze", json={"raw_logs": huge_logs})
        self.assertEqual(response.status_code, 413)
        self.assertIn("exceeds safe processing limit", response.json()["detail"].lower())

    def test_analyze_valid_logs_deterministic(self):
        payload = {
            "raw_logs": (
                "10:42:01 INFO [order-service] Order service started\n"
                "10:42:03 INFO [order-service] Connecting to database\n"
                "10:42:04 ERROR [db-pool] Database connection timeout\n"
                "10:42:05 ERROR [order-service] Failed to create order\n"
                "10:42:06 ERROR [http-server] HTTP 500 Internal Server Error"
            ),
            "use_ai": False
        }
        response = self.client.post("/api/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertIn("inc-", result["incident_id"])
        self.assertEqual(result["overview"]["severity"], "CRITICAL")
        self.assertEqual(len(result["timeline"]), 5)
        self.assertGreaterEqual(len(result["hypotheses"]), 2)
        self.assertEqual(result["hypotheses"][0]["rank"], 1)
        self.assertIn("E-03", result["hypotheses"][0]["supporting_evidence_ids"])
        self.assertGreaterEqual(len(result["recommended_actions"]), 2)

    def test_cors_preflight_and_origin(self):
        # Test preflight OPTIONS request
        response = self.client.options(
            "/api/analyze",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type"
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("access-control-allow-origin"), "http://localhost:5173")


if __name__ == '__main__':
    unittest.main()
