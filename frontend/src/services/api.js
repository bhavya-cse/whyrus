// Centralized API configuration for Whyrus
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchPresets() {
  const res = await fetch(`${API_BASE}/api/presets`);
  if (!res.ok) throw new Error("Failed to load incident presets");
  return res.json();
}

export async function previewRedaction(text) {
  const res = await fetch(`${API_BASE}/api/redact-preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error("Redaction preview failed");
  return res.json();
}

export async function analyzeIncident(payload) {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Analysis request failed." }));
    throw new Error(errorData.detail || "Analysis request failed.");
  }

  return res.json();
}
