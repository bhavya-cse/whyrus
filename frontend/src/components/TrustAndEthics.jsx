
import React from 'react';
import {
  ShieldAlert,
  HelpCircle,
  EyeOff,
  Scale,
  AlertTriangle,
} from 'lucide-react';

export default function TrustAndEthics() {
  const principles = [
    {
      title: 'Evidence Before Assumptions',
      icon: Scale,
      statement:
        'Every hypothesis must link directly to observed Evidence IDs.',
      description:
        'Whyrus never invents facts, logs, file paths, or line numbers. If a hypothesis cannot point to concrete timestamps and log events, it will not be presented.',
    },
    {
      title: 'Correlation Is Not Proof of Causation',
      icon: AlertTriangle,
      statement:
        'Chronological precedence suggests causality, but does not guarantee it.',
      description:
        'A database error preceding an HTTP 500 strongly correlates, but transient network partitions or third-party DNS failures may be the true root cause. Whyrus acknowledges alternatives.',
    },
    {
      title: 'Confidence Reflects Evidence Strength',
      icon: HelpCircle,
      statement:
        'Confidence labels reflect evidence completeness, not uncalibrated probabilities.',
      description:
        'Labels like High, Moderate, Plausible, and Preliminary indicate how many independent signals support the hypothesis and whether contradictory evidence exists.',
    },
    {
      title: 'Incomplete Logs Lead to Preliminary Conclusions',
      icon: ShieldAlert,
      statement: 'The engine is only as good as the evidence supplied.',
      description:
        "If debug logs or metrics are omitted, Whyrus explicitly identifies 'Missing Telemetry' needed to confirm the root cause before recommending irreversible production actions.",
    },
    {
      title: 'Strict Credential Redaction',
      icon: EyeOff,
      statement:
        'Sensitive tokens, passwords, and keys are scrubbed by default.',
      description:
        'JWTs, Bearer headers, database passwords, and AWS credentials are automatically masked into [REDACTED] tokens before processing or external AI synthesis.',
    },
  ];

  return (
    <section
      id="trust"
      className="py-20 lg:py-28 border-b transition-colors duration-200"
      style={{
        backgroundColor: 'var(--page-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div
            className="text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#713F75]" />
            <span>Evidence, Rigor & Transparency</span>
          </div>

          <h2
            className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            How Whyrus approaches uncertainty: <br />
            <span style={{ color: 'var(--text-secondary)' }}>
              No false certainty. No fabricated claims.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Root-cause analysis in complex software systems requires honesty
            about what is observed, what is plausible, and what requires
            further verification.
          </p>
        </div>

        {/* Trust Principle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, idx) => {
            const Icon = principle.icon;
            const isFeatured = idx === 0;

            return (
              <div
                key={principle.title}
                className={`p-7 rounded-xs border transition-all duration-200 flex flex-col justify-between hover:border-[#713F75] ${
                  isFeatured ? 'lg:col-span-2' : ''
                }`}
                style={{
                  backgroundColor: isFeatured
                    ? 'var(--surface-subtle)'
                    : 'var(--surface-bg)',
                  borderColor: isFeatured
                    ? '#E4CDE6'
                    : 'var(--border-color)',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xs bg-[#F7EFF8] border border-[#E4CDE6] flex items-center justify-center text-[#713F75] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h3
                      className="font-heading font-bold text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {principle.title}
                    </h3>
                  </div>

                  <div className="font-mono text-xs font-semibold text-[#713F75] leading-relaxed">
                    “{principle.statement}”
                  </div>

                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {principle.description}
                  </p>
                </div>

                <div
                  className="pt-4 border-t mt-4 text-[11px] font-mono"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Core Engineering Axiom #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
