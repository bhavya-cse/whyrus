import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  AlertTriangle, 
  Server, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function InteractiveDemo({ onLoadIntoLiveAnalyzer }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'hypotheses' | 'actions'
  const [selectedEventId, setSelectedEventId] = useState('E-03');
  const [expandedHypothesis, setExpandedHypothesis] = useState(true);
  const [expandedAction, setExpandedAction] = useState(true);

  const demoEvents = [
    {
      id: "E-01",
      time: "10:42:01",
      level: "INFO",
      component: "order-service",
      message: "Order service started on port 8080",
      isTrigger: false,
      isCascade: false
    },
    {
      id: "E-02",
      time: "10:42:03",
      level: "INFO",
      component: "order-service",
      message: "Connecting to database postgres://app-db:5432/orders",
      isTrigger: false,
      isCascade: false
    },
    {
      id: "E-03",
      time: "10:42:04",
      level: "ERROR",
      component: "db-pool",
      message: "Database connection timeout (could not acquire connection after 1000ms)",
      isTrigger: true,
      isCascade: false,
      evidenceNote: "Earliest fatal trigger. Occurred immediately prior to order creation failure."
    },
    {
      id: "E-04",
      time: "10:42:05",
      level: "ERROR",
      component: "order-service",
      message: "Failed to create order #89211: Database unavailable",
      isTrigger: false,
      isCascade: true,
      evidenceNote: "Secondary symptom caused by unavailability of database connection."
    },
    {
      id: "E-05",
      time: "10:42:06",
      level: "ERROR",
      component: "http-server",
      message: "HTTP 500 Internal Server Error returned for POST /api/v1/orders",
      isTrigger: false,
      isCascade: true,
      evidenceNote: "Downstream surface error exposed to checkout clients."
    }
  ];

  const selectedEvent = demoEvents.find(e => e.id === selectedEventId) || demoEvents[2];

  return (
    <section id="demo" className="py-20 lg:py-28 bg-[#F7F6F2] border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#167D78]"></span>
              <span>Interactive Demonstration</span>
            </div>
            
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#17243A] tracking-tight">
              Inspect an incident investigation in action.
            </h2>
            
            <p className="text-base text-[#64748B] leading-relaxed">
              Explore how Whyrus breaks down an actual cascade failure into a chronological event stream, 
              ranks plausible root causes, and generates actionable verification steps.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-3">
            {/* Clear Demonstration Warning Label */}
            <div className="px-3 py-1.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#E5A34B]"></span>
              <span>Demo mode • Illustrative data</span>
            </div>
            <button
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-[#167D78] hover:bg-[#126863] text-white text-xs font-medium transition-colors shadow-sm"
            >
              <span>Load into live engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Demo Product Showcase Container */}
        <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-xl overflow-hidden">
          
          {/* Top Control Bar with Tabs */}
          <div className="bg-[#17243A] text-white px-6 py-4 border-b border-[#273852] flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#C94C4C] animate-pulse"></div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Incident ID:
              </span>
              <span className="font-mono text-xs text-white bg-[#0F172A] px-2 py-0.5 rounded border border-[#273852]">
                inc-db-timeout-cascade
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#C94C4C]/20 text-[#FF8585] font-semibold font-mono border border-[#C94C4C]/30">
                CRITICAL
              </span>
            </div>

            {/* View Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-[#0F172A] p-1 rounded-lg border border-[#273852]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#167D78] text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-[#167D78] text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Timeline (5)
              </button>
              <button
                onClick={() => setActiveTab('hypotheses')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'hypotheses'
                    ? 'bg-[#167D78] text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Hypotheses (2)
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'actions'
                    ? 'bg-[#167D78] text-white'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Recommendations
              </button>
            </div>

          </div>

          {/* Interactive Workspace Body */}
          <div className="p-6 lg:p-8">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Summary Banner */}
                <div className="bg-[#F7F6F2] p-5 rounded-xl border border-[#E5E4DE] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#167D78] font-semibold">
                      Incident Summary
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">
                      Timeframe: 10:42:01 – 10:42:06 (5 seconds)
                    </span>
                  </div>
                  <p className="text-sm text-[#17243A] leading-relaxed font-medium">
                    A database connection timeout occurred at 10:42:04 in <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-white border border-[#E5E4DE]">db-pool</code>, 
                    preventing order persistence and cascading into an HTTP 500 error in <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-white border border-[#E5E4DE]">http-server</code>.
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E4DE]">
                    <div className="text-xs font-mono text-[#64748B]">Primary Error</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#C94C4C] truncate">
                      Database timeout
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-1">First fatal event at 10:42:04</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E4DE]">
                    <div className="text-xs font-mono text-[#64748B]">Affected Components</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#17243A]">
                      db-pool, order-service
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-1">2 internal services involved</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E4DE]">
                    <div className="text-xs font-mono text-[#64748B]">Severity Criteria</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#C94C4C]">
                      CRITICAL (Downstream 500)
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-1">Impacted public endpoint</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E5E4DE]">
                    <div className="text-xs font-mono text-[#64748B]">Top Hypothesis</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#167D78] truncate">
                      Pool Starvation (H-01)
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-1">Confidence: High (88%)</div>
                  </div>
                </div>

                {/* Quick Interactive Peek */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">
                    Want to inspect the timeline or hypotheses? Click a tab above or explore the timeline directly.
                  </span>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-semibold text-[#167D78] hover:text-[#126863] flex items-center space-x-1"
                  >
                    <span>View Interactive Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Event list (7 cols) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider mb-2 flex justify-between">
                    <span>Parsed Event Sequence</span>
                    <span>Click to inspect evidence details</span>
                  </div>

                  {demoEvents.map((ev) => {
                    const isSelected = selectedEventId === ev.id;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#F7F6F2] border-[#167D78] ring-1 ring-[#167D78]'
                            : 'bg-white border-[#E5E4DE] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#17243A] text-white font-bold text-[10px]">
                              {ev.id}
                            </span>
                            <span className="text-[#64748B]">{ev.time}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              ev.level === 'ERROR' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}>
                              {ev.level}
                            </span>
                            <span className="text-[#17243A] font-semibold">[{ev.component}]</span>
                          </div>

                          {ev.isTrigger && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                              Trigger Cause
                            </span>
                          )}
                          {ev.isCascade && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              Cascade Symptom
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-xs font-mono text-[#17243A]">
                          {ev.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Event Detail Inspector (5 cols) */}
                <div className="lg:col-span-5 bg-[#F7F6F2] p-5 rounded-xl border border-[#E5E4DE] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-[#167D78]">
                      Evidence Inspector
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#E5E4DE]">
                      Evidence ID: {selectedEvent.id}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[#64748B] font-mono text-[11px]">Timestamp</div>
                      <div className="font-mono font-medium text-[#17243A]">{selectedEvent.time}</div>
                    </div>

                    <div>
                      <div className="text-[#64748B] font-mono text-[11px]">Component & Severity</div>
                      <div className="font-mono font-medium text-[#17243A]">
                        {selectedEvent.component} • {selectedEvent.level}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#64748B] font-mono text-[11px]">Raw Event Line</div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E4DE] font-mono text-[11px] text-[#17243A] break-all">
                        {selectedEvent.time} {selectedEvent.level} [{selectedEvent.component}] {selectedEvent.message}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#64748B] font-mono text-[11px]">Forensic Assessment</div>
                      <div className="p-2.5 rounded bg-white border border-[#E5E4DE] text-xs text-[#17243A] leading-relaxed">
                        {selectedEvent.evidenceNote || "Routine operational event prior to failure onset."}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E4DE]">
                    <button
                      onClick={() => setActiveTab('hypotheses')}
                      className="w-full py-2 rounded bg-[#17243A] hover:bg-[#273852] text-white text-xs font-medium transition-colors"
                    >
                      View Hypotheses linked to {selectedEvent.id}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: HYPOTHESES */}
            {activeTab === 'hypotheses' && (
              <div className="space-y-6">
                
                {/* Hypothesis 1 */}
                <div className="rounded-xl border border-[#167D78] bg-[#F7F6F2] p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#167D78] text-white">
                        Rank #1 • H-01
                      </span>
                      <h4 className="font-heading font-bold text-lg text-[#17243A]">
                        Database Unavailable or Connection Pool Starvation
                      </h4>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#167D78]/15 text-[#167D78] font-semibold border border-[#167D78]/30">
                      Plausible • Confidence: High (88%)
                    </span>
                  </div>

                  <p className="text-sm text-[#17243A] leading-relaxed">
                    A database connection timeout occurred immediately before order creation failed. 
                    The application process was unable to acquire an active connection from <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-[#E5E4DE]">db-pool</code> within 1000ms, causing immediate abort of transaction #89211.
                  </p>

                  {/* Evidence IDs & Ranking Reason */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-[#E5E4DE] space-y-1">
                      <span className="font-mono text-[#167D78] font-semibold block">Supporting Evidence</span>
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="font-mono px-2 py-0.5 rounded bg-[#17243A] text-white font-bold">E-03</span>
                        <span className="font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800">E-04</span>
                        <span className="text-[#64748B] text-[11px]">(Database timeout + Order failure)</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-[#E5E4DE] space-y-1">
                      <span className="font-mono text-[#64748B] font-semibold block">Ranking Rationale</span>
                      <p className="text-[#17243A] leading-relaxed">
                        Chronological precedence: The database error preceded downstream HTTP 500 by 2 seconds.
                      </p>
                    </div>
                  </div>

                  {/* Missing Evidence Required to Confirm */}
                  <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-950 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Missing Evidence Needed for Certainty</span>
                    </div>
                    <p className="leading-relaxed">
                      Database server active connection telemetry and network latency metrics during the 10:42:04 window. 
                      Without database-side logs, transient network packet drop cannot be ruled out completely.
                    </p>
                  </div>
                </div>

                {/* Hypothesis 2 (Alternative) */}
                <div className="rounded-xl border border-[#E5E4DE] bg-white p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#E5E4DE] text-[#64748B]">
                        Rank #2 • H-02
                      </span>
                      <h4 className="font-heading font-bold text-base text-[#17243A]">
                        Transient Network Partition between Application and Database Subnet
                      </h4>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Plausible • Confidence: Moderate (58%)
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Rather than the database instance being down, a transient TCP packet drop or NAT gateway saturation could have produced the 1000ms socket timeout.
                  </p>
                </div>

              </div>
            )}

            {/* TAB: ACTIONS */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                
                <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C94C4C] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Immediate Check [A-01]
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">Target: db-pool, database</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#17243A]">
                    Inspect Database Health & Connection Pool Metrics
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Query <code className="font-mono text-xs bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#E5E4DE]">pg_stat_activity</code> or your connection pooler telemetry to verify if active connections hit the maximum pool limit at 10:42:04.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#167D78] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Verification Test [A-02]
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">Target: Application Pod</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#17243A]">
                    Test Network Latency and Socket Connectivity
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Execute a TCP connection probe or ping test from the order-service pod to verify latency and eliminate firewall drops.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E5A34B] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Code Inspection [A-03]
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">Target: config/database.yml</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#17243A]">
                    Review Recent Pool Size Configuration Changes
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Check if a recent Git commit modified <code className="font-mono text-xs bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#E5E4DE]">pool_size</code> or <code className="font-mono text-xs bg-[#F7F6F2] px-1.5 py-0.5 rounded border border-[#E5E4DE]">timeout_ms</code> parameters without load testing.
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Demonstration Footer */}
          <div className="bg-[#F7F6F2] px-6 py-4 border-t border-[#E5E4DE] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
            <div>
              Demonstration constructed with real Whyrus analysis schema. All evidence IDs reference verifiable log timestamps.
            </div>
            <button
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className="font-medium text-[#167D78] hover:text-[#126863] flex items-center space-x-1 shrink-0"
            >
              <span>Test with your own logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
