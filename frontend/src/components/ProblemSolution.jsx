
import React from 'react';
import {
  AlertOctagon,
  Compass,
  Link2,
  Cpu,
  GitCommit,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function ProblemSolution({ onOpenAnalyzer }) {
  return (
    <section
      id="overview"
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
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#713F75]" />
            <span>The Diagnostic Dilemma</span>
          </div>

          <h2
            className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            An error tells you what happened. <br />
            <span style={{ color: 'var(--text-secondary)' }}>
              Not why it failed.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Distributed systems fail across multiple components at once. A
            single upstream error triggers cascading alerts, forcing engineers
            to piece together clues under pressure.
          </p>
        </div>

        {/* Reality vs. Whyrus Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Fragmented Reality */}
          <div
            className="lg:col-span-5 rounded-md p-8 border flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface-subtle)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="space-y-6">

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xs bg-red-100 flex items-center justify-center text-red-700">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <h3
                  className="font-heading font-bold text-xl"
                  style={{ color: 'var(--text-primary)' }}
                >
                  The Reality of Incident Chaos
                </h3>
              </div>

              <div className="space-y-4 pt-1">

                <div
                  className="p-4 rounded-xs border space-y-1"
                  style={{
                    backgroundColor: 'var(--surface-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div
                    className="flex items-center space-x-2 text-xs font-mono font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>Scattered & Multi-Layer Logs</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Events scatter across services, databases, and queues
                    without unified correlation IDs.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xs border space-y-1"
                  style={{
                    backgroundColor: 'var(--surface-bg)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div
                    className="flex items-center space-x-2 text-xs font-mono font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Secondary Ripple Symptoms</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Connection pool exhaustion triggers dozens of 500 errors,
                    diverting focus toward downstream symptoms.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xs border space-y-1"
                  style={{
                    backgroundColor: 'var(--surface-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                  <div
                    className="flex items-center space-x-2 text-xs font-mono font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#713F75]" />
                    <span>Incomplete Stack Traces & Commits</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Stack traces reveal where execution stopped, not why it failed,
                    while recent merges are blamed without proof.
                  </p>
                </div>

              </div>
            </div>

            <div
              className="pt-6 mt-6 border-t text-xs font-mono"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              Outcome: Prolonged recovery times and speculative hotfixes.
            </div>
          </div>

          {/* Right Column: Whyrus Diagnostic Approach */}
          <div
            className="lg:col-span-7 rounded-md p-8 border shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--surface-bg)',
              borderColor: '#E4CDE6',
            }}
          >
            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xs bg-[#F7EFF8] border border-[#E4CDE6] flex items-center justify-center text-[#713F75]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3
                    className="font-heading font-bold text-xl"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    The Whyrus Diagnostic Approach
                  </h3>
                </div>

                <span className="self-start sm:self-auto text-[11px] font-mono uppercase tracking-wider text-[#713F75] bg-[#F7EFF8] border border-[#E4CDE6] px-2.5 py-1 rounded-xs font-semibold">
                  Evidence Grounded
                </span>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Whyrus structures investigations systematically: building
                chronological timelines, separating observed facts from assumptions,
                and ranking root-cause hypotheses with verifiable steps.
              </p>

              {/* Three Structured Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">

                <div
                  className="p-4 rounded-xs border space-y-2"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="text-xs font-mono font-semibold text-[#713F75] flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Event Correlation</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Builds chronological timelines to separate the root trigger
                    from cascading noise.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xs border space-y-2"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="text-xs font-mono font-semibold text-[#713F75] flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Ranked Hypotheses</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Ranks plausible causes by evidence directness while highlighting
                    missing telemetry.
                  </p>
                </div>

                <div
                  className="p-4 rounded-xs border space-y-2"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="text-xs font-mono font-semibold text-[#713F75] flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>Git Diff Context</span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Correlates recent code and config changes with error onset
                    times to flag risky commits.
                  </p>
                </div>

              </div>

              {/* Evidence Principle */}
              <div
                className="p-4 rounded-xs border flex items-start space-x-3 text-xs"
                style={{
                  backgroundColor: '#F7EFF8',
                  borderColor: '#E4CDE6',
                  color: '#463348',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#713F75] mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  <strong className="text-[#572F5B]">
                    Strict Fact Distinction:
                  </strong>{' '}
                  Hypotheses are never presented as confirmed facts. Every ranked
                  cause identifies required missing telemetry and concrete verification steps.
                </p>
              </div>

            </div>

            <div
              className="pt-6 mt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ready to examine your failure?
              </span>

              <button
                type="button"
                onClick={onOpenAnalyzer}
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#713F75] hover:text-[#572F5B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#713F75] rounded-sm"
              >
                <span>Launch Analysis Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
