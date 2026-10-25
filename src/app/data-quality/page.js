"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Download,
  ArrowRight,
  RefreshCw,
  Building2,
  GraduationCap,
  Check,
  Zap,
  HelpCircle,
  SendHorizontal
} from "lucide-react";

export default function DataQualityPage() {
  const [loading, setLoading] = useState(false);
  const [dirtyBatch, setDirtyBatch] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cleanedRecords, setCleanedRecords] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadDemoBatch();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const loadDemoBatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/data-quality/sample-dirty-batch");
      if (res.ok) {
        const data = await res.json();
        setDirtyBatch(data.records || []);
        runQualityAudit(data.records || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runQualityAudit = async (recordsToAnalyze) => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/data-quality/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: recordsToAnalyze })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = (recordId, suggestedFixes, original) => {
    const updated = {
      ...original,
      ...suggestedFixes,
      apaar_id: suggestedFixes.apaar_id || original.raw_apaar_id || original.apaar_id,
      full_name: suggestedFixes.full_name || original.raw_full_name || original.full_name,
      institution: suggestedFixes.institution || original.raw_institution || original.institution,
      branch: suggestedFixes.branch || original.raw_branch || original.branch,
      program: suggestedFixes.program || `B.Tech ${suggestedFixes.branch || "Engineering"}`,
      cgpa: suggestedFixes.cgpa !== undefined ? suggestedFixes.cgpa : original.raw_cgpa || original.cgpa,
      email: suggestedFixes.email || original.raw_email || original.email,
      abc_id: suggestedFixes.abc_id || original.raw_abc_id || original.abc_id
    };

    setCleanedRecords((prev) => ({
      ...prev,
      [recordId]: updated
    }));

    showToast(`AI Suggested fixes applied to staging record ${recordId}!`);
  };

  const handleSubmitToWorkflow = async (recordId, original) => {
    const targetRecord = cleanedRecords[recordId] || original;
    const apaar = targetRecord.apaar_id || targetRecord.raw_apaar_id;
    const name = targetRecord.full_name || targetRecord.raw_full_name;

    try {
      const res = await fetch("http://127.0.0.1:5000/api/workflow/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apaar_id: apaar,
          full_name: name,
          institution: targetRecord.institution || targetRecord.raw_institution || "Delhi Technological University",
          branch: targetRecord.branch || targetRecord.raw_branch || "CSE",
          email: targetRecord.email || targetRecord.raw_email || "student@dtu.ac.in",
          cgpa: parseFloat(targetRecord.cgpa || 8.5),
          abc_credits_total: 24,
          submission_notes: "Submitted after AI-Powered Data Quality sanitization & validation check."
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Record ${data.record?.workflow_id} submitted into Multi-Level Verification Workflow!`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error submitting to workflow");
    }
  };

  const overallScore = analysisResult?.overall_score || 0;

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#142B4A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-[#22D3EE]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <Wand2 className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AI-Powered Data Quality Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Student Database Sanitizer & Pre-Submission Audit
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Find missing mandatory fields, detect typos & abbreviations, and suggest 1-click fixes before records enter the approval workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadDemoBatch}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Reload SIH Demo Dirty Batch</span>
            </button>
            <Link
              href="/workflow"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Go to Workflow</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#142B4A]" />
            </Link>
          </div>
        </div>

        {/* AI Scorecard & Department Health Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Overall Quality Score Gauge */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Database Hygiene Health Score
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  overallScore >= 80 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {overallScore >= 80 ? "COMPLIANT" : "NEEDS PRE-CLEANING"}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black text-[#142B4A]">{overallScore}%</span>
                <span className="text-xs text-slate-500 font-semibold">Quality Index</span>
              </div>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-[#E2E8F0] mb-4">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    overallScore >= 80 ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-[#142B4A]"
                  }`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                AI evaluation analyzed <strong>{analysisResult?.total_records || 5} student records</strong> and identified <strong>{analysisResult?.total_issues || 15} format and standardization issues</strong>. Applying suggested fixes will boost database health to ~98%.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E2E8F0] text-center text-xs mt-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-[10px] text-slate-500 font-semibold">Clean Records</div>
                <div className="text-lg font-black text-emerald-700">{analysisResult?.clean_records || 0}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-[10px] text-slate-500 font-semibold">Flagged Issues</div>
                <div className="text-lg font-black text-rose-600">{analysisResult?.total_issues || 0}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-[#E2E8F0]">
                <div className="text-[10px] text-slate-500 font-semibold">Fixed Staged</div>
                <div className="text-lg font-black text-[#142B4A]">{Object.keys(cleanedRecords).length}</div>
              </div>
            </div>
          </div>

          {/* Right: Department & Batch Quality Health Breakdown */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#142B4A]" />
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Data Quality Report by Department & Batch
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">AICTE Audit Standard</span>
              </div>

              <div className="space-y-3.5">
                {Object.entries(analysisResult?.department_breakdown || {
                  "Computer Science": { score: 55, count: 1 },
                  "Artificial Intelligence": { score: 65, count: 1 },
                  "Electronics": { score: 60, count: 1 },
                  "Electrical Engineering": { score: 70, count: 1 },
                  "Mechanical Engineering": { score: 70, count: 1 }
                }).map(([dept, info]) => (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#0F172A]">{dept} ({info.count} Record{info.count > 1 ? "s" : ""})</span>
                      <span className={`font-mono font-bold ${info.score >= 80 ? "text-emerald-700" : "text-amber-700"}`}>
                        {info.score}% Quality
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          info.score >= 80 ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${info.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-slate-500 flex items-center justify-between mt-4">
              <span>All suggestions can be previewed without modifying database records.</span>
              <span className="text-[#142B4A] font-bold">Safe AI Sandbox Mode</span>
            </div>
          </div>
        </div>

        {/* Detailed Issue Cards & 1-Click Fixes */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#142B4A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#142B4A]" />
              <span>Record Diagnostics & AI Recommended Corrections</span>
            </h2>
            <span className="text-xs text-slate-500">Click &quot;Apply AI Fix&quot; to review staged correction</span>
          </div>

          {(analysisResult?.results || []).map((diag, index) => {
            const raw = diag.original_record;
            const recordId = diag.record_id;
            const isCleaned = !!cleanedRecords[recordId];
            const currentRecord = cleanedRecords[recordId] || raw;

            return (
              <div
                key={recordId || index}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isCleaned
                    ? "bg-white border-emerald-400 shadow-sm"
                    : "bg-white border-[#E2E8F0] shadow-sm"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-[#E2E8F0]">
                      Record #{index + 1}
                    </span>
                    <h3 className="font-bold text-[#0F172A] text-base">
                      {currentRecord.full_name || currentRecord.raw_full_name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#142B4A]">
                      {currentRecord.apaar_id || currentRecord.raw_apaar_id}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isCleaned
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : diag.quality_score >= 80
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}>
                    {isCleaned ? "FIXES APPLIED (STAGED)" : `HEALTH: ${diag.quality_score}/100`}
                  </span>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Column 1: Current/Raw Record */}
                  <div className="lg:col-span-4 bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0] text-xs space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {isCleaned ? "Sanitized Staging Data" : "Raw Input Data"}
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Institution:</span>{" "}
                      <span className={isCleaned ? "text-emerald-800 font-bold" : "text-[#0F172A] font-semibold"}>
                        {currentRecord.institution || currentRecord.raw_institution}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Branch:</span>{" "}
                      <span className={isCleaned ? "text-emerald-800 font-bold" : "text-[#0F172A] font-semibold"}>
                        {currentRecord.branch || currentRecord.raw_branch}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Email:</span>{" "}
                      <span className={isCleaned ? "text-emerald-800 font-bold" : "text-[#0F172A] font-semibold"}>
                        {currentRecord.email || currentRecord.raw_email}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">CGPA:</span>{" "}
                      <span className={isCleaned ? "text-emerald-800 font-bold" : "text-[#0F172A] font-semibold"}>
                        {currentRecord.cgpa !== undefined ? currentRecord.cgpa : currentRecord.raw_cgpa}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">ABC ID:</span>{" "}
                      <span className={isCleaned ? "text-emerald-800 font-bold" : "text-[#0F172A] font-semibold"}>
                        {currentRecord.abc_id || currentRecord.raw_abc_id || "(Missing)"}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: AI Explanations */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      AI Diagnostic Findings ({diag.issues_count} Detected)
                    </div>

                    {diag.issues.length === 0 ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>No formatting or validation anomalies detected. Ready for submission.</span>
                      </div>
                    ) : (
                      diag.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                              {issue.severity === "CRITICAL" ? (
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              <span>{issue.message}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">{issue.type}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {issue.explanation}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Column 3: Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0] text-xs space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-[#142B4A] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-[#142B4A]" />
                        <span>AI Sanitization Action</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Applies AI pattern normalization to APAAR digits, college naming standards, and CGPA bounds.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {!isCleaned ? (
                        <button
                          type="button"
                          onClick={() => handleApplyFix(recordId, diag.suggested_fixes, raw)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>Apply 1-Click AI Fix</span>
                        </button>
                      ) : (
                        <div className="p-2 text-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Sanitized</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSubmitToWorkflow(recordId, raw)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#142B4A] border border-[#E2E8F0] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <SendHorizontal className="w-3.5 h-3.5 text-[#142B4A]" />
                        <span>Submit to Workflow</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
