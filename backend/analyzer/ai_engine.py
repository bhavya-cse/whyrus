import os
import json
import logging
from typing import List, Tuple, Optional
from pydantic import ValidationError
from models.schemas import (
    LogEvent,
    Hypothesis,
    RecommendedAction,
    IncidentOverview,
    GitDiffFinding,
)

logger = logging.getLogger("whyrus.ai")


def run_gemini_analysis(
    events: List[LogEvent],
    overview: IncidentOverview,
    deterministic_hypotheses: List[Hypothesis],
    deterministic_actions: List[RecommendedAction],
    git_diff_findings: Optional[List[GitDiffFinding]] = None,
    service_context: Optional[str] = None,
) -> Tuple[List[Hypothesis], List[RecommendedAction], str, str]:
    """
    Attempts to enrich incident analysis using Google Gemini if GEMINI_API_KEY is configured.
    Enforces strict evidence grounding: AI must only reference real evidence IDs (E-xx).
    Never fabricates evidence links.
    Falls back gracefully to deterministic results if key is missing, API is unreachable,
    or AI output fails validation.

    Returns:
        (hypotheses, recommended_actions, engine_used_string, engine_notes_string)
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if not api_key:
        return (
            deterministic_hypotheses,
            deterministic_actions,
            "deterministic-rule-engine",
            "Deterministic rule-based analysis. (Gemini API key not configured — add GEMINI_API_KEY in .env for generative reasoning)"
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        valid_evidence_ids = set(e.id for e in events)
        events_summary = "\n".join([
            f"- [{e.id}] {e.timestamp or 'step'} [{e.level}] {e.component or 'unknown-comp'}: {e.message}"
            for e in events[:30]
        ])

        diff_summary = ""
        if git_diff_findings:
            diff_summary = "\nRelevant recent Git changes (Correlated context, not confirmed causes):\n" + "\n".join([
                f"- File: {f.file_path} ({f.change_type}, relevance: {f.relevance_score}): {f.relevance_reason}"
                for f in git_diff_findings[:5]
            ])

        prompt = f"""You are the root-cause analysis engine for Whyrus, an evidence-led incident investigation system.
CORE AXIOM: EVIDENCE BEFORE ASSUMPTIONS.
- Do not invent log lines, file paths, or line numbers.
- Distinguish strictly between observed facts and plausible hypotheses.
- Every hypothesis MUST cite at least one real supporting evidence ID from the valid list: {sorted(list(valid_evidence_ids))}.
- If you cannot find supporting evidence for a hypothesis from the provided events, do NOT include that hypothesis.
- Confidence scores must be calibrated (0.0 to 1.0) based on directness of observed evidence, not uncalibrated probabilities.

EVIDENCE OBSERVED:
{events_summary}
{diff_summary}

INCIDENT CONTEXT:
Primary Error: {overview.primary_error}
Severity: {overview.severity} ({overview.severity_reasoning})
Service Context: {service_context or 'None supplied'}

TASK:
1. Formulate 1 to 3 ranked plausible root-cause hypotheses grounded in the evidence.
2. For EVERY hypothesis, assign:
   - "id": e.g. "H-01", "H-02"
   - "rank": integer (1 is top plausible)
   - "title": concise cause statement
   - "confidence_label": one of "High", "Moderate", "Plausible", "Preliminary"
   - "confidence_score": float 0.0 to 1.0 reflecting evidence strength
   - "explanation": clear technical explanation connecting facts to hypothesis
   - "supporting_evidence_ids": list of valid IDs from {sorted(list(valid_evidence_ids))}. MUST NOT BE EMPTY.
   - "contradictory_evidence_ids": list of any conflicting evidence IDs or empty []
   - "reason_for_ranking": rationale for priority
   - "verification_checks": concrete inspection steps developers can perform
   - "missing_evidence": what specific missing telemetry or logs would confirm this
3. Provide 2 to 4 recommended actions categorized as "Immediate Check", "Verification Test", "Code Inspection", or "Telemetry Requirement".

OUTPUT FORMAT:
Respond with pure JSON matching this exact structure:
{{
  "hypotheses": [ ... ],
  "recommended_actions": [ ... ]
}}
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            )
        )

        response_text = response.text.strip()
        data = json.loads(response_text)

        parsed_hypotheses: List[Hypothesis] = []
        for h in data.get("hypotheses", []):
            raw_supporting = h.get("supporting_evidence_ids", [])
            # Filter strictly to valid evidence IDs
            filtered_supporting = [eid for eid in raw_supporting if eid in valid_evidence_ids]
            
            # RULE: Never fabricate evidence links. If no valid evidence ID is cited, drop the ungrounded hypothesis.
            if not filtered_supporting:
                logger.warning("Dropping ungrounded AI hypothesis '%s' (no valid evidence IDs cited: %s)", h.get("title"), raw_supporting)
                continue

            filtered_contradictory = [eid for eid in h.get("contradictory_evidence_ids", []) if eid in valid_evidence_ids]

            try:
                hypo = Hypothesis(
                    id=h.get("id", f"H-0{len(parsed_hypotheses)+1}"),
                    rank=h.get("rank", len(parsed_hypotheses)+1),
                    title=h.get("title", "Plausible Incident Cause"),
                    confidence_label=h.get("confidence_label", "Plausible"),
                    confidence_score=max(0.0, min(1.0, float(h.get("confidence_score", 0.70)))),
                    explanation=h.get("explanation", ""),
                    supporting_evidence_ids=filtered_supporting,
                    contradictory_evidence_ids=filtered_contradictory,
                    reason_for_ranking=h.get("reason_for_ranking", "Based on chronological event correlation"),
                    verification_checks=h.get("verification_checks", ["Inspect service logs"]),
                    missing_evidence=h.get("missing_evidence", ["Detailed dependency metrics"])
                )
                parsed_hypotheses.append(hypo)
            except ValidationError as ve:
                logger.warning("AI hypothesis failed schema validation: %s", ve)

        parsed_actions: List[RecommendedAction] = []
        for a in data.get("recommended_actions", []):
            try:
                action = RecommendedAction(
                    id=a.get("id", f"A-0{len(parsed_actions)+1}"),
                    category=a.get("category", "Immediate Check"),
                    action=a.get("action", "Perform inspection"),
                    details=a.get("details", ""),
                    relevant_files_or_endpoints=a.get("relevant_files_or_endpoints", []),
                    priority=a.get("priority", "medium")
                )
                parsed_actions.append(action)
            except ValidationError as ve:
                logger.warning("AI action failed schema validation: %s", ve)

        # Ensure we have valid grounded hypotheses and actions
        if parsed_hypotheses and parsed_actions:
            # Re-index ranks 1..N
            for i, hyp in enumerate(parsed_hypotheses, start=1):
                hyp.rank = i
            return (
                parsed_hypotheses,
                parsed_actions,
                "deterministic+gemini",
                "Synthesized using deterministic timeline extraction with Gemini evidence-grounded reasoning."
            )
        else:
            logger.info("AI reasoning did not yield valid grounded hypotheses. Engaging deterministic fallback.")
            return (
                deterministic_hypotheses,
                deterministic_actions,
                "deterministic-rule-engine",
                "Deterministic rule-based analysis (AI response lacked valid grounded evidence IDs; deterministic engine engaged)."
            )

    except Exception as exc:
        logger.warning("Gemini API call failed (%s). Using deterministic fallback.", exc)
        return (
            deterministic_hypotheses,
            deterministic_actions,
            "deterministic-rule-engine",
            f"Deterministic rule-based analysis (Gemini fallback: {type(exc).__name__})."
        )
