import React, { useState } from 'react';
import { 
  FileText, 
  Workflow, 
  Search, 
  CheckSquare, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorks({ onOpenAnalyzer }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      number: "01",
      title: "Ingest Evidence",
      badge: "Intake & Redaction",
      summary: "Paste raw logs, upload .log or .txt incident dumps, and supply optional Git diffs or service names.",
      details: [
        "Automated client and server-side secret scrubbing masks JWTs, passwords, and API keys before parsing.",
        "Accepts multi-source logs: ISO 8601, syslog, log4j, Docker/Kubernetes container streams.",
        "Optional Git diff parsing flags suspicious alterations in pool sizes, timeouts, and connection ports."
      ],
      previewContent: {
        label: "Stage 01 • Evidence Scrubbing & Intake",
        text: `10:42:01 INFO  [order-service] Starting service...\n10:42:04 ERROR [db-pool] Timeout: auth=[REDACTED_TOKEN]\n10:42:06 ERROR [http-server] HTTP 500 Internal Error`
      }
    },
    {
      number: "02",
      title: "Correlate Events",
      badge: "Parsing & Timelines",
      summary: "Unstructured logs are parsed into discrete events, multiline stack traces are folded, and an ordered timeline is assembled.",
      details: [
        "Deterministic parsing assigns unique Evidence IDs (E-01, E-02, E-03) to each event.",
        "Multiline stack traces are folded directly into their parent error event, eliminating noise.",
        "Identifies timestamps, service tags, and normalized severities (INFO, WARN, ERROR, CRITICAL)."
      ],
      previewContent: {
        label: "Stage 02 • Chronological Event Stream",
        text: `[E-01] 10:42:01 INFO  [order-service] Starting service...\n[E-02] 10:42:04 ERROR [db-pool] Connection timeout (1000ms limit)\n[E-03] 10:42:06 ERROR [http-server] HTTP 500 - POST /api/orders`
      }
    },
    {
      number: "03",
      title: "Investigate Root Causes",
      badge: "Causality & Ranking",
      summary: "Connect related failure events, evaluate causality, and rank root-cause hypotheses based on evidence directness.",
      details: [
        "Separates earliest trigger events from downstream secondary symptoms.",
        "Calculates calibrated evidence strength scores based on directness of observed signals.",
        "Explicitly states missing telemetry needed to reach definitive certainty, avoiding false guarantees."
      ],
      previewContent: {
        label: "Stage 03 • Ranked Root-Cause Hypotheses",
        text: `Hypothesis [H-01]: Database Connection Pool Starvation\nConfidence: High (88%)\nSupporting Evidence: E-02, E-03\nMissing Evidence: Database server connection pool saturation metric`
      }
    },
    {
      number: "04",
      title: "Validate Recovery",
      badge: "Targeted Next Steps",
      summary: "Receive prioritized debugging recommendations categorized by immediate checks, verification tests, and code reviews.",
      details: [
        "Targeted inspection steps to verify or refute each hypothesis quickly.",
        "Pinpoints specific configuration files, ports, database views, or endpoints.",
        "Highlights missing monitoring telemetry to prevent repeat outages."
      ],
      previewContent: {
        label: "Stage 04 • Actionable Verification Guidance",
        text: `[Immediate Check] Query pg_stat_activity on database\nVerify if connection pool hit max limit at incident window.\nTarget: config/database.yml (pool_size)`
      }
    }
  ];

  return (
    <section id="workflow" className="py-20 lg:py-28 bg-[#FAFAF9] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#111827] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
            <span>Investigation Workflow</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#111827] leading-[1.15] tracking-tight">
            How Whyrus works: <br />
            <span className="text-[#4B5563]">From scattered logs to evidence-backed answers.</span>
          </h2>
          
          <p className="text-base sm:text-lg text-[#4B5563] font-normal leading-relaxed">
            Four connected stages designed to eliminate guesswork, respect uncertainty, and guide engineering teams directly to resolution.
          </p>
        </div>

        {/* 4-Stage Connected Workflow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stage Navigator (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.number}
                  onClick={() => setActiveStage(idx)}
                  className={`cursor-pointer rounded-xs p-6 transition-all duration-200 border ${
                    isActive
                      ? 'bg-white border-[#111827] shadow-sm'
                      : 'bg-[#FAFAF9] border-[#E5E7EB] hover:bg-white hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs transition-colors ${
                        isActive ? 'bg-[#111827] text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                      }`}>
                        {stage.number}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-[#111827]">
                        {stage.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#4B5563] bg-white px-2 py-0.5 rounded-xs border border-[#E5E7EB]">
                      {stage.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                    {stage.summary}
                  </p>

                  {/* Expanded details when active */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2 animate-fade-in-up">
                      {stage.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start space-x-2 text-xs text-[#111827]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8CE800] mt-1.5 shrink-0"></span>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Stage Preview Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white text-[#111827] rounded-md border border-[#E5E7EB] shadow-md overflow-hidden">
              
              <div className="px-5 py-3.5 bg-[#F9F9F8] border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
                  <span className="text-xs font-mono font-medium text-[#111827]">
                    Stage {stages[activeStage].number} Architecture
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4B5563] bg-white px-2 py-0.5 rounded-xs border border-[#E5E7EB]">
                  Interactive
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider">
                  {stages[activeStage].previewContent.label}
                </div>

                <div className="bg-[#111827] p-4 rounded-xs border border-[#1F2937] font-mono text-xs text-[#E5E7EB] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {stages[activeStage].previewContent.text}
                </div>

                <div className="text-xs text-[#6B7280] leading-relaxed pt-1">
                  {activeStage === 0 && "Logs are scrubbed of credentials before passing into parsing or external models."}
                  {activeStage === 1 && "Events are arranged sequentially, linking symptoms to original triggers."}
                  {activeStage === 2 && "Hypotheses remain plausible propositions until verified against telemetry."}
                  {activeStage === 3 && "Developers receive actionable tests instead of generic troubleshooting tips."}
                </div>

                <div className="pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={onOpenAnalyzer}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Run your logs through this pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
