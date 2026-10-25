"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Building2,
  FileCheck2,
  Award,
  History,
  MessageSquare,
  Check,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  ArrowRight
} from "lucide-react";

export default function AdminPortalPage() {
  const { data: session } = useSession();

  // Active Admin Tab: 'FAILED_APPROVALS' | 'STUDENT_REPOSITORY' | 'SMART_ALERTS' | 'COMPLIANCE_REPORTS'
  const [activeTab, setActiveTab] = useState("FAILED_APPROVALS");

  // State
  const [failedCases, setFailedCases] = useState([]);
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Resolution Modal State
  const [selectedCase, setSelectedCase] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [actionRemarks, setActionRemarks] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === "FAILED_APPROVALS") {
        const res = await fetch("http://127.0.0.1:5000/api/admin/failed-approvals");
        if (res.ok) {
          const data = await res.json();
          setFailedCases(data.failed_cases || []);
        }
      } else if (activeTab === "STUDENT_REPOSITORY") {
        const res = await fetch("http://127.0.0.1:5000/api/students?limit=100");
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
        }
      } else if (activeTab === "SMART_ALERTS") {
        const [notifRes, analRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/api/workflow/notifications?role=AICTE_ADMIN"),
          fetch("http://127.0.0.1:5000/api/analytics")
        ]);
        if (notifRes.ok) {
          const nData = await notifRes.json();
          setAlerts(nData.notifications || []);
        }
        if (analRes.ok) {
          const aData = await analRes.json();
          setAnalytics(aData.analytics);
        }
      } else if (activeTab === "COMPLIANCE_REPORTS") {
        const res = await fetch("http://127.0.0.1:5000/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      }
    } catch (err) {
      console.error("Admin data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCase = async (decision) => {
    if (!selectedCase) return;
    if (decision === "REJECT" && !actionRemarks.trim()) {
      alert("Please provide specific correction reasons or rejection remarks.");
      return;
    }

    setProcessingAction(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/resolve-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_id: selectedCase.workflow_id,
          decision: decision,
          remarks: actionRemarks || "Approved by Institution & AICTE Central Admin Panel.",
          user: {
            name: session?.user?.name || "Prof. T. G. Sitharam",
            role: "AICTE_ADMIN",
            institution: "AICTE Central Administration"
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Case ${decision === "APPROVE" ? "Approved" : "Returned"} successfully!`);
        setShowResolveModal(false);
        setSelectedCase(null);
        setActionRemarks("");
        fetchAdminData();
      } else {
        alert(data.message || "Action failed.");
      }
    } catch (err) {
      alert("Error contacting backend service.");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ["APAAR_ID", "ABC_ID", "Full_Name", "Institution", "Branch", "Credits", "CGPA", "Status"];
    const rows = students.map((s) => [
      s.apaar_id,
      s.abc_id,
      `"${s.full_name}"`,
      `"${s.institution}"`,
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
    link.setAttribute("download", `AICTE_National_Registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV Registry exported successfully!");
  };

  const filteredFailed = failedCases.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.apaar_id?.toLowerCase().includes(q) ||
      c.institution?.toLowerCase().includes(q) ||
      c.workflow_id?.toLowerCase().includes(q)
    );
  });

  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.apaar_id?.toLowerCase().includes(q) ||
      s.institution?.toLowerCase().includes(q) ||
      s.branch?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#142B4A] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-[#22D3EE]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE & Institution Central Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              AICTE Institution & Admin Panel
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Manual approval authority for AI-failed verifications, centralized student records, and anti-fraud oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#142B4A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#142B4A] ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Queue</span>
            </button>
            <Link
              href="/scan"
              className="px-4 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Student Gateway</span>
            </Link>
          </div>
        </div>

        {/* Core Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab("FAILED_APPROVALS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "FAILED_APPROVALS"
                ? "bg-[#142B4A] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeTab === "FAILED_APPROVALS" ? "text-amber-300" : "text-amber-500"}`} />
            <span>AI-Failed Approvals Queue</span>
            {failedCases.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "FAILED_APPROVALS" ? "bg-amber-400 text-[#142B4A]" : "bg-amber-100 text-amber-800"
              }`}>
                {failedCases.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("STUDENT_REPOSITORY")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "STUDENT_REPOSITORY"
                ? "bg-[#142B4A] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Centralized Student Records</span>
          </button>

          <button
            onClick={() => setActiveTab("SMART_ALERTS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "SMART_ALERTS"
                ? "bg-[#142B4A] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Smart Fraud Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab("COMPLIANCE_REPORTS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "COMPLIANCE_REPORTS"
                ? "bg-[#142B4A] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <Award className="w-4 h-4 text-[#22D3EE]" />
            <span>AICTE Compliance Reports</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: AI-FAILED APPROVALS QUEUE (MAIN USER REQUIREMENT) */}
        {/* ============================================================== */}
        {activeTab === "FAILED_APPROVALS" && (
          <div className="space-y-4">
            
            {/* Notice Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">
                  Automated Verification Policy (AICTE NEP-2020 Mandate):
                </strong>
                <p className="leading-relaxed text-amber-800">
                  Clean records with valid Aadhaar consent, no duplicate enrollments, and accredited AICTE affiliation are 
                  <strong> verified and issued APAAR IDs automatically by AI</strong>. Only records where the AI detects a 
                  <strong> verification failure, demographic mismatch, missing documents, or dual-enrollment fraud</strong> 
                  are held here for Institution & AICTE Admin approval.
                </p>
              </div>
            </div>

            {/* Search Filter */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center shadow-sm">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter failed cases by student name, APAAR ID, or institution..."
                className="w-full bg-transparent text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Applications List */}
            {loading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] text-slate-500">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#142B4A]" />
                <span className="text-xs font-semibold">Loading AI-Failed verification queue...</span>
              </div>
            ) : filteredFailed.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#E2E8F0] rounded-3xl text-slate-500 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-[#0F172A] text-base">All Approvals Clear!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  No records currently flagged for manual intervention. The AI verification engine has processed all student applications.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredFailed.map((c) => {
                  const report = c.ai_verification_report || {};
                  const isFraud = c.status === "FRAUD_CONFIRMED_REJECTED" || report.status === "AI_REJECTED_FRAUD";
                  return (
                    <div
                      key={c.workflow_id}
                      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md transition-all space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                            isFraud ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {report.trust_score ? `${report.trust_score}%` : "FLAG"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-500 font-semibold">{c.workflow_id}</span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isFraud ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>
                                {isFraud ? "CRITICAL: FRAUD BLOCKED" : "AI VERIFICATION FAILED"}
                              </span>
                            </div>
                            <h3 className="text-base font-black text-[#0F172A] mt-0.5">{c.full_name}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => {
                              setSelectedCase(c);
                              setShowResolveModal(true);
                              setActionRemarks("");
                            }}
                            className="px-4 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                            <span>Inspect & Resolve Case</span>
                          </button>
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">APAAR ID</span>
                          <span className="font-mono font-bold text-[#142B4A]">{c.apaar_id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Institution</span>
                          <span className="font-bold text-[#0F172A] truncate block">{c.institution}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Code: {c.aicte_id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Program & Branch</span>
                          <span className="font-bold text-[#0F172A]">{c.branch}</span>
                          <span className="text-[10px] text-slate-500 block">Adm Year {c.admission_year || 2024}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">AI Detected Flag</span>
                          <span className="font-bold text-rose-700 block truncate">
                            {(report.flags || [c.flag_notes || c.rejection_remarks || "Verification Anomaly"])[0]}
                          </span>
                        </div>
                      </div>

                      {/* Specific AI Reasoning Callout */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#142B4A] text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>AI Assessment:</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {report.decision || c.submission_notes || "Demographic or document verification could not be automatically confirmed."}
                        </p>
                        {(report.flags || []).length > 0 && (
                          <div className="text-[10px] text-rose-800 font-semibold pt-0.5">
                            Flags: {report.flags.join(" • ")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CENTRALIZED STUDENT RECORDS */}
        {/* ============================================================== */}
        {activeTab === "STUDENT_REPOSITORY" && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repository by student name, APAAR ID, branch, or institute..."
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2 pl-10 pr-4 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#142B4A] border border-[#E2E8F0] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export CSV Registry</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-[#E2E8F0] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">APAAR & ABC ID</th>
                      <th className="py-3 px-4">Institution</th>
                      <th className="py-3 px-4">Branch</th>
                      <th className="py-3 px-4">ABC Credits</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500">
                          No student records found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => (
                        <tr key={s.apaar_id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#0F172A]">{s.full_name}</div>
                            <div className="text-[10px] text-slate-500">{s.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-[#142B4A]">{s.apaar_id}</div>
                            <div className="text-[10px] text-blue-700">{s.abc_id}</div>
                          </td>
                          <td className="py-3 px-4 max-w-[220px]">
                            <div className="text-[#0F172A] truncate font-medium">{s.institution}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Code: {s.aicte_id}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold">{s.branch}</span>
                          </td>
                          <td className="py-3 px-4 font-black text-[#142B4A]">
                            {s.abc_credits_total} Cr
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              s.status === "Flagged" ? "bg-rose-50 text-rose-800 border border-rose-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/student/${encodeURIComponent(s.apaar_id)}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#142B4A] border border-[#E2E8F0] font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Card</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SMART ALERTS & FRAUD SENTINEL */}
        {/* ============================================================== */}
        {activeTab === "SMART_ALERTS" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-[#142B4A]">National Anti-Fraud Sentinel Alerts</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated background algorithms monitor cross-institutional enrollment rosters to flag dual seat-locking, 
                phantom students, and missing mandatory documents.
              </p>
            </div>

            <div className="space-y-2.5">
              {alerts.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-[#E2E8F0] text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <span className="text-xs font-semibold">No active fraud or discrepancy alerts.</span>
                </div>
              ) : (
                alerts.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs flex items-start justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(n.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Affiliation: {n.institution}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: COMPLIANCE REPORTS */}
        {/* ============================================================== */}
        {activeTab === "COMPLIANCE_REPORTS" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">Total APAAR Enrolled</span>
                <div className="text-3xl font-black text-[#142B4A] mt-1">{analytics?.total_students || 8}</div>
                <div className="text-[11px] text-emerald-700 font-bold mt-1">100% Digital Identity Sync</div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">AICTE Compliance Rate</span>
                <div className="text-3xl font-black text-emerald-600 mt-1">{analytics?.compliance_rate || 98.4}%</div>
                <div className="text-[11px] text-slate-500 mt-1">Accredited Roster Verified</div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">Academic Bank Credits</span>
                <div className="text-3xl font-black text-[#142B4A] mt-1">{analytics?.total_abc_credits || 680}</div>
                <div className="text-[11px] text-slate-500 mt-1">Avg {analytics?.avg_credits || 85} Cr / Student</div>
              </div>
              <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm bg-rose-50/30">
                <span className="text-xs text-rose-800 uppercase font-bold">Dual Enrollment Alerts</span>
                <div className="text-3xl font-black text-rose-600 mt-1">{analytics?.flagged_fraud_count || 1}</div>
                <div className="text-[11px] text-rose-700 mt-1 font-semibold">Under Investigation</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* RESOLUTION MODAL FOR AI-FAILED CASES */}
        {/* ============================================================== */}
        {showResolveModal && selectedCase && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative text-[#0F172A]">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedCase(null);
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#142B4A] text-[#22D3EE] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#142B4A]">
                    Resolve AI-Failed Verification
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Case: {selectedCase.workflow_id} • Student: {selectedCase.full_name}
                  </p>
                </div>
              </div>

              {/* AI Discrepancy Breakdown */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 mb-4">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>AI Detection & Anomaly Breakdown:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono text-[10px]">
                    Trust Score: {selectedCase.ai_verification_report?.trust_score || "N/A"}%
                  </span>
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  {selectedCase.ai_verification_report?.decision || selectedCase.submission_notes}
                </p>
                {(selectedCase.ai_verification_report?.flags || []).length > 0 && (
                  <div className="space-y-0.5 pt-1 border-t border-amber-200/60">
                    {selectedCase.ai_verification_report.flags.map((f, i) => (
                      <div key={i} className="text-[11px] text-amber-900 font-semibold">• {f}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Demographics Review */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E2E8F0] grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Proposed APAAR ID</span>
                  <span className="font-mono font-bold text-[#142B4A]">{selectedCase.apaar_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Institution Affiliation</span>
                  <span className="font-bold text-[#0F172A]">{selectedCase.institution}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Branch & Program</span>
                  <span className="font-bold text-[#0F172A]">{selectedCase.branch}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Academic Bank Credits</span>
                  <span className="font-bold text-[#142B4A]">{selectedCase.abc_credits_total} Cr</span>
                </div>
              </div>

              {/* Remarks Textarea */}
              <div className="space-y-1.5 mb-5">
                <label className="block text-xs font-bold text-[#0F172A]">
                  Authority Decision Remarks *
                </label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Enter approval justification or rejection correction remarks..."
                  className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                />
              </div>

              {/* Decision Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={processingAction}
                    onClick={() => handleResolveCase("REJECT")}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-50"
                  >
                    Reject with Remarks
                  </button>
                  <button
                    type="button"
                    disabled={processingAction}
                    onClick={() => handleResolveCase("APPROVE")}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Issue APAAR ID</span>
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
