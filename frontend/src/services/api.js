
// Centralized API configuration for Whyrus
const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000'
    : ''
);

/**
 * Safely parse a server response.
 * Supports both JSON and plain-text error responses.
 */
async function parseResponse(res) {
  const responseText = await res.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return {
      detail: responseText
    };
  }
}

/**
 * Extract a readable error message from a server response.
 */
function getErrorMessage(data, status) {
  const message =
    data?.detail ||
    data?.error ||
    data?.message ||
    `Request failed with status ${status}.`;

  if (typeof message === 'string') {
    return message;
  }

  try {
    return JSON.stringify(message);
  } catch {
    return `Request failed with status ${status}.`;
  }
}

/**
 * Check whether the Whyrus backend is available.
 */
export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`);

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res.status));
  }

  return data;
}

/**
 * Fetch available incident analysis presets.
 */
export async function fetchPresets() {
  const res = await fetch(`${API_BASE}/api/presets`);

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res.status));
  }

  return data;
}

/**
 * Preview sensitive information redaction before analysis.
 */
export async function previewRedaction(text) {
  const res = await fetch(`${API_BASE}/api/redact-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res.status));
  }

  return data;
}

/**
 * Analyze an incident using the Whyrus backend.
 */
export async function analyzeIncident(payload) {
  let res;

  try {
    res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // Handle network errors, unavailable servers, and connection failures.
    throw new Error(
      `Could not connect to the Whyrus API. Check that the backend is running and the API URL is correct. ${
        error instanceof Error ? error.message : ''
      }`.trim()
    );
  }

  const data = await parseResponse(res);

  if (!res.ok) {
    throw new Error(getErrorMessage(data, res.status));
  }

  return data;
}
