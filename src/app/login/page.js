"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  LogIn,
  QrCode,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  GitPullRequest,
  FileCheck2,
  AlertTriangle,
  Award
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRoleTab, setSelectedRoleTab] = useState("OPERATOR"); // 'OPERATOR' | 'VERIFIER' | 'REVIEWER' | 'ADMIN'
  const [email, setEmail] = useState("operator@dtu.ac.in");
  const [password, setPassword] = useState("operator123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authorityPresets = [
    {
      key: "OPERATOR",
      name: "College Operator",
      badge: "Level 1",
      email: "operator@dtu.ac.in",
      pass: "operator123",
      icon: GitPullRequest,
      desc: "Submits student data & fixes records returned with remarks.",
      destination: "/workflow"
    },
    {
      key: "VERIFIER",
      name: "Institution Verifier",
      badge: "Level 2",
      email: "verifier@dtu.ac.in",
      pass: "verifier123",
      icon: FileCheck2,
      desc: "Dean/Faculty verifies marksheets, approves or flags suspicious cases.",
      destination: "/workflow"
    },
    {
      key: "REVIEWER",
      name: "Authorized Reviewer",
      badge: "Level 3",
      email: "reviewer@aicte.gov.in",
      pass: "reviewer123",
      icon: AlertTriangle,
      desc: "AICTE Grievance Cell resolves dual-enrollment fraud & disputes.",
      destination: "/workflow"
    },
    {
      key: "ADMIN",
      name: "AICTE Central Admin",
      badge: "Level 4 (HQ)",
      email: "admin@aicte.gov.in",
      pass: "admin123",
      icon: Award,
      desc: "National registry oversight & final cryptographic AICTE seal.",
      destination: "/workflow"
    }
  ];

  const handleSelectRole = (p) => {
    setSelectedRoleTab(p.key);
    setEmail(p.email);
    setPassword(p.pass);
    setError("");
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Try the 1-click authority buttons.");
      } else {
        router.push("/workflow");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOneClick = async (preset) => {
    setEmail(preset.email);
    setPassword(preset.pass);
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: preset.email,
      password: preset.pass,
    });

    if (!res?.error) {
      router.push(preset.destination);
      router.refresh();
    } else {
      setError("Login failed with preset.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Top Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#142B4A] text-[#22D3EE] p-2.5 mx-auto mb-3 shadow-sm flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#22D3EE]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
            AICTE Authority Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
            Role-Based Access for College Data Operators, Institution Verifiers, Authorized Reviewers, and AICTE Central Administrators.
          </p>
        </div>

        {/* 1. STUDENT AUTHENTICATION CALLOUT: Scan APAAR ID */}
        <div className="bg-white border border-[#22D3EE]/60 rounded-2xl p-5 text-center shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#142B4A] uppercase tracking-widest mb-1">
            <QrCode className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Student Gateway</span>
          </div>
          <h3 className="text-sm font-extrabold text-[#142B4A] mb-1">
            Are you a student verifying your identity?
          </h3>
          <p className="text-xs text-slate-600 mb-3.5 max-w-md mx-auto">
            No password required! Students authenticate instantly by scanning their APAAR ID QR card via camera or image upload.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4 text-[#22D3EE]" />
            <span>Authenticate via Student APAAR Scanner</span>
          </Link>
        </div>

        {/* 2. DIFFERENT LOGINS FOR DIFFERENT LEVEL OF AUTHORITIES */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Select Authority Level (1-Click Switcher for SIH Evaluators)</span>
            </div>
            <span className="text-[10px] text-[#142B4A] font-bold bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">4 Authority Tiers</span>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            {authorityPresets.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedRoleTab === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handleSelectRole(p)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-50 border-[#142B4A] ring-2 ring-[#142B4A]/10 shadow-sm"
                      : "bg-white border-[#E2E8F0] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{p.badge}</span>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#142B4A]" : "text-slate-400"}`} />
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.email}</div>
                </button>
              );
            })}
          </div>

          {/* Active Role Description Banner */}
          {(() => {
            const current = authorityPresets.find(p => p.key === selectedRoleTab) || authorityPresets[0];
            return (
              <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-[#142B4A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Selected: {current.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#142B4A] font-mono border border-[#E2E8F0]">
                      {current.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{current.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickOneClick(current)}
                  className="px-3.5 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs flex-shrink-0 shadow-sm transition-all"
                >
                  1-Click Sign In
                </button>
              </div>
            );
          })()}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Manual Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Official Authority Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@dtu.ac.in"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>{loading ? "Authenticating Authority..." : `Sign In as ${authorityPresets.find(p => p.key === selectedRoleTab)?.name || "Officer"}`}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
