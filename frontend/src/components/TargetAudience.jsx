
import React from 'react';
import {
  Code2,
  Server,
  GraduationCap,
} from 'lucide-react';

export default function TargetAudience({ onOpenAnalyzer }) {
  const audiences = [
    {
      title: 'Software Developers',
      role: 'Application Engineers',
      icon: Code2,
      tag: 'Deep Debugging',
      benefit:
        'Bypass wall-of-text log parsing. Whyrus correlates stack traces with prior warnings and database logs to determine whether an exception stems from bad input or upstream dependency failure.',
    },
    {
      title: 'DevOps & SRE Teams',
      role: 'Reliability & Production',
      icon: Server,
      tag: 'MTTR Reduction',
      benefit:
        'Rapidly isolate cascading outages. When multiple alerts trigger simultaneously, Whyrus identifies the initial trigger event to stop teams from chasing downstream symptoms.',
    },
    {
      title: 'Students & QA Engineers',
      role: 'Forensic Skills & Verification',
      icon: GraduationCap,
      tag: 'Verification & Learning',
      benefit:
        'Turn crash dumps and flaky test logs into structured incident timelines. Learn disciplined forensic debugging habits while providing development teams with reproducible verification steps.',
    },
  ];

  return (
    <section
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
            <span>Who Whyrus Is Built For</span>
          </div>

          <h2
            className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Tailored for engineers who demand <br />
            <span style={{ color: 'var(--text-secondary)' }}>
              evidence over speculation.
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            From junior engineers learning to read complex stack traces to SREs
            managing multi-service production outages.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((aud) => {
            const Icon = aud.icon;

            return (
              <div
                key={aud.title}
                className="rounded-xs p-7 border shadow-2xs flex flex-col justify-between transition-all duration-200 hover:border-[#713F75] hover:shadow-sm"
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-9 h-9 rounded-xs bg-[#F7EFF8] border border-[#E4CDE6] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#713F75]" />
                    </div>

                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-xs border"
                      style={{
                        backgroundColor: 'var(--surface-bg)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {aud.tag}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-heading font-bold text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {aud.title}
                    </h3>

                    <div
                      className="text-xs font-mono mt-0.5"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {aud.role}
                    </div>
                  </div>

                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {aud.benefit}
                  </p>
                </div>

                <div
                  className="pt-6 border-t mt-6 flex items-center justify-between gap-3 text-xs font-mono"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Practical application
                  </span>

                  <span className="text-[#713F75] font-semibold text-right">
                    ✓ Evidence grounded
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
