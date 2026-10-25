
import React, { useState } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';

export default function InteractiveDemo({ onLoadIntoLiveAnalyzer }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEventId, setSelectedEventId] = useState('E-03');

  const demoEvents = [
    {
      id: 'E-01',
      time: '10:42:01',
      level: 'INFO',
      component: 'order-service',
      message: 'Order service started on port 8080',
      isTrigger: false,
      isCascade: false,
    },
    {
      id: 'E-02',
      time: '10:42:03',
      level: 'INFO',
      component: 'order-service',
      message: 'Connecting to database postgres://app-db:5432/orders',
      isTrigger: false,
      isCascade: false,
    },
    {
      id: 'E-03',
      time: '10:42:04',
      level: 'ERROR',
      component: 'db-pool',
      message:
        'Database connection timeout (could not acquire connection after 1000ms)',
      isTrigger: true,
      isCascade: false,
      evidenceNote:
        'Earliest fatal trigger. Occurred immediately prior to order creation failure.',
    },
    {
      id: 'E-04',
      time: '10:42:05',
      level: 'ERROR',
      component: 'order-service',
      message: 'Failed to create order #89211: Database unavailable',
      isTrigger: false,
      isCascade: true,
      evidenceNote:
        'Secondary symptom caused by unavailability of database connection.',
    },
    {
      id: 'E-05',
      time: '10:42:06',
      level: 'ERROR',
      component: 'http-server',
      message:
        'HTTP 500 Internal Server Error returned for POST /api/v1/orders',
      isTrigger: false,
      isCascade: true,
      evidenceNote: 'Downstream surface error exposed to checkout clients.',
    },
  ];

  const selectedEvent =
    demoEvents.find((event) => event.id === selectedEventId) || demoEvents[2];

  const tabs = ['overview', 'timeline', 'hypotheses', 'actions'];

  const surfaceStyle = {
    backgroundColor: 'var(--surface-bg)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  };

  const secondaryTextStyle = { color: 'var(--text-secondary)' };

  const subtleStyle = {
    backgroundColor: 'var(--surface-subtle)',
    borderColor: 'var(--border-color)',
  };

  const plumButton =
    'bg-[#713F75] hover:bg-[#572F5B] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#713F75] focus:ring-offset-2';

  const mutedPanel =
    'rounded-xs border p-4 space-y-2';

  const codeClass =
    'font-mono text-xs px-1.5 py-0.5 rounded-xs border border-[#E4CDE6] bg-[#F7EFF8] text-[#572F5B]';

  return (
    <section
      id="sample"
      className="py-20 lg:py-28 border-b transition-colors duration-200"
      style={{
        backgroundColor: 'var(--page-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl space-y-3">
            <div
              className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider"
              style={secondaryTextStyle}
            >
              <span className="w-2 h-2 rounded-full bg-[#713F75]" />
              <span>Sample Incident Investigation</span>
            </div>

            <h2
              className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Forensic inspection in practice.
            </h2>

            <p
              className="text-base leading-relaxed"
              style={secondaryTextStyle}
            >
              Explore how Whyrus breaks down an actual cascade failure into a
              chronological event stream, ranks plausible root causes, and
              generates actionable verification steps.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-xs border text-xs font-mono flex items-center space-x-2"
              style={{ ...subtleStyle, color: 'var(--text-secondary)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#713F75]" />
              <span>Demo mode • Illustrative data</span>
            </div>

            <button
              type="button"
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xs text-xs font-semibold uppercase tracking-wider shadow-xs ${plumButton}`}
            >
              <span>Load into analysis workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Demo Container */}
        <div
          className="rounded-md border shadow-sm overflow-hidden transition-colors duration-200"
          style={{ ...subtleStyle, color: 'var(--text-primary)' }}
        >

          {/* Control Bar */}
          <div
            className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4"
            style={{ ...surfaceStyle }}
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />

              <span
                className="font-mono text-xs font-bold uppercase tracking-wider"
                style={secondaryTextStyle}
              >
                Incident ID:
              </span>

              <span
                className="font-mono text-xs px-2 py-0.5 rounded-xs border font-bold"
                style={{
                  ...subtleStyle,
                  color: 'var(--text-primary)',
                }}
              >
                inc-db-timeout-cascade
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-xs bg-red-50 text-red-700 font-bold font-mono border border-red-200">
                CRITICAL
              </span>
            </div>

            {/* Navigation Tabs */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 rounded-xs border"
              style={subtleStyle}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'bg-[#713F75] text-white shadow-xs'
                      : 'hover:bg-[#F7EFF8] hover:text-[#572F5B]'
                  }`}
                  style={
                    activeTab === tab
                      ? undefined
                      : { color: 'var(--text-secondary)' }
                  }
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'timeline' && 'Timeline (5)'}
                  {tab === 'hypotheses' && 'Hypotheses (2)'}
                  {tab === 'actions' && 'Actions (3)'}
                </button>
              ))}
            </div>
          </div>

          {/* Workspace Body */}
          <div className="p-6 lg:p-8">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in-up">

                <div
                  className="p-5 rounded-xs border space-y-3"
                  style={surfaceStyle}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="text-xs font-mono uppercase tracking-wider font-bold flex items-center space-x-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#713F75]" />
                      <span>Incident Summary</span>
                    </span>

                    <span className="text-xs font-mono" style={secondaryTextStyle}>
                      Timeframe: 10:42:01 – 10:42:06 (5 seconds)
                    </span>
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    A database connection timeout occurred at 10:42:04 in{' '}
                    <code className={codeClass}>db-pool</code>, preventing
                    order persistence and cascading into an HTTP 500 error in{' '}
                    <code className={codeClass}>http-server</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xs border" style={surfaceStyle}>
                    <div className="text-xs font-mono" style={secondaryTextStyle}>
                      Primary Error
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-red-600 truncate">
                      Database timeout
                    </div>
                    <div className="text-[11px] mt-1" style={secondaryTextStyle}>
                      First fatal event at 10:42:04
                    </div>
                  </div>

                  <div className="p-4 rounded-xs border" style={surfaceStyle}>
                    <div className="text-xs font-mono" style={secondaryTextStyle}>
                      Affected Services
                    </div>
                    <div
                      className="mt-1 font-mono text-sm font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      db-pool, order-service
                    </div>
                    <div className="text-[11px] mt-1" style={secondaryTextStyle}>
                      2 internal components
                    </div>
                  </div>

                  <div className="p-4 rounded-xs border" style={surfaceStyle}>
                    <div className="text-xs font-mono" style={secondaryTextStyle}>
                      Severity Criteria
                    </div>
                    <div className="mt-1 font-mono text-sm font-bold text-red-600">
                      CRITICAL (Public HTTP 500)
                    </div>
                    <div className="text-[11px] mt-1" style={secondaryTextStyle}>
                      Impacted public endpoint
                    </div>
                  </div>

                  <div className="p-4 rounded-xs border" style={surfaceStyle}>
                    <div className="text-xs font-mono" style={secondaryTextStyle}>
                      Top Hypothesis
                    </div>
                    <div
                      className="mt-1 font-mono text-sm font-bold truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Pool Starvation (H-01)
                    </div>
                    <div className="text-[11px] mt-1" style={secondaryTextStyle}>
                      Evidence Strength: High (88%)
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs" style={secondaryTextStyle}>
                    Select any tab above to inspect timeline events or examine
                    the ranked hypotheses.
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-semibold hover:text-[#713F75] flex items-center space-x-1 underline decoration-[#713F75] decoration-2 underline-offset-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span>Inspect Event Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in-up">

                <div className="lg:col-span-7 space-y-2.5">
                  <div
                    className="text-xs font-mono uppercase tracking-wider mb-2 flex justify-between gap-3"
                    style={secondaryTextStyle}
                  >
                    <span>Parsed Chronological Stream</span>
                    <span>Click step to inspect evidence</span>
                  </div>

                  {demoEvents.map((ev) => {
                    const isSelected = selectedEventId === ev.id;

                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => setSelectedEventId(ev.id)}
                        className={`w-full text-left p-3.5 rounded-xs border transition-all ${
                          isSelected
                            ? 'border-[#713F75] ring-1 ring-[#713F75] shadow-xs'
                            : 'hover:border-[#E4CDE6]'
                        }`}
                        style={{
                          backgroundColor: 'var(--surface-bg)',
                          borderColor: isSelected
                            ? '#713F75'
                            : 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-1.5 py-0.5 rounded-xs bg-[#713F75] text-white font-bold text-[10px]">
                              {ev.id}
                            </span>

                            <span style={secondaryTextStyle}>{ev.time}</span>

                            <span
                              className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold border ${
                                ev.level === 'ERROR'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {ev.level}
                            </span>

                            <span className="font-semibold">
                              [{ev.component}]
                            </span>
                          </div>

                          {ev.isTrigger && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-xs bg-[#F7EFF8] text-[#572F5B] border border-[#E4CDE6]">
                              Primary Trigger
                            </span>
                          )}

                          {ev.isCascade && (
                            <span
                              className="text-[10px] font-mono px-2 py-0.5 rounded-xs"
                              style={{
                                ...subtleStyle,
                                color: 'var(--text-secondary)',
                              }}
                            >
                              Cascade Ripple
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-xs font-mono">
                          {ev.message}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Evidence Inspector */}
                <div
                  className="lg:col-span-5 p-5 rounded-xs border space-y-4"
                  style={surfaceStyle}
                >
                  <div
                    className="flex items-center justify-between pb-3 border-b gap-2"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Evidence Inspector
                    </span>

                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-xs border font-bold"
                      style={{
                        ...subtleStyle,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Evidence ID: {selectedEvent.id}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-mono text-[11px]" style={secondaryTextStyle}>
                        Timestamp
                      </div>
                      <div className="font-mono font-medium">
                        {selectedEvent.time}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[11px]" style={secondaryTextStyle}>
                        Service & Severity
                      </div>
                      <div className="font-mono font-medium">
                        {selectedEvent.component} • {selectedEvent.level}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[11px]" style={secondaryTextStyle}>
                        Raw Event Line
                      </div>
                      <div
                        className="p-3 rounded-xs border font-mono text-[11px] break-all"
                        style={subtleStyle}
                      >
                        {selectedEvent.time} {selectedEvent.level} [
                        {selectedEvent.component}] {selectedEvent.message}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[11px]" style={secondaryTextStyle}>
                        Diagnostic Assessment
                      </div>
                      <div
                        className="p-3 rounded-xs border text-xs leading-relaxed"
                        style={subtleStyle}
                      >
                        {selectedEvent.evidenceNote ||
                          'Routine operational event prior to failure onset.'}
                      </div>
                    </div>
                  </div>

                  <div
                    className="pt-2 border-t"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab('hypotheses')}
                      className={`w-full py-2.5 rounded-xs text-xs font-semibold uppercase tracking-wider ${plumButton}`}
                    >
                      View Hypotheses linked to {selectedEvent.id}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HYPOTHESES */}
            {activeTab === 'hypotheses' && (
              <div className="space-y-5 animate-fade-in-up">

                <div
                  className="rounded-xs border p-6 space-y-4"
                  style={{ ...surfaceStyle, borderColor: '#713F75' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs bg-[#713F75] text-white">
                        Rank #1 • H-01
                      </span>

                      <h4
                        className="font-heading font-bold text-lg"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Database Connection Pool Exhaustion or Unreachable Host
                      </h4>
                    </div>

                    <span className="font-mono text-xs px-2.5 py-1 rounded-xs bg-[#F7EFF8] text-[#572F5B] font-semibold border border-[#E4CDE6]">
                      Confidence: High (88%)
                    </span>
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={secondaryTextStyle}
                  >
                    A database connection timeout occurred immediately before
                    order creation failed. The application process was unable
                    to acquire an active connection from{' '}
                    <code className={codeClass}>db-pool</code> within 1000ms,
                    causing immediate abort of transaction #89211.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div
                      className="p-3.5 rounded-xs border space-y-1"
                      style={subtleStyle}
                    >
                      <span
                        className="font-mono font-semibold block"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Supporting Evidence
                      </span>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="font-mono px-2 py-0.5 rounded-xs bg-[#713F75] text-white font-bold">
                          E-03
                        </span>
                        <span className="font-mono px-2 py-0.5 rounded-xs bg-[#F7EFF8] text-[#572F5B] border border-[#E4CDE6] font-bold">
                          E-04
                        </span>
                        <span style={secondaryTextStyle} className="text-[11px]">
                          (Database timeout + Order failure)
                        </span>
                      </div>
                    </div>

                    <div
                      className="p-3.5 rounded-xs border space-y-1"
                      style={subtleStyle}
                    >
                      <span
                        className="font-mono font-semibold block"
                        style={secondaryTextStyle}
                      >
                        Ranking Rationale
                      </span>
                      <p
                        className="leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Chronological precedence: The database error preceded
                        downstream HTTP 500 by 2 seconds.
                      </p>
                    </div>
                  </div>

                  {/* Amber is intentionally retained for caution */}
                  <div className="p-3.5 rounded-xs bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-950 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Missing Telemetry Needed for Certainty</span>
                    </div>
                    <p className="leading-relaxed">
                      Database server active connection metrics during the
                      10:42:04 window. Without database daemon logs, transient
                      network transport packet drop cannot be completely ruled
                      out.
                    </p>
                  </div>
                </div>

                {/* Alternative Hypothesis */}
                <div
                  className="rounded-xs border p-5 space-y-3"
                  style={surfaceStyle}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs border"
                        style={{
                          ...subtleStyle,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Rank #2 • H-02
                      </span>

                      <h4
                        className="font-heading font-bold text-base"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Transient Network Partition between Application and
                        Database Subnet
                      </h4>
                    </div>

                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-xs bg-[#F7EFF8] text-[#572F5B] border border-[#E4CDE6]">
                      Confidence: Moderate (58%)
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed" style={secondaryTextStyle}>
                    Rather than the database instance being down, a transient
                    TCP packet drop or NAT gateway saturation could have
                    produced the 1000ms socket timeout.
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            {activeTab === 'actions' && (
              <div className="space-y-4 animate-fade-in-up">

                <div className={mutedPanel} style={surfaceStyle}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#572F5B] bg-[#F7EFF8] px-2 py-0.5 rounded-xs border border-[#E4CDE6]">
                      Immediate Check [A-01]
                    </span>
                    <span className="text-xs font-mono" style={secondaryTextStyle}>
                      Target: db-pool, database
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base">
                    Inspect Database Health & Connection Pool Metrics
                  </h4>

                  <p className="text-xs leading-relaxed" style={secondaryTextStyle}>
                    Query <code className={codeClass}>pg_stat_activity</code>{' '}
                    or connection pooler telemetry to verify if active
                    connections hit the maximum pool limit at 10:42:04.
                  </p>
                </div>

                <div className={mutedPanel} style={surfaceStyle}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#572F5B] bg-[#F7EFF8] px-2 py-0.5 rounded-xs border border-[#E4CDE6]">
                      Verification Test [A-02]
                    </span>
                    <span className="text-xs font-mono" style={secondaryTextStyle}>
                      Target: Application Pod
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base">
                    Test Network Latency and Socket Connectivity
                  </h4>

                  <p className="text-xs leading-relaxed" style={secondaryTextStyle}>
                    Execute a TCP connection probe from the order-service pod
                    to verify latency and eliminate firewall drops.
                  </p>
                </div>

                <div className={mutedPanel} style={surfaceStyle}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#572F5B] bg-[#F7EFF8] px-2 py-0.5 rounded-xs border border-[#E4CDE6]">
                      Code Inspection [A-03]
                    </span>
                    <span className="text-xs font-mono" style={secondaryTextStyle}>
                      Target: config/database.yml
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base">
                    Review Recent Pool Size Configuration Changes
                  </h4>

                  <p className="text-xs leading-relaxed" style={secondaryTextStyle}>
                    Check if a recent Git commit modified{' '}
                    <code className={codeClass}>pool_size</code> or{' '}
                    <code className={codeClass}>timeout_ms</code> parameters
                    without load testing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div
            className="px-6 py-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            style={{
              backgroundColor: 'var(--surface-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              Demonstration constructed with real Whyrus analysis schema. All
              evidence IDs reference verifiable log timestamps.
            </div>

            <button
              type="button"
              onClick={() => onLoadIntoLiveAnalyzer('db-cascade')}
              className="font-semibold hover:text-[#713F75] flex items-center space-x-1 shrink-0 underline decoration-[#713F75] decoration-2 underline-offset-4"
              style={{ color: 'var(--text-primary)' }}
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
