"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  LogIn,
  QrCode,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Users,
  CheckCircle2,
  Building2,
  ExternalLink
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Active Login Mode: 'STUDENT' | 'ADMIN'
  const [loginMode, setLoginMode] = useState("STUDENT");

  // Student Input
  const [studentApaar, setStudentApaar] = useState("9283-4710-8521");
  const [studentError, setStudentError] = useState("");

  // Admin Input
  const [adminEmail, setAdminEmail] = useState("admin@aicte.gov.in");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!studentApaar.trim()) {
      setStudentError("Please enter your 12-digit APAAR ID.");
      return;
    }
    router.push(`/scan?apaar=${encodeURIComponent(studentApaar.trim())}`);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: adminEmail,
        password: adminPassword,
      });

      if (res?.error) {
        setAdminError("Invalid credentials. Try 1-Click Admin Access.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setAdminError("An unexpected error occurred during sign-in.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleQuickAdminAccess = async () => {
    setAdminEmail("admin@aicte.gov.in");
    setAdminPassword("admin123");
    setAdminLoading(true);
    setAdminError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: "admin@aicte.gov.in",
      password: "admin123",
    });

    if (!res?.error) {
      router.push("/admin");
      router.refresh();
    } else {
      setAdminError("Login failed.");
      setAdminLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full space-y-6">

        {/* Portal Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#142B4A] text-[#22D3EE] p-2.5 mx-auto mb-3 shadow-sm flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#22D3EE]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
            AICTE APAAR Portal Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Dedicated Student Portal for instant ID verification & Admin Panel for AI-failed verification approvals.
          </p>
        </div>

        {/* 2-Mode Selector (Student vs Admin) */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setLoginMode("STUDENT")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginMode === "STUDENT"
                ? "bg-white text-[#142B4A] shadow-sm"
                : "text-slate-600 hover:text-[#0F172A]"
            }`}
          >
            <QrCode className="w-4 h-4 text-[#22D3EE]" />
            <span>Student Portal (APAAR ID)</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMode("ADMIN")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              loginMode === "ADMIN"
                ? "bg-white text-[#142B4A] shadow-sm"
                : "text-slate-600 hover:text-[#0F172A]"
            }`}
          >
            <Building2 className="w-4 h-4 text-[#142B4A]" />
            <span>AICTE & Institute Admin Panel</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* OPTION 1: STUDENT GATEWAY (LOGIN WITH APAAR ID) */}
        {/* ============================================================== */}
        {loginMode === "STUDENT" && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#142B4A] block">
                Single Student Identity
              </span>
              <h2 className="text-lg font-black text-[#0F172A] mt-0.5">
                Login with Your APAAR ID
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                No passwords needed! Enter your 12-digit APAAR ID to view only your verified personal details and academic credit card.
              </p>
            </div>

            {studentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{studentError}</span>
              </div>
            )}

            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  12-Digit Student APAAR ID
                </label>
                <div className="relative">
                  <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={studentApaar}
                    onChange={(e) => {
                      setStudentApaar(e.target.value);
                      setStudentError("");
                    }}
                    placeholder="9283-4710-8521"
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>
              </div>

              {/* Sample Quick Fill Profiles */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 font-semibold">Demo IDs:</span>
                <button
                  type="button"
                  onClick={() => setStudentApaar("9283-4710-8521")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px]"
                >
                  Aarav (9283-4710-8521)
                </button>
                <button
                  type="button"
                  onClick={() => setStudentApaar("8412-9034-1187")}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px]"
                >
                  Priya (8412-9034-1187)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>View My Student Details & ABC Card</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
              </button>
            </form>

            {/* If Student Doesn't Have ID CTA */}
            <div className="pt-4 border-t border-[#E2E8F0] bg-slate-50 p-4 rounded-2xl text-center space-y-2.5">
              <div className="text-xs font-bold text-[#0F172A]">
                Don&apos;t have an APAAR ID yet?
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Create your official 12-digit APAAR ID through DigiLocker or the official Government of India portal:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <a
                  href="https://apaar.education.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Official APAAR Website (apaar.education.gov.in)</span>
                </a>
                <a
                  href="https://www.digilocker.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#0F172A] font-bold text-xs shadow-sm transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
                  <span>DigiLocker (digilocker.gov.in)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* OPTION 2: ADMIN PANEL LOGIN (INSTITUTION & AICTE) */}
        {/* ============================================================== */}
        {loginMode === "ADMIN" && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#142B4A] block">
                Institution & AICTE Administration
              </span>
              <h2 className="text-lg font-black text-[#0F172A] mt-0.5">
                Sign In to Admin Panel
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access manual resolution queue for records where AI detected verification failures or discrepancies.
              </p>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Official Administrative Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@aicte.gov.in"
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>{adminLoading ? "Authenticating..." : "Sign In to Admin Panel"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdminAccess}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#142B4A] font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
                  <span>1-Click Admin</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
