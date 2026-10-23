import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function Footer({ onOpenAnalyzer, onNavigateSection }) {
  return (
    <footer className="bg-[#17243A] text-white border-t border-[#273852]">
      
      {/* Final Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 border-b border-[#273852]">
        <div className="bg-[#1E2E48] rounded-2xl p-8 sm:p-12 border border-[#2D4366] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-medium tracking-wider uppercase text-[#167D78] bg-[#167D78]/20 px-3 py-1 rounded border border-[#167D78]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
              <span>Ready for Forensic Clarity</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Start with the evidence. Find your next step.
            </h2>

            <p className="text-base text-[#94A3B8] leading-relaxed">
              Bring your logs. Whyrus will help you investigate the failure without speculation or hallucinations.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenAnalyzer}
              className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded font-medium text-white bg-[#167D78] hover:bg-[#126863] transition-all duration-150 shadow-lg shadow-[#167D78]/20 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#167D78] focus:ring-offset-[#17243A]"
            >
              <span>Analyze an incident</span>
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#167D78] flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span className="w-2 h-0.5 bg-white/70"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5A34B]"></span>
                </div>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                whyrus
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              An evidence-led root-cause analysis platform for software engineers, DevOps teams, and students. 
              Connecting logs, stack traces, and code changes into explainable forensic conclusions.
            </p>

            <div className="text-[11px] font-mono text-[#64748B]">
              Product Tagline: “Understand the failure. Find the reason.”
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => onNavigateSection('#product')} className="hover:text-white transition-colors">
                  Product Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#how-it-works')} className="hover:text-white transition-colors">
                  Investigation Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#demo')} className="hover:text-white transition-colors">
                  Interactive Preview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#capabilities')} className="hover:text-white transition-colors">
                  Core Capabilities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('#trust')} className="hover:text-white transition-colors">
                  Trust & Evidence Axioms
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Verification (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
              Architecture & Transparency
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Whyrus operates with a deterministic log parsing core and evidence-grounded synthesis via Google Gemini. 
              No private credentials or source code are stored.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#167D78]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Automated Secret Redaction Active</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 mt-12 border-t border-[#273852] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] font-mono gap-4">
          <div>
            © {new Date().getFullYear()} Whyrus Root-Cause Analysis Platform. All rights reserved.
          </div>
          <div>
            Honest engineering • Evidence before assumptions
          </div>
        </div>

      </div>

    </footer>
  );
}
