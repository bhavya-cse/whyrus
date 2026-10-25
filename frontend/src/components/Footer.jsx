import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onOpenAnalyzer, onNavigateSection }) {
  return (
    <footer className="bg-white text-[#111827] border-t border-[#E5E7EB]">
      
      {/* Final Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 border-b border-[#E5E7EB]">
        <div className="bg-[#111827] text-white rounded-md p-8 sm:p-12 border border-[#1F2937] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-sm">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase text-[#111827] bg-[#8CE800] px-3 py-1 rounded-xs">
              <span>Ready for Forensic Clarity</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Start with the evidence. Find your next step.
            </h2>

            <p className="text-base text-[#D1D5DB] leading-relaxed">
              Bring your logs. Whyrus will help you investigate the failure without speculation or hallucinations.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenAnalyzer}
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider text-[#111827] bg-[#8CE800] hover:bg-[#78D000] transition-all duration-150 shadow-xs focus:ring-2 focus:ring-offset-2 focus:ring-[#8CE800]"
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
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Logo variant="full" />

            <p className="text-xs text-[#4B5563] leading-relaxed max-w-sm pt-2">
              An evidence-led root-cause analysis platform for software engineers, DevOps teams, and students. 
              Connecting logs, errors, timelines, and code changes into explainable forensic conclusions.
            </p>

            <div className="text-[11px] font-mono text-[#6B7280]">
              Product Tagline: “Find the cause. Restore confidence.”
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827]">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-[#4B5563]">
              <li>
                <button onClick={() => onNavigateSection('#overview')} className="hover:text-[#111827] transition-colors">
                  Overview & Dilemma
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#workflow')} className="hover:text-[#111827] transition-colors">
                  Investigation Workflow
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#sample')} className="hover:text-[#111827] transition-colors">
                  Sample Incident Preview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#capabilities')} className="hover:text-[#111827] transition-colors">
                  Core Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#trust')} className="hover:text-[#111827] transition-colors">
                  Evidence & Trust Axioms
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Verification (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827]">
              Architecture & Transparency
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Whyrus operates with a deterministic log correlation engine and evidence-grounded AI synthesis. 
              No private credentials or source code are retained.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#111827] pt-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#8CE800]" />
              <span>Automated Secret Scrubbing Active</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 mt-12 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Whyrus Root-Cause Analysis Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
            <span>Evidence before assumptions</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
