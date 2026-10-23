import re
from typing import List, Dict, Any, Optional
from models.schemas import GitDiffFinding, LogEvent

DIFF_FILE_HEADER = re.compile(r'^diff --git a/(.+?) b/(.+?)$', re.MULTILINE)
CONFIG_KEYWORDS = re.compile(
    r'\b(timeout|pool_size|max_connections|retry|retries|port|host|url|password|secret|token|database|db_|auth|migration|alter table)\b',
    re.IGNORECASE
)


def parse_git_diff(diff_text: Optional[str], events: List[LogEvent]) -> List[GitDiffFinding]:
    """
    Parses a unified git diff and correlates touched files and configuration changes
    with errors observed in the log events.
    """
    if not diff_text or not diff_text.strip():
        return []

    findings: List[GitDiffFinding] = []
    chunks = diff_text.strip().split("diff --git ")

    # Collect keywords from error events to correlate
    error_terms = set()
    for e in events:
        if e.is_error:
            words = re.findall(r'[a-zA-Z0-9_]{3,}', e.message.lower())
            error_terms.update(words)
            if e.component:
                error_terms.add(e.component.lower())
            if e.exception_type:
                error_terms.add(e.exception_type.lower())

    for chunk in chunks:
        if not chunk.strip():
            continue

        lines = chunk.strip().splitlines()
        first_line = lines[0]
        file_path_match = re.search(r'^[ab]/(.+?)\s+[ab]/(.+?)$', first_line)
        if not file_path_match:
            # check simple file name
            file_path = first_line.split()[-1] if first_line.split() else "unknown_file"
        else:
            file_path = file_path_match.group(2)

        added_lines = [l[1:].strip() for l in lines if l.startswith('+') and not l.startswith('+++')]
        deleted_lines = [l[1:].strip() for l in lines if l.startswith('-') and not l.startswith('---')]

        relevance = "low"
        reasons = []
        highlighted = []

        # Check for config keywords in changed lines
        for l in added_lines + deleted_lines:
            match = CONFIG_KEYWORDS.search(l)
            if match:
                relevance = "high"
                reasons.append(f"Altered critical configuration parameter '{match.group(1)}'")
                if len(highlighted) < 3:
                    highlighted.append(l)

        # Check if file path matches any affected service or component
        clean_name = file_path.lower()
        matched_terms = [t for t in error_terms if len(t) > 3 and t in clean_name]
        if matched_terms:
            if relevance != "high":
                relevance = "medium"
            reasons.append(f"File matches error context keywords: {', '.join(matched_terms[:3])}")

        if not reasons:
            reasons.append("Code modified in recent commit; no direct configuration or keyword correlation found.")
            # Pick first 2 additions as highlight if available
            highlighted = (added_lines or deleted_lines)[:2]

        finding = GitDiffFinding(
            file_path=file_path,
            change_type="modified" if deleted_lines and added_lines else ("added" if added_lines else "deleted"),
            relevance_score=relevance,
            relevance_reason="; ".join(reasons),
            highlighted_lines=highlighted
        )
        findings.append(finding)

    # Sort high relevance first
    order = {"high": 0, "medium": 1, "low": 2}
    findings.sort(key=lambda f: order.get(f.relevance_score, 3))
    return findings
