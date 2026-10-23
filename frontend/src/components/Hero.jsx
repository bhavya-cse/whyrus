import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Database, 
  AlertTriangle, 
  Server, 
  CheckCircle, 
  Search, 
  ShieldAlert,
  GitBranch,
  CornerDownRight,
  ExternalLink
} from 'lucide-react';

export default function Hero({ onStartAnalysis, onExploreWorks }) {
  const [activeStep, setActiveStep] = useState(2); // Default to database timeout event

  const sampleEvents = [
    {
      id: "E-01",
      time: "10:42:01",
      level: "INFO",
      service: "order-service",
      text: "Worker started on port 8080 with pool size 5",
      type: "info"
    },
    {
      id: "E-02",
      time: "10:42:03",
      level: "INFO",
      service: "order-service",
      text: "Acquiring connection to postgres://app-db:5432/orders",
      type: "info"
    },
    {
      id: "E-03",
      time: "10:42:04",
      level: "ERROR",
      service: "db-pool",
      text: "Database connection timeout (1000ms limit reached)",
      type: "trigger",
      detail: "Pool exhausted or database unresponsive after pool_size reduced from 25 to 5 in commit 4f981a."
    },
    {
      id: "E-04",
      time: "10:42:05",
      level: "ERROR",
      service: "order-service",
      text: "Failed to persist order #89211: Database unavailable",
      type: "cascade"
    },
    {
      id: "E-05",
      time: "10:42:06",
      level: "ERROR",
      service: "http-server",
      text: "HTTP 500 Internal Server Error returned to checkout client",
      type: "symptom"
    }
  ];

  return (
    <section className="relative bg-[#17243A] text-white pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-[#273852]">
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-medium tracking-wider uppercase text-[#167D78] bg-[#167D78]/15 px-3 py-1 rounded border border-[#167D78]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
              <span>Intelligent Incident Investigation</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-white">
              Every error has a story. <br className="hidden sm:inline" />
              <span className="text-[#E5A34B]">Find out why.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-[#94A3B8] font-normal leading-relaxed max-w-xl">
              Whyrus connects logs, stack traces, and code changes to help you understand what failed, 
              investigate plausible root causes, and decide what to fix next.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartAnalysis}
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded font-medium text-white bg-[#167D78] hover:bg-[#126863] transition-all duration-150 shadow-lg shadow-[#167D78]/25 text-base focus:ring-2 focus:ring-offset-2 focus:ring-[#167D78] focus:ring-offset-[#17243A]"
              >
                <span>Investigate an incident</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreWorks}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded font-medium text-[#CBD5E1] hover:text-white bg-[#1E2E48] hover:bg-[#273852] border border-[#334155] transition-colors text-base"
              >
                <span>Explore how it works</span>
              </button>
            </div>

            {/* Product Axiom Footnote */}
            <div className="pt-4 flex items-center space-x-3 text-xs text-[#64748B] font-mono">
              <span className="w-2 h-0.5 bg-[#167D78]"></span>
              <span>Evidence-led analysis. Explainable hypotheses. Actionable next steps.</span>
            </div>
          </div>

          {/* Right Column: Original Incident Investigation Visual Composition */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-[#0F172A] border border-[#273852] shadow-2xl overflow-hidden">
              
              {/* Terminal Window Header */}
              <div className="bg-[#17243A] px-4 py-3 border-b border-[#273852] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#334155]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#334155]"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#334155]"></span>
                  <span className="text-xs font-mono text-[#94A3B8] ml-2 font-medium">incident-reconstruction.whyrus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-[#E5A34B] bg-[#E5A34B]/10 px-2 py-0.5 rounded border border-[#E5A34B]/20">
                    5 events parsed
                  </span>
                </div>
              </div>

              {/* Connected Timeline Visualization */}
              <div className="p-5 space-y-4">
                
                {/* Event sequence list */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] mb-2 flex items-center justify-between">
                    <span>Chronological Event Stream</span>
                    <span className="text-[10px]">Click step to inspect evidence</span>
                  </div>

                  {sampleEvents.map((ev, index) => {
                    const isSelected = activeStep === index;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setActiveStep(index)}
                        className={`group cursor-pointer rounded border p-2.5 transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#1E2E48] border-[#167D78] shadow-sm'
                            : 'bg-[#131F33] border-[#22334D] hover:border-[#334B6E]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#0A101D] text-[#94A3B8] border border-[#1E2E48]">
                              {ev.id}
                            </span>
                            <span className="text-[#64748B]">{ev.time}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              ev.level === 'ERROR' 
                                ? 'bg-[#C94C4C]/20 text-[#FF8585] border border-[#C94C4C]/30' 
                                : 'bg-[#167D78]/20 text-[#5EEAD4] border border-[#167D78]/30'
                            }`}>
                              {ev.level}
                            </span>
                            <span className="text-[#94A3B8] hidden sm:inline">[{ev.service}]</span>
                          </div>

                          {ev.type === 'trigger' && (
                            <span className="text-[10px] font-sans font-medium text-[#E5A34B] bg-[#E5A34B]/10 px-2 py-0.5 rounded border border-[#E5A34B]/30">
                              Earliest Trigger
                            </span>
                          )}
                          {ev.type === 'symptom' && (
                            <span className="text-[10px] font-sans font-medium text-[#94A3B8] bg-[#334155]/20 px-2 py-0.5 rounded">
                              Surface Symptom
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 text-xs font-mono text-[#CBD5E1] truncate">
                          {ev.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Trail Relationship Box */}
                <div className="pt-2 border-t border-[#273852]">
                  <div className="bg-[#17253B] rounded-lg p-3.5 border border-[#273852] space-y-2.5">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#167D78]"></span>
                        <span className="text-xs font-sans font-semibold text-white">Synthesized Hypothesis [H-01]</span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#167D78]/20 text-[#5EEAD4] border border-[#167D78]/40">
                        Evidence Strength: High (88%)
                      </span>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      <strong className="text-white">Database Pool Starvation:</strong> The database connection timeout at 10:42:04 (<span className="font-mono text-[#5EEAD4]">E-03</span>) 
                      occurred prior to order creation failure (<span className="font-mono text-[#5EEAD4]">E-04</span>) and subsequent HTTP 500 (<span className="font-mono text-[#5EEAD4]">E-05</span>).
                    </p>

                    {/* Investigation Relationship Diagram */}
                    <div className="bg-[#0D1524] p-2.5 rounded border border-[#1F2F4A] flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center space-x-1.5 text-[#E5A34B]">
                        <Database className="w-3.5 h-3.5" />
                        <span>E-03 Pool Timeout</span>
                      </div>
                      <span className="text-[#64748B]">→ triggers →</span>
                      <div className="flex items-center space-x-1.5 text-[#C94C4C]">
                        <Server className="w-3.5 h-3.5" />
                        <span>E-05 HTTP 500</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span>Action: Verify pool_size & DB CPU metrics</span>
                      <button 
                        onClick={onStartAnalysis}
                        className="text-[#167D78] hover:text-[#5EEAD4] font-medium flex items-center space-x-1"
                      >
                        <span>Analyze this case live</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
