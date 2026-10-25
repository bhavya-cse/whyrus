import React from 'react';
import { 
  AlertOctagon, 
  Compass, 
  Link2, 
  Cpu, 
  GitCommit, 
  CheckCircle2, 
  ArrowRight,
  Split,
  Layers
} from 'lucide-react';

export default function ProblemSolution({ onOpenAnalyzer }) {
  return (
    <section id="overview" className="py-20 lg:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
            <span>The Diagnostic Dilemma</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#111827] leading-[1.15] tracking-tight">
            An error tells you what happened. <br />
            <span className="text-[#4B5563]">Not why it failed.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#4B5563] font-normal leading-relaxed">
            Modern distributed systems fail across multiple components simultaneously. 
            A single upstream failure cascades into dozens of downstream alerts, leaving engineers to manually reassemble disparate clues under production pressure.
          </p>
        </div>

        {/* Asymmetrical 2-Column Editorial Grid: The Reality vs The Whyrus Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Fragmented Reality (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAFAF9] rounded-md p-8 border border-[#E5E7EB] flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xs bg-red-100 flex items-center justify-center text-red-700">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#111827]">
                  The Reality of Incident Chaos
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                
                <div className="p-4 rounded-xs bg-white border border-[#E5E7EB] space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#111827]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Scattered & Multi-Layer Logs</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Events are scattered across microservices, database clusters, and message queues without unified correlation IDs.
                  </p>
                </div>

                <div className="p-4 rounded-xs bg-white border border-[#E5E7EB] space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#111827]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Secondary Ripple Symptoms</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    A connection pool exhaustion triggers 50 HTTP 500 errors. Debugging the 500s treats symptoms rather than the root exhaustion.
                  </p>
                </div>

                <div className="p-4 rounded-xs bg-white border border-[#E5E7EB] space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#111827]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111827]"></span>
                    <span>Incomplete Stack Traces & Commits</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Stack traces capture where execution stopped, not the condition that triggered it. Recent Git merges are often falsely blamed without evidence.
                  </p>
                </div>

              </div>

            </div>

            <div className="pt-6 border-t border-[#E5E7EB] text-xs font-mono text-[#6B7280]">
              Outcome: Prolonged recovery times and speculative hotfixes.
            </div>
          </div>

          {/* Right Column: Whyrus Systematic Synthesis (7 cols) */}
          <div className="lg:col-span-7 bg-[#111827] text-white rounded-md p-8 border border-[#1F2937] shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xs bg-[#8CE800] flex items-center justify-center text-[#111827]">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    The Whyrus Diagnostic Approach
                  </h3>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#111827] bg-[#8CE800] px-2.5 py-0.5 rounded-xs font-semibold">
                  Evidence Grounded
                </span>
              </div>

              <p className="text-sm text-[#D1D5DB] leading-relaxed">
                Whyrus structures incident investigation systematically: reconstructing the chronological timeline, separating observed facts from speculative assumptions, and synthesizing ranked hypotheses with verifiable next steps.
              </p>

              {/* Three Structured Breakthroughs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                
                <div className="bg-[#1F2937] p-4 rounded-xs border border-[#374151] space-y-2">
                  <div className="text-xs font-mono font-semibold text-[#8CE800] flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Event Correlation</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Extracts chronological timelines to separate the primary trigger from secondary cascading noise.
                  </p>
                </div>

                <div className="bg-[#1F2937] p-4 rounded-xs border border-[#374151] space-y-2">
                  <div className="text-xs font-mono font-semibold text-white flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Ranked Hypotheses</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Evaluates plausible causes based on evidence directness, acknowledging missing telemetry explicitly.
                  </p>
                </div>

                <div className="bg-[#1F2937] p-4 rounded-xs border border-[#374151] space-y-2">
                  <div className="text-xs font-mono font-semibold text-[#8CE800] flex items-center space-x-1.5">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>Git Diff Context</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Correlates recent configuration diffs with observed error timestamps to isolate risky changes.
                  </p>
                </div>

              </div>

              {/* Principle Statement Quote Box */}
              <div className="bg-[#18181B] p-4 rounded-xs border border-[#27272A] flex items-start space-x-3 text-xs text-[#E4E4E7]">
                <CheckCircle2 className="w-4 h-4 text-[#8CE800] mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  <strong className="text-white">Strict Fact Distinction:</strong> Whyrus never reports hypotheses as confirmed facts. 
                  Every cause includes missing evidence needed for definitive proof and concrete inspection steps.
                </p>
              </div>

            </div>

            <div className="pt-6 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-xs font-mono text-[#9CA3AF]">
                Ready to examine your failure?
              </span>
              <button
                onClick={onOpenAnalyzer}
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#8CE800] hover:text-[#A3E635] transition-colors"
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
