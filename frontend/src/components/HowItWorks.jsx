
import React, { useState } from 'react';
import {
  ArrowRight,
} from 'lucide-react';

export default function HowItWorks({ onOpenAnalyzer }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      number: "01",
      title: "Ingest Evidence",
      badge: "Intake & Redaction",
      summary: "Paste raw logs, upload incident dumps, and supply optional Git diffs or service names.",
      details: [
        "Client and server-side scrubbing masks JWTs, passwords, and API keys before parsing.",
        "Supports ISO 8601, syslog, log4j, and container log streams.",
        "Optional Git diff parsing flags suspicious alterations in pool sizes, timeouts, and ports."
      ],
      previewContent: {
        label: "Stage 01 • Evidence Scrubbing & Intake",
        text: `10:42:01 INFO  [order-service] Starting service...\n10:42:04 ERROR [db-pool] Timeout: auth=[REDACTED_TOKEN]\n10:42:06 ERROR [http-server] HTTP 500 Internal Error`
      }
    },
    {
      number: "02",
      title: "Correlate Events",
      badge: "Parsing & Timelines",
      summary: "Parses logs into discrete events, folds stack traces, and builds a unified timeline.",
      details: [
        "Assigns unique Evidence IDs (E-01, E-02) to each observed event.",
        "Folds multiline stack traces into parent errors to eliminate noise.",
        "Normalizes timestamps, service tags, and severity levels across sources."
      ],
      previewContent: {
        label: "Stage 02 • Chronological Event Stream",
        text: `[E-01] 10:42:01 INFO  [order-service] Starting service...\n[E-02] 10:42:04 ERROR [db-pool] Connection timeout (1000ms limit)\n[E-03] 10:42:06 ERROR [http-server] HTTP 500 - POST /api/orders`
      }
    },
    {
      number: "03",
      title: "Investigate Root Causes",
      badge: "Causality & Ranking",
      summary: "Connects failure events, evaluates causality, and ranks root causes by evidence strength.",
      details: [
        "Separates initial trigger events from downstream cascading symptoms.",
        "Scores hypotheses based on directness of observed signals.",
        "Highlights missing telemetry needed for definitive certainty."
      ],
      previewContent: {
        label: "Stage 03 • Ranked Root-Cause Hypotheses",
        text: `Hypothesis [H-01]: Database Connection Pool Starvation\nConfidence: High (88%)\nSupporting Evidence: E-02, E-03\nMissing Evidence: Database server connection pool saturation metric`
      }
    },
    {
      number: "04",
      title: "Validate Recovery",
      badge: "Targeted Next Steps",
      summary: "Delivers prioritized debugging steps across immediate checks, verification tests, and code reviews.",
      details: [
        "Targeted inspection steps to verify or refute hypotheses quickly.",
        "Pinpoints specific config files, ports, and database views to inspect.",
        "Recommends monitoring additions to prevent repeat incidents."
      ],
      previewContent: {
        label: "Stage 04 • Actionable Verification Guidance",
        text: `[Immediate Check] Query pg_stat_activity on database\nVerify if connection pool hit max limit at incident window.\nTarget: config/database.yml (pool_size)`
      }
    }
  ];

  return (
    <section
      id="workflow"
      className="py-20 lg:py-28 border-b transition-colors duration-200"
      style={{
        backgroundColor: 'var(--page-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div
            className="text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#713F75]" />
            <span>Investigation Workflow</span>
          </div>

          <h2
            className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            How Whyrus works: <br />
            <span className="text-[#713F75]">
              From scattered logs to evidence-backed answers.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Four connected stages designed to eliminate guesswork and guide
            engineering teams directly to resolution.
          </p>
        </div>

        {/* Four-Stage Connected Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Stage Navigator */}
          <div className="lg:col-span-7 space-y-3.5">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;

              return (
                <div
                  key={stage.number}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setActiveStage(idx)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setActiveStage(idx);
                    }
                  }}
                  className={`cursor-pointer rounded-xs p-6 transition-all duration-200 border ${
                    isActive
                      ? 'bg-[var(--surface-bg)] border-[#713F75] shadow-sm'
                      : 'bg-[var(--surface-subtle)] border-[var(--border-color)] hover:bg-[var(--surface-bg)] hover:border-[#E4CDE6]'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs transition-colors ${
                          isActive
                            ? 'bg-[#713F75] text-white'
                            : 'bg-[#F7EFF8] text-[#713F75]'
                        }`}
                      >
                        {stage.number}
                      </span>

                      <h3
                        className="font-heading font-bold text-lg"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {stage.title}
                      </h3>
                    </div>

                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-xs border"
                      style={{
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--surface-bg)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {stage.badge}
                    </span>
                  </div>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {stage.summary}
                  </p>

                  {/* Expanded Stage Details */}
                  {isActive && (
                    <div
                      className="mt-4 pt-4 border-t space-y-2 animate-fade-in-up"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      {stage.details.map((detail, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start space-x-2 text-xs"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#713F75] mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Stage Preview */}
          <div className="lg:col-span-5 sticky top-28">
            <div
              className="rounded-md border shadow-md overflow-hidden transition-colors duration-200"
              style={{
                backgroundColor: 'var(--surface-bg)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div
                className="px-5 py-3.5 border-b flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#713F75]" />
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Stage {stages[activeStage].number} Architecture
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-xs border bg-[#F7EFF8] text-[#713F75] border-[#E4CDE6]">
                  Interactive
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stages[activeStage].previewContent.label}
                </div>

                {/* Log Preview */}
                <div className="bg-[#24202A] p-4 rounded-xs border border-[#403345] font-mono text-xs text-[#F3EAF4] whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto">
                  {stages[activeStage].previewContent.text}
                </div>

                <div
                  className="text-xs leading-relaxed pt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeStage === 0 &&
                    'Logs are scrubbed of credentials before passing into parsing or models.'}
                  {activeStage === 1 &&
                    'Events are arranged chronologically, linking downstream errors to root triggers.'}
                  {activeStage === 2 &&
                    'Hypotheses remain plausible until validated against concrete telemetry.'}
                  {activeStage === 3 &&
                    'Engineers receive targeted inspection commands instead of generic advice.'}
                </div>

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <button
                    type="button"
                    onClick={onOpenAnalyzer}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xs bg-[#713F75] hover:bg-[#572F5B] text-white text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-[#713F75] focus:ring-offset-2"
                  >
                    <span>Run your logs through this pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
