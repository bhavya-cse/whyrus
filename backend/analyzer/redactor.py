import re
from typing import Tuple

# Regex patterns for common sensitive values, credentials, and API keys
SECRET_PATTERNS = [
    # Private Key blocks
    (re.compile(r'-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----'), '[REDACTED_PRIVATE_KEY]'),
    
    # Generic JWT token pattern (header.payload.signature)
    (re.compile(r'\beyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\b'), '[REDACTED_JWT]'),

    # Authorization / Bearer tokens
    (re.compile(r'(?i)\b(bearer\s+)([A-Za-z0-9_\-\.]{12,})'), r'\1[REDACTED_TOKEN]'),

    # Database connection URIs containing credentials (postgres, mysql, mongodb, redis, amqp)
    (re.compile(r'\b(postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|rediss|amqp|couchdb):\/\/([^:\s@]*):([^@\s]+)@'), r'\1://\2:[REDACTED_DB_PWD]@'),

    # Password parameters (e.g. password="...", pwd=..., db_password=...)
    (re.compile(r'(?i)\b(password|passwd|pwd|db_pass|db_password)\s*[:=]\s*["\']?([^"\'\s]{4,})["\']?'), r'\1=[REDACTED_PASSWORD]'),

    # Generic API Keys / Tokens (e.g. api_key="abc...", client_secret='...', auth_token=...)
    (re.compile(r'(?i)\b(api[_-]?key|secret[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|auth[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9_\-\.]{12,})["\']?'), r'\1=[REDACTED_SECRET]'),

    # AWS Access Key IDs
    (re.compile(r'\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b'), '[REDACTED_AWS_KEY]'),

    # Google Cloud / AI API keys (AIza...)
    (re.compile(r'\bAIza[0-9A-Za-z\-_]{35}\b'), '[REDACTED_GOOGLE_API_KEY]'),

    # GitHub Personal Access Tokens (ghp_..., gho_..., etc.)
    (re.compile(r'\bgh[pousr]_[A-Za-z0-9_]{36,}\b'), '[REDACTED_GITHUB_TOKEN]'),
]


def redact_secrets(text: str) -> Tuple[str, int]:
    """
    Sanitizes log input by replacing identified credentials and API keys with redact tokens.
    Returns the sanitized text and the total count of redactions performed.
    """
    if not text:
        return "", 0

    redacted_text = text
    total_redactions = 0

    for pattern, replacement in SECRET_PATTERNS:
        matches = list(pattern.finditer(redacted_text))
        if matches:
            total_redactions += len(matches)
            redacted_text = pattern.sub(replacement, redacted_text)

    return redacted_text, total_redactions
