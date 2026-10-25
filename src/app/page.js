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
  ExternalLink,
  Award,
  BookOpen,
  GitPullRequest,
  Wand2,
  Check,
  Building2
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState("");
  const [stats, setStats] = useState({
    total_students: 7,
    verified_count: 5,
    flagged_fraud_count: 1,
    compliance_rate: 98.4,
    total_abc_credits: 636,
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

  const handleQuickDemoScan = (apaarId) => {
    router.push(`/scan?apaar=${encodeURIComponent(apaarId)}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-[#0F172A]">
      {/* Hero Section */}
      <section className="py-14 lg:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-[#E2E8F0] text-[#142B4A] text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
            <span>AICTE Smart India Hackathon • Problem Statement SIH26263</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#142B4A] mb-5 leading-tight">
            One Nation, One Student ID <br />
            <span className="text-[#0F172A] font-extrabold">
              APAAR Verification & Academic Data Platform
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base text-slate-600 mb-8 leading-relaxed">
            Centralized student data management, instant QR-based identity authentication, 
            multi-level verification workflow, and AI-powered pre-submission quality audit 
            for all AICTE-approved institutions.
          </p>

          {/* Quick Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <form onSubmit={handleQuickSearch} className="relative flex items-center shadow-sm">
              <div className="absolute left-4 text-slate-400">
                <Search className="w-5 h-5 text-[#142B4A]" />
              </div>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter 12-digit APAAR ID (e.g. 9283-4710-8521)..."
                className="w-full bg-slate-50 border-2 border-[#E2E8F0] focus:border-[#142B4A] rounded-2xl py-3.5 pl-12 pr-28 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
              </button>
            </form>

            {/* Quick 1-Click Demo Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Quick Demo:</span>
              <button
                type="button"
                onClick={() => handleQuickDemoScan("9283-4710-8521")}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aarav (CSE - Valid)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan("8412-9034-1187")}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1 font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Priya (AI&DS - Valid)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoScan("9999-0000-1111")}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 transition-colors flex items-center gap-1 font-semibold"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Vikram (Fraud Alert)</span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/students"
              className="px-6 py-3 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>AI New Student Verification</span>
            </Link>
            <Link
              href="/scan"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4 text-[#142B4A]" />
              <span>Open APAAR Scanner</span>
            </Link>
            <Link
              href="/workflow"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              <GitPullRequest className="w-4 h-4 text-[#142B4A]" />
              <span>Multi-Level Approval Pipeline</span>
            </Link>
            <Link
              href="/data-quality"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
            >
              <Wand2 className="w-4 h-4 text-[#142B4A]" />
              <span>AI Data Quality Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live AICTE Metric Highlights */}
      <section className="bg-slate-50 py-8 border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#142B4A] mb-1">
                {stats.total_students}+
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Registered Students
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">
                {stats.compliance_rate}%
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Compliance Rate
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#142B4A] mb-1">
                {stats.total_abc_credits}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Academic Bank Credits (ABC)
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-rose-600 mb-1">
                {stats.flagged_fraud_count}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Dual Enrollment Alerts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Pillars */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mb-2">
            Built for AICTE Higher Education Institutions
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Clean, modular features addressing student identity, approval workflows, and data hygiene.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-[#142B4A]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-2">Major Auth: APAAR Scanner</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Real-time camera scanner or image upload to authenticate APAAR cards at campus gates and exam centers in under 200ms.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B4A] hover:underline"
            >
              <span>Test Scanner</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <GitPullRequest className="w-6 h-6 text-[#142B4A]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-2">Multi-Level Workflow</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Structured 4-tier approval state machine across College Operator, Institution Verifier, Reviewer, and AICTE Admin.
            </p>
            <Link
              href="/workflow"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B4A] hover:underline"
            >
              <span>View Workflow</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-[#142B4A]" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-2">AI Data Quality Assistant</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Pre-submission sanitizer detecting format errors, college typos, and providing 1-click suggested corrections safely.
            </p>
            <Link
              href="/data-quality"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142B4A] hover:underline"
            >
              <span>Sanitize Records</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Verifiable ID Card Preview */}
      <section className="bg-white border-t border-[#E2E8F0] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-50 border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <span className="text-[11px] font-bold text-[#142B4A] uppercase tracking-wider">
                Official Credentialing
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#142B4A]">
                Cryptographic Verifiable Student ID Card
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generates official AICTE-stamped digital ID cards with dynamic cryptographic QR codes linking admissions, ABC credits, and DigiLocker verification.
              </p>
              <div className="pt-2">
                <Link
                  href="/student/9283-4710-8521"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#142B4A] text-white font-bold text-xs"
                >
                  <span>Preview Official ID Card</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm text-xs space-y-2 w-full md:w-80">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="font-bold text-[#142B4A]">AICTE Student Passport</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <div className="font-bold text-sm text-[#0F172A]">Aarav Sharma</div>
              <div className="font-mono text-xs font-bold text-[#142B4A]">APAAR: 9283-4710-8521</div>
              <div className="text-[11px] text-slate-500">Delhi Technological University (DTU)</div>
              <div className="text-[11px] text-slate-500">126 ABC Credits • CGPA: 8.94</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
