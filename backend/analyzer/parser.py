import re
from typing import List, Tuple, Optional
from models.schemas import LogEvent

# Timestamp patterns
TIMESTAMP_PATTERNS = [
    # ISO 8601 / RFC 3339 (e.g. 2026-10-24T01:42:01.123Z or 2026-10-24 01:42:01)
    re.compile(r'(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)'),
    # Simple clock (e.g. 10:42:01 or 10:42:01.456)
    re.compile(r'(\b\d{2}:\d{2}:\d{2}(?:\.\d+)?\b)'),
    # Month Day time (e.g. Oct 24 10:42:01)
    re.compile(r'([A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})'),
]

# Log level patterns
LEVEL_REGEX = re.compile(
    r'\b(?P<level>CRITICAL|FATAL|SEVERE|ERROR|ERR|WARN|WARNING|INFO|DEBUG|TRACE)\b',
    re.IGNORECASE
)

# Component/service name patterns: [service-name] or service-name: or logger=service
COMPONENT_PATTERNS = [
    re.compile(r'\[([a-zA-Z0-9_\-\.]{2,30})\]'),
    re.compile(r'(?:service|module|component|logger|app)[=:]([a-zA-Z0-9_\-\.]{2,30})', re.IGNORECASE),
    re.compile(r'([a-zA-Z0-9_\-]{3,20}-service)\b', re.IGNORECASE),
]

# Exception type pattern
EXCEPTION_PATTERN = re.compile(
    r'\b([A-Z][a-zA-Z0-9]*(?:Error|Exception|Timeout|Failure|Fault|Crash|Violation))\b'
)

# Stack trace indicator lines (without timestamp)
STACK_TRACE_START = re.compile(
    r'^(?:Traceback \(most recent call last\):|.*Exception in thread|.*Caused by:)',
    re.IGNORECASE
)
STACK_TRACE_LINE = re.compile(
    r'^(?:\s+at\s+.*|\s+File\s+".*",\s+line\s+\d+.*|\s+\.{3}\s+\d+\s+more|\s+from\s+.*)'
)


def normalize_level(raw_level: Optional[str]) -> str:
    if not raw_level:
        return "INFO"
    lvl = raw_level.upper()
    if lvl in ("CRITICAL", "FATAL", "SEVERE"):
        return "CRITICAL"
    if lvl in ("ERROR", "ERR"):
        return "ERROR"
    if lvl in ("WARN", "WARNING"):
        return "WARN"
    if lvl in ("DEBUG", "TRACE"):
        return "DEBUG"
    return "INFO"


def extract_component(line: str) -> Optional[str]:
    for pat in COMPONENT_PATTERNS:
        match = pat.search(line)
        if match:
            comp = match.group(1).strip()
            # Exclude common false positives like log levels
            if comp.upper() not in ("INFO", "ERROR", "WARN", "DEBUG", "CRITICAL", "FATAL", "THREAD"):
                return comp
    return None


def extract_timestamp(line: str) -> Tuple[Optional[str], str]:
    for pat in TIMESTAMP_PATTERNS:
        match = pat.search(line)
        if match:
            ts = match.group(1)
            # Remove timestamp from leading part of message if at start
            start, end = match.span()
            cleaned_line = (line[:start] + line[end:]).strip()
            return ts, cleaned_line
    return None, line


def parse_logs_deterministic(raw_text: str) -> Tuple[List[LogEvent], List[str]]:
    """
    Parses arbitrary log text into a structured list of LogEvent models,
    properly folding multi-line stack traces into parent error events.
    """
    lines = raw_text.strip().splitlines()
    events: List[LogEvent] = []
    warnings: List[str] = []

    if not lines or not raw_text.strip():
        warnings.append("No log lines provided for parsing.")
        return events, warnings

    current_event_data = None
    stack_trace_buffer: List[str] = []
    evidence_counter = 1

    for idx, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()
        if not stripped:
            continue

        # Check if this line is an independent event with its own timestamp or log level
        timestamp, remaining = extract_timestamp(raw_line)
        level_match = LEVEL_REGEX.search(remaining)
        has_leading_level = level_match and level_match.start() < 15
        is_independent_event = bool(timestamp) or bool(has_leading_level)

        if not is_independent_event and current_event_data:
            # Check if line is part of a stack trace or starts an un-timestamped traceback
            is_trace_starter = bool(STACK_TRACE_START.search(raw_line))
            is_trace_body = bool(STACK_TRACE_LINE.match(raw_line)) or (
                bool(stack_trace_buffer) and (raw_line.startswith(" ") or raw_line.startswith("\t"))
            )
            # Final exception line of a traceback (e.g. "ConnectionError: db unreachable")
            is_trace_closer = bool(stack_trace_buffer) and bool(re.match(r'^[a-zA-Z0-9_\.]+(?:Error|Exception):', raw_line))

            if is_trace_starter or is_trace_body or is_trace_closer:
                stack_trace_buffer.append(raw_line)
                exc_m = EXCEPTION_PATTERN.search(raw_line)
                if exc_m and not current_event_data.get("exception_type"):
                    current_event_data["exception_type"] = exc_m.group(1)
                continue

        # If we had a previous event being collected and now reached a new event, finalize it
        if current_event_data:
            if stack_trace_buffer:
                current_event_data["stack_trace"] = "\n".join(stack_trace_buffer)
                stack_trace_buffer = []
            events.append(LogEvent(**current_event_data))
            current_event_data = None

        raw_level = level_match.group("level") if level_match else None
        level = normalize_level(raw_level)
        component = extract_component(raw_line)

        # Look for exception class
        exc_match = EXCEPTION_PATTERN.search(raw_line)
        exc_type = exc_match.group(1) if exc_match else None

        # Clean core message
        message = remaining
        if level_match:
            start, end = level_match.span()
            message = (message[:start] + message[end:]).strip()
        message = re.sub(r'^[\[\]:\-\s]+', '', message).strip()
        if not message:
            message = stripped

        is_error = level in ("ERROR", "CRITICAL", "WARN") or exc_type is not None or "HTTP 5" in raw_line or "SIGKILL" in raw_line

        ev_id = f"E-{evidence_counter:02d}"
        evidence_counter += 1

        current_event_data = {
            "id": ev_id,
            "line_number": idx,
            "timestamp": timestamp,
            "level": level,
            "component": component,
            "message": message,
            "raw_line": raw_line,
            "is_error": is_error,
            "exception_type": exc_type,
            "stack_trace": None
        }

    # Finalize last event
    if current_event_data:
        if stack_trace_buffer:
            current_event_data["stack_trace"] = "\n".join(stack_trace_buffer)
        events.append(LogEvent(**current_event_data))

    if not events:
        warnings.append("Could not extract distinct log events. Please check input format.")

    # Check for timestamps coverage
    timed_events = sum(1 for e in events if e.timestamp is not None)
    if events and timed_events < len(events) * 0.5:
        warnings.append(f"Only {timed_events}/{len(events)} events have identifiable timestamps. Relative sequence was inferred from line order.")

    return events, warnings
