import React from 'react';
import { 
  AlertOctagon, 
  Search, 
  GitCommit, 
  Layers, 
  CheckCircle2, 
  Compass, 
  FileSpreadsheet,
  Link2,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function ProblemSolution({ onOpenAnalyzer }) {
  return (
    <section id="product" className="py-20 lg:py-28 bg-[#F7F6F2] border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
            <span>The Investigation Dilemma</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#17243A] leading-[1.18] tracking-tight">
            An error message tells you what happened. <br className="hidden sm:inline" />
            <span className="text-[#167D78]">Not necessarily why.</span>
          </h2>
          
          <p className="text-lg text-[#64748B] font-normal leading-relaxed">
            Modern distributed applications fail across multiple layers simultaneously. 
            A single root cause cascades into dozens of downstream alerts, leaving engineers to manually piece together fragments under pressure.
          </p>
        </div>

        {/* Asymmetrical Editorial Composition: Problem vs Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: The Fragmented Reality (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl p-8 border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#C94C4C]/10 flex items-center justify-center text-[#C94C4C]">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#17243A]">
                  The Reality of Incident Chaos
                </h3>
              </div>

              <div className="space-y-4 pt-2">
                
                <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[#E5E4DE] space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-medium text-[#17243A]">
                    <span className="w-2 h-2 rounded-full bg-[#C94C4C]"></span>
                    <span>Scattered & Multi-Source Logs</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Log events are distributed across container clusters, API gateways, database logs, and background queues without correlation IDs.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[#E5E4DE] space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-medium text-[#17243A]">
                    <span className="w-2 h-2 rounded-full bg-[#E5A34B]"></span>
                    <span>Secondary Cascading Symptoms</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    A connection pool exhaustion triggers 50 HTTP 500 errors. Debugging the 500s treats symptoms rather than the underlying saturation.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[#E5E4DE] space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-medium text-[#17243A]">
                    <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
                    <span>Incomplete Stack Traces & Commits</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Stack traces capture where the thread failed, not the state change that led to it. Recent Git merges are often falsely blamed without evidence.
                  </p>
                </div>

              </div>

            </div>

            <div className="pt-6 border-t border-[#E5E4DE] text-xs font-mono text-[#64748B]">
              Result: High Mean-Time-to-Resolution (MTTR) and trial-and-error deployments.
            </div>
          </div>

          {/* Right Column: Whyrus Systematic Synthesis (7 cols) */}
          <div className="lg:col-span-7 bg-[#17243A] text-white rounded-xl p-8 border border-[#273852] shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#167D78] flex items-center justify-center text-white">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    The Whyrus Systematic Approach
                  </h3>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#167D78] bg-[#167D78]/20 px-2.5 py-0.5 rounded border border-[#167D78]/30">
                  Evidence-Grounded
                </span>
              </div>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Whyrus treats debugging like a forensic investigation: reconstructing the timeline, separating observed facts from speculative assumptions, and synthesizing ranked hypotheses with verifiable tests.
              </p>

              {/* Three Structured Breakthroughs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                <div className="bg-[#1E2E48] p-4 rounded-lg border border-[#2D4366] space-y-2">
                  <div className="text-xs font-mono font-semibold text-[#5EEAD4] flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Event Correlation</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Identifies chronological sequences to separate the primary trigger from secondary ripple errors.
                  </p>
                </div>

                <div className="bg-[#1E2E48] p-4 rounded-lg border border-[#2D4366] space-y-2">
                  <div className="text-xs font-mono font-semibold text-[#E5A34B] flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Hypothesis Ranking</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Ranks plausible root causes based on directness of supporting evidence, not speculative guesswork.
                  </p>
                </div>

                <div className="bg-[#1E2E48] p-4 rounded-lg border border-[#2D4366] space-y-2">
                  <div className="text-xs font-mono font-semibold text-[#FFFFFF] flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>Diff Context</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    Correlates recent configuration diffs with observed error signatures to isolate risky changes.
                  </p>
                </div>

              </div>

              {/* Principle Statement Quote Box */}
              <div className="bg-[#0F172A] p-4 rounded-lg border border-[#273852] flex items-start space-x-3 text-xs text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-[#167D78] mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  <strong className="text-white">Strict Fact Distinction:</strong> Whyrus never reports hypotheses as confirmed facts. 
                  Every cause includes missing evidence needed for 100% certainty and concrete queries to test it.
                </p>
              </div>

            </div>

            <div className="pt-6 border-t border-[#273852] flex items-center justify-between">
              <span className="text-xs font-mono text-[#64748B]">
                Ready to examine your failure?
              </span>
              <button
                onClick={onOpenAnalyzer}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#5EEAD4] hover:text-white transition-colors"
              >
                <span>Launch Incident Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
