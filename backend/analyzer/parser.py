
import re
from typing import List, Tuple, Optional

from models.schemas import LogEvent


# Timestamp patterns
TIMESTAMP_PATTERNS = [
    # ISO 8601 / RFC 3339
    re.compile(
        r'(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}'
        r'(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)'
    ),

    # Simple clock: 10:42:01 or 10:42:01.456
    re.compile(r'(\b\d{2}:\d{2}:\d{2}(?:\.\d+)?\b)'),

    # Month Day time: Oct 24 10:42:01
    re.compile(r'([A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})'),
]


# Log level patterns
LEVEL_REGEX = re.compile(
    r'\b(?P<level>CRITICAL|FATAL|SEVERE|ERROR|ERR|WARN|WARNING|INFO|DEBUG|TRACE)\b',
    re.IGNORECASE,
)


# Component/service name patterns
COMPONENT_PATTERNS = [
    re.compile(r'\[([a-zA-Z0-9_-][a-zA-Z0-9_.-]{0,29})\]'),
    re.compile(
        r'(?:service|module|component|logger|app)[=:]\s*'
        r'([a-zA-Z0-9_-][a-zA-Z0-9_.-]{1,29})',
        re.IGNORECASE,
    ),
    re.compile(r'\b([a-zA-Z0-9_-]{3,20}-service)\b', re.IGNORECASE),
]


# Exception type pattern
EXCEPTION_PATTERN = re.compile(
    r'\b([A-Z][a-zA-Z0-9_]*(?:Error|Exception|Timeout|Failure|Fault|Crash|Violation))\b'
)


# Stack trace indicator lines
STACK_TRACE_START = re.compile(
    r'^(?:Traceback \(most recent call last\):|.*Exception in thread|.*Caused by:)',
    re.IGNORECASE,
)

STACK_TRACE_LINE = re.compile(
    r'^(?:\s+at\s+.*|\s+File\s+".*",\s+line\s+\d+.*|\s+\.{3}\s+\d+\s+more|\s+from\s+.*)'
)


def normalize_level(raw_level: Optional[str]) -> str:
    """Normalize a raw log level into a consistent severity category."""
    if not raw_level:
        return "INFO"

    level = raw_level.upper()

    if level in ("CRITICAL", "FATAL", "SEVERE"):
        return "CRITICAL"

    if level in ("ERROR", "ERR"):
        return "ERROR"

    if level in ("WARN", "WARNING"):
        return "WARN"

    if level in ("DEBUG", "TRACE"):
        return "DEBUG"

    return "INFO"


def extract_component(line: str) -> Optional[str]:
    """Extract a component name without retaining its surrounding brackets."""
    for pattern in COMPONENT_PATTERNS:
        match = pattern.search(line)

        if match:
            component = match.group(1).strip()

            if component.upper() not in {
                "INFO",
                "ERROR",
                "WARN",
                "WARNING",
                "DEBUG",
                "TRACE",
                "CRITICAL",
                "FATAL",
                "THREAD",
            }:
                return component

    return None


def extract_timestamp(line: str) -> Tuple[Optional[str], str]:
    """Extract a timestamp and return the line with that timestamp removed."""
    for pattern in TIMESTAMP_PATTERNS:
        match = pattern.search(line)

        if match:
            timestamp = match.group(1)
            start, end = match.span()
            cleaned_line = (line[:start] + line[end:]).strip()

            return timestamp, cleaned_line

    return None, line


