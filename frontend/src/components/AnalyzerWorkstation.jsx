import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Upload, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  GitBranch, 
  HelpCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Filter,
  ExternalLink,
  Info
} from 'lucide-react';

import { fetchPresets, previewRedaction, analyzeIncident } from '../services/api';

export default function AnalyzerWorkstation({ initialPresetId, onBackToMarketing }) {
  // Input form states
  const [rawLogs, setRawLogs] = useState('');
  const [gitDiff, setGitDiff] = useState('');
  const [serviceContext, setServiceContext] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [showGitDiffInput, setShowGitDiffInput] = useState(false);
  
  // Privacy & redaction state
  const [redactionPreview, setRedactionPreview] = useState(null);
  const [previewingRedaction, setPreviewingRedaction] = useState(false);

  // Workflow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [presets, setPresets] = useState([]);
  
  // Results view states
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState('all'); // 'all' | 'errors'
  const [expandedTraceEventId, setExpandedTraceEventId] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Fetch presets
  useEffect(() => {
    fetchPresets()
      .then(data => {
        setPresets(data);
      })
      .catch(err => console.error("Could not load incident presets:", err));
  }, []);

  // When initialPresetId or presets change, apply matching preset
  useEffect(() => {
    if (initialPresetId && presets.length > 0) {
      const match = presets.find(p => p.id === initialPresetId);
      if (match) {
        applyPreset(match);
      }
    }
  }, [initialPresetId, presets]);

  const applyPreset = (preset) => {
    setRawLogs(preset.raw_logs);
    setGitDiff(preset.git_diff || '');
    setServiceContext(preset.service_context || '');
    if (preset.git_diff) {
      setShowGitDiffInput(true);
    }
    setError(null);
    setRedactionPreview(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'log' && ext !== 'txt') {
      setError("Supported file types are .log and .txt only.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty. Please provide logs with incident events.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 500 * 1024) {
      setError("File exceeds safe processing limit of 500 KB. Please provide an excerpt of the failure window.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawLogs(event.target.result || '');
      setError(null);
      setRedactionPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setError("Failed to read file contents.");
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleCheckRedaction = async () => {
    if (!rawLogs.trim()) return;
    try {
      const data = await previewRedaction(rawLogs);
      setRedactionPreview(data);
      setPreviewingRedaction(true);
    } catch (err) {
      console.error("Redaction preview failed:", err);
      setError("Failed to generate redaction preview.");
    }
  };

  const handleRunAnalysis = async () => {
    if (!rawLogs.trim()) {
      setError("Please paste log lines or upload a log file to begin analysis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeIncident({
        raw_logs: rawLogs,
        git_diff: gitDiff.trim() ? gitDiff : null,
        service_context: serviceContext.trim() ? serviceContext : null,
        use_ai: useAI
      });

      setAnalysisResult(data);
      setSelectedEvidenceId(null);

      // Scroll to results smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setError(err.message || "An unexpected error occurred during incident analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyIncidentSummary = () => {
    if (!analysisResult) return;
    const text = `WHYYRUS INCIDENT REPORT
Incident ID: ${analysisResult.incident_id}
Severity: ${analysisResult.overview.severity} (${analysisResult.overview.severity_reasoning})
Primary Error: ${analysisResult.overview.primary_error}
Summary: ${analysisResult.overview.summary}

TOP ROOT CAUSE HYPOTHESIS:
${analysisResult.hypotheses[0]?.title} (Confidence: ${analysisResult.hypotheses[0]?.confidence_label})
Evidence: ${analysisResult.hypotheses[0]?.supporting_evidence_ids.join(', ')}
${analysisResult.hypotheses[0]?.explanation}

FIRST RECOMMENDED ACTION:
${analysisResult.recommended_actions[0]?.action}: ${analysisResult.recommended_actions[0]?.details}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Workstation Header */}
        <div className="bg-[#17243A] text-white rounded-2xl p-6 sm:p-8 border border-[#273852] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-medium tracking-wider uppercase text-[#167D78]">
              <span className="w-2 h-2 rounded-full bg-[#167D78] animate-pulse"></span>
              <span>Incident Investigation Workbench</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Root-Cause Analysis Engine
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-xl">
              Supply unstructured log dumps, stack traces, and optional Git diffs. 
              Whyrus redacts secrets, reconstructs the timeline, and ranks verifiable hypotheses.
            </p>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="text-xs font-mono text-[#94A3B8] self-center mr-2 hidden lg:block">
              Load Realistic Presets:
            </div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="px-3 py-2 rounded bg-[#1E2E48] hover:bg-[#273852] border border-[#334155] text-xs font-mono text-[#CBD5E1] hover:text-white transition-colors"
                title={preset.description}
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT WORKBENCH SECTION */}
        <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 lg:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E4DE] pb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#17243A]">
                1. Incident Input & Log Stream
              </h2>
              <p className="text-xs text-[#64748B]">
                Paste logs or upload a .log / .txt file. Maximum 500 KB.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".log,.txt"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#F7F6F2] hover:bg-[#E5E4DE] border border-[#CBD5E1] text-xs font-mono text-[#17243A] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .log / .txt</span>
              </button>

              <button
                type="button"
                onClick={handleCheckRedaction}
                disabled={!rawLogs.trim()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-teal-50 hover:bg-teal-100 border border-teal-200 text-xs font-mono text-[#167D78] transition-colors disabled:opacity-40"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Preview Redaction</span>
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold">Input Error:</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Redaction Preview Info Box */}
          {previewingRedaction && redactionPreview && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#167D78]" />
                  <span>Client & Backend Secret Scrubbing Preview</span>
                </span>
                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-teal-200 text-[#167D78]">
                  {redactionPreview.redactions_count} sensitive tokens detected & masked
                </span>
              </div>
              <p className="text-[11px] text-teal-800">
                All identified JWT tokens, passwords, Authorization headers, and AWS credentials are automatically replaced with redact tags before entering the parsing pipeline.
              </p>
            </div>
          )}

          {/* Log Editor Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>Raw Incident Logs</span>
              <span>{rawLogs.split('\n').filter(Boolean).length} lines • {rawLogs.length} chars</span>
            </div>

            <textarea
              value={rawLogs}
              onChange={(e) => {
                setRawLogs(e.target.value);
                setError(null);
                setRedactionPreview(null);
              }}
              rows={9}
              placeholder="Paste raw logs, stack traces, or console output here... e.g.&#10;10:42:01 INFO [order-service] Starting service...&#10;10:42:04 ERROR [db-pool] Connection timeout: could not acquire connection after 1000ms&#10;10:42:06 ERROR [http-server] HTTP 500 Internal Server Error"
              className="w-full p-4 rounded-xl bg-[#0F172A] text-[#CBD5E1] font-mono text-xs leading-relaxed border border-[#273852] focus:ring-2 focus:ring-[#167D78] focus:border-transparent outline-none resize-y selection:bg-[#167D78]/40"
            />
          </div>

          {/* Optional Controls: Service Context & Git Diff Collapsible */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-mono text-[#64748B] mb-1">
                  Optional Service / Component Context
                </label>
                <input
                  type="text"
                  value={serviceContext}
                  onChange={(e) => setServiceContext(e.target.value)}
                  placeholder="e.g. order-service, production-us-east-1"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#F7F6F2] border border-[#E5E4DE] text-xs font-mono text-[#17243A] focus:ring-1 focus:ring-[#167D78] outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F7F6F2] border border-[#E5E4DE]">
                <div>
                  <div className="text-xs font-medium text-[#17243A]">Enable Gemini Reasoning</div>
                  <div className="text-[11px] text-[#64748B]">Enriches deterministic rules with LLM synthesis</div>
                </div>
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4 text-[#167D78] rounded border-gray-300 focus:ring-[#167D78] accent-[#167D78]"
                />
              </div>

            </div>

            {/* Toggle Git Diff Input */}
            <div>
              <button
                type="button"
                onClick={() => setShowGitDiffInput(!showGitDiffInput)}
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#167D78] hover:text-[#126863] font-medium"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>{showGitDiffInput ? "− Hide Git Diff Input" : "+ Correlate with Recent Git Diff"}</span>
              </button>

              {showGitDiffInput && (
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-mono text-[#64748B]">Unified Diff (git diff HEAD~1):</span>
                  <textarea
                    value={gitDiff}
                    onChange={(e) => setGitDiff(e.target.value)}
                    rows={4}
                    placeholder="diff --git a/config/database.yml b/config/database.yml&#10;--- a/config/database.yml&#10;+++ b/config/database.yml&#10;@@ -12,2 +12,2 @@&#10;-  pool_size: 25&#10;+  pool_size: 5"
                    className="w-full p-3 rounded-xl bg-[#0F172A] text-[#CBD5E1] font-mono text-xs border border-[#273852] focus:ring-1 focus:ring-[#167D78] outline-none"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-[#E5E4DE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#64748B]">
              Processing is local & evidence-grounded. No credentials stored.
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {rawLogs && (
                <button
                  type="button"
                  onClick={() => {
                    setRawLogs('');
                    setGitDiff('');
                    setAnalysisResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2.5 rounded text-xs font-mono text-[#64748B] hover:text-[#17243A]"
                >
                  Clear All
                </button>
              )}

              <button
                type="button"
                disabled={loading || !rawLogs.trim()}
                onClick={handleRunAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#167D78] hover:bg-[#126863] text-white font-medium text-sm transition-all shadow-md shadow-[#167D78]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Parsing & Correlating Incident...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Analyze Incident</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* ANALYSIS RESULTS SECTION */}
        {analysisResult && (
          <div ref={resultsRef} className="space-y-8 animate-fadeIn">
            
            {/* Incident Header & Overview Card */}
            <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 lg:p-8 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E5E4DE] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#64748B]">
                      Analysis Result:
                    </span>
                    <span className="font-mono text-xs text-white bg-[#17243A] px-2 py-0.5 rounded font-bold">
                      {analysisResult.incident_id}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                      analysisResult.overview.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                      analysisResult.overview.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {analysisResult.overview.severity}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#17243A]">
                    {analysisResult.overview.primary_error}
                  </h3>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={copyIncidentSummary}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#F7F6F2] hover:bg-[#E5E4DE] text-xs font-mono text-[#17243A] border border-[#CBD5E1] transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#17243A] hover:bg-[#273852] text-xs font-mono text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Another Incident</span>
                  </button>
                </div>
              </div>

              {/* Engine Transparency Notice */}
              <div className="bg-[#17243A] text-white p-4 rounded-xl border border-[#273852] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#167D78] animate-pulse"></span>
                  <span className="text-[#5EEAD4] font-semibold">{analysisResult.analysis_engine_used}</span>
                  <span className="text-[#64748B]">|</span>
                  <span className="text-[#CBD5E1]">{analysisResult.engine_notes}</span>
                </div>
                {analysisResult.redacted_secrets_count > 0 && (
                  <span className="font-mono text-[11px] bg-[#0F172A] px-2 py-0.5 rounded text-[#E5A34B] border border-[#334155]">
                    {analysisResult.redacted_secrets_count} secrets redacted
                  </span>
                )}
              </div>

              {/* Parsing Warnings when relevant */}
              {analysisResult.parsing_warnings?.length > 0 && (
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Parsing Warnings</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {analysisResult.parsing_warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Executive Technical Summary */}
              <div className="bg-[#F7F6F2] p-5 rounded-xl border border-[#E5E4DE] space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#167D78]">
                  Incident Overview Summary
                </span>
                <p className="text-sm text-[#17243A] leading-relaxed">
                  {analysisResult.overview.summary}
                </p>
                <div className="text-xs text-[#64748B] pt-1">
                  <strong>Severity Reasoning:</strong> {analysisResult.overview.severity_reasoning}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-white border border-[#E5E4DE]">
                  <div className="text-[#64748B]">Total Events</div>
                  <div className="mt-1 text-base font-bold text-[#17243A]">
                    {analysisResult.overview.total_events}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E5E4DE]">
                  <div className="text-[#64748B]">Error Events</div>
                  <div className="mt-1 text-base font-bold text-[#C94C4C]">
                    {analysisResult.overview.error_count}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E5E4DE]">
                  <div className="text-[#64748B]">Earliest Event</div>
                  <div className="mt-1 text-xs font-bold text-[#17243A] truncate">
                    {analysisResult.overview.first_event_time || 'Initial line'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E5E4DE]">
                  <div className="text-[#64748B]">Involved Components</div>
                  <div className="mt-1 text-xs font-bold text-[#167D78] truncate">
                    {analysisResult.overview.affected_components.join(', ') || 'N/A'}
                  </div>
                </div>
              </div>

            </div>

            {/* TWO-COLUMN RESULTS LAYOUT: TIMELINE (LEFT) & HYPOTHESES (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* TIMELINE SECTION (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-base text-[#17243A]">
                      Timeline Events
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F7F6F2] text-[#64748B] border border-[#E5E4DE]">
                      {analysisResult.timeline.length}
                    </span>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex items-center space-x-1 text-xs font-mono">
                    <button
                      onClick={() => setTimelineFilter('all')}
                      className={`px-2 py-0.5 rounded ${timelineFilter === 'all' ? 'bg-[#17243A] text-white' : 'text-[#64748B] hover:text-[#17243A]'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setTimelineFilter('errors')}
                      className={`px-2 py-0.5 rounded ${timelineFilter === 'errors' ? 'bg-[#17243A] text-white' : 'text-[#64748B] hover:text-[#17243A]'}`}
                    >
                      Errors Only
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  {analysisResult.timeline
                    .filter(ev => timelineFilter === 'all' || ev.is_error)
                    .map((ev) => {
                      const isHighlighted = selectedEvidenceId === ev.id;
                      const hasStackTrace = Boolean(ev.stack_trace);
                      const isTraceOpen = expandedTraceEventId === ev.id;

                      return (
                        <div
                          key={ev.id}
                          id={`ev-${ev.id}`}
                          onClick={() => setSelectedEvidenceId(ev.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isHighlighted
                              ? 'bg-teal-50/70 border-[#167D78] ring-2 ring-[#167D78]/30 shadow-sm'
                              : 'bg-white border-[#E5E4DE] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center space-x-2">
                              <span className="px-1.5 py-0.5 rounded bg-[#17243A] text-white font-bold text-[10px]">
                                {ev.id}
                              </span>
                              <span className="text-[#64748B]">{ev.timestamp || `#${ev.line_number}`}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                ev.level === 'CRITICAL' || ev.level === 'ERROR'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : ev.level === 'WARN'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {ev.level}
                              </span>
                            </div>

                            {ev.component && (
                              <span className="text-[11px] font-mono text-[#64748B] truncate max-w-[120px]">
                                [{ev.component}]
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs font-mono text-[#17243A] break-words">
                            {ev.message}
                          </div>

                          {/* Stack Trace fold */}
                          {hasStackTrace && (
                            <div className="mt-2 pt-2 border-t border-[#E5E4DE]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedTraceEventId(isTraceOpen ? null : ev.id);
                                }}
                                className="text-[11px] font-mono text-[#167D78] hover:text-[#126863] flex items-center space-x-1"
                              >
                                {isTraceOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                <span>{isTraceOpen ? 'Hide Folded Stack Trace' : 'View Folded Stack Trace'}</span>
                              </button>

                              {isTraceOpen && (
                                <pre className="mt-2 p-2.5 rounded bg-[#0F172A] text-[#CBD5E1] text-[10px] font-mono overflow-x-auto whitespace-pre leading-relaxed border border-[#273852]">
                                  {ev.stack_trace}
                                </pre>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}
                </div>

              </div>

              {/* HYPOTHESES & ACTIONS SECTION (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Ranked Hypotheses Card */}
                <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 lg:p-7 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
                    <div className="space-y-0.5">
                      <h3 className="font-heading font-bold text-lg text-[#17243A]">
                        Ranked Root-Cause Hypotheses
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Ranked by evidence precedence. Click evidence tags to highlight timeline events.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#167D78] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {analysisResult.hypotheses.length} plausible
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.hypotheses.map((h) => {
                      const isTopRank = h.rank === 1;

                      return (
                        <div
                          key={h.id}
                          className={`rounded-xl p-5 border transition-all ${
                            isTopRank
                              ? 'bg-[#F7F6F2] border-[#167D78] shadow-sm'
                              : 'bg-white border-[#E5E4DE]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                                isTopRank ? 'bg-[#167D78] text-white' : 'bg-[#17243A] text-white'
                              }`}>
                                Rank #{h.rank} • {h.id}
                              </span>
                              <h4 className="font-heading font-bold text-base text-[#17243A]">
                                {h.title}
                              </h4>
                            </div>

                            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#17243A] font-semibold shrink-0">
                              Confidence: {h.confidence_label} ({Math.round(h.confidence_score * 100)}%)
                            </span>
                          </div>

                          <p className="mt-3 text-xs text-[#17243A] leading-relaxed">
                            {h.explanation}
                          </p>

                          {/* Supporting Evidence IDs */}
                          <div className="mt-3 pt-3 border-t border-[#E5E4DE] flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-[#64748B] text-[11px]">Supporting Evidence:</span>
                            {h.supporting_evidence_ids.map(eid => (
                              <button
                                key={eid}
                                onClick={() => {
                                  setSelectedEvidenceId(eid);
                                  const el = document.getElementById(`ev-${eid}`);
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors ${
                                  selectedEvidenceId === eid
                                    ? 'bg-[#167D78] text-white border-[#167D78]'
                                    : 'bg-white text-[#167D78] border-[#167D78]/40 hover:bg-teal-50'
                                }`}
                              >
                                {eid} ↗
                              </button>
                            ))}
                          </div>

                          {/* Ranking rationale */}
                          <div className="mt-2 text-[11px] font-mono text-[#64748B]">
                            <strong>Rationale:</strong> {h.reason_for_ranking}
                          </div>

                          {/* Verification Checks */}
                          {h.verification_checks?.length > 0 && (
                            <div className="mt-3 p-3 rounded-lg bg-white border border-[#E5E4DE] space-y-1.5 text-xs">
                              <span className="font-mono font-semibold text-[#17243A] text-[11px] block">
                                Checks Required to Validate:
                              </span>
                              {h.verification_checks.map((chk, cIdx) => (
                                <div key={cIdx} className="flex items-start space-x-2 text-[#64748B]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#167D78] mt-1.5 shrink-0"></span>
                                  <span className="leading-relaxed">{chk}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Missing Evidence Required to Confirm */}
                          {h.missing_evidence?.length > 0 && (
                            <div className="mt-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
                              <span className="font-semibold font-mono flex items-center space-x-1">
                                <HelpCircle className="w-3 h-3 text-amber-700" />
                                <span>Missing Telemetry to Reach 100% Certainty:</span>
                              </span>
                              <div className="leading-relaxed">
                                {h.missing_evidence.join(' • ')}
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Recommended Actions Card */}
                <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 lg:p-7 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
                    <h3 className="font-heading font-bold text-lg text-[#17243A]">
                      Targeted Debugging Recommendations
                    </h3>
                    <span className="text-xs font-mono text-[#64748B]">
                      {analysisResult.recommended_actions.length} prioritized steps
                    </span>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.recommended_actions.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2 hover:border-[#CBD5E1] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            act.category === 'Immediate Check' ? 'bg-red-50 text-red-700 border-red-200' :
                            act.category === 'Verification Test' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {act.category} • {act.id}
                          </span>
                          
                          {act.relevant_files_or_endpoints?.length > 0 && (
                            <span className="text-[11px] font-mono text-[#64748B] truncate max-w-[200px]">
                              {act.relevant_files_or_endpoints.join(', ')}
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-sm text-[#17243A]">
                          {act.action}
                        </h4>

                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {act.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Git Diff Findings Card (if supplied) */}
                {analysisResult.git_diff_findings?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#E5E4DE] shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E4DE]">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-[#167D78]" />
                        <h3 className="font-heading font-bold text-base text-[#17243A]">
                          Git Diff Correlated Changes
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-[#64748B]">
                        {analysisResult.git_diff_findings.length} files inspected
                      </span>
                    </div>

                    <div className="space-y-3">
                      {analysisResult.git_diff_findings.map((df, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-[#E5E4DE] bg-[#F7F6F2] space-y-2 text-xs">
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-[#17243A]">{df.file_path}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              df.relevance_score === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-800'
                            }`}>
                              Relevance: {df.relevance_score.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[#64748B] leading-relaxed">
                            {df.relevance_reason}
                          </p>
                          {df.highlighted_lines?.length > 0 && (
                            <div className="p-2 rounded bg-[#0F172A] text-[#CBD5E1] font-mono text-[10px] space-y-0.5">
                              {df.highlighted_lines.map((l, lIdx) => (
                                <div key={lIdx} className="truncate">{l}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
