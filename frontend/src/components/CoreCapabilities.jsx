
import React from 'react';
import {
  Clock,
  ShieldCheck,
  Cpu,
  GitBranch,
  Sparkles,
  SearchCheck,
} from 'lucide-react';

const cardStyle = {
  backgroundColor: 'var(--surface-bg)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
};

const iconBoxStyle = {
  backgroundColor: 'var(--accent-subtle)',
  borderColor: 'var(--accent-border)',
};

const iconStyle = {
  color: 'var(--accent-color)',
};

const secondaryTextStyle = {
  color: 'var(--text-secondary)',
};

const mutedTextStyle = {
  color: 'var(--text-muted)',
};

const subtlePanelStyle = {
  backgroundColor: 'var(--surface-subtle)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
};

const plumPanelStyle = {
  backgroundColor: 'var(--accent-subtle)',
  borderColor: 'var(--accent-border)',
  color: 'var(--text-primary)',
};

export default function CoreCapabilities({ onOpenAnalyzer }) {
  return (
    <section
      id="capabilities"
      className="py-20 lg:py-28 border-b"
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
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent-color)' }}
            />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight">
            Forensic engineering precision. <br />
            <span style={secondaryTextStyle}>
              Designed for production reality.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed"
            style={secondaryTextStyle}
          >
            Whyrus pairs deterministic log correlation with evidence-grounded
            reasoning to deliver explainable, auditable incident analysis.
          </p>
        </div>

        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Chronological Incident Reconstruction */}
          <div
            className="md:col-span-8 rounded-md p-8 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-xs border flex items-center justify-center"
                  style={iconBoxStyle}
                >
                  <Clock className="w-4 h-4" style={iconStyle} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl">
                    Chronological Incident Reconstruction
                  </h3>
                  <span
                    className="text-xs font-mono"
                    style={mutedTextStyle}
                  >
                    Deterministic Sequence Mapping
                  </span>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed max-w-2xl"
                style={secondaryTextStyle}
              >
                Raw logs are parsed into an ordered timeline with individual
                Evidence IDs (E-01, E-02). Multiline stack traces are
                automatically folded into parent events, exposing the exact
                chronological progression from initial trigger to downstream crash.
              </p>

              {/* Example Timeline */}
              <div
                className="p-4 rounded-xs border font-mono text-xs space-y-2 overflow-x-auto"
                style={subtlePanelStyle}
              >
                <div className="flex items-center space-x-2 whitespace-nowrap">
                  <span
                    className="font-bold"
                    style={{ color: 'var(--accent-color)' }}
                  >
                    [E-01] 10:42:01
                  </span>
                  <span>INFO [order-service] Starting server</span>
                </div>

                <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                  <span className="font-bold">[E-02] 10:42:04</span>
                  <span>
                    ERROR [db-pool] Connection timeout (1000ms limit)
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 whitespace-nowrap">
                  <span className="font-bold">[E-03] 10:42:06</span>
                  <span>
                    ERROR [http-server] HTTP 500 Internal Server Error
                  </span>
                </div>
              </div>
            </div>

            <div
              className="pt-6 mt-6 border-t text-xs font-mono"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              Standardized across ISO 8601, syslog, custom formats, and microservice tags.
            </div>
          </div>

          {/* Automated Secret Redaction */}
          <div
            className="md:col-span-4 rounded-md p-7 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div
                className="w-9 h-9 rounded-xs border flex items-center justify-center"
                style={iconBoxStyle}
              >
                <ShieldCheck className="w-5 h-5" style={iconStyle} />
              </div>

              <h3 className="font-heading font-bold text-xl">
                Automated Secret Redaction
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={secondaryTextStyle}
              >
                Client and backend redaction masks JWTs, Bearer tokens, DB
                connection passwords, and cloud API keys before data enters
                parsing or optional AI processing.
              </p>

              <div
                className="p-3 rounded-xs border font-mono text-[11px] break-words"
                style={plumPanelStyle}
              >
                Authorization: Bearer{' '}
                <span className="font-bold">[REDACTED_TOKEN]</span>
              </div>
            </div>

            <div
              className="text-xs font-mono font-semibold pt-4 mt-4 border-t"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              Privacy First Architecture
            </div>
          </div>

          {/* Explainable Hypothesis Ranking */}
          <div
            className="md:col-span-4 rounded-md p-7 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div
                className="w-9 h-9 rounded-xs border flex items-center justify-center"
                style={iconBoxStyle}
              >
                <Cpu className="w-5 h-5" style={iconStyle} />
              </div>

              <h3 className="font-heading font-bold text-xl">
                Explainable Hypothesis Ranking
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={secondaryTextStyle}
              >
                Scores plausible causes based on evidence directness and
                chronological priority. Every hypothesis points directly to
                observed Evidence IDs rather than guesswork.
              </p>
            </div>

            <div
              className="mt-5 p-2.5 rounded-xs border text-[11px] font-mono font-medium"
              style={subtlePanelStyle}
            >
              Evidence Strength: High (88%) • Supporting: E-02, E-03
            </div>
          </div>

          {/* Git Diff Context Correlation */}
          <div
            className="md:col-span-4 rounded-md p-7 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div
                className="w-9 h-9 rounded-xs border flex items-center justify-center"
                style={iconBoxStyle}
              >
                <GitBranch className="w-5 h-5" style={iconStyle} />
              </div>

              <h3 className="font-heading font-bold text-xl">
                Git Diff Context Correlation
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={secondaryTextStyle}
              >
                Supply recent commits to correlate configuration alterations
                (pool sizes, timeouts, port numbers, dependencies) with error
                onset times in the log timeline.
              </p>
            </div>

            <div
              className="mt-5 p-2.5 rounded-xs border text-[11px] font-mono break-words"
              style={subtlePanelStyle}
            >
              Detected:{' '}
              <span className="text-red-700 dark:text-red-300">
                - pool_size: 25
              </span>
              {' / '}
              <span
                className="font-semibold"
                style={{ color: 'var(--accent-color)' }}
              >
                + pool_size: 4
              </span>
            </div>
          </div>

          {/* Evidence-Grounded AI Reasoning */}
          <div
            className="md:col-span-4 rounded-md p-7 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div
                className="w-9 h-9 rounded-xs border flex items-center justify-center"
                style={iconBoxStyle}
              >
                <Sparkles className="w-5 h-5" style={iconStyle} />
              </div>

              <h3 className="font-heading font-bold text-xl">
                Evidence-Grounded AI Reasoning
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={secondaryTextStyle}
              >
                Powered by Google Gemini with strict prompt constraints: AI can
                only reference validated Evidence IDs. No hallucinated file
                paths or phantom log lines.
              </p>
            </div>

            <div
              className="mt-5 text-xs font-mono"
              style={mutedTextStyle}
            >
              Deterministic rule engine fallback always active.
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div
            className="md:col-span-12 rounded-md p-8 border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
            style={cardStyle}
          >
            <div className="space-y-2 max-w-2xl">
              <div
                className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                <SearchCheck
                  className="w-4 h-4"
                  style={iconStyle}
                />
                <span>Actionable Recommendations</span>
              </div>

              <h3 className="font-heading font-bold text-xl">
                Practical, prioritized next steps developers can actually execute
              </h3>

              <p
                className="text-xs leading-relaxed"
                style={secondaryTextStyle}
              >
                Categorized by Immediate Checks, Verification Tests, Code
                Inspections, and Telemetry Requirements. Whyrus specifies exact
                queries to run, metrics to inspect, and missing logs to collect.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAnalyzer}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xs bg-[#713F75] hover:bg-[#572F5B] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
            >
              Test with Your Incidents
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
