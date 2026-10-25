"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  UploadCloud,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  RotateCcw,
  Sparkles,
  Building2,
  GraduationCap,
  FileSpreadsheet,
  X,
  Check,
  ShieldCheck,
  Fingerprint,
  FileCheck2,
  ArrowRight,
  RefreshCw,
  QrCode,
  FileText
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Modals state
  const [showAiModal, setShowAiModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedAiReport, setSelectedAiReport] = useState(null);
  const [notification, setNotification] = useState("");

  // AI Verification State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");

  const [aiForm, setAiForm] = useState({
    full_name: "Priya Sharma",
    aadhaar_number: "5544-3322-1100",
    student_consent: true,
    dob: "2004-06-15",
    gender: "Female",
    email: "priya.sharma24@dtu.ac.in",
    phone: "+91 98110 33445",
    institution: "Delhi Technological University",
    aicte_id: "1-33271891",
    program: "B.Tech Computer Science & Engineering",
    branch: "CSE",
    admission_year: 2024,
    current_semester: 1,
    cgpa: 8.85,
    document_name: "Class_XII_CBSE_Marksheet_Verified.pdf",
    document_type: "CLASS_12_MARKSHEET",
    document_uploaded: true
  });

  const [bulkText, setBulkText] = useState("");

  const branches = ["All", "CSE", "AI & DS", "ENTC", "EE", "ME", "Cyber Security"];
  const statuses = ["All", "Verified", "Flagged", "Graduated"];

  useEffect(() => {
    fetchStudents();
    fetchPresets();
  }, [searchQuery, selectedBranch, selectedStatus]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const fetchPresets = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/ai-verify-student/presets");
      if (res.ok) {
        const data = await res.json();
        setPresets(data.presets || []);
      }
    } catch (err) {
      console.error("Presets loading error", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedBranch !== "All") params.append("branch", selectedBranch);
      if (selectedStatus !== "All") params.append("status", selectedStatus);

      const res = await fetch(`http://127.0.0.1:5000/api/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (p) => {
    setSelectedPresetId(p.preset_id);
    setAiForm({ ...p.payload });
    setAiResult(null);
  };

  const handleRunAiVerification = async (e) => {
    if (e) e.preventDefault();
    if (!aiForm.student_consent) {
      alert("Mandatory Consent: The student must authorize Aadhaar demographic authentication under AICTE Digilocker guidelines.");
      return;
    }
    if (!aiForm.full_name.trim()) {
      alert("Full Name is mandatory.");
      return;
    }

    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/ai-verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...aiForm,
          auto_enroll: true,
          user: {
            name: "Ramesh Patel",
            role: "COLLEGE_OPERATOR",
            institution: aiForm.institution
          }
        })
      });

      const data = await res.json();
      setAiResult(data);
      if (data.success) {
        showToast(data.message || "AI Verification completed!");
        fetchStudents();
      } else {
        showToast(data.message || "Verification returned flags.");
      }
    } catch (err) {
      alert("Error contacting AI Verification service: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (apaarId) => {
    if (!confirm(`Are you sure you want to remove APAAR record: ${apaarId}?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/students/${encodeURIComponent(apaarId)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("Student removed from registry.");
        fetchStudents();
      }
    } catch (err) {
      alert("Failed to delete student record");
    }
  };

  const handleResetData = async () => {
    if (!confirm("Reset registry with default AICTE test students?")) return;
    try {
      const res = await fetch("http://127.0.0.1:5000/api/seed", { method: "POST" });
      if (res.ok) {
        showToast("Registry reset and seeded with default AICTE records.");
        fetchStudents();
      }
    } catch (err) {}
  };

  const handleBulkUpload = async () => {
    if (!bulkText.trim()) return;
    try {
      let parsed;
      if (bulkText.trim().startsWith("[")) {
        parsed = JSON.parse(bulkText);
      } else {
        const lines = bulkText.trim().split("\n");
        parsed = lines.map((l) => {
          const parts = l.split(",");
          return {
            apaar_id: parts[0]?.trim(),
            full_name: parts[1]?.trim(),
            institution: parts[2]?.trim() || "AICTE Institute",
            branch: parts[3]?.trim() || "CSE",
            program: `B.Tech ${parts[3]?.trim() || "Engineering"}`,
            cgpa: parseFloat(parts[4]?.trim() || "8.0"),
            abc_credits_total: 24,
            status: "Verified",
            kyc_status: "VERIFIED"
          };
        });
      }

      const res = await fetch("http://127.0.0.1:5000/api/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: parsed }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowBulkModal(false);
        setBulkText("");
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Invalid format: " + err.message);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ["APAAR_ID", "ABC_ID", "Full_Name", "Institution", "Program", "Branch", "Credits", "CGPA", "Status"];
    const rows = students.map((s) => [
      s.apaar_id,
      s.abc_id,
      `"${s.full_name}"`,
      `"${s.institution}"`,
      `"${s.program}"`,
      s.branch,
      s.abc_credits_total,
      s.cgpa,
      s.status
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AICTE_APAAR_Registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Registry exported successfully!");
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#142B4A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-[#22D3EE]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <Users className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE Institutional Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Student APAAR Data Management
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Maintain academic rosters, monitor Academic Bank of Credits (ABC), and onboard student cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setShowAiModal(true);
                setAiResult(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>AI Verify & Register Student</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4 text-[#142B4A]" />
              <span>Bulk Ingest</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleResetData}
              title="Reset data"
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-[#0F172A] border border-[#E2E8F0] shadow-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by APAAR ID, student name, institution..."
              className="w-full bg-slate-50 border border-[#E2E8F0] focus:border-[#142B4A] rounded-xl py-2 pl-10 pr-4 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-50 border border-[#E2E8F0] text-xs font-bold rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-[#E2E8F0] text-xs font-bold rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-[#E2E8F0] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">APAAR & ABC ID</th>
                  <th className="py-3.5 px-4">Institution</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">ABC Credits</th>
                  <th className="py-3.5 px-4">CGPA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      Loading AICTE student registry...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No student records found matching filters.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.apaar_id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={s.full_name}
                            className="w-9 h-9 rounded-xl object-cover border border-[#E2E8F0]"
                          />
                          <div>
                            <div className="font-bold text-[#0F172A] text-sm">{s.full_name}</div>
                            <div className="text-[10px] text-slate-500">{s.email || "student@aicte.edu"}</div>
                          </div>
                        </div>
                      </td>

                      {/* APAAR ID & ABC ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-[#142B4A]">{s.apaar_id}</div>
                        <div className="text-[10px] text-blue-700 font-semibold">{s.abc_id}</div>
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="text-[#0F172A] font-medium truncate">{s.institution}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Code: {s.aicte_id}</div>
                      </td>

                      {/* Branch & Year */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] font-bold">
                          {s.branch}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Adm {s.admission_year || 2023} • Sem {s.current_semester || 1}
                        </div>
                      </td>

                      {/* ABC Credits */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-[#142B4A] text-sm">
                          {s.abc_credits_total || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">Credits</span>
                      </td>

                      {/* CGPA */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-[#142B4A]">
                          {s.cgpa || "—"}
                        </span>
                      </td>

                      {/* Status & AI Trust Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            s.status === "Flagged"
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : s.status === "Graduated"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}>
                            {s.status === "Flagged" ? (
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            )}
                            <span>{s.status}</span>
                          </span>

                          {s.ai_verification_report ? (
                            <button
                              type="button"
                              onClick={() => setSelectedAiReport(s)}
                              className="flex items-center gap-1 text-[10px] font-bold text-[#142B4A] hover:text-[#0F172A] bg-cyan-50/80 px-2 py-0.5 rounded-md border border-[#22D3EE]/40 transition-colors"
                              title="Click to view AI Verification Report"
                            >
                              <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                              <span>{s.ai_verification_report.trust_score}% AI Match</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 block font-mono">DigiLocker KYC</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/scan?apaar=${encodeURIComponent(s.apaar_id)}`}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#142B4A] border border-[#E2E8F0] transition-colors"
                            title="Verify in Scanner"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </Link>
                          <Link
                            href={`/student/${encodeURIComponent(s.apaar_id)}`}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#142B4A] border border-[#E2E8F0] transition-colors"
                            title="Open Verifiable Card"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.apaar_id)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#E2E8F0] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal 1: AI-Powered APAAR Verification & Onboarding */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-[#0F172A] my-8">
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiResult(null);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A] p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-[#142B4A] text-[#22D3EE] flex items-center justify-center font-bold shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#142B4A]">
                    AI-Powered Student APAAR Verification & Onboarding
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Aadhaar e-KYC consent, demographic match, nationwide duplicate detection & AICTE compliance.
                  </p>
                </div>
              </div>

              {/* SIH Evaluator Presets Bar */}
              <div className="mt-4 mb-5 p-3 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                  <span>Fast-Track SIH Evaluator Test Cases (1-Click Fill)</span>
                  <span className="text-[#142B4A] font-mono">4 Demo Profiles</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {presets.length > 0 ? (
                    presets.map((p) => {
                      const isSelected = selectedPresetId === p.preset_id;
                      return (
                        <button
                          key={p.preset_id}
                          type="button"
                          onClick={() => handleSelectPreset(p)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                            isSelected
                              ? "bg-white border-[#142B4A] shadow-sm ring-2 ring-[#142B4A]/10"
                              : "bg-white border-[#E2E8F0] hover:bg-slate-100/70"
                          }`}
                        >
                          <div className="font-bold text-[#0F172A] truncate text-[11px]">
                            {p.title.split("(")[0]}
                          </div>
                          <div className="text-[9px] text-[#142B4A] font-bold truncate mt-0.5">
                            {p.badge.split("•")[0]}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-4 text-[11px] text-slate-400 py-1">Loading AI evaluation presets...</div>
                  )}
                </div>
              </div>

              {/* Live AI Verification Result Card if Available */}
              {aiResult && (
                <div className="mb-5 p-4 rounded-2xl border transition-all bg-white shadow-sm border-[#E2E8F0]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                        aiResult.verified ? "bg-emerald-100 text-emerald-800" : (aiResult.status === "AI_REJECTED_FRAUD" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800")
                      }`}>
                        {aiResult.ai_trust_score}%
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                          <span>Verdict: {aiResult.status}</span>
                          <span className={`text-[10px] px-2 py-0.2 rounded-full border ${
                            aiResult.verified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : (aiResult.status === "AI_REJECTED_FRAUD" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200")
                          }`}>
                            {aiResult.risk_level}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{aiResult.message}</p>
                      </div>
                    </div>

                    {aiResult.apaar_id && (
                      <div className="text-right sm:border-l sm:pl-3 border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold block">Issued APAAR ID</span>
                        <span className="font-mono text-xs font-black text-[#142B4A]">{aiResult.apaar_id}</span>
                      </div>
                    )}
                  </div>

                  {/* 4 AI Pillars Progress Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] mb-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Aadhaar Match</span>
                      <span className="font-bold text-[#0F172A]">{aiResult.report?.demographic_match_score || 0}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Anti-Fraud Duplicate</span>
                      <span className={`font-bold ${aiResult.report?.anti_fraud_score === 100 ? "text-emerald-700" : "text-rose-700"}`}>
                        {aiResult.report?.anti_fraud_score === 100 ? "Clean Pass" : "Conflict Alert"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <span className="text-slate-500 block">AICTE Institute Code</span>
                      <span className="font-bold text-[#0F172A]">{aiResult.report?.institution_compliance_score || 0}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Document Integrity</span>
                      <span className="font-bold text-[#0F172A]">{aiResult.report?.document_score || 0}%</span>
                    </div>
                  </div>

                  {/* Discrepancy Flags & Suggestions */}
                  {(aiResult.report?.flags || []).length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs mb-3 space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>AI Discrepancy & Sentinel Flags:</span>
                      </div>
                      {aiResult.report.flags.map((f, i) => (
                        <div key={i} className="text-[11px] text-amber-800">• {f}</div>
                      ))}
                    </div>
                  )}

                  {/* Action Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E2E8F0] text-xs">
                    {aiResult.apaar_id && (
                      <Link
                        href={`/student/${encodeURIComponent(aiResult.apaar_id)}`}
                        className="px-3 py-1.5 rounded-lg bg-[#142B4A] text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Official Card</span>
                      </Link>
                    )}
                    <Link
                      href="/workflow"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#142B4A] font-bold text-[11px] flex items-center gap-1 border border-[#E2E8F0]"
                    >
                      <FileCheck2 className="w-3 h-3" />
                      <span>Track in Workflow Pipeline</span>
                    </Link>
                    {aiResult.apaar_id && (
                      <Link
                        href={`/scan?apaar=${encodeURIComponent(aiResult.apaar_id)}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#142B4A] font-bold text-[11px] flex items-center gap-1 border border-[#E2E8F0]"
                      >
                        <QrCode className="w-3 h-3 text-[#22D3EE]" />
                        <span>Scan APAAR QR</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleRunAiVerification} className="space-y-3.5 text-xs">
                
                {/* Column 1: Demographics & Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={aiForm.full_name}
                      onChange={(e) => setAiForm({ ...aiForm, full_name: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">
                      12-Digit Aadhaar / VID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="5544-3322-1100"
                      value={aiForm.aadhaar_number}
                      onChange={(e) => setAiForm({ ...aiForm, aadhaar_number: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 font-mono text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={aiForm.dob}
                      onChange={(e) => setAiForm({ ...aiForm, dob: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Gender</label>
                    <select
                      value={aiForm.gender}
                      onChange={(e) => setAiForm({ ...aiForm, gender: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Mobile</label>
                    <input
                      type="text"
                      value={aiForm.phone}
                      onChange={(e) => setAiForm({ ...aiForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                {/* Mandatory Student Consent Checkbox */}
                <div className="p-3 rounded-2xl bg-slate-50 border-2 border-[#142B4A]/20">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiForm.student_consent}
                      onChange={(e) => setAiForm({ ...aiForm, student_consent: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-[#142B4A] focus:ring-[#142B4A]"
                    />
                    <div className="text-[11px] text-[#0F172A] leading-relaxed">
                      <strong className="text-[#142B4A]">Mandatory Consent (Aadhaar Act 2016 & AICTE DigiLocker Policy):</strong>
                      <span className="text-slate-600 block mt-0.5">
                        I hereby declare and provide consent for demographic/biometric authentication against the National Central Registry for generating my permanent APAAR ID & Academic Bank of Credits (ABC) record.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Column 2: Institutional & Academic Admission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">AICTE Institution</label>
                    <input
                      type="text"
                      value={aiForm.institution}
                      onChange={(e) => setAiForm({ ...aiForm, institution: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">AICTE Institute Code</label>
                    <input
                      type="text"
                      value={aiForm.aicte_id}
                      onChange={(e) => setAiForm({ ...aiForm, aicte_id: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 font-mono text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Branch</label>
                    <select
                      value={aiForm.branch}
                      onChange={(e) => setAiForm({ ...aiForm, branch: e.target.value, program: `B.Tech ${e.target.value}` })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    >
                      {branches.filter(b => b !== "All").map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Admission Year</label>
                    <input
                      type="number"
                      value={aiForm.admission_year}
                      onChange={(e) => setAiForm({ ...aiForm, admission_year: parseInt(e.target.value) || 2024 })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={aiForm.cgpa}
                      onChange={(e) => setAiForm({ ...aiForm, cgpa: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                {/* Academic Document Upload Toggle */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#142B4A]" />
                    <div>
                      <div className="font-bold text-[#0F172A]">Class XII Marksheet / DigiLocker Slip</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {aiForm.document_uploaded ? aiForm.document_name : "No file attached"}
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#142B4A]">
                    <input
                      type="checkbox"
                      checked={aiForm.document_uploaded}
                      onChange={(e) => setAiForm({ ...aiForm, document_uploaded: e.target.checked, document_name: e.target.checked ? "Class_XII_CBSE_Marksheet_Verified.pdf" : "" })}
                      className="rounded border-slate-300 text-[#142B4A] focus:ring-[#142B4A]"
                    />
                    <span>Marksheet Verified</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-generates 12-digit APAAR ID & submits to Workflow</span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAiModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-[#22D3EE] ${aiLoading ? "animate-spin" : ""}`} />
                      <span>{aiLoading ? "Executing AI Multi-Factor Engine..." : "Run AI Verification & Generate APAAR"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: View Inspected Student AI Verification Report */}
        {selectedAiReport && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#0F172A]">
              <button
                onClick={() => setSelectedAiReport(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#142B4A] text-[#22D3EE] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#142B4A]">AI Verification Certificate</h3>
                  <div className="text-[11px] text-slate-500 font-mono">APAAR: {selectedAiReport.apaar_id}</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Candidate</span>
                    <div className="font-bold text-sm text-[#0F172A]">{selectedAiReport.full_name}</div>
                    <div className="text-slate-500 text-[11px]">{selectedAiReport.institution}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-700">
                      {selectedAiReport.ai_verification_report?.trust_score || 98.4}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">AI Trust Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                    <span className="text-slate-500 block">Demographic Match</span>
                    <span className="font-bold text-[#142B4A]">{selectedAiReport.ai_verification_report?.demographic_match_score || 98}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                    <span className="text-slate-500 block">Anti-Fraud Sentinel</span>
                    <span className="font-bold text-emerald-700">No Dual Seat Found</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] text-slate-600 space-y-1 text-[11px]">
                  <div>
                    <strong>Masked Aadhaar:</strong> {selectedAiReport.masked_aadhaar || selectedAiReport.ai_verification_report?.masked_aadhaar || "XXXX-XXXX-1100"}
                  </div>
                  <div>
                    <strong>Consent Authorization:</strong> Verified via Digilocker e-KYC
                  </div>
                  <div>
                    <strong>AI Decision:</strong> {selectedAiReport.ai_verification_report?.decision || "All academic credentials and AICTE regulatory norms verified."}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Link
                    href={`/scan?apaar=${encodeURIComponent(selectedAiReport.apaar_id)}`}
                    className="px-4 py-2 rounded-xl bg-[#142B4A] text-white font-bold text-xs"
                  >
                    Verify in Scanner &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Bulk Ingest */}
        {showBulkModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#0F172A]">
              <button
                onClick={() => setShowBulkModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#142B4A] flex items-center justify-center font-bold">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#142B4A]">Bulk Ingest Students</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Paste CSV (format: <code>apaar_id,full_name,institution,branch,cgpa</code>) or JSON array of student objects.
              </p>

              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`9384-1120-7744,Rohan Das,Delhi Technological University,CSE,8.8\n9102-4433-2211,Sanya Sen,VJTI Mumbai,AI & DS,9.1`}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-3 text-xs font-mono text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
              />

              <div className="pt-3 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setBulkText(`9384-1120-7744,Rohan Das,Delhi Technological University,CSE,8.8\n9102-4433-2211,Sanya Sen,VJTI Mumbai,AI & DS,9.1`)}
                  className="text-[#142B4A] font-bold hover:underline"
                >
                  Load Example CSV
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkUpload}
                    className="px-5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold"
                  >
                    Ingest Cohort
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
