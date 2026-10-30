
import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onOpenAnalyzer, onNavigateSection }) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Final Call to Action Section */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div
          className="rounded-md p-8 sm:p-12 border flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xs"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--text-primary)',
            borderColor: 'var(--accent-border)',
          }}
        >
          <div className="space-y-3 max-w-2xl">
            <div
              className="inline-flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase border px-3 py-1 rounded-xs"
              style={{
                color: 'var(--accent-color)',
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <span>Ready for Forensic Clarity</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight">
              Start with the evidence. Find your next step.
            </h2>

            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Bring your logs. Whyrus will help you investigate the failure
              without speculation or hallucinations.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenAnalyzer}
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider text-white bg-[#713F75] hover:bg-[#572F5B] transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                '--tw-ring-color': 'var(--accent-color)',
              }}
            >
              <span>Analyse an incident</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Brand Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="full" />

            <p
              className="text-xs leading-relaxed max-w-sm pt-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              An evidence-led root-cause analysis platform for software
              developers, DevOps &amp; SRE teams, and students &amp; QA engineers.
              Connecting logs, errors, timelines, and code changes into explainable forensic conclusions.
            </p>

            <div
              className="text-[11px] font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              Product Tagline: “Find the cause. Restore confidence.”
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              Navigation
            </h3>

            <ul
              className="space-y-2 text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('#overview')}
                  className="transition-colors hover:underline"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '';
                  }}
                >
                  Overview &amp; Dilemma
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('#workflow')}
                  className="transition-colors hover:underline"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '';
                  }}
                >
                  Investigation Workflow
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('#capabilities')}
                  className="transition-colors hover:underline"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '';
                  }}
                >
                  Platform Capabilities
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection('#trust')}
                  className="transition-colors hover:underline"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = 'var(--accent-color)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '';
                  }}
                >
                  Evidence, Rigor &amp; Transparency
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Verification */}
          <div className="md:col-span-4 space-y-3">
            <h3
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              Architecture &amp; Transparency
            </h3>

            <p
              className="text-xs leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Whyrus operates with a deterministic log correlation engine and
              evidence-grounded AI synthesis. No private credentials or source
              code are retained.
            </p>

            <div
              className="flex items-center space-x-2 text-xs font-mono pt-1 font-semibold"
              style={{ color: 'var(--accent-color)' }}
            >
              <ShieldCheck
                className="w-4 h-4 shrink-0"
                style={{ color: 'var(--accent-color)' }}
              />
              <span>Automated Secret Scrubbing Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          className="pt-12 mt-12 border-t flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Whyrus Root-Cause Analysis Platform.
            All rights reserved.
          </div>

          <div
            className="flex items-center space-x-2"
            style={{ color: 'var(--accent-color)' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent-color)' }}
            />
            <span>Evidence before assumptions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
