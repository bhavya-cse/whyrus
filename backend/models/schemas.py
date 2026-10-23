from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    raw_logs: str = Field(..., description="Raw log text or stack trace to analyze")
    git_diff: Optional[str] = Field(None, description="Optional Git diff for correlating recent code changes")
    service_context: Optional[str] = Field(None, description="Optional service name or environment context")
    use_ai: bool = Field(True, description="Whether to enrich with AI when credentials are configured")


class LogEvent(BaseModel):
    id: str = Field(..., description="Unique evidence ID, e.g. E-01")
    line_number: Optional[int] = Field(None, description="Original line number")
    timestamp: Optional[str] = Field(None, description="Extracted ISO or clock timestamp")
    level: str = Field(..., description="DEBUG, INFO, WARN, ERROR, CRITICAL, or UNKNOWN")
    component: Optional[str] = Field(None, description="Identified service or module name")
    message: str = Field(..., description="Core event message")
    raw_line: str = Field(..., description="Original log line")
    is_error: bool = Field(..., description="True if marked as warning, error or fatal")
    exception_type: Optional[str] = Field(None, description="Extracted exception class name")
    stack_trace: Optional[str] = Field(None, description="Attached stack trace lines")


class Hypothesis(BaseModel):
    id: str = Field(..., description="Hypothesis identifier, e.g. H-01")
    rank: int = Field(..., description="Ranking order (1 is most plausible)")
    title: str = Field(..., description="Concise statement of the plausible cause")
    confidence_label: str = Field(..., description="Evidence-backed strength: High, Moderate, Plausible, or Preliminary")
    confidence_score: float = Field(..., description="Calibrated score between 0.0 and 1.0 based on evidence count and directness")
    explanation: str = Field(..., description="Clear explanation connecting observed facts to this hypothesis")
    supporting_evidence_ids: List[str] = Field(..., description="Evidence event IDs supporting this hypothesis")
    contradictory_evidence_ids: List[str] = Field(default_factory=list, description="Evidence IDs that might conflict or cast doubt")
    reason_for_ranking: str = Field(..., description="Explicit rationale for why this is ranked at this level")
    verification_checks: List[str] = Field(..., description="Concrete inspection steps or queries to confirm or refute")
    missing_evidence: List[str] = Field(..., description="Missing data or telemetry needed for definitive certainty")


class RecommendedAction(BaseModel):
    id: str = Field(..., description="Action ID, e.g. A-01")
    category: str = Field(..., description="Immediate Check, Verification Test, Code Inspection, or Telemetry Requirement")
    action: str = Field(..., description="Summary action header")
    details: str = Field(..., description="Specific step-by-step guidance")
    relevant_files_or_endpoints: List[str] = Field(default_factory=list, description="Referenced components, endpoints or files")
    priority: str = Field("medium", description="high, medium, or low")


class IncidentOverview(BaseModel):
    summary: str = Field(..., description="Executive technical summary of the incident")
    primary_error: str = Field(..., description="Root symptom or earliest fatal trigger")
    affected_components: List[str] = Field(default_factory=list, description="Components or services involved")
    severity: str = Field(..., description="CRITICAL, HIGH, MEDIUM, or LOW")
    severity_reasoning: str = Field(..., description="Clear objective explanation of why this severity was assigned")
    first_event_time: Optional[str] = Field(None, description="Earliest recorded timestamp")
    last_event_time: Optional[str] = Field(None, description="Latest recorded timestamp")
    total_events: int = Field(..., description="Total parsed log events")
    error_count: int = Field(..., description="Total error or critical events")


class GitDiffFinding(BaseModel):
    file_path: str = Field(..., description="Path of modified file")
    change_type: str = Field(..., description="modified, added, or deleted")
    relevance_score: str = Field(..., description="high, medium, low")
    relevance_reason: str = Field(..., description="Why this diff change correlates with the observed failure")
    highlighted_lines: List[str] = Field(default_factory=list, description="Key diff lines")


class AnalysisResult(BaseModel):
    incident_id: str = Field(..., description="Unique generated incident ID")
    created_at: str = Field(..., description="Analysis completion timestamp")
    overview: IncidentOverview = Field(..., description="High-level incident breakdown")
    timeline: List[LogEvent] = Field(..., description="Structured chronological log timeline")
    hypotheses: List[Hypothesis] = Field(..., description="Ranked root-cause hypotheses")
    recommended_actions: List[RecommendedAction] = Field(..., description="Targeted actionable next steps")
    git_diff_findings: List[GitDiffFinding] = Field(default_factory=list, description="Findings from git diff if supplied")
    redacted_secrets_count: int = Field(0, description="Count of detected secrets redacted before analysis")
    analysis_engine_used: str = Field(..., description="Engine type: deterministic-rule-engine or deterministic+gemini")
    engine_notes: str = Field(..., description="Operational status and transparency note")
    parsing_warnings: List[str] = Field(default_factory=list, description="Noteworthy parsing anomalies or truncated lines")
