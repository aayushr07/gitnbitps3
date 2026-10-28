"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/config/api";
import {
  QrCode,
  ShieldCheck,
  Users,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building2,
  UploadCloud,
  FileCheck2,
  FileSpreadsheet,
  Globe2,
  Award,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState("");
  const [stats, setStats] = useState({
    total_students: 8,
    verified_count: 7,
    flagged_fraud_count: 1,
    total_approved_intake: 840,
    total_actual_enrolment: 818,
    intake_utilization_rate: 97.4,
    tfws_count: 1,
    ews_count: 1,
    supernumerary_count: 3,
    nri_count: 1,
    oci_count: 1,
    fn_count: 1,
    excess_intake_violations: 1,
    compliance_rate: 87.5,
  });

  useEffect(() => {
    fetch(API_ENDPOINTS.analytics)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.analytics) {
          setStats(data.analytics);
        }
      })
      .catch(() => {});
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    router.push(`/scan?apaar=${encodeURIComponent(quickInput.trim())}`);
  };

  const flowSteps = [
    {
      num: "01",
      title: "Institution Intake",
      desc: "Institutions manage AICTE Approved Intake, supernumerary quotas & programs",
      href: "/institution",
      icon: Building2
    },
    {
      num: "02",
      title: "Data Upload",
      desc: "Post-admission upload with Approved Intake, NRI, OCI, FN & Supernumerary fields",
      href: "/institution",
      icon: UploadCloud
    },
    {
      num: "03",
      title: "APAAR Validation",
      desc: "Automated engine checks format, duplicates, and admissions exceeding intake",
      href: "/institution",
      icon: FileCheck2
    },
    {
      num: "04",
      title: "Central Repository",
      desc: "National master student registry using APAAR ID as unique academic identifier",
      href: "/students",
      icon: Users
    },
    {
      num: "05",
      title: "Monitoring & Sentinel",
      desc: "Real-time intake monitoring, excess admission anomaly detection & policy reports",
      href: "/analytics",
      icon: BarChart3
    },
    {
      num: "06",
      title: "Authorized Verification",
      desc: "Tamper-proof credential verification for AICTE, employers & regulatory bodies",
      href: "/scan",
      icon: QrCode
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] text-[#0A2947]">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-white border-b border-[#D3D4C0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E4C9]/70 border border-[#D3D4C0] text-[#0A2947] text-xs font-bold mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-pulse" />
            <span>AICTE National Academic Identity Initiative • One Nation, One Student ID</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A2947] mb-4 leading-tight">
            Integrated APAAR Student Data <br />
            <span className="text-[#8B5E3C]">Management & Verification Platform</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
            A unified digital ecosystem enabling AICTE-approved institutions to securely submit student-level data 
            with APAAR ID, real-time intake compliance monitoring, excess enrolment anomaly detection, 
            and tamper-proof stakeholder verification.
          </p>

          {/* Quick Search Box */}
          <div className="max-w-xl mx-auto mb-6">
            <form onSubmit={handleQuickSearch} className="relative flex items-center shadow-xs">
              <div className="absolute left-4 text-slate-400">
                <Search className="w-5 h-5 text-[#0A2947]" />
              </div>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter 12-digit APAAR ID or Student ID (e.g. 9283-4710-8521)..."
                className="w-full bg-[#FAF8F5] border-2 border-[#D3D4C0] focus:border-[#8B5E3C] rounded-2xl py-3.5 pl-12 pr-28 text-xs sm:text-sm text-[#0A2947] placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#0A2947] hover:bg-[#8B5E3C] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F3E4C9]" />
              </button>
            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Quick Demo Records:</span>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=9283-4710-8521")}
                className="px-2.5 py-1 rounded-lg bg-[#F3E4C9]/60 border border-[#D3D4C0] text-[#0A2947] hover:bg-[#F3E4C9] transition-colors flex items-center gap-1 font-bold text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-[#8B5E3C]" />
                <span>Aarav (Regular Merit)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=8412-9034-1187")}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D3D4C0] text-[#0A2947] hover:bg-[#F3E4C9]/60 transition-colors flex items-center gap-1 font-bold text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-[#8B5E3C]" />
                <span>Priya (Supernumerary TFW)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=6671-2299-4411")}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D3D4C0] text-[#0A2947] hover:bg-[#F3E4C9]/60 transition-colors flex items-center gap-1 font-bold text-[11px]"
              >
                <Globe2 className="w-3 h-3 text-[#0A2947]" />
                <span>Aiman (Foreign National)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=9999-0000-1111")}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1 font-bold text-[11px]"
              >
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Vikram (Excess & Dual Flag)</span>
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/institution"
              className="px-5 py-2.5 rounded-xl bg-[#0A2947] hover:bg-[#8B5E3C] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-[#F3E4C9]" />
              <span>Institution Portal & Upload</span>
            </Link>
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#D3D4C0] hover:border-[#8B5E3C] text-[#0A2947] font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-[#0A2947]" />
              <span>AICTE Central Repository</span>
            </Link>
            <Link
              href="/analytics"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#D3D4C0] hover:border-[#8B5E3C] text-[#0A2947] font-bold text-xs shadow-xs flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-[#8B5E3C]" />
              <span>Admission Monitoring & Alerts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-Time AICTE National Metrics Bar */}
      <section className="bg-[#F3E4C9]/30 border-b border-[#D3D4C0] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-white p-3.5 rounded-xl border border-[#D3D4C0] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Students</span>
              <span className="text-xl font-black text-[#0A2947]">{stats.total_students || 19}</span>
              <span className="text-[10px] text-[#8B5E3C] font-semibold block mt-0.5">APAAR Linked</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D3D4C0] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Approved Intake</span>
              <span className="text-xl font-black text-[#0A2947]">{stats.total_approved_intake?.toLocaleString() || "840"}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Sanctioned Seats (60/dept)</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D3D4C0] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Actual Enrolment</span>
              <span className="text-xl font-black text-[#0A2947]">{stats.total_actual_enrolment?.toLocaleString() || "815"}</span>
              <span className="text-[10px] text-[#8B5E3C] font-semibold block mt-0.5">{stats.intake_utilization_rate || 97.0}% Utilized</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D3D4C0] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Supernumerary</span>
              <span className="text-xl font-black text-[#8B5E3C]">{stats.supernumerary_count || 3}</span>
              <span className="text-[10px] text-[#8B5E3C] font-semibold block mt-0.5">TFW, EWS, Sports</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D3D4C0] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">International / NRI</span>
              <span className="text-xl font-black text-[#0A2947]">{(stats.nri_count || 1) + (stats.fn_count || 1) + (stats.oci_count || 1)}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">NRI / OCI / FN</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-rose-600 block">Excess Violations</span>
              <span className="text-xl font-black text-rose-700">{stats.excess_intake_violations || 1}</span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Over-Admit Flags</span>
            </div>

          </div>
        </div>
      </section>

      {/* End-to-End Expected Solution Flow (Interactive Architecture) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E4C9] border border-[#D3D4C0] text-[#8B5E3C] text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>End-to-End System Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A2947]">
            AICTE Student Data Management Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-1">
            Structured 6-stage lifecycle from institutional post-admission upload to automated validation, 
            intake capacity enforcement, and authorized stakeholder verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                href={step.href}
                className="group bg-white border border-[#D3D4C0] hover:border-[#8B5E3C] rounded-2xl p-6 transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#F3E4C9] bg-[#0A2947] px-2.5 py-1 rounded-lg">
                      STAGE {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] group-hover:bg-[#F3E4C9]/60 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-[#0A2947] group-hover:text-[#8B5E3C]" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#0A2947] group-hover:text-[#8B5E3C] transition-colors mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D3D4C0]/50 flex items-center justify-between text-xs font-bold text-[#0A2947]">
                  <span>Explore Stage</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[#8B5E3C] transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Key Requirements Highlights */}
      <section className="bg-white border-t border-[#D3D4C0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#0A2947]">
              Platform Capabilities Aligned with AICTE Norms
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Engineered to replace fragmented statistical reporting with authentic, verifiable student-level data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D3D4C0]">
              <div className="w-8 h-8 rounded-lg bg-[#0A2947] text-[#F3E4C9] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 h-4 text-[#F3E4C9]" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2947] mb-1">Standardized Data Schema</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory data fields for Approved Intake, Actual Enrolment, Supernumerary Seats (TFW, EWS, Sports), 
                NRI Category, OCI Status, and Foreign National (FN) details linked with APAAR ID.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D3D4C0]">
              <div className="w-8 h-8 rounded-lg bg-[#0A2947] text-[#F3E4C9] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-[#F3E4C9]" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2947] mb-1">Automated Validation Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time anomaly sentinel identifying duplicate student records, invalid APAAR IDs, 
                admissions exceeding approved intake, and cross-institutional dual-enrolment fraud.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D3D4C0]">
              <div className="w-8 h-8 rounded-lg bg-[#0A2947] text-[#F3E4C9] flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-[#F3E4C9]" />
              </div>
              <h3 className="text-sm font-bold text-[#0A2947] mb-1">Verifiable Academic Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tamper-proof verifiable records and degree certificates with prominent display of APAAR ID 
                along with Institutional Student ID and cryptographic QR verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
