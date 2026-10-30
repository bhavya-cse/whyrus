
import React from 'react';
import {
  Clock,
  ShieldCheck,
  Cpu,
  GitBranch,
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

        {/* Four Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Chronological Incident Reconstruction */}
          <div
            className="rounded-md p-7 sm:p-8 border shadow-xs flex flex-col justify-between"
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
                className="text-sm leading-relaxed"
                style={secondaryTextStyle}
              >
                Raw logs are parsed into an ordered timeline with individual
                Evidence IDs (E-01, E-02). Multiline stack traces fold into
                parent events, exposing the exact chronological sequence from
                initial trigger to downstream crash.
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
              className="pt-4 mt-4 border-t text-xs font-mono"
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
            className="rounded-md p-7 sm:p-8 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-xs border flex items-center justify-center"
                  style={iconBoxStyle}
                >
                  <ShieldCheck className="w-5 h-5" style={iconStyle} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl">
                    Automated Secret Redaction
                  </h3>
                  <span
                    className="text-xs font-mono"
                    style={mutedTextStyle}
                  >
                    Client & Backend Data Scrubbing
                  </span>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={secondaryTextStyle}
              >
                Sensitive tokens, Bearer headers, database passwords, and cloud API
                keys are automatically masked into [REDACTED] tokens before data
                enters parsing or external AI synthesis.
              </p>

              <div
                className="p-3.5 rounded-xs border font-mono text-xs break-words"
                style={plumPanelStyle}
              >
                Authorization: Bearer{' '}
                <span className="font-bold">[REDACTED_TOKEN]</span>
              </div>
            </div>

            <div
              className="pt-4 mt-4 border-t text-xs font-mono font-semibold"
              style={{
                color: 'var(--accent-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              Privacy First: No unmasked secrets leave your browser or pipeline.
            </div>
          </div>

          {/* Explainable Root-Cause Ranking */}
          <div
            className="rounded-md p-7 sm:p-8 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-xs border flex items-center justify-center"
                  style={iconBoxStyle}
                >
                  <Cpu className="w-5 h-5" style={iconStyle} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl">
                    Explainable Root-Cause Ranking
                  </h3>
                  <span
                    className="text-xs font-mono"
                    style={mutedTextStyle}
                  >
                    Evidence Directness & Telemetry Checks
                  </span>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={secondaryTextStyle}
              >
                Ranks plausible causes based on direct evidence and chronological
                precedence. Explicitly identifies missing telemetry required for
                confirmation before recommending irreversible production actions.
              </p>

              <div
                className="p-3.5 rounded-xs border text-xs font-mono font-medium"
                style={subtlePanelStyle}
              >
                Evidence Strength: High (88%) • Missing Telemetry: DB pool metrics
              </div>
            </div>

            <div
              className="pt-4 mt-4 border-t text-xs font-mono"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              Strict fact distinction: every hypothesis points to observed Evidence IDs.
            </div>
          </div>

          {/* Git Diff & Evidence Correlation */}
          <div
            className="rounded-md p-7 sm:p-8 border shadow-xs flex flex-col justify-between"
            style={cardStyle}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-xs border flex items-center justify-center"
                  style={iconBoxStyle}
                >
                  <GitBranch className="w-5 h-5" style={iconStyle} />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl">
                    Git Diff & Evidence Correlation
                  </h3>
                  <span
                    className="text-xs font-mono"
                    style={mutedTextStyle}
                  >
                    Commit & Configuration Analysis
                  </span>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={secondaryTextStyle}
              >
                Correlates recent configuration diffs (pool sizes, timeouts, port
                numbers, dependencies) directly with error onset times in the log
                timeline to isolate risky changes without false blame.
              </p>

              <div
                className="p-3.5 rounded-xs border text-xs font-mono break-words"
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

            <div
              className="pt-4 mt-4 border-t text-xs font-mono"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              Distinguishes coincidental commits from verified incident triggers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
