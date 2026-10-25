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
  Sparkles, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Filter,
  Info,
  Clock,
  Activity
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
${analysisResult.hypotheses[0]?.title} (Evidence Strength: ${analysisResult.hypotheses[0]?.confidence_label})
Evidence IDs: ${analysisResult.hypotheses[0]?.supporting_evidence_ids.join(', ')}
${analysisResult.hypotheses[0]?.explanation}

TOP RECOMMENDED ACTION:
${analysisResult.recommended_actions[0]?.action}: ${analysisResult.recommended_actions[0]?.details}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-8 lg:py-12 text-[#111827]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Workstation Header */}
        <div className="bg-white rounded-md p-6 sm:p-8 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase text-[#111827]">
              <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
              <span>Incident Investigation Workspace</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#111827]">
              Root-Cause Analysis Engine
            </h1>
            <p className="text-sm text-[#4B5563] max-w-xl">
              Supply unstructured log excerpts, stack traces, and optional Git diffs. 
              Whyrus automatically sanitizes secrets, parses the event sequence, and evaluates evidence-backed hypotheses.
            </p>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="text-xs font-mono text-[#6B7280] self-center mr-2 hidden lg:block uppercase tracking-wider">
              Load Demo Presets:
            </div>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="px-3 py-2 rounded-xs bg-[#FAFAF9] hover:bg-[#111827] hover:text-white border border-[#E5E7EB] text-xs font-mono text-[#111827] transition-all"
                title={preset.description}
              >
                {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT WORKBENCH SECTION */}
        <div className="bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 lg:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#111827]">
                1. Incident Logs & Telemetry
              </h2>
              <p className="text-xs text-[#6B7280]">
                Paste logs or upload a .log / .txt file. Maximum 500 KB safety cap.
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
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-[#FAFAF9] hover:bg-[#F4F4F2] border border-[#D1D5DB] text-xs font-mono text-[#111827] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .log / .txt</span>
              </button>

              <button
                type="button"
                onClick={handleCheckRedaction}
                disabled={!rawLogs.trim()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-white hover:bg-[#F4FBE8] border border-[#D1D5DB] text-xs font-mono text-[#111827] transition-colors disabled:opacity-40"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" />
                <span>Preview Redaction</span>
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-4 rounded-xs bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold">Input Error:</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Redaction Preview Info Box */}
          {previewingRedaction && redactionPreview && (
            <div className="p-4 rounded-xs bg-[#F4FBE8] border border-[#D3F49A] text-xs text-[#1F2937] space-y-2 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1.5 text-[#111827]">
                  <ShieldCheck className="w-4 h-4 text-[#65A30D]" />
                  <span>Client & Backend Secret Scrubbing Preview</span>
                </span>
                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-xs border border-[#D3F49A] text-[#111827] font-semibold">
                  {redactionPreview.redactions_count} sensitive tokens detected & masked
                </span>
              </div>
              <p className="text-[11px] text-[#4B5563]">
                Identified JWT tokens, passwords, Authorization headers, and cloud credentials are automatically replaced with redact tags before entering the analysis engine.
              </p>
            </div>
          )}

          {/* Log Editor Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#6B7280]">
              <span>Raw Incident Logs</span>
              <span>{rawLogs.split('\n').filter(Boolean).length} lines • {rawLogs.length} characters</span>
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
              className="w-full p-4 rounded-xs bg-[#111827] text-[#E5E7EB] font-mono text-xs leading-relaxed border border-[#1F2937] focus:ring-2 focus:ring-[#8CE800] focus:border-transparent outline-hidden resize-y selection:bg-[#8CE800]/40"
            />
          </div>

          {/* Optional Controls: Service Context & Git Diff Collapsible */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-xs font-mono text-[#6B7280] mb-1">
                  Optional Service / Component Context
                </label>
                <input
                  type="text"
                  value={serviceContext}
                  onChange={(e) => setServiceContext(e.target.value)}
                  placeholder="e.g. order-service, production-us-east-1"
                  className="w-full px-3.5 py-2 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB] text-xs font-mono text-[#111827] focus:ring-1 focus:ring-[#111827] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB]">
                <div>
                  <div className="text-xs font-semibold text-[#111827]">Enable Gemini Reasoning</div>
                  <div className="text-[11px] text-[#6B7280]">Enriches deterministic rules with LLM synthesis when configured</div>
                </div>
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4 text-[#111827] rounded-xs border-gray-300 focus:ring-[#8CE800] accent-[#111827]"
                />
              </div>

            </div>

            {/* Toggle Git Diff Input */}
            <div>
              <button
                type="button"
                onClick={() => setShowGitDiffInput(!showGitDiffInput)}
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#111827] hover:text-black font-semibold underline decoration-[#8CE800] decoration-2 underline-offset-4"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#65A30D]" />
                <span>{showGitDiffInput ? "− Hide Git Diff Input" : "+ Correlate with Recent Git Diff"}</span>
              </button>

              {showGitDiffInput && (
                <div className="mt-3 space-y-1 animate-fade-in-up">
                  <span className="text-[11px] font-mono text-[#6B7280]">Unified Diff (git diff HEAD~1):</span>
                  <textarea
                    value={gitDiff}
                    onChange={(e) => setGitDiff(e.target.value)}
                    rows={4}
                    placeholder="diff --git a/config/database.yml b/config/database.yml&#10;--- a/config/database.yml&#10;+++ b/config/database.yml&#10;@@ -12,2 +12,2 @@&#10;-  pool_size: 25&#10;+  pool_size: 4"
                    className="w-full p-3 rounded-xs bg-[#111827] text-[#E5E7EB] font-mono text-xs border border-[#1F2937] focus:ring-1 focus:ring-[#8CE800] outline-hidden"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6B7280]">
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
                  className="px-4 py-2.5 rounded-xs text-xs font-mono text-[#6B7280] hover:text-[#111827]"
                >
                  Clear All
                </button>
              )}

              <button
                type="button"
                disabled={loading || !rawLogs.trim()}
                onClick={handleRunAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Parsing & Correlating Incident...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Analyse Incident</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* ANALYSIS RESULTS SECTION */}
        {analysisResult && (
          <div ref={resultsRef} className="space-y-8 animate-fade-in-up">
            
            {/* Incident Header & Overview Card */}
            <div className="bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 lg:p-8 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E5E7EB] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280]">
                      Analysis Result:
                    </span>
                    <span className="font-mono text-xs text-white bg-[#111827] px-2 py-0.5 rounded-xs font-bold">
                      {analysisResult.incident_id}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-xs font-mono font-bold ${
                      analysisResult.overview.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                      analysisResult.overview.severity === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {analysisResult.overview.severity}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#111827]">
                    {analysisResult.overview.primary_error}
                  </h3>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={copyIncidentSummary}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-white hover:bg-[#FAFAF9] text-xs font-mono text-[#111827] border border-[#D1D5DB] transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-[#111827] hover:bg-[#8CE800] hover:text-[#111827] text-xs font-mono text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Another Incident</span>
                  </button>
                </div>
              </div>

              {/* Engine Status Transparency Notice */}
              <div className="bg-[#FAFAF9] text-[#111827] p-4 rounded-xs border border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#8CE800]"></span>
                  <span className="font-bold text-[#111827]">{analysisResult.analysis_engine_used}</span>
                  <span className="text-[#9CA3AF]">|</span>
                  <span className="text-[#4B5563]">{analysisResult.engine_notes}</span>
                </div>
                {analysisResult.redacted_secrets_count > 0 && (
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-xs text-[#111827] border border-[#E5E7EB]">
                    {analysisResult.redacted_secrets_count} secrets redacted
                  </span>
                )}
              </div>

              {/* Parsing Warnings */}
              {analysisResult.parsing_warnings?.length > 0 && (
                <div className="p-3.5 rounded-xs bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Parsing Warnings</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-800">
                    {analysisResult.parsing_warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Executive Summary */}
              <div className="bg-white p-5 rounded-xs border border-[#E5E7EB] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111827]">
                  Incident Overview Summary
                </span>
                <p className="text-sm text-[#111827] leading-relaxed">
                  {analysisResult.overview.summary}
                </p>
                <div className="text-xs text-[#6B7280] pt-1">
                  <strong>Severity Reasoning:</strong> {analysisResult.overview.severity_reasoning}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB]">
                  <div className="text-[#6B7280]">Total Events</div>
                  <div className="mt-1 text-base font-bold text-[#111827]">
                    {analysisResult.overview.total_events}
                  </div>
                </div>

                <div className="p-3.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB]">
                  <div className="text-[#6B7280]">Error Events</div>
                  <div className="mt-1 text-base font-bold text-red-600">
                    {analysisResult.overview.error_count}
                  </div>
                </div>

                <div className="p-3.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB]">
                  <div className="text-[#6B7280]">Earliest Event</div>
                  <div className="mt-1 text-xs font-bold text-[#111827] truncate">
                    {analysisResult.overview.first_event_time || 'Initial line'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xs bg-[#FAFAF9] border border-[#E5E7EB]">
                  <div className="text-[#6B7280]">Involved Services</div>
                  <div className="mt-1 text-xs font-bold text-[#111827] truncate">
                    {analysisResult.overview.affected_components.join(', ') || 'N/A'}
                  </div>
                </div>
              </div>

            </div>

            {/* 2-COLUMN RESULTS LAYOUT: TIMELINE (LEFT) & HYPOTHESES (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* TIMELINE SECTION (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center space-x-2">
                    <span className="font-heading font-bold text-base text-[#111827]">
                      Timeline Events
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-xs bg-[#FAFAF9] text-[#6B7280] border border-[#E5E7EB]">
                      {analysisResult.timeline.length}
                    </span>
                  </div>

                  {/* Filter buttons */}
                  <div className="flex items-center space-x-1 text-xs font-mono">
                    <button
                      onClick={() => setTimelineFilter('all')}
                      className={`px-2.5 py-1 rounded-xs transition-colors ${
                        timelineFilter === 'all' 
                          ? 'bg-[#111827] text-white font-bold' 
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setTimelineFilter('errors')}
                      className={`px-2.5 py-1 rounded-xs transition-colors ${
                        timelineFilter === 'errors' 
                          ? 'bg-[#111827] text-white font-bold' 
                          : 'text-[#6B7280] hover:text-[#111827]'
                      }`}
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
                          className={`p-3 rounded-xs border transition-all cursor-pointer ${
                            isHighlighted
                              ? 'bg-[#F4FBE8] border-[#8CE800] ring-2 ring-[#8CE800]/50 shadow-xs'
                              : 'bg-white border-[#E5E7EB] hover:border-[#9CA3AF]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center space-x-2">
                              <span className="px-1.5 py-0.5 rounded-xs bg-[#111827] text-white font-bold text-[10px]">
                                {ev.id}
                              </span>
                              <span className="text-[#6B7280]">{ev.timestamp || `#${ev.line_number}`}</span>
                              <span className={`px-1.5 py-0.5 rounded-xs text-[10px] font-bold ${
                                ev.level === 'CRITICAL' || ev.level === 'ERROR'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : ev.level === 'WARN'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {ev.level}
                              </span>
                            </div>

                            {ev.component && (
                              <span className="text-[11px] font-mono text-[#6B7280] truncate max-w-[120px]">
                                [{ev.component}]
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-xs font-mono text-[#111827] break-words">
                            {ev.message}
                          </div>

                          {/* Stack Trace fold */}
                          {hasStackTrace && (
                            <div className="mt-2 pt-2 border-t border-[#E5E7EB]">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedTraceEventId(isTraceOpen ? null : ev.id);
                                }}
                                className="text-[11px] font-mono text-[#111827] hover:text-black font-semibold flex items-center space-x-1"
                              >
                                {isTraceOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                <span>{isTraceOpen ? 'Hide Stack Trace' : 'View Stack Trace'}</span>
                              </button>

                              {isTraceOpen && (
                                <pre className="mt-2 p-2.5 rounded-xs bg-[#111827] text-[#E5E7EB] text-[10px] font-mono overflow-x-auto whitespace-pre leading-relaxed border border-[#1F2937]">
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
                <div className="bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 lg:p-7 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <div className="space-y-0.5">
                      <h3 className="font-heading font-bold text-lg text-[#111827]">
                        Ranked Root-Cause Hypotheses
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        Ranked by evidence precedence. Click evidence tags to highlight timeline events.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#111827] bg-[#FAFAF9] px-2 py-0.5 rounded-xs border border-[#E5E7EB] font-bold">
                      {analysisResult.hypotheses.length} plausible
                    </span>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.hypotheses.map((h) => {
                      const isTopRank = h.rank === 1;

                      return (
                        <div
                          key={h.id}
                          className={`rounded-xs p-5 border transition-all ${
                            isTopRank
                              ? 'bg-[#FAFAF9] border-[#111827] shadow-xs'
                              : 'bg-white border-[#E5E7EB]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs ${
                                isTopRank ? 'bg-[#111827] text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                              }`}>
                                Rank #{h.rank} • {h.id}
                              </span>
                              <h4 className="font-heading font-bold text-base text-[#111827]">
                                {h.title}
                              </h4>
                            </div>

                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-xs bg-white border border-[#D1D5DB] text-[#111827] font-semibold shrink-0">
                              Evidence Strength: {h.confidence_label} ({Math.round(h.confidence_score * 100)}%)
                            </span>
                          </div>

                          <p className="mt-3 text-xs text-[#374151] leading-relaxed">
                            {h.explanation}
                          </p>

                          {/* Supporting Evidence IDs */}
                          <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-[#6B7280] text-[11px]">Supporting Evidence:</span>
                            {h.supporting_evidence_ids.map(eid => (
                              <button
                                key={eid}
                                onClick={() => {
                                  setSelectedEvidenceId(eid);
                                  const el = document.getElementById(`ev-${eid}`);
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className={`px-2 py-0.5 rounded-xs font-mono text-[11px] font-bold border transition-colors ${
                                  selectedEvidenceId === eid
                                    ? 'bg-[#111827] text-white border-[#111827]'
                                    : 'bg-white text-[#111827] border-[#D1D5DB] hover:bg-[#F4FBE8] hover:border-[#8CE800]'
                                }`}
                              >
                                {eid} ↗
                              </button>
                            ))}
                          </div>

                          {/* Ranking rationale */}
                          <div className="mt-2 text-[11px] font-mono text-[#6B7280]">
                            <strong>Rationale:</strong> {h.reason_for_ranking}
                          </div>

                          {/* Verification Checks */}
                          {h.verification_checks?.length > 0 && (
                            <div className="mt-3 p-3 rounded-xs bg-white border border-[#E5E7EB] space-y-1.5 text-xs">
                              <span className="font-mono font-semibold text-[#111827] text-[11px] block">
                                Checks Required to Validate:
                              </span>
                              {h.verification_checks.map((chk, cIdx) => (
                                <div key={cIdx} className="flex items-start space-x-2 text-[#4B5563]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#8CE800] mt-1.5 shrink-0"></span>
                                  <span className="leading-relaxed">{chk}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Missing Evidence Required to Confirm */}
                          {h.missing_evidence?.length > 0 && (
                            <div className="mt-2 p-2.5 rounded-xs bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
                              <span className="font-semibold font-mono flex items-center space-x-1">
                                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                                <span>Missing Telemetry to Reach Certainty:</span>
                              </span>
                              <div className="leading-relaxed text-amber-800">
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
                <div className="bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 lg:p-7 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                    <h3 className="font-heading font-bold text-lg text-[#111827]">
                      Targeted Debugging Recommendations
                    </h3>
                    <span className="text-xs font-mono text-[#6B7280]">
                      {analysisResult.recommended_actions.length} prioritized steps
                    </span>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.recommended_actions.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-xs border border-[#E5E7EB] bg-white space-y-2 hover:border-[#D1D5DB] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                            act.category === 'Immediate Check' ? 'bg-red-50 text-red-700 border-red-200' :
                            act.category === 'Verification Test' ? 'bg-slate-100 text-slate-800 border-slate-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {act.category} • {act.id}
                          </span>
                          
                          {act.relevant_files_or_endpoints?.length > 0 && (
                            <span className="text-[11px] font-mono text-[#6B7280] truncate max-w-[200px]">
                              {act.relevant_files_or_endpoints.join(', ')}
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-sm text-[#111827]">
                          {act.action}
                        </h4>

                        <p className="text-xs text-[#4B5563] leading-relaxed">
                          {act.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Git Diff Findings Card */}
                {analysisResult.git_diff_findings?.length > 0 && (
                  <div className="bg-white rounded-md border border-[#E5E7EB] shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-[#111827]" />
                        <h3 className="font-heading font-bold text-base text-[#111827]">
                          Git Diff Correlated Context
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-[#6B7280]">
                        {analysisResult.git_diff_findings.length} files inspected
                      </span>
                    </div>

                    <div className="space-y-3">
                      {analysisResult.git_diff_findings.map((df, idx) => (
                        <div key={idx} className="p-3.5 rounded-xs border border-[#E5E7EB] bg-[#FAFAF9] space-y-2 text-xs">
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-[#111827]">{df.file_path}</span>
                            <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                              df.relevance_score === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                            }`}>
                              Relevance: {df.relevance_score.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[#4B5563] leading-relaxed">
                            {df.relevance_reason}
                          </p>
                          {df.highlighted_lines?.length > 0 && (
                            <div className="p-2 rounded-xs bg-[#111827] text-[#E5E7EB] font-mono text-[10px] space-y-0.5">
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
