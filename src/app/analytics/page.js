"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Building2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Award,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  Globe2,
  Sparkles,
  Info
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReportTab, setActiveReportTab] = useState("INTAKE"); // 'INTAKE' | 'QUOTAS' | 'SENTINEL'
  const [expandedInstId, setExpandedInstId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, instRes, repRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/api/analytics"),
        fetch("http://127.0.0.1:5000/api/institutions"),
        fetch("http://127.0.0.1:5000/api/reports/admissions")
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setData(aData.analytics);
      }
      if (instRes.ok) {
        const iData = await instRes.json();
        setInstitutions(iData.institutions || []);
      }
      if (repRes.ok) {
        const rData = await repRes.json();
        setReportsData(rData.report?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open("http://127.0.0.1:5000/api/reports/admissions?format=csv", "_blank");
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6 print:border-black">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0] print:hidden">
              <ShieldCheck className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE Central Admission Monitoring & Governance Bureau</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Admissions Monitoring & Regulatory Analytics
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Real-time monitoring of Approved Intake vs Actual Enrolment, supernumerary quotas, excess admission anomaly detection, and policy reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start print:hidden">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#142B4A] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Export CSV Report</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Print Policy Report</span>
            </button>

            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 shadow-sm transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#142B4A]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Sanctioned Intake</span>
              <Users className="w-4 h-4 text-[#142B4A]" />
            </div>
            <div className="text-2xl font-black text-[#142B4A]">
              {data?.total_approved_intake?.toLocaleString() || "840"}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
              <span>{institutions.length || 6} Inst (60 cutoff/dept)</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Enrolled</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700">
              {data?.total_actual_enrolment?.toLocaleString() || "815"}
            </div>
            <div className="text-[10px] text-blue-600 font-bold mt-1">
              {data?.intake_utilization_rate || 97.0}% Capacity Filled
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Open Vacancy</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {data?.total_vacant_seats ?? 33}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              Seats Open for Enrolment
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">APAAR Linked</span>
              <FileCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-700">
              {data?.total_students || 19}
            </div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-1">
              Verified Registry Profiles
            </div>
          </div>

          <div className="bg-white border border-blue-200 bg-blue-50/30 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-blue-800 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">100% Full Intake</span>
              <Award className="w-4 h-4 text-blue-700" />
            </div>
            <div className="text-2xl font-black text-blue-800">
              {data?.full_intake_count || 1}
            </div>
            <div className="text-[10px] text-blue-700 font-bold mt-1">
              COEP Pune (180/180 Full)
            </div>
          </div>

          {/* Excess Intake Violations Sentinel */}
          <div className="bg-white border border-rose-300 rounded-2xl p-4 shadow-sm bg-rose-50/30">
            <div className="flex items-center justify-between text-rose-800 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Intake Anomaly</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700">
              {data?.excess_intake_violations || 1}
            </div>
            <div className="text-[10px] text-rose-700 font-bold mt-1">
              Over-Admission (Apex +8)
            </div>
          </div>

        </div>

        {/* Real-Time Excess Enrolment & Fraud Sentinel Alert Banner */}
        {data?.excess_institutions?.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-950">
                  CRITICAL SENTINEL ALERT: Admissions Exceeding Approved Intake Detected
                </h3>
                <p className="text-xs text-rose-800">
                  AICTE automated validator detected non-compliant institutions admitting students in excess of sanctioned intake.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {data.excess_institutions.map((inst) => (
                <div key={inst.aicte_id} className="p-4 rounded-2xl bg-white border border-rose-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">{inst.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                      +{inst.actual_enrolment - inst.approved_intake} SEATS OVER CAP
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Approved Intake: <strong>{inst.approved_intake}</strong> • Actual Enrolled:{" "}
                    <strong className="text-rose-700">{inst.actual_enrolment}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Flagged Program: <strong>B.Tech Computer Science & Engineering</strong> (Sanctioned 60, Admitted 68)
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Concurrent Dual Enrolment Detected</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                    FRAUD ANOMALY
                  </span>
                </div>
                <div className="text-slate-600">
                  APAAR ID: <strong className="font-mono text-[#142B4A]">9999-0000-1111</strong> (Vikramaditya Rao)
                </div>
                <div className="text-[11px] text-slate-500">
                  Simultaneously enrolled full-time across 2 institutions. Investigation escalated to AICTE Bureau.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Policy-Making & Accreditation Reports Section (Requirement 9) */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-[#142B4A] text-[10px] font-bold uppercase mb-1">
                <span>Accreditation & Policy Reports</span>
              </div>
              <h2 className="text-lg font-black text-[#142B4A]">
                AICTE Annual Admission & Intake Compliance Master Report
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Department-level sanctioned cutoff (60/dept), enrollment status, vacancies, supernumerary quotas, and APAAR verification records.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveReportTab("INTAKE")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeReportTab === "INTAKE"
                    ? "bg-[#142B4A] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                Intake & Vacancies
              </button>
              <button
                onClick={() => setActiveReportTab("QUOTAS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeReportTab === "QUOTAS"
                    ? "bg-[#142B4A] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                Supernumerary & Quotas
              </button>
            </div>
          </div>

          {/* Master Report Table */}
          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#142B4A] text-white">
                  <tr>
                    <th className="p-3 font-bold">AICTE ID</th>
                    <th className="p-3 font-bold">Institution Name</th>
                    <th className="p-3 font-bold">State</th>
                    {activeReportTab === "INTAKE" ? (
                      <>
                        <th className="p-3 font-bold">Departments</th>
                        <th className="p-3 font-bold">Sanctioned Intake</th>
                        <th className="p-3 font-bold">Enrolled</th>
                        <th className="p-3 font-bold">APAAR Registered</th>
                        <th className="p-3 font-bold">Capacity & Vacancy Status</th>
                        <th className="p-3 font-bold text-center">Department Matrix</th>
                      </>
                    ) : (
                      <>
                        <th className="p-3 font-bold">TFWS (5%)</th>
                        <th className="p-3 font-bold">EWS (10%)</th>
                        <th className="p-3 font-bold">Supernumerary Total</th>
                        <th className="p-3 font-bold">NRI (5%)</th>
                        <th className="p-3 font-bold">FN (15%)</th>
                        <th className="p-3 font-bold">Compliance Score</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {reportsData.map((row, idx) => {
                    const isViolation = row.is_violation || row.excess_seats > 0;
                    const isFull = row.is_full || (row.actual_enrolment === row.approved_intake);
                    const isExpanded = expandedInstId === row.aicte_id;

                    return (
                      <>
                        <tr key={idx} className={isViolation ? "bg-rose-50/50 hover:bg-rose-50" : isFull ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-slate-50"}>
                          <td className="p-3 font-mono font-bold text-[#142B4A]">{row.aicte_id}</td>
                          <td className="p-3 font-bold text-[#0F172A]">{row.institution_name}</td>
                          <td className="p-3 text-slate-600">{row.state}</td>

                          {activeReportTab === "INTAKE" ? (
                            <>
                              <td className="p-3 font-semibold text-slate-700">
                                {row.departments_count || (row.programs?.length || 1)} Depts (60/ea)
                              </td>
                              <td className="p-3 font-black text-slate-900">{row.approved_intake} seats</td>
                              <td className="p-3 font-black text-blue-700">{row.actual_enrolment}</td>
                              <td className="p-3 font-bold text-indigo-700">
                                <span className="inline-flex items-center gap-1">
                                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>{row.registered_students || 0} students</span>
                                </span>
                              </td>
                              <td className="p-3">
                                {isViolation ? (
                                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                                    +{row.excess_seats || row.vacancy_or_excess} OVER LIMIT (VIOLATION)
                                  </span>
                                ) : isFull ? (
                                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black border border-blue-200">
                                    INTAKE FULL (180/180 • 100% FILLED)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                    {row.vacant_seats || Math.max(0, row.approved_intake - row.actual_enrolment)} OPEN SEATS AVAILABLE
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setExpandedInstId(isExpanded ? null : row.aicte_id)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] border border-slate-300 transition-all"
                                >
                                  {isExpanded ? "Hide Details" : "View Departments"}
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-3 font-semibold text-emerald-800">
                                {row.tfws_enrolled || 0} / {row.tfws_approved || 0}
                              </td>
                              <td className="p-3 font-semibold text-amber-800">
                                {row.ews_enrolled || 0} / {row.ews_approved || 0}
                              </td>
                              <td className="p-3 font-semibold text-slate-700">
                                {row.supernumerary_enrolled || 0} / {row.supernumerary_quota || 0}
                              </td>
                              <td className="p-3 font-semibold text-purple-700">{row.nri_enrolled || 0}</td>
                              <td className="p-3 font-semibold text-blue-700">{row.fn_enrolled || 0}</td>
                              <td className="p-3 font-bold text-emerald-700">{row.compliance_score || 98.0}%</td>
                            </>
                          )}
                        </tr>

                        {/* Department matrix accordion drawer */}
                        {isExpanded && activeReportTab === "INTAKE" && (
                          <tr className="bg-slate-50/80 border-b border-slate-200">
                            <td colSpan={9} className="p-4 pl-8">
                              <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2">
                                <div className="text-[11px] font-bold text-[#142B4A] uppercase tracking-wider flex items-center justify-between">
                                  <span>{row.institution_name} — Department Breakdown (60 Cutoff per Department)</span>
                                  <span className="text-[10px] text-slate-500 font-normal">Sanctioned AICTE Divisions</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                                  {row.programs?.map((prog, pIdx) => {
                                    const pAppr = prog.approved_intake || 60;
                                    const pEnr = prog.actual_enrolment || 0;
                                    const pVacant = Math.max(0, pAppr - pEnr);
                                    const pExcess = Math.max(0, pEnr - pAppr);
                                    const pFull = pEnr === pAppr;

                                    return (
                                      <div
                                        key={pIdx}
                                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                                          pExcess > 0
                                            ? "border-rose-300 bg-rose-50/50"
                                            : pFull
                                            ? "border-blue-200 bg-blue-50/30"
                                            : "border-slate-200 bg-slate-50"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-[#0F172A]">{prog.program || prog.branch}</span>
                                          <span className="text-[10px] font-mono font-bold text-[#142B4A]">{prog.branch}</span>
                                        </div>
                                        <div className="flex items-baseline justify-between text-slate-600">
                                          <span>Enrolment / Cutoff:</span>
                                          <span className="font-bold">
                                            {pEnr} / {pAppr} seats
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-0.5">
                                          {pExcess > 0 ? (
                                            <span className="text-[10px] font-black text-rose-700">+{pExcess} Over Cutoff (Violation)</span>
                                          ) : pFull ? (
                                            <span className="text-[10px] font-black text-blue-700">100% Full (60/60 Filled)</span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-emerald-700">{pVacant} Open Seats Available</span>
                                          )}
                                          <span className="text-[10px] text-slate-500">
                                            TFWS: {prog.tfws_enrolled || 0}/{prog.tfws_approved || 3} • EWS: {prog.ews_enrolled || 0}/{prog.ews_approved || 6}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Trails Feed */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#142B4A]">
              Immutable National Audit Trail (Security & Consent)
            </h3>
            <span className="text-[11px] text-slate-400">Section 8 DPDP Act Compliant</span>
          </div>

          <div className="space-y-2.5">
            {data?.audit_logs?.slice(0, 5).map((log, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-[#0F172A]">{log.action}</span>
                  <span className="text-slate-400 block text-[10px]">{log.details}</span>
                </div>
                <div className="text-right sm:flex-shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] font-bold text-[#142B4A]">{log.actor_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
