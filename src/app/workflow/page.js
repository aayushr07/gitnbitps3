"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Building2,
  Users,
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  ArrowRight,
  History,
  MessageSquare,
  Award,
  Bell,
  X,
  FileCheck2,
  Filter,
  Check,
  UserCheck,
  Sparkles,
  Fingerprint
} from "lucide-react";

export default function WorkflowPage() {
  const { data: session } = useSession();

  // Active viewing role (defaults to logged-in user or AICTE_ADMIN)
  const [activeRole, setActiveRole] = useState("AICTE_ADMIN");
  const [activeTab, setActiveTab] = useState("ALL");
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [actionRemarks, setActionRemarks] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // New Student Submission Form
  const [newApp, setNewApp] = useState({
    apaar_id: "",
    full_name: "",
    email: "",
    institution: "Delhi Technological University",
    aicte_id: "1-33271891",
    branch: "CSE",
    program: "B.Tech Computer Science & Engineering",
    admission_year: 2024,
    current_semester: 1,
    abc_credits_total: 24,
    cgpa: 8.50,
    submission_notes: "Initial enrollment submission with 10th/12th certificate and DigiLocker KYC."
  });

  useEffect(() => {
    if (session?.user?.role) {
      setActiveRole(session.user.role);
    }
  }, [session]);

  useEffect(() => {
    fetchWorkflowData();
  }, [activeRole, activeTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchWorkflowData = async () => {
    setLoading(true);
    try {
      const [recRes, statsRes, notifRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/workflow/records?role=${activeRole}&status=${activeTab}`),
        fetch(`http://127.0.0.1:5000/api/workflow/stats`),
        fetch(`http://127.0.0.1:5000/api/workflow/notifications?role=${activeRole}`)
      ]);

      if (recRes.ok) {
        const data = await recRes.json();
        setRecords(data.records || []);
      }
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
      }
      if (notifRes.ok) {
        const nData = await notifRes.json();
        setNotifications(nData.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load workflow data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedRecord) return;
    if ((actionType === "REJECT_WITH_REMARKS" || actionType === "FLAG_FOR_REVIEW") && !actionRemarks.trim()) {
      alert("Please provide specific remarks or correction reasons.");
      return;
    }

    setProcessingAction(true);
    try {
      const currentUser = session?.user || {
        name: activeRole === "COLLEGE_OPERATOR" ? "Ramesh Patel" : activeRole === "INSTITUTION_VERIFIER" ? "Dr. Pradeep Kumar" : activeRole === "AUTHORIZED_REVIEWER" ? "Smt. Sunita Rao" : "Prof. T. G. Sitharam",
        role: activeRole,
        institution: "AICTE Portal"
      };

      const res = await fetch("http://127.0.0.1:5000/api/workflow/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_id: selectedRecord.workflow_id,
          action: actionType,
          remarks: actionRemarks,
          user: currentUser
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setShowReviewModal(false);
        setActionRemarks("");
        setSelectedRecord(null);
        fetchWorkflowData();
      } else {
        alert(data.message || "Failed to process workflow action.");
      }
    } catch (err) {
      alert("Error contacting backend service.");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleSubmitNewRecord = async (e) => {
    e.preventDefault();
    if (!newApp.full_name) {
      alert("Full Name is mandatory.");
      return;
    }

    try {
      const currentUser = session?.user || {
        name: "Ramesh Patel",
        role: "COLLEGE_OPERATOR",
        institution: newApp.institution
      };

      const res = await fetch("http://127.0.0.1:5000/api/ai-verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newApp,
          student_consent: true,
          auto_enroll: true,
          user: currentUser
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`AI-Verified (${data.ai_trust_score}% Trust Score) and submitted to workflow!`);
        setShowSubmitModal(false);
        fetchWorkflowData();
        setNewApp({
          apaar_id: "",
          full_name: "",
          email: "",
          institution: "Delhi Technological University",
          aicte_id: "1-33271891",
          branch: "CSE",
          program: "B.Tech Computer Science & Engineering",
          admission_year: 2024,
          current_semester: 1,
          abc_credits_total: 24,
          cgpa: 8.50,
          submission_notes: "Initial enrollment submission with 10th/12th certificate and DigiLocker KYC."
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to submit student application: " + err.message);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.full_name?.toLowerCase().includes(q) ||
      r.apaar_id?.toLowerCase().includes(q) ||
      r.institution?.toLowerCase().includes(q) ||
      r.workflow_id?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUBMITTED":
      case "RESUBMITTED":
        return { label: "Pending Verifier Review", bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "INSTITUTION_APPROVED":
        return { label: "Institution Approved", bg: "bg-amber-50 text-amber-800 border-amber-200" };
      case "FLAGGED_REVIEW":
        return { label: "Flagged (Reviewer Required)", bg: "bg-rose-50 text-rose-800 border-rose-200 font-bold" };
      case "REJECTED_WITH_REMARKS":
        return { label: "Returned for Correction", bg: "bg-orange-50 text-orange-800 border-orange-200" };
      case "AICTE_FINAL_APPROVED":
        return { label: "AICTE Approved (Active)", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "FRAUD_CONFIRMED_REJECTED":
        return { label: "Fraud Blacklisted", bg: "bg-rose-100 text-rose-900 border-rose-300" };
      default:
        return { label: status, bg: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

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

        {/* Header & Role Switcher Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <GitPullRequest className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Multi-Level Verification Workflow</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Institutional Approval Pipeline
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Structured multi-tier verification: College Operator &rarr; Institution Verifier &rarr; Reviewer &rarr; AICTE Admin.
            </p>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-white border border-[#E2E8F0] p-2 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1.5 px-2 text-xs text-slate-500 font-semibold">
              <UserCheck className="w-4 h-4 text-[#142B4A]" />
              <span>Role:</span>
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#142B4A] rounded-xl px-3 py-2 focus:outline-none focus:border-[#142B4A]"
            >
              <option value="COLLEGE_OPERATOR">Level 1: College Operator</option>
              <option value="INSTITUTION_VERIFIER">Level 2: Institution Verifier (Dean)</option>
              <option value="AUTHORIZED_REVIEWER">Level 3: Authorized Reviewer (Fraud Cell)</option>
              <option value="AICTE_ADMIN">Level 4: AICTE Central Admin (HQ)</option>
            </select>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-[#22D3EE]" />
              <span>Submit Record</span>
            </button>
            <button
              onClick={fetchWorkflowData}
              title="Refresh Queue"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-[#0F172A] hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Visual Workflow Pipeline Flowchart */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Multi-Level Workflow State Machine
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border text-xs ${activeRole === "COLLEGE_OPERATOR" ? "bg-blue-50/60 border-blue-400" : "bg-slate-50 border-[#E2E8F0]"}`}>
              <div className="flex items-center justify-between font-bold text-[#0F172A] mb-1">
                <span>1. College Operator</span>
                <span className="text-[10px] text-blue-700 font-mono font-bold">SUBMITTED</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Submits student profile. Receives rejected records with correction reasons to fix and resubmit.
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${activeRole === "INSTITUTION_VERIFIER" ? "bg-emerald-50/60 border-emerald-400" : "bg-slate-50 border-[#E2E8F0]"}`}>
              <div className="flex items-center justify-between font-bold text-[#0F172A] mb-1">
                <span>2. Institution Verifier</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">VERIFIED</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Checks marksheets, attendance & ABC credits. Approves, flags, or returns with correction remarks.
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${activeRole === "AUTHORIZED_REVIEWER" ? "bg-amber-50/60 border-amber-400" : "bg-slate-50 border-[#E2E8F0]"}`}>
              <div className="flex items-center justify-between font-bold text-[#0F172A] mb-1">
                <span>3. Authorized Reviewer</span>
                <span className="text-[10px] text-amber-800 font-mono font-bold">RESOLVED</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Grievance & Fraud Cell investigates dual-enrollment alerts. Clears flag or confirms fraud.
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs ${activeRole === "AICTE_ADMIN" ? "bg-purple-50/60 border-purple-400" : "bg-slate-50 border-[#E2E8F0]"}`}>
              <div className="flex items-center justify-between font-bold text-[#0F172A] mb-1">
                <span>4. AICTE Admin</span>
                <span className="text-[10px] text-purple-700 font-mono font-bold">FINAL SEAL</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                National oversight. Grants final seal and auto-enrolls student into live APAAR Scanner registry.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-[#142B4A]">{stats?.total_cases || 5}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Cases</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-blue-700">{stats?.pending_institution_verification || 1}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Pending Verifier</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-amber-600">{stats?.pending_aicte_final_approval || 1}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Pending AICTE</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-rose-600">{stats?.flagged_for_reviewer || 1}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Flagged / Disputes</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-orange-600">{stats?.returned_for_correction || 1}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Returned</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl shadow-sm">
            <div className="text-xl sm:text-2xl font-black text-emerald-600">{stats?.officially_enrolled || 1}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Approved & Live</div>
          </div>
        </div>

        {/* Queue Filter Tabs & Search Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Cases" },
              { id: "SUBMITTED", label: "Pending Verifier" },
              { id: "INSTITUTION_APPROVED", label: "Institution Approved" },
              { id: "FLAGGED_REVIEW", label: "Flagged Cases" },
              { id: "REJECTED_WITH_REMARKS", label: "Returned Records" },
              { id: "AICTE_FINAL_APPROVED", label: "Final Approved" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#142B4A] text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, ID, or college..."
              className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
            />
          </div>
        </div>

        {/* Workflow Applications Roster */}
        <div className="space-y-3.5">
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-[#E2E8F0]">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#142B4A]" />
              <span>Loading workflow queue...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#E2E8F0] rounded-3xl text-slate-500 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-[#0F172A] text-base">Queue Clear</h3>
              <p className="text-xs text-slate-500 mt-1">No applications matching current filter.</p>
            </div>
          ) : (
            filteredRecords.map((r) => {
              const badge = getStatusBadge(r.status);
              return (
                <div
                  key={r.workflow_id}
                  className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 hover:shadow-md transition-all space-y-4"
                >
                  {/* Top Bar of Record */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-xs text-[#142B4A]">
                        {r.workflow_id.slice(-3)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-semibold">{r.workflow_id}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {r.ai_verification_report && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-[#142B4A] border border-[#22D3EE]/50 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                              <span>{r.ai_verification_report.trust_score}% AI Verified</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-[#0F172A] mt-0.5">{r.full_name}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRecord(r);
                        setShowReviewModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#142B4A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <History className="w-3.5 h-3.5 text-[#142B4A]" />
                      <span>Review & Audit Trail</span>
                    </button>
                  </div>

                  {/* Body Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">APAAR ID</span>
                      <div className="font-mono font-bold text-[#142B4A]">{r.apaar_id}</div>
                      <div className="text-[10px] font-mono text-slate-500">{r.abc_id}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Institution</span>
                      <div className="font-bold text-[#0F172A] truncate">{r.institution}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Code: {r.aicte_id}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Program / Branch</span>
                      <div className="font-bold text-[#0F172A]">{r.branch}</div>
                      <div className="text-[10px] text-slate-500">Sem {r.current_semester} • CGPA {r.cgpa}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Assigned Queue</span>
                      <div className="font-semibold text-slate-700 truncate">{r.assigned_to}</div>
                      <div className="text-[10px] text-slate-500">{new Date(r.submitted_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Callout if REJECTED WITH REMARKS */}
                  {r.status === "REJECTED_WITH_REMARKS" && r.rejection_remarks && (
                    <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">
                          Correction Reason (Returned to College Operator):
                        </strong>
                        <p className="mt-0.5 leading-relaxed text-orange-800">{r.rejection_remarks}</p>
                      </div>
                    </div>
                  )}

                  {/* Callout if FLAGGED REVIEW */}
                  {r.status === "FLAGGED_REVIEW" && r.flag_notes && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">
                          Fraud / Anomaly Flag (Assigned to Authorized Reviewer):
                        </strong>
                        <p className="mt-0.5 leading-relaxed text-rose-800">{r.flag_notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons for Active Role */}
                  <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      Submitted by: <strong className="text-[#0F172A]">{r.submitted_by}</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Operator Actions */}
                      {activeRole === "COLLEGE_OPERATOR" && r.status === "REJECTED_WITH_REMARKS" && (
                        <button
                          onClick={() => {
                            setSelectedRecord(r);
                            setActionRemarks("Re-uploaded valid marksheet with verified DigiLocker e-KYC hash.");
                            handleAction("RESUBMIT");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold"
                        >
                          Resubmit with Corrections
                        </button>
                      )}

                      {/* Institution Verifier Actions */}
                      {activeRole === "INSTITUTION_VERIFIER" && (r.status === "SUBMITTED" || r.status === "RESUBMITTED") && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setActionRemarks("Marksheet, ABC credits and DigiLocker KYC verified by Dean office.");
                              handleAction("INSTITUTION_APPROVE");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setShowReviewModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                          >
                            Flag for Review
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setShowReviewModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold"
                          >
                            Return with Remarks
                          </button>
                        </>
                      )}

                      {/* Authorized Reviewer Actions */}
                      {activeRole === "AUTHORIZED_REVIEWER" && r.status === "FLAGGED_REVIEW" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setActionRemarks("Dispute resolved: verified student holds valid single seat admission.");
                              handleAction("CLEAR_FLAG");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            Clear Flag & Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRecord(r);
                              setActionRemarks("Confirmed duplicate admission fraud across 2 AICTE institutions.");
                              handleAction("CONFIRM_FRAUD");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                          >
                            Confirm Fraud (Blacklist)
                          </button>
                        </>
                      )}

                      {/* AICTE Admin Actions */}
                      {activeRole === "AICTE_ADMIN" && r.status === "INSTITUTION_APPROVED" && (
                        <button
                          onClick={() => {
                            setSelectedRecord(r);
                            setActionRemarks("AICTE National Registry cryptographic token generated. Official seal granted.");
                            handleAction("AICTE_FINAL_APPROVE");
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold shadow-sm flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5 text-[#22D3EE]" />
                          <span>Grant AICTE Final Seal</span>
                        </button>
                      )}

                      {/* If Already Approved */}
                      {r.status === "AICTE_FINAL_APPROVED" && (
                        <Link
                          href={`/scan?apaar=${encodeURIComponent(r.apaar_id)}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 font-bold border border-emerald-200"
                        >
                          Verify in Scanner &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ============================================================== */}
        {/* MODAL 1: AUDIT TRAIL & REVIEW ACTION MODAL */}
        {/* ============================================================== */}
        {showReviewModal && selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 text-[#0F172A]">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#142B4A] flex items-center justify-center font-bold">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#142B4A]">
                    Approval History & AI Audit: {selectedRecord.full_name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    ID: {selectedRecord.workflow_id} • APAAR: {selectedRecord.apaar_id}
                  </div>
                </div>
              </div>

              {/* AI Verification Assessment Card */}
              {selectedRecord.ai_verification_report && (
                <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-[#22D3EE]/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#142B4A]">
                      <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                      <span>AI Multi-Factor Verification Assessment</span>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#142B4A] text-white">
                      {selectedRecord.ai_verification_report.trust_score}% Trust Score
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Aadhaar Match</span>
                      <span className="font-bold text-[#0F172A]">{selectedRecord.ai_verification_report.demographic_match_score || 98}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Anti-Fraud Sentinel</span>
                      <span className={`font-bold ${selectedRecord.ai_verification_report.anti_fraud_score === 100 ? "text-emerald-700" : "text-rose-700"}`}>
                        {selectedRecord.ai_verification_report.anti_fraud_score === 100 ? "Clean Pass" : "Conflict Alert"}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="text-slate-500 block">AICTE Institute Code</span>
                      <span className="font-bold text-[#0F172A]">{selectedRecord.ai_verification_report.institution_compliance_score || 100}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="text-slate-500 block">Documents Integrity</span>
                      <span className="font-bold text-[#0F172A]">{selectedRecord.ai_verification_report.document_score || 100}%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    <strong>AI Decision:</strong> {selectedRecord.ai_verification_report.decision}
                  </p>
                  {(selectedRecord.ai_verification_report.flags || []).length > 0 && (
                    <div className="text-[10px] text-rose-800 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
                      Flags: {selectedRecord.ai_verification_report.flags.join(" • ")}
                    </div>
                  )}
                </div>
              )}

              {/* Audit Trail Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0] space-y-3 max-h-56 overflow-y-auto pr-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Cryptographic Audit Log
                </div>
                {(selectedRecord.audit_history || []).map((step, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-[#E2E8F0] pb-3 last:pb-0 text-xs">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#142B4A]" />
                    <div className="flex items-center justify-between text-slate-800 font-bold">
                      <span>{step.action} by {step.actor_name} ({step.actor_role})</span>
                      <span className="text-[10px] text-slate-500">{new Date(step.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{step.remarks}</p>
                    <div className="text-[10px] text-[#142B4A] font-mono font-bold mt-0.5">
                      {step.prev_status} &rarr; {step.new_status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Remarks Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F172A]">
                  Authority Action Remarks / Correction Reasons *
                </label>
                <textarea
                  rows={3}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder="Enter detailed remarks (mandatory when rejecting with correction reasons or flagging)..."
                  className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
                />
                
                {/* Quick Preset Remarks */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="text-slate-500">Quick Remarks:</span>
                  <button
                    type="button"
                    onClick={() => setActionRemarks("All DigiLocker marksheets, ABC credit ledger, and attendance verified compliant.")}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]"
                  >
                    All verified compliant
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionRemarks("DigiLocker marksheet document missing digital seal. Please re-upload verified copy.")}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]"
                  >
                    Missing marksheet seal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionRemarks("Discrepancy: concurrent registration detected in another AICTE institution.")}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-[#E2E8F0]"
                  >
                    Dual registration flag
                  </button>
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>

                {activeRole === "INSTITUTION_VERIFIER" && (
                  <>
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={() => handleAction("REJECT_WITH_REMARKS")}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Return with Correction Remarks
                    </button>
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={() => handleAction("FLAG_FOR_REVIEW")}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                    >
                      Flag for Reviewer
                    </button>
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={() => handleAction("INSTITUTION_APPROVE")}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Approve Application
                    </button>
                  </>
                )}

                {activeRole === "AUTHORIZED_REVIEWER" && (
                  <>
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={() => handleAction("CONFIRM_FRAUD")}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Confirm Fraud & Blacklist
                    </button>
                    <button
                      type="button"
                      disabled={processingAction}
                      onClick={() => handleAction("CLEAR_FLAG")}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Clear Flag & Approve
                    </button>
                  </>
                )}

                {activeRole === "AICTE_ADMIN" && (
                  <button
                    type="button"
                    disabled={processingAction}
                    onClick={() => handleAction("AICTE_FINAL_APPROVE")}
                    className="px-5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Grant AICTE National Approval</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: SUBMIT STUDENT DATA (COLLEGE OPERATOR) */}
        {/* ============================================================== */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-[#0F172A]">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#142B4A] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#142B4A]">
                    Submit Student Record into Verification Workflow
                  </h3>
                  <p className="text-xs text-slate-500">Record enters Level 1 (SUBMITTED) queue.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitNewRecord} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">APAAR ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="9283-4710-8521"
                      value={newApp.apaar_id}
                      onChange={(e) => setNewApp({ ...newApp, apaar_id: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] font-mono focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varun Malhotra"
                      value={newApp.full_name}
                      onChange={(e) => setNewApp({ ...newApp, full_name: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="student@dtu.ac.in"
                      value={newApp.email}
                      onChange={(e) => setNewApp({ ...newApp, email: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Branch</label>
                    <select
                      value={newApp.branch}
                      onChange={(e) => setNewApp({ ...newApp, branch: e.target.value, program: `B.Tech ${e.target.value}` })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    >
                      <option value="CSE">CSE</option>
                      <option value="AI & DS">AI & DS</option>
                      <option value="ENTC">ENTC</option>
                      <option value="EE">EE</option>
                      <option value="ME">ME</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={newApp.institution}
                    onChange={(e) => setNewApp({ ...newApp, institution: e.target.value })}
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ABC Credits</label>
                    <input
                      type="number"
                      value={newApp.abc_credits_total}
                      onChange={(e) => setNewApp({ ...newApp, abc_credits_total: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newApp.cgpa}
                      onChange={(e) => setNewApp({ ...newApp, cgpa: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Notes</label>
                  <textarea
                    rows={2}
                    value={newApp.submission_notes}
                    onChange={(e) => setNewApp({ ...newApp, submission_notes: e.target.value })}
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold"
                  >
                    Submit for Verification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
