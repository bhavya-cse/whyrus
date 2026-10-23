import React from 'react';
import { 
  FileCode, 
  GitBranch, 
  Clock, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  SearchCheck,
  CheckCircle2,
  TerminalSquare
} from 'lucide-react';

export default function CoreCapabilities({ onOpenAnalyzer }) {
  return (
    <section id="capabilities" className="py-20 lg:py-28 bg-white border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
            <span>Platform Capabilities</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#17243A] leading-[1.18] tracking-tight">
            Engineered for forensic precision. <br className="hidden sm:inline" />
            <span className="text-[#167D78]">Designed for engineering reality.</span>
          </h2>
          
          <p className="text-lg text-[#64748B] font-normal leading-relaxed">
            Whyrus pairs deterministic log parsing with evidence-grounded AI synthesis to deliver clear, auditable incident analysis.
          </p>
        </div>

        {/* Varied Architectural Layout for Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Chronological Incident Reconstruction (Featured - 8 cols) */}
          <div className="md:col-span-8 bg-[#17243A] text-white rounded-2xl p-8 border border-[#273852] shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#167D78] flex items-center justify-center text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    Chronological Incident Reconstruction
                  </h3>
                  <span className="text-xs font-mono text-[#94A3B8]">Deterministic Sequence Mapping</span>
                </div>
              </div>

              <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-2xl">
                Raw logs are parsed into an ordered timeline with individual Evidence IDs (E-01, E-02). 
                Multi-line stack traces are automatically folded into parent events, exposing the exact chronological progression from initial trigger to downstream crash.
              </p>

              {/* Visual Mock Element */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#273852] font-mono text-xs text-[#94A3B8] space-y-2">
                <div className="flex items-center space-x-2 text-white">
                  <span className="text-[#5EEAD4] font-bold">[E-01] 10:42:01</span>
                  <span>INFO [order-service] Starting server</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-300">
                  <span className="text-[#E5A34B] font-bold">[E-02] 10:42:04</span>
                  <span>ERROR [db-pool] Connection timeout (1000ms)</span>
                </div>
                <div className="flex items-center space-x-2 text-red-400">
                  <span className="text-[#FF8585] font-bold">[E-03] 10:42:06</span>
                  <span>ERROR [http-server] HTTP 500 Internal Server Error</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#273852] text-xs font-mono text-[#64748B]">
              Standardized across ISO 8601, syslog, custom formats, and microservice tags.
            </div>
          </div>

          {/* Card 2: Sensitive Token & Secret Redaction (4 cols) */}
          <div className="md:col-span-4 bg-[#F7F6F2] rounded-2xl p-7 border border-[#E5E4DE] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#17243A] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#17243A]">
                Automated Secret Redaction
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Client-side and backend redaction masks JWTs, Bearer tokens, DB connection passwords, and cloud API keys before data ever enters parsing or external AI processing.
              </p>
              <div className="p-3 rounded-lg bg-white border border-[#E5E4DE] font-mono text-[11px] text-[#17243A]">
                Authorization: Bearer <span className="text-[#167D78] font-bold">[REDACTED_TOKEN]</span>
              </div>
            </div>
            <div className="text-xs font-mono text-[#167D78] font-semibold pt-4">
              Privacy First Architecture
            </div>
          </div>

          {/* Card 3: Explainable Root-Cause Ranking (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#167D78]/15 flex items-center justify-center text-[#167D78]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#17243A]">
                Explainable Hypothesis Ranking
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Whyrus scores plausible causes based on evidence directness and chronological priority. Every hypothesis points directly to observed Evidence IDs rather than guesswork.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#F7F6F2] border border-[#E5E4DE] text-[11px] font-mono text-[#17243A]">
              Confidence: High (88%) • Supporting: E-02, E-03
            </div>
          </div>

          {/* Card 4: Git Diff & Code Change Correlation (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#E5A34B]/15 flex items-center justify-center text-[#E5A34B]">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#17243A]">
                Git Diff & Commit Correlation
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Supply recent git diffs to correlate configuration alterations (pool sizes, timeouts, port numbers, dependencies) with error onset times in the log timeline.
              </p>
            </div>
            <div className="p-2.5 rounded bg-[#F7F6F2] border border-[#E5E4DE] text-[11px] font-mono text-[#17243A]">
              Detected: <span className="text-[#C94C4C]">- pool_size: 25</span> / <span className="text-[#167D78]">+ pool_size: 5</span>
            </div>
          </div>

          {/* Card 5: Evidence-Grounded AI Synthesis (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-7 border border-[#E5E4DE] shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-9 h-9 rounded-lg bg-[#167D78] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#17243A]">
                Evidence-Grounded AI Reasoning
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Powered by Google Gemini with strict prompt constraints: AI can only reference validated Evidence IDs. No hallucinated file paths or phantom log lines.
              </p>
            </div>
            <div className="text-xs font-mono text-[#64748B]">
              Deterministic rule engine fallback always available.
            </div>
          </div>

          {/* Card 6: Targeted Debugging Actions (12 cols full width) */}
          <div className="md:col-span-12 bg-[#F7F6F2] rounded-2xl p-8 border border-[#E5E4DE] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#167D78] uppercase">
                <SearchCheck className="w-4 h-4" />
                <span>Actionable Recommendations</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#17243A]">
                Practical, prioritized next steps developers can actually execute
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Categorized by Immediate Checks, Verification Tests, Code Inspections, and Telemetry Requirements. 
                Whyrus tells you exactly what queries to run, what metrics to inspect, and what missing logs to collect.
              </p>
            </div>

            <button
              onClick={onOpenAnalyzer}
              className="shrink-0 px-6 py-3 rounded-lg bg-[#17243A] hover:bg-[#273852] text-white font-medium text-xs transition-colors"
            >
              Test with Your Incidents
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
