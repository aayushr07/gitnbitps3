"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  Camera,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  GraduationCap,
  Award,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Clock,
  Fingerprint,
  Printer,
  Globe2
} from "lucide-react";

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Scanning State
  const [activeTab, setActiveTab] = useState("manual"); // 'camera' | 'upload' | 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [selectedVerifier, setSelectedVerifier] = useState("Tata Consultancy Services (HR Campus Hiring)");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const html5QrCodeRef = useRef(null);

  // Demo cards for 1-click testing
  const demoProfiles = [
    {
      id: "9283-4710-8521",
      name: "Aarav Sharma",
      inst: "Delhi Technological University",
      type: "valid",
      badge: "Regular Intake (Valid)",
      color: "border-emerald-300 bg-emerald-50 text-emerald-800"
    },
    {
      id: "8412-9034-1187",
      name: "Priya Patel",
      inst: "VJTI Mumbai",
      type: "valid",
      badge: "Supernumerary TFW (Valid)",
      color: "border-cyan-300 bg-cyan-50 text-cyan-800"
    },
    {
      id: "6671-2299-4411",
      name: "Aiman Rahman",
      inst: "COEP Pune",
      type: "valid",
      badge: "Foreign National (FN Valid)",
      color: "border-blue-300 bg-blue-50 text-blue-800"
    },
    {
      id: "9999-0000-1111",
      name: "Vikramaditya Rao",
      inst: "Apex Institute [Disputed]",
      type: "fraud",
      badge: "Excess & Dual Enrolment Fraud",
      color: "border-rose-300 bg-rose-50 text-rose-800"
    }
  ];

  useEffect(() => {
    const qApaar = searchParams.get("apaar");
    if (qApaar) {
      setManualInput(qApaar);
      performVerification(qApaar);
    }
    fetchRecentVerifications();
  }, [searchParams]);

  const fetchRecentVerifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/verifications?limit=5");
      if (res.ok) {
        const d = await res.json();
        setRecentScans(d.verifications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const performVerification = async (identifier) => {
    if (!identifier || !identifier.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/verify-apaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apaar_id: identifier.trim(),
          verifier: selectedVerifier,
          purpose: "Stakeholder Employment / Regulatory Verification"
        }),
      });

      const data = await res.json();
      setResult(data);
      fetchRecentVerifications();
    } catch (err) {
      setResult({
        success: false,
        message: "Network error connecting to AICTE Verification API.",
        status: "CONNECTION_FAILED"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    performVerification(manualInput);
  };

  // Camera QR Scanning
  const startCamera = async () => {
    setCameraError("");
    setCameraActive(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          stopCamera();
          setManualInput(decodedText);
          performVerification(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setCameraError("Camera unavailable or permission denied. Use Manual Entry or 1-Click Profiles.");
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {}
      setCameraActive(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE Authorized Stakeholder Verification Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Authentic Student Identity Verification
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Secure real-time verification of student academic credentials for AICTE, Institutions, Employers, and Regulatory Bodies.
            </p>
          </div>

          {/* Stakeholder Verifier Persona */}
          <div className="bg-white border border-[#E2E8F0] p-2 rounded-2xl shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 pl-2">Verifier Role:</span>
            <select
              value={selectedVerifier}
              onChange={(e) => setSelectedVerifier(e.target.value)}
              className="bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#142B4A] focus:outline-none focus:border-[#142B4A]"
            >
              <option value="Tata Consultancy Services (HR Campus Hiring)">Tata Consultancy Services (TCS Employer)</option>
              <option value="Infosys Campus Verification Bureau">Infosys Campus Verification Bureau</option>
              <option value="University Grants Commission (UGC Regulatory Inspection)">UGC Regulatory Body Inspection</option>
              <option value="AICTE Central Admission Oversight">AICTE Central Oversight Cell</option>
            </select>
          </div>
        </div>

        {/* 1-Click Quick Demo Profiles for Evaluators */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
            <span>1-Click SIH Evaluator Test Profiles:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setManualInput(p.id);
                  performVerification(p.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${p.color}`}
              >
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] font-mono font-semibold">{p.id}</div>
                <div className="text-[9px] mt-1 font-bold">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Verification Interaction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Verification Scanner Inputs */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Input Method Switcher */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-1.5 flex gap-1 shadow-sm">
              <button
                onClick={() => {
                  setActiveTab("manual");
                  stopCamera();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "manual" ? "bg-[#142B4A] text-white" : "text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search ID</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("camera");
                  startCamera();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "camera" ? "bg-[#142B4A] text-white" : "text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera QR</span>
              </button>
            </div>

            {/* Manual Entry Form */}
            {activeTab === "manual" && (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">
                      Enter 12-Digit APAAR ID or Student ID
                    </label>
                    <input
                      type="text"
                      required
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. 9283-4710-8521 or DTU/2022/CSE/001"
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-xs font-mono font-bold text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                    <span>{loading ? "Authenticating Against AICTE..." : "Authenticate Student Record"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Live Camera Scanner */}
            {activeTab === "camera" && (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3 text-center">
                <div id="reader" className="w-full rounded-xl overflow-hidden bg-slate-900 min-h-[260px] flex items-center justify-center text-white text-xs">
                  {!cameraActive && <p className="p-4 text-slate-400">Starting Camera Scanner...</p>}
                </div>
                {cameraError && (
                  <p className="text-xs text-rose-600 font-semibold">{cameraError}</p>
                )}
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  Stop Camera
                </button>
              </div>
            )}

            {/* Recent Verification Queries */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent Verification Audit Queries:</span>
              </h4>
              <div className="space-y-2">
                {recentScans.slice(0, 3).map((v, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-[11px] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0F172A] block">{v.student_name}</span>
                      <span className="font-mono text-slate-400 text-[10px]">{v.apaar_id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      v.status === "SUCCESS_VERIFIED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {v.status === "SUCCESS_VERIFIED" ? "AUTHENTIC" : "FLAGGED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Verifiable Credential Result Display */}
          <div className="lg:col-span-7">
            {result ? (
              <div className={`bg-white border-2 rounded-3xl p-6 sm:p-7 shadow-md space-y-5 ${
                result.verified ? "border-emerald-500" : "border-rose-500"
              }`}>
                
                {/* Result Header & Digital Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      result.verified ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {result.verified ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                        result.verified ? "text-emerald-700" : "text-rose-700"
                      }`}>
                        {result.verified ? "AICTE Cryptographically Authenticated" : "Verification Anomaly Alert"}
                      </span>
                      <h3 className="text-lg font-black text-[#0F172A]">
                        {result.student?.full_name || "Unverified Record"}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black self-start ${
                    result.verified
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}>
                    {result.status}
                  </span>
                </div>

                {/* Cryptographic SHA-256 Seal Banner */}
                {result.cryptographic_seal && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs font-mono flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Cryptographic Seal:</span>
                    <span className="text-[10px] font-bold text-[#142B4A] truncate max-w-[280px]">
                      {result.cryptographic_seal}
                    </span>
                  </div>
                )}

                {/* Student Full Record Data */}
                {result.student && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      
                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">APAAR ID</span>
                        <span className="text-sm font-mono font-black text-[#142B4A] block mt-0.5">
                          {result.student.apaar_id}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Student ID / Roll No</span>
                        <span className="text-sm font-mono font-black text-[#0F172A] block mt-0.5">
                          {result.student.student_id || "NOT ASSIGNED"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Institution</span>
                        <span className="font-bold text-[#0F172A] block mt-0.5">{result.student.institution}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Code: {result.student.aicte_id}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Program & Branch</span>
                        <span className="font-bold text-[#0F172A] block mt-0.5">{result.student.program}</span>
                        <span className="text-[10px] text-slate-500">Year: {result.student.admission_year}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Intake Quota & Category</span>
                        <span className="font-bold text-[#142B4A] block mt-0.5">
                          {result.student.supernumerary_seat
                            ? `Supernumerary: ${result.student.supernumerary_type}`
                            : result.student.nri_category && result.student.nri_category !== "Not Applicable"
                            ? `NRI: ${result.student.nri_category}`
                            : result.student.foreign_national_status
                            ? `FN (${result.student.passport_country})`
                            : "Regular Sanctioned Intake"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Credits (ABC)</span>
                        <span className="font-bold text-emerald-700 block mt-0.5">
                          {result.student.abc_credits_total || 0} Credits (CGPA: {result.student.cgpa || "—"})
                        </span>
                      </div>

                    </div>

                    {/* Fraud / Compliance Notes */}
                    {result.student.compliance_notes && (
                      <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                        result.verified ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
                      }`}>
                        <strong>Audit Assessment:</strong> {result.student.compliance_notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/student/${encodeURIComponent(result.student.apaar_id)}`}
                        className="px-5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
                      >
                        <Award className="w-4 h-4 text-[#22D3EE]" />
                        <span>View & Print Official Degree Certificate</span>
                      </Link>

                      <span className="text-[11px] text-slate-400 font-mono">
                        Query ID: {result.verification_log?.id || "VER-CURRENT"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center shadow-sm space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShieldCheck className="w-8 h-8 text-[#142B4A]" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Awaiting Verification Query
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Scan a student&apos;s physical/digital APAAR QR code or enter their 12-digit APAAR ID to retrieve authentic academic records.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Scanner...</div>}>
      <ScanContent />
    </Suspense>
  );
}
