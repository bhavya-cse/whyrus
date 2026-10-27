
import React from 'react';
import { ArrowRight } from 'lucide-react';
import IncidentAnimation from './IncidentAnimation';
import HeroWordAnimation from './HeroWordAnimation';

export default function Hero({ onStartAnalysis, onExploreWorks }) {
  return (
    <section
      className="relative pt-8 pb-20 lg:pt-10 lg:pb-28 border-b overflow-visible transition-colors duration-200"
      style={{
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

      

        {/* Existing two-column hero layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-6">

          {/* LEFT: Existing hero content */}
          <div className="space-y-6 min-w-0">
            {/* Small word animation above the existing heading */}
<div className="hero-word-slot">
  <HeroWordAnimation />
</div>
            <div
              className="inline-flex items-center space-x-2.5 px-3 py-2 rounded-xs border text-xs font-mono font-semibold uppercase tracking-wider"
              style={{
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#713F75]" />
              <span>Intelligent Incident Investigation</span>
            </div>

            
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
  <span className="whyrus-highlight">
    Find the cause.
  </span>
  <br />
  <span className="whyrus-highlight">
    Restore confidence.
  </span>
</h1>


            <p
              className="text-base sm:text-lg font-normal leading-relaxed max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Whyrus connects logs, errors, timelines, and code changes to help
              engineers investigate software failures, rank plausible root
              causes, and decide what to verify next.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onStartAnalysis}
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider text-white bg-[#713F75] hover:bg-[#572F5B] transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#713F75]"
              >
                <span>Analyse an incident</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreWorks}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider border transition-colors hover:border-[#713F75] hover:text-[#713F75] focus:outline-none focus:ring-2 focus:ring-[#713F75] focus:ring-offset-2"
                style={{
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <span>Explore how it works</span>
              </button>
            </div>

            <div
              className="pt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="w-3 h-0.5 bg-[#713F75]" />
              <span>
                Evidence before assumptions • Explainable hypotheses • Actionable next steps
              </span>
            </div>
          </div>

          {/* RIGHT: Existing incident animation */}
          <div className="w-full min-w-0 hidden lg:block">
            <IncidentAnimation />
          </div>

        </div>
      </div>
    </section>
  );
}
