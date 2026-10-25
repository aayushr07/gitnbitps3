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
  RefreshCw
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, instRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/api/analytics"),
        fetch("http://127.0.0.1:5000/api/institutions")
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setData(aData.analytics);
      }
      if (instRes.ok) {
        const iData = await instRes.json();
        setInstitutions(iData.institutions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE Central Monitoring Bureau</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Institutional Compliance & Fraud Sentinel
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Cross-institutional audit reports, dual-enrollment fraud detection, and ABC credit trends.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#142B4A] text-xs font-bold flex items-center gap-2 shadow-sm self-start transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#142B4A] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Total APAAR Registered</span>
              <Users className="w-4 h-4 text-[#142B4A]" />
            </div>
            <div className="text-3xl font-black text-[#142B4A]">
              {data?.total_students || 7}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>100% Digital Identity Onboarding</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">AICTE Compliance Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {data?.compliance_rate || 98.4}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {data?.verified_count || 5} verified records
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Academic Bank Credits</span>
              <Award className="w-4 h-4 text-[#142B4A]" />
            </div>
            <div className="text-3xl font-black text-[#142B4A]">
              {data?.total_abc_credits || 636}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Avg {data?.avg_credits || 90.8} credits / student
            </div>
          </div>

          <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-sm bg-rose-50/30">
            <div className="flex items-center justify-between text-rose-800 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Fraud & Dual Enrollments</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-rose-600">
              {data?.flagged_fraud_count || 1}
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">
              Investigation Pending
            </div>
          </div>
        </div>

        {/* Dual Enrollment Fraud Alerts Callout Box */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-rose-950">Active AICTE Fraud & Dual Enrollment Alerts</h3>
          </div>
          <p className="text-xs text-rose-800 mb-4 leading-relaxed">
            AICTE algorithms continuously cross-reference APAAR IDs against nationwide college admission rosters to prevent duplicate seat locking and fraudulent scholarship claims.
          </p>

          <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#142B4A] font-bold">9999-0000-1111</span>
                <span className="font-bold text-[#0F172A]">— Vikramaditya Rao</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold">
                DUAL SEAT FRAUD
              </span>
            </div>
            <p className="text-slate-600">
              Student APAAR ID flagged active simultaneously at:
              <strong className="text-[#0F172A]"> Apex Institute of Tech (ID: 1-99887766)</strong> and
              <strong className="text-[#0F172A]"> Skyline College (ID: 1-33291044)</strong>.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px]">
              <Link
                href="/scan?apaar=9999-0000-1111"
                className="text-[#142B4A] hover:underline font-bold"
              >
                Inspect Record in Scanner &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Grid: Institutions & Branch Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Participating Institutions */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#142B4A]" />
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  AICTE Approved Institutions Roster
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{institutions.length} Institutes</span>
            </div>

            <div className="space-y-2.5">
              {institutions.map((inst) => (
                <div
                  key={inst.aicte_id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#0F172A]">{inst.name}</div>
                    <div className="text-[10px] text-slate-500">
                      Code: <span className="font-mono font-bold text-[#142B4A]">{inst.aicte_id}</span> • {inst.state}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-black">{inst.compliance_score}%</span>
                    <span className="text-[10px] text-slate-400 block">Compliance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Distribution */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-[#142B4A]" />
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Program & Branch Distribution
                </h3>
              </div>

              <div className="space-y-3">
                {Object.entries(data?.branch_distribution || { CSE: 3, "AI & DS": 1, ENTC: 1, EE: 1, ME: 1 }).map(([branch, count]) => {
                  const percent = Math.round((count / (data?.total_students || 7)) * 100);
                  return (
                    <div key={branch} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-[#0F172A]">{branch}</span>
                        <span className="text-slate-500">{count} Students ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#E2E8F0]">
                        <div
                          className="h-full bg-[#142B4A] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-500">
              <span>National Academic Depository (NAD) Synced</span>
              <Link href="/students" className="text-[#142B4A] hover:underline font-bold">
                Manage All Records &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
