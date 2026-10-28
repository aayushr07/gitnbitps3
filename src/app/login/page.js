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
  ExternalLink,
  Award,
  Globe2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Custom Input State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password: password,
      });

      if (res?.error) {
        setError("Invalid credentials. Try using one of the 1-Click Persona cards below.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (personaEmail, personaPassword, targetRoute = "/") => {
    setEmail(personaEmail);
    setPassword(personaPassword);
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: personaEmail,
      password: personaPassword,
    });

    if (!res?.error) {
      router.push(targetRoute);
      router.refresh();
    } else {
      setError("Persona login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] text-[#0A2947] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full space-y-6">

        {/* Portal Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0A2947] text-[#F3E4C9] p-2.5 mx-auto mb-3 shadow-xs flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#F3E4C9]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2947]">
            AICTE Stakeholder Authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Role-Based Access Control (RBAC) for AICTE Central Authorities, Institution Registrars, Employers & Students.
          </p>
        </div>

        {/* 1-Click Persona Cards for SIH Evaluators */}
        <div className="bg-white border border-[#D3D4C0] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#D3D4C0] pb-2.5 flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2947] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>1-Click SIH Evaluator Persona Switcher</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Auth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Persona 1: AICTE Central Admin */}
            <button
              type="button"
              onClick={() => handleQuickPersona("admin@aicte.gov.in", "admin123", "/analytics")}
              className="p-3.5 rounded-2xl border border-[#D3D4C0] hover:border-[#8B5E3C] bg-[#FAF8F5] hover:bg-[#F3E4C9]/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-[#0A2947] bg-[#F3E4C9] border border-[#D3D4C0] px-2 py-0.5 rounded-full">
                  AICTE Admin
                </span>
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="font-bold text-xs text-[#0A2947] group-hover:text-[#8B5E3C]">
                Prof. T. G. Sitharam
              </div>
              <div className="text-[10px] text-slate-500">AICTE Chairman / National Monitoring</div>
            </button>

            {/* Persona 2: Institution Registrar */}
            <button
              type="button"
              onClick={() => handleQuickPersona("registrar@dtu.ac.in", "verifier123", "/institution")}
              className="p-3.5 rounded-2xl border border-[#D3D4C0] hover:border-[#8B5E3C] bg-[#FAF8F5] hover:bg-[#F3E4C9]/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-[#0A2947] bg-[#F3E4C9] border border-[#D3D4C0] px-2 py-0.5 rounded-full">
                  Institution Registrar
                </span>
                <Building2 className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="font-bold text-xs text-[#0A2947] group-hover:text-[#8B5E3C]">
                Dr. Pradeep Kumar
              </div>
              <div className="text-[10px] text-slate-500">DTU Delhi / Post-Admission Upload</div>
            </button>

            {/* Persona 3: Authorized Employer / Verifier */}
            <button
              type="button"
              onClick={() => handleQuickPersona("verifier@tcs.com", "verifier123", "/scan")}
              className="p-3.5 rounded-2xl border border-[#D3D4C0] hover:border-[#8B5E3C] bg-[#FAF8F5] hover:bg-[#F3E4C9]/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-[#0A2947] bg-[#F3E4C9] border border-[#D3D4C0] px-2 py-0.5 rounded-full">
                  Authorized Verifier
                </span>
                <QrCode className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="font-bold text-xs text-[#0A2947] group-hover:text-[#8B5E3C]">
                Rajiv Nair (TCS HR)
              </div>
              <div className="text-[10px] text-slate-500">Employer / Stakeholder Verification</div>
            </button>

            {/* Persona 4: Student */}
            <button
              type="button"
              onClick={() => handleQuickPersona("student@dtu.ac.in", "student123", "/student/9283-4710-8521")}
              className="p-3.5 rounded-2xl border border-[#D3D4C0] hover:border-[#8B5E3C] bg-[#FAF8F5] hover:bg-[#F3E4C9]/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-[#0A2947] bg-[#F3E4C9] border border-[#D3D4C0] px-2 py-0.5 rounded-full">
                  Student Persona
                </span>
                <Award className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="font-bold text-xs text-[#0A2947] group-hover:text-[#8B5E3C]">
                Aarav Sharma
              </div>
              <div className="text-[10px] text-slate-500">Degree Certificate & APAAR Passport</div>
            </button>

          </div>
        </div>

        {/* Custom Login Form */}
        <div className="bg-white border border-[#D3D4C0] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-[#D3D4C0] pb-2">
            <span className="text-xs font-bold text-[#0A2947]">Or Sign In with Official Email</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#0A2947] mb-1">Official Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aicte.gov.in or registrar@dtu.ac.in"
                  className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A2947] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#0A2947] hover:bg-[#8B5E3C] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F3E4C9]" />
              <span>{loading ? "Authenticating..." : "Sign In with Credentials"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
