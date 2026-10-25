import React, { useState } from 'react';
import { 
  ArrowRight, 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Terminal,
  CornerDownRight,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

export default function Hero({ onStartAnalysis, onExploreWorks }) {
  const [activeStep, setActiveStep] = useState(2); // Default to database timeout event

  const sampleEvents = [
    {
      id: "E-01",
      time: "10:42:01",
      level: "INFO",
      service: "order-service",
      text: "Worker initialized on port 8080 with pool size 4",
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
      text: "Database connection timeout (1000ms threshold reached)",
      type: "trigger",
      detail: "Connection pool starvation occurred immediately prior to order creation failure."
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
    <section className="relative bg-[#FAFAF9] text-[#111827] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E5E7EB] overflow-hidden">
      
      {/* Editorial Hairline Grid Background Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #111827 1px, transparent 1px), linear-gradient(to bottom, #111827 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Eyebrow with vivid lime accent */}
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase text-[#111827] bg-white px-3 py-1.5 rounded-sm border border-[#E5E7EB] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8CE800] shadow-xs shadow-[#8CE800]/50"></span>
              <span>Intelligent Incident Investigation</span>
            </div>

            {/* Confident Editorial Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight text-[#111827]">
              Find the cause. <br />
              <span className="text-[#111827] underline decoration-[#8CE800] decoration-4 underline-offset-8">
                Restore confidence.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4B5563] font-normal leading-relaxed max-w-xl">
              Whyrus connects logs, errors, timelines, and code changes to help engineers 
              investigate software failures, rank plausible root causes, and decide what to verify next.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onStartAnalysis}
                className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-sm font-semibold text-xs uppercase tracking-wider text-[#111827] bg-[#8CE800] hover:bg-[#78D000] transition-all duration-150 shadow-xs focus:ring-2 focus:ring-offset-2 focus:ring-[#8CE800]"
              >
                <span>Analyse an incident</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreWorks}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-sm font-semibold text-xs uppercase tracking-wider text-[#111827] bg-white hover:bg-[#F4F4F2] border border-[#D1D5DB] transition-colors"
              >
                <span>Explore how it works</span>
              </button>
            </div>

            {/* Editorial Axiom Footnote */}
            <div className="pt-4 flex items-center space-x-3 text-xs text-[#6B7280] font-mono">
              <span className="w-3 h-0.5 bg-[#8CE800]"></span>
              <span>Evidence before assumptions • Explainable hypotheses • Actionable next steps</span>
            </div>
          </div>

          {/* Right Column: Visual Incident Investigation Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-md bg-white border border-[#E5E7EB] shadow-lg overflow-hidden">
              
              {/* Card Header Bar */}
              <div className="bg-[#F9F9F8] px-5 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111827]"></span>
                  <span className="text-xs font-mono font-medium text-[#111827] tracking-tight">
                    diagnostic-trace.whyrus
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#F4FBE8] text-[#3F6212] font-semibold border border-[#D3F49A]">
                    5 events correlated
                  </span>
                </div>
              </div>

              {/* Event Timeline Stream */}
              <div className="p-5 sm:p-6 space-y-4">
                
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#6B7280]">
                  <span>Chronological Event Stream</span>
                  <span className="text-[10px] text-[#9CA3AF]">Click step to inspect</span>
                </div>

                <div className="space-y-2">
                  {sampleEvents.map((ev, index) => {
                    const isSelected = activeStep === index;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setActiveStep(index)}
                        className={`group cursor-pointer rounded-xs border p-3 transition-all duration-150 ${
                          isSelected
                            ? 'bg-[#FAFAF9] border-[#111827] ring-1 ring-[#111827] shadow-xs'
                            : 'bg-white border-[#E5E7EB] hover:border-[#9CA3AF]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2.5">
                            <span className="px-1.5 py-0.5 rounded-xs text-[10px] bg-[#111827] text-white font-bold">
                              {ev.id}
                            </span>
                            <span className="text-[#6B7280]">{ev.time}</span>
                            <span className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold ${
                              ev.level === 'ERROR' 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ev.level}
                            </span>
                            <span className="text-[#111827] font-semibold hidden sm:inline">[{ev.service}]</span>
                          </div>

                          {ev.type === 'trigger' && (
                            <span className="text-[10px] font-mono font-semibold text-[#111827] bg-[#8CE800] px-2 py-0.5 rounded-xs shadow-2xs">
                              Primary Trigger
                            </span>
                          )}
                          {ev.type === 'symptom' && (
                            <span className="text-[10px] font-mono text-[#6B7280] bg-[#F4F4F2] px-2 py-0.5 rounded-xs">
                              Surface Symptom
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 text-xs font-mono text-[#374151] truncate">
                          {ev.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Synthesis Box */}
                <div className="pt-3 border-t border-[#E5E7EB]">
                  <div className="bg-[#FAFAF9] rounded-xs p-4 border border-[#E5E7EB] space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8CE800] shadow-xs shadow-[#8CE800]/50"></span>
                        <span className="text-xs font-heading font-bold text-[#111827]">
                          Ranked Hypothesis [H-01]
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#111827] text-white font-medium">
                        Evidence Strength: High (88%)
                      </span>
                    </div>

                    <p className="text-xs text-[#374151] leading-relaxed">
                      <strong className="text-[#111827]">Database Connection Pool Starvation:</strong> The timeout at 10:42:04 (<span className="font-mono font-bold text-[#111827]">E-03</span>) 
                      occurred prior to order failure (<span className="font-mono font-bold text-[#111827]">E-04</span>) and subsequent HTTP 500 (<span className="font-mono font-bold text-[#111827]">E-05</span>).
                    </p>

                    {/* Investigation Relationship Breadcrumb */}
                    <div className="bg-white p-2.5 rounded-xs border border-[#E5E7EB] flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center space-x-1.5 text-[#111827] font-semibold">
                        <Database className="w-3.5 h-3.5 text-amber-600" />
                        <span>E-03 Pool Timeout</span>
                      </div>
                      <span className="text-[#9CA3AF]">→ cascades into →</span>
                      <div className="flex items-center space-x-1.5 text-red-600 font-semibold">
                        <Server className="w-3.5 h-3.5" />
                        <span>E-05 HTTP 500</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1">
                      <span>Action: Verify pool_size & active connections</span>
                      <button 
                        onClick={onStartAnalysis}
                        className="text-[#111827] hover:text-black font-semibold flex items-center space-x-1 underline decoration-[#8CE800] decoration-2 underline-offset-4"
                      >
                        <span>Analyse this case</span>
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