def parse_logs_deterministic(raw_text: str) -> Tuple[List[LogEvent], List[str]]:
    """
    Parse log text into structured LogEvent objects.

    Multiline stack traces are attached to their preceding event.
    WARN events are not classified as errors solely because of their level.
    """
    events: List[LogEvent] = []
    warnings: List[str] = []

    if not raw_text or not raw_text.strip():
        warnings.append("No log lines provided for parsing.")
        return events, warnings

    lines = raw_text.strip().splitlines()

    current_event_data = None
    stack_trace_buffer: List[str] = []
    evidence_counter = 1

    for line_number, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()

        if not stripped:
            continue

        timestamp, remaining = extract_timestamp(raw_line)

        level_match = LEVEL_REGEX.search(remaining)
        has_leading_level = (
            level_match is not None and level_match.start() < 15
        )

        is_independent_event = bool(timestamp) or bool(has_leading_level)

        # Attach continuation and stack-trace lines to the previous event.
        if not is_independent_event and current_event_data:
            is_trace_starter = bool(STACK_TRACE_START.search(stripped))

            is_trace_body = bool(STACK_TRACE_LINE.match(raw_line)) or (
                bool(stack_trace_buffer)
                and (raw_line.startswith(" ") or raw_line.startswith("\t"))
            )

            is_trace_closer = (
                bool(stack_trace_buffer)
                and bool(
                    re.match(
                        r'^[a-zA-Z0-9_.]+(?:Error|Exception|Timeout|Failure|Fault):',
                        stripped,
                    )
                )
            )

            if is_trace_starter or is_trace_body or is_trace_closer:
                stack_trace_buffer.append(raw_line)

                exception_match = EXCEPTION_PATTERN.search(raw_line)

                if (
                    exception_match
                    and not current_event_data.get("exception_type")
                ):
                    current_event_data["exception_type"] = exception_match.group(1)

                continue

        # Finalize the previous event before starting a new one.
        if current_event_data:
            if stack_trace_buffer:
                current_event_data["stack_trace"] = "\n".join(
                    stack_trace_buffer
                )
                stack_trace_buffer = []

            events.append(LogEvent(**current_event_data))
            current_event_data = None

        raw_level = level_match.group("level") if level_match else None
        level = normalize_level(raw_level)

        component = extract_component(raw_line)

        # Detect exception types, including OutOfMemoryError.
        exception_match = EXCEPTION_PATTERN.search(raw_line)
        exception_type = (
            exception_match.group(1) if exception_match else None
        )

        # Clean the message by removing the timestamp, log level,
        # and leading component prefix.
        message = remaining

        if level_match:
            start, end = level_match.span()
            message = (message[:start] + message[end:]).strip()

        message = re.sub(
            r'^\s*\[[^\]]+\]\s*',
            '',
            message,
        )

        message = re.sub(r'^[\[\]:\-\s]+', '', message).strip()

        if not message:
            message = stripped

        # Only actual error/fatal levels or explicit failure indicators
        # count as errors. A WARN level alone is not an error.
        is_error = (
            level in ("ERROR", "CRITICAL")
            or exception_type is not None
            or bool(
                re.search(
                    r'\bHTTP\s+5\d{2}\b',
                    raw_line,
                    re.IGNORECASE,
                )
            )
            or bool(
                re.search(
                    r'\bSIGKILL\b',
                    raw_line,
                    re.IGNORECASE,
                )
            )
        )

        event_id = f"E-{evidence_counter:02d}"
        evidence_counter += 1

        current_event_data = {
            "id": event_id,
            "line_number": line_number,
            "timestamp": timestamp,
            "level": level,
            "component": component,
            "message": message,
            "raw_line": raw_line,
            "is_error": is_error,
            "exception_type": exception_type,
            "stack_trace": None,
        }

    # Finalize the last event.
    if current_event_data:
        if stack_trace_buffer:
            current_event_data["stack_trace"] = "\n".join(
                stack_trace_buffer
            )

        events.append(LogEvent(**current_event_data))

    if not events:
        warnings.append(
            "Could not extract distinct log events. Please check input format."
        )

    # Warn when timestamp coverage is low.
    timed_events = sum(
        1 for event in events if event.timestamp is not None
    )

    if events and timed_events < len(events) * 0.5:
        warnings.append(
            f"Only {timed_events}/{len(events)} events have identifiable "
            "timestamps. Relative sequence was inferred from line order."
        )

    return events, warnings
