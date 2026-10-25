import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Cpu, 
  GitBranch, 
  Sparkles, 
  SearchCheck,
  CheckCircle2,
  Terminal,
  ArrowRight
} from 'lucide-react';

export default function CoreCapabilities({ onOpenAnalyzer }) {
  return (
    <section id="capabilities" className="py-20 lg:py-28 bg-[#FAFAF9] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
            <span>Platform Capabilities</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#111827] leading-[1.15] tracking-tight">
            Forensic engineering precision. <br />
            <span className="text-[#4B5563]">Designed for production reality.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#4B5563] font-normal leading-relaxed">
            Whyrus pairs deterministic log correlation with evidence-grounded reasoning to deliver explainable, auditable incident analysis.
          </p>
        </div>

        {/* Varied Editorial Layout for Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Featured Capability: Chronological Incident Reconstruction (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-md p-8 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xs bg-[#111827] flex items-center justify-center text-white">
                  <Clock className="w-4 h-4 text-[#8CE800]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#111827]">
                    Chronological Incident Reconstruction
                  </h3>
                  <span className="text-xs font-mono text-[#6B7280]">Deterministic Sequence Mapping</span>
                </div>
              </div>

              <p className="text-sm text-[#4B5563] leading-relaxed max-w-2xl">
                Raw logs are parsed into an ordered timeline with individual Evidence IDs (E-01, E-02). 
                Multiline stack traces are automatically folded into parent events, exposing the exact chronological progression from initial trigger to downstream crash.
              </p>

              {/* Visual Sequence Element */}
              <div className="bg-[#FAFAF9] p-4 rounded-xs border border-[#E5E7EB] font-mono text-xs text-[#374151] space-y-2">
                <div className="flex items-center space-x-2 text-[#111827]">
                  <span className="text-[#111827] font-bold">[E-01] 10:42:01</span>
                  <span>INFO [order-service] Starting server</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-800">
                  <span className="text-amber-800 font-bold">[E-02] 10:42:04</span>
                  <span>ERROR [db-pool] Connection timeout (1000ms limit)</span>
                </div>
                <div className="flex items-center space-x-2 text-red-700">
                  <span className="text-red-700 font-bold">[E-03] 10:42:06</span>
                  <span>ERROR [http-server] HTTP 500 Internal Server Error</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E7EB] text-xs font-mono text-[#6B7280]">
              Standardized across ISO 8601, syslog, custom formats, and microservice tags.
            </div>
          </div>

          {/* Capability: Secret Redaction (4 cols) */}
          <div className="md:col-span-4 bg-[#111827] text-white rounded-md p-7 border border-[#1F2937] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xs bg-[#1F2937] flex items-center justify-center text-[#8CE800]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Automated Secret Redaction
              </h3>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Client and backend redaction masks JWTs, Bearer tokens, DB connection passwords, and cloud API keys before data enters parsing or optional AI processing.
              </p>
              <div className="p-3 rounded-xs bg-[#1F2937] border border-[#374151] font-mono text-[11px] text-[#E5E7EB]">
                Authorization: Bearer <span className="text-[#8CE800] font-bold">[REDACTED_TOKEN]</span>
              </div>
            </div>
            <div className="text-xs font-mono text-[#8CE800] font-semibold pt-4">
              Privacy First Architecture
            </div>
          </div>

          {/* Capability: Explainable Root-Cause Ranking (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-md p-7 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#111827]">
                Explainable Hypothesis Ranking
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Scores plausible causes based on evidence directness and chronological priority. Every hypothesis points directly to observed Evidence IDs rather than guesswork.
              </p>
            </div>
            <div className="p-2.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] text-[11px] font-mono text-[#111827] font-medium">
              Evidence Strength: High (88%) • Supporting: E-02, E-03
            </div>
          </div>

          {/* Capability: Git Diff Correlation (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-md p-7 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#111827]">
                Git Diff Context Correlation
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Supply recent commits to correlate configuration alterations (pool sizes, timeouts, port numbers, dependencies) with error onset times in the log timeline.
              </p>
            </div>
            <div className="p-2.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] text-[11px] font-mono text-[#111827]">
              Detected: <span className="text-red-700">- pool_size: 25</span> / <span className="text-[#3F6212] font-semibold">+ pool_size: 4</span>
            </div>
          </div>

          {/* Capability: Grounded AI Reasoning (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-md p-7 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Sparkles className="w-5 h-5 text-[#65A30D]" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#111827]">
                Evidence-Grounded AI Reasoning
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Powered by Google Gemini with strict prompt constraints: AI can only reference validated Evidence IDs. No hallucinated file paths or phantom log lines.
              </p>
            </div>
            <div className="text-xs font-mono text-[#6B7280]">
              Deterministic rule engine fallback always active.
            </div>
          </div>

          {/* Capability: Targeted Debugging Actions (12 cols) */}
          <div className="md:col-span-12 bg-white rounded-md p-8 border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#111827] uppercase tracking-wider">
                <SearchCheck className="w-4 h-4 text-[#8CE800]" />
                <span>Actionable Recommendations</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#111827]">
                Practical, prioritized next steps developers can actually execute
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Categorized by Immediate Checks, Verification Tests, Code Inspections, and Telemetry Requirements. 
                Whyrus specifies exact queries to run, metrics to inspect, and missing logs to collect.
              </p>
            </div>

            <button
              onClick={onOpenAnalyzer}
              className="shrink-0 px-6 py-3 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Test with Your Incidents
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
