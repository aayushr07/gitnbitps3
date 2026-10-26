"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Lock,
  ExternalLink,
  Award,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState("");
  const [stats, setStats] = useState({
    total_students: 7,
    verified_count: 6,
    flagged_fraud_count: 1,
    total_approved_intake: 2760,
    total_actual_enrolment: 2754,
    intake_utilization_rate: 99.8,
    supernumerary_count: 3,
    nri_count: 1,
    oci_count: 1,
    fn_count: 1,
    excess_intake_violations: 1,
    compliance_rate: 98.4,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/analytics")
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
    <div className="flex-1 flex flex-col bg-slate-50 text-[#0F172A]">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-[#E2E8F0] text-[#142B4A] text-xs font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            <span>AICTE National Academic Identity Initiative • One Nation, One Student ID</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#142B4A] mb-4 leading-tight">
            Integrated APAAR Student Data <br />
            <span className="text-[#0F172A]">Management & Verification Platform</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
            A unified digital ecosystem enabling AICTE-approved institutions to securely submit student-level data 
            with APAAR ID, real-time intake compliance monitoring, excess enrolment anomaly detection, 
            and tamper-proof stakeholder verification.
          </p>

          {/* Quick Search Box */}
          <div className="max-w-xl mx-auto mb-6">
            <form onSubmit={handleQuickSearch} className="relative flex items-center shadow-sm">
              <div className="absolute left-4 text-slate-400">
                <Search className="w-5 h-5 text-[#142B4A]" />
              </div>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter 12-digit APAAR ID or Student ID (e.g. 9283-4710-8521)..."
                className="w-full bg-slate-50 border-2 border-[#E2E8F0] focus:border-[#142B4A] rounded-2xl py-3.5 pl-12 pr-28 text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
              </button>
            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Quick Demo Records:</span>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=9283-4710-8521")}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 font-semibold text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Aarav (Regular Merit)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=8412-9034-1187")}
                className="px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-100 transition-colors flex items-center gap-1 font-semibold text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                <span>Priya (Supernumerary TFW)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=6671-2299-4411")}
                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1 font-semibold text-[11px]"
              >
                <Globe2 className="w-3 h-3 text-blue-600" />
                <span>Aiman (Foreign National)</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/scan?apaar=9999-0000-1111")}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1 font-semibold text-[11px]"
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
              className="px-5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-[#22D3EE]" />
              <span>Institution Portal & Upload</span>
            </Link>
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#142B4A] font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4 text-[#142B4A]" />
              <span>AICTE Central Repository</span>
            </Link>
            <Link
              href="/analytics"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#142B4A] font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Admission Monitoring & Alerts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-Time AICTE National Metrics Bar */}
      <section className="bg-slate-100/80 border-b border-[#E2E8F0] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Students</span>
              <span className="text-xl font-black text-[#142B4A]">{stats.total_students || 7}</span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">APAAR Linked</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Approved Intake</span>
              <span className="text-xl font-black text-[#142B4A]">{stats.total_approved_intake?.toLocaleString() || "2,760"}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Sanctioned Seats</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Actual Enrolment</span>
              <span className="text-xl font-black text-blue-700">{stats.total_actual_enrolment?.toLocaleString() || "2,754"}</span>
              <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">{stats.intake_utilization_rate || 99.8}% Utilized</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Supernumerary</span>
              <span className="text-xl font-black text-cyan-700">{stats.supernumerary_count || 3}</span>
              <span className="text-[10px] text-cyan-600 font-semibold block mt-0.5">TFW, EWS, Sports</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">International / NRI</span>
              <span className="text-xl font-black text-purple-700">{(stats.nri_count || 1) + (stats.fn_count || 1) + (stats.oci_count || 1)}</span>
              <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">NRI / OCI / FN</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 shadow-sm">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#142B4A] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>End-to-End System Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
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
                className="group bg-white border border-[#E2E8F0] hover:border-[#142B4A] rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-[#22D3EE] bg-[#142B4A] px-2.5 py-1 rounded-lg">
                      STAGE {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-cyan-50 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-[#142B4A] group-hover:text-[#22D3EE]" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#142B4A] transition-colors mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#142B4A]">
                  <span>Explore Stage</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Key Requirements Highlights */}
      <section className="bg-white border-t border-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#142B4A]">
              Platform Capabilities Aligned with AICTE Norms
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Engineered to replace fragmented statistical reporting with authentic, verifiable student-level data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#142B4A] text-[#22D3EE] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Standardized Data Schema</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory data fields for Approved Intake, Actual Enrolment, Supernumerary Seats (TFW, EWS, Sports), 
                NRI Category, OCI Status, and Foreign National (FN) details linked with APAAR ID.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#142B4A] text-[#22D3EE] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Automated Validation Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time anomaly sentinel identifying duplicate student records, invalid APAAR IDs, 
                admissions exceeding approved intake, and cross-institutional dual-enrolment fraud.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#142B4A] text-[#22D3EE] flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-[#22D3EE]" />
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Verifiable Academic Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tamper-proof verifiable records and degree certificates with prominent display of APAAR ID 
                along with Institutional Student ID and cryptographic QR verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0F172A] text-slate-400 py-6 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AICTE APAAR Platform</span>
            <span>• Ministry of Education • Government of India</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/institution" className="hover:text-white transition-colors">Institution Portal</Link>
            <Link href="/students" className="hover:text-white transition-colors">Central Repository</Link>
            <Link href="/analytics" className="hover:text-white transition-colors">Intake Monitoring</Link>
            <Link href="/scan" className="hover:text-white transition-colors">Stakeholder Scanner</Link>
            <Link href="/integration" className="hover:text-white transition-colors">ERP API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
