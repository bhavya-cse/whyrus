import React, { useState } from 'react';
import { 
  FileText, 
  GitPullRequest, 
  Clock, 
  Workflow, 
  CheckSquare, 
  HelpCircle,
  Shield,
  ArrowRight
} from 'lucide-react';

export default function HowItWorks({ onOpenAnalyzer }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      number: "01",
      title: "Collect the Evidence",
      badge: "Intake & Redaction",
      summary: "Paste raw application logs, upload .log/.txt dumps, or supply optional Git diffs and stack traces.",
      details: [
        "Automatic client & server-side redaction of secrets, JWT tokens, and credentials.",
        "Accepts multi-format logs: ISO 8601, syslog, log4j, Docker/Kubernetes container streams.",
        "Optional Git diff input to inspect configuration drift and recent code edits."
      ],
      previewContent: {
        type: "code",
        label: "Redacted Evidence Ingestion",
        text: `10:42:01 INFO [order-service] Starting service...\n10:42:04 ERROR [db-pool] Timeout: auth=[REDACTED_SECRET]\n10:42:06 ERROR [http-server] HTTP 500 Internal Error`
      }
    },
    {
      number: "02",
      title: "Reconstruct the Incident",
      badge: "Parsing & Timelines",
      summary: "Parse unstructured logs into discrete events, fold multi-line stack traces, and assemble a timeline.",
      details: [
        "Deterministic parsing assigns unique Evidence IDs (E-01, E-02, etc.).",
        "Stack traces are folded into their parent error event instead of polluting the stream.",
        "Extracts log levels (CRITICAL, ERROR, WARN), timestamps, and component tags."
      ],
      previewContent: {
        type: "timeline",
        label: "Synthesized Chronological Timeline",
        text: `[E-01] 10:42:01 INFO  [order-service] Starting service...\n[E-02] 10:42:04 ERROR [db-pool] Connection timeout (1000ms limit)\n[E-03] 10:42:06 ERROR [http-server] HTTP 500 - POST /api/orders`
      }
    },
    {
      number: "03",
      title: "Investigate Plausible Causes",
      badge: "Correlation & Ranking",
      summary: "Connect related failure events, evaluate causality, and rank root-cause hypotheses with confidence scores.",
      details: [
        "Separates earliest trigger events from downstream cascade errors.",
        "Calculates calibrated confidence scores based on directness of supporting evidence.",
        "Lists contradictory evidence and explicitly identifies missing data needed for confirmation."
      ],
      previewContent: {
        type: "hypothesis",
        label: "Hypothesis [H-01] — Ranked #1",
        text: `Cause: Database Connection Pool Exhaustion\nConfidence: High (88%)\nSupporting: E-02, E-03\nMissing Evidence: Database server connection pool saturation metric`
      }
    },
    {
      number: "04",
      title: "Decide What to Do Next",
      badge: "Actionable Guidance",
      summary: "Receive targeted, prioritized debugging actions categorized by immediate checks, verification tests, and code fixes.",
      details: [
        "Clear step-by-step verification commands to prove or refute each hypothesis.",
        "Pinpoints specific config files, ports, endpoints, or code frames to inspect.",
        "Identifies missing telemetry or monitoring probes to prevent recurrence."
      ],
      previewContent: {
        type: "action",
        label: "Targeted Debugging Action",
        text: `[Immediate Check] Inspect Database Connection Pool Metrics\nQuery pg_stat_activity to check if active connections hit max limit.\nRelevant file: config/database.yml (pool_size)`
      }
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
            <span>The Investigation Pipeline</span>
          </div>
          
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] text-[#17243A] leading-[1.18] tracking-tight">
            How Whyrus works: <br className="hidden sm:inline" />
            <span className="text-[#167D78]">From scattered errors to evidence-backed answers.</span>
          </h2>
          
          <p className="text-lg text-[#64748B] font-normal leading-relaxed">
            Four connected stages designed to eliminate guesswork, respect uncertainty, and guide engineers directly to resolution.
          </p>
        </div>

        {/* 4-Stage Interactive Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Stage Navigator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.number}
                  onClick={() => setActiveStage(idx)}
                  className={`cursor-pointer rounded-xl p-6 transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#F7F6F2] border-[#167D78] shadow-sm'
                      : 'bg-white border-[#E5E4DE] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-[#167D78] text-white' : 'bg-[#E5E4DE] text-[#64748B]'
                      }`}>
                        {stage.number}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-[#17243A]">
                        {stage.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E5E4DE]">
                      {stage.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                    {stage.summary}
                  </p>

                  {/* Expanded details when active */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-[#E5E4DE] space-y-2">
                      {stage.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start space-x-2 text-xs text-[#17243A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#167D78] mt-1.5 shrink-0"></span>
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
            <div className="bg-[#17243A] text-white rounded-xl border border-[#273852] shadow-xl overflow-hidden">
              
              <div className="px-5 py-3.5 bg-[#0F172A] border-b border-[#273852] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#167D78] animate-pulse"></span>
                  <span className="text-xs font-mono text-[#94A3B8]">
                    Pipeline Stage {stages[activeStage].number} Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#E5A34B]">
                  Live Transform
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-xs font-mono text-[#5EEAD4] uppercase tracking-wider">
                  {stages[activeStage].previewContent.label}
                </div>

                <div className="bg-[#0A101D] p-4 rounded-lg border border-[#1E2E48] font-mono text-xs text-[#CBD5E1] whitespace-pre-wrap leading-relaxed">
                  {stages[activeStage].previewContent.text}
                </div>

                <div className="text-xs text-[#94A3B8] leading-relaxed pt-2">
                  {activeStage === 0 && "Logs are scrubbed of credentials before passing into parsing or external models."}
                  {activeStage === 1 && "Events are arranged sequentially, linking symptoms to original triggers."}
                  {activeStage === 2 && "Hypotheses remain plausible propositions until verified against telemetry."}
                  {activeStage === 3 && "Developers receive actionable tests instead of generic troubleshooting tips."}
                </div>

                <div className="pt-4 border-t border-[#273852]">
                  <button
                    onClick={onOpenAnalyzer}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded bg-[#167D78] hover:bg-[#126863] text-white text-xs font-medium transition-colors"
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
