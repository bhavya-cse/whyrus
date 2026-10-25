import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function InteractiveDemo({ onLoadIntoLiveAnalyzer }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'hypotheses' | 'actions'
  const [selectedEventId, setSelectedEventId] = useState('E-03');

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
    <section id="sample" className="py-20 lg:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#111827]">
              <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
              <span>Sample Incident Investigation</span>
            </div>
            
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#111827] tracking-tight">
              Forensic inspection in practice.
            </h2>
            
            <p className="text-base text-[#4B5563] leading-relaxed">
              Explore how Whyrus breaks down an actual cascade failure into a chronological event stream, 
              ranks plausible root causes, and generates actionable verification steps.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] text-[#4B5563] text-xs font-mono flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8CE800]"></span>
              <span>Demo mode • Illustrative data</span>
            </div>
            <button
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              <span>Load into analysis workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Showcase Container */}
        <div className="bg-[#FAFAF9] rounded-md border border-[#E5E7EB] shadow-sm overflow-hidden">
          
          {/* Top Control Bar with Tabs */}
          <div className="bg-white px-6 py-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Incident ID:
              </span>
              <span className="font-mono text-xs text-[#111827] bg-[#FAFAF9] px-2 py-0.5 rounded-xs border border-[#E5E7EB] font-bold">
                inc-db-timeout-cascade
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-xs bg-red-50 text-red-700 font-bold font-mono border border-red-200">
                CRITICAL
              </span>
            </div>

            {/* View Navigation Tabs */}
            <div className="flex items-center space-x-1 bg-[#FAFAF9] p-1 rounded-xs border border-[#E5E7EB]">
              {['overview', 'timeline', 'hypotheses', 'actions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'bg-[#111827] text-white shadow-2xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'timeline' && 'Timeline (5)'}
                  {tab === 'hypotheses' && 'Hypotheses (2)'}
                  {tab === 'actions' && 'Actions (3)'}
                </button>
              ))}
            </div>

          </div>

          {/* Interactive Workspace Body */}
          <div className="p-6 lg:p-8">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Summary Banner */}
                <div className="bg-white p-5 rounded-xs border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#111827] font-bold flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
                      <span>Incident Summary</span>
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">
                      Timeframe: 10:42:01 – 10:42:06 (5 seconds)
                    </span>
                  </div>
                  <p className="text-sm text-[#111827] leading-relaxed font-normal">
                    A database connection timeout occurred at 10:42:04 in <code className="font-mono text-xs px-1.5 py-0.5 rounded-xs bg-[#F4F4F2] border border-[#E5E7EB]">db-pool</code>, 
                    preventing order persistence and cascading into an HTTP 500 error in <code className="font-mono text-xs px-1.5 py-0.5 rounded-xs bg-[#F4F4F2] border border-[#E5E7EB]">http-server</code>.
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xs border border-[#E5E7EB]">
                    <div className="text-xs font-mono text-[#6B7280]">Primary Error</div>
                    <div className="mt-1 font-mono text-sm font-bold text-red-600 truncate">
                      Database timeout
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">First fatal event at 10:42:04</div>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#E5E7EB]">
                    <div className="text-xs font-mono text-[#6B7280]">Affected Services</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#111827]">
                      db-pool, order-service
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">2 internal components</div>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#E5E7EB]">
                    <div className="text-xs font-mono text-[#6B7280]">Severity Criteria</div>
                    <div className="mt-1 font-mono text-sm font-bold text-red-600">
                      CRITICAL (Public HTTP 500)
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">Impacted public endpoint</div>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#E5E7EB]">
                    <div className="text-xs font-mono text-[#6B7280]">Top Hypothesis</div>
                    <div className="mt-1 font-mono text-sm font-bold text-[#111827] truncate">
                      Pool Starvation (H-01)
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-1">Evidence Strength: High (88%)</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">
                    Select any tab above to inspect timeline events or examine the ranked hypotheses.
                  </span>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-semibold text-[#111827] hover:text-black flex items-center space-x-1 underline decoration-[#8CE800] decoration-2 underline-offset-4"
                  >
                    <span>Inspect Event Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">
                
                {/* Event list (7 cols) */}
                <div className="lg:col-span-7 space-y-2.5">
                  <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider mb-2 flex justify-between">
                    <span>Parsed Chronological Stream</span>
                    <span>Click step to inspect evidence</span>
                  </div>

                  {demoEvents.map((ev) => {
                    const isSelected = selectedEventId === ev.id;
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`p-3.5 rounded-xs border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#111827] ring-1 ring-[#111827] shadow-xs'
                            : 'bg-white border-[#E5E7EB] hover:border-[#9CA3AF]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center space-x-2.5">
                            <span className="px-1.5 py-0.5 rounded-xs bg-[#111827] text-white font-bold text-[10px]">
                              {ev.id}
                            </span>
                            <span className="text-[#6B7280]">{ev.time}</span>
                            <span className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold ${
                              ev.level === 'ERROR' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {ev.level}
                            </span>
                            <span className="text-[#111827] font-semibold">[{ev.component}]</span>
                          </div>

                          {ev.isTrigger && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-xs bg-[#8CE800] text-[#111827]">
                              Primary Trigger
                            </span>
                          )}
                          {ev.isCascade && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#F4F4F2] text-[#4B5563]">
                              Cascade Ripple
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-xs font-mono text-[#111827]">
                          {ev.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Inspector (5 cols) */}
                <div className="lg:col-span-5 bg-white p-5 rounded-xs border border-[#E5E7EB] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827]">
                      Evidence Inspector
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] font-bold">
                      Evidence ID: {selectedEvent.id}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[#6B7280] font-mono text-[11px]">Timestamp</div>
                      <div className="font-mono font-medium text-[#111827]">{selectedEvent.time}</div>
                    </div>

                    <div>
                      <div className="text-[#6B7280] font-mono text-[11px]">Service & Severity</div>
                      <div className="font-mono font-medium text-[#111827]">
                        {selectedEvent.component} • {selectedEvent.level}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#6B7280] font-mono text-[11px]">Raw Event Line</div>
                      <div className="p-3 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] font-mono text-[11px] text-[#111827] break-all">
                        {selectedEvent.time} {selectedEvent.level} [{selectedEvent.component}] {selectedEvent.message}
                      </div>
                    </div>

                    <div>
                      <div className="text-[#6B7280] font-mono text-[11px]">Diagnostic Assessment</div>
                      <div className="p-3 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] text-xs text-[#374151] leading-relaxed">
                        {selectedEvent.evidenceNote || "Routine operational event prior to failure onset."}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => setActiveTab('hypotheses')}
                      className="w-full py-2.5 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      View Hypotheses linked to {selectedEvent.id}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: HYPOTHESES */}
            {activeTab === 'hypotheses' && (
              <div className="space-y-5 animate-fade-in-up">
                
                {/* Hypothesis 1 */}
                <div className="rounded-xs border border-[#111827] bg-white p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-[#111827] text-white">
                        Rank #1 • H-01
                      </span>
                      <h4 className="font-heading font-bold text-lg text-[#111827]">
                        Database Connection Pool Exhaustion or Unreachable Host
                      </h4>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-xs bg-[#F4FBE8] text-[#3F6212] font-semibold border border-[#D3F49A]">
                      Confidence: High (88%)
                    </span>
                  </div>

                  <p className="text-sm text-[#374151] leading-relaxed">
                    A database connection timeout occurred immediately before order creation failed. 
                    The application process was unable to acquire an active connection from <code className="font-mono text-xs bg-[#FAFAF9] px-1 py-0.5 rounded-xs border border-[#E5E7EB]">db-pool</code> within 1000ms, causing immediate abort of transaction #89211.
                  </p>

                  {/* Supporting Evidence IDs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#FAFAF9] p-3.5 rounded-xs border border-[#E5E7EB] space-y-1">
                      <span className="font-mono text-[#111827] font-semibold block">Supporting Evidence</span>
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="font-mono px-2 py-0.5 rounded-xs bg-[#111827] text-white font-bold">E-03</span>
                        <span className="font-mono px-2 py-0.5 rounded-xs bg-[#E5E7EB] text-[#111827] font-bold">E-04</span>
                        <span className="text-[#6B7280] text-[11px]">(Database timeout + Order failure)</span>
                      </div>
                    </div>

                    <div className="bg-[#FAFAF9] p-3.5 rounded-xs border border-[#E5E7EB] space-y-1">
                      <span className="font-mono text-[#6B7280] font-semibold block">Ranking Rationale</span>
                      <p className="text-[#111827] leading-relaxed">
                        Chronological precedence: The database error preceded downstream HTTP 500 by 2 seconds.
                      </p>
                    </div>
                  </div>

                  {/* Missing Telemetry */}
                  <div className="p-3.5 rounded-xs bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-950 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Missing Telemetry Needed for Certainty</span>
                    </div>
                    <p className="leading-relaxed">
                      Database server active connection metrics during the 10:42:04 window. Without database daemon logs, transient network transport packet drop cannot be completely ruled out.
                    </p>
                  </div>
                </div>

                {/* Hypothesis 2 (Alternative) */}
                <div className="rounded-xs border border-[#E5E7EB] bg-white p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-[#E5E7EB] text-[#4B5563]">
                        Rank #2 • H-02
                      </span>
                      <h4 className="font-heading font-bold text-base text-[#111827]">
                        Transient Network Partition between Application and Database Subnet
                      </h4>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-xs bg-slate-100 text-slate-700 border border-slate-200">
                      Confidence: Moderate (58%)
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Rather than the database instance being down, a transient TCP packet drop or NAT gateway saturation could have produced the 1000ms socket timeout.
                  </p>
                </div>

              </div>
            )}

            {/* TAB: ACTIONS */}
            {activeTab === 'actions' && (
              <div className="space-y-4 animate-fade-in-up">
                
                <div className="p-4 rounded-xs border border-[#E5E7EB] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-xs border border-red-200">
                      Immediate Check [A-01]
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">Target: db-pool, database</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#111827]">
                    Inspect Database Health & Connection Pool Metrics
                  </h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Query <code className="font-mono text-xs bg-[#FAFAF9] px-1.5 py-0.5 rounded-xs border border-[#E5E7EB]">pg_stat_activity</code> or connection pooler telemetry to verify if active connections hit the maximum pool limit at 10:42:04.
                  </p>
                </div>

                <div className="p-4 rounded-xs border border-[#E5E7EB] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#111827] bg-[#FAFAF9] px-2 py-0.5 rounded-xs border border-[#E5E7EB]">
                      Verification Test [A-02]
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">Target: Application Pod</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#111827]">
                    Test Network Latency and Socket Connectivity
                  </h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Execute a TCP connection probe from the order-service pod to verify latency and eliminate firewall drops.
                  </p>
                </div>

                <div className="p-4 rounded-xs border border-[#E5E7EB] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                      Code Inspection [A-03]
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">Target: config/database.yml</span>
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#111827]">
                    Review Recent Pool Size Configuration Changes
                  </h4>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Check if a recent Git commit modified <code className="font-mono text-xs bg-[#FAFAF9] px-1.5 py-0.5 rounded-xs border border-[#E5E7EB]">pool_size</code> or <code className="font-mono text-xs bg-[#FAFAF9] px-1.5 py-0.5 rounded-xs border border-[#E5E7EB]">timeout_ms</code> parameters without load testing.
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="bg-white px-6 py-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
            <div>
              Demonstration constructed with real Whyrus analysis schema. All evidence IDs reference verifiable log timestamps.
            </div>
            <button
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className="font-semibold text-[#111827] hover:text-black flex items-center space-x-1 shrink-0 underline decoration-[#8CE800] decoration-2 underline-offset-4"
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
