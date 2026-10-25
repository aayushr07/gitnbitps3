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
  UserCheck,
  Clock,
  Fingerprint,
  X
} from "lucide-react";

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Scanning State
  const [activeTab, setActiveTab] = useState("camera"); // 'camera' | 'upload' | 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const html5QrCodeRef = useRef(null);

  // New Student AI Creator State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);
  const [newStudentForm, setNewStudentForm] = useState({
    full_name: "Priya Sharma",
    aadhaar_number: "5544-3322-1100",
    dob: "2004-06-15",
    gender: "Female",
    email: "priya.sharma24@dtu.ac.in",
    phone: "+91 98110 33445",
    institution: "Delhi Technological University",
    aicte_id: "1-33271891",
    program: "B.Tech Computer Science & Engineering",
    branch: "CSE",
    admission_year: 2024,
    current_semester: 1,
    student_consent: true,
    document_uploaded: true,
    document_name: "Class_XII_CBSE_Marksheet.pdf"
  });

  // Demo cards for 1-click testing
  const demoProfiles = [
    {
      id: "9283-4710-8521",
      name: "Aarav Sharma",
      inst: "Delhi Technological University (DTU)",
      branch: "CSE",
      type: "valid",
      badge: "Verified Student"
    },
    {
      id: "8412-9034-1187",
      name: "Priya Patel",
      inst: "VJTI Mumbai",
      branch: "AI & DS",
      type: "valid",
      badge: "Verified Student"
    },
    {
      id: "9999-0000-1111",
      name: "Vikramaditya Rao",
      inst: "Apex Institute [Disputed]",
      branch: "CSE",
      type: "fraud",
      badge: "Dual Enrollment Fraud"
    },
    {
      id: "5512-3390-7764",
      name: "Karthik Raja",
      inst: "PSG College of Technology",
      branch: "ME",
      type: "graduated",
      badge: "Graduated Alumni"
    }
  ];

  useEffect(() => {
    const qParam = searchParams.get("apaar");
    if (qParam) {
      setManualInput(qParam);
      performVerification(qParam);
    }
    fetchRecentVerifications();
  }, [searchParams]);

  const fetchRecentVerifications = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/verifications?limit=8");
      if (res.ok) {
        const data = await res.json();
        if (data.verifications) {
          setRecentScans(data.verifications);
        }
      }
    } catch (err) {}
  };

  const performVerification = async (payload) => {
    if (!payload || !payload.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/verify-apaar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apaar_id: payload.trim(),
          verifier: "AICTE Portal Gate / Exam Scanner"
        })
      });

      const data = await res.json();
      setResult(data);
      fetchRecentVerifications();
    } catch (err) {
      setResult({
        success: false,
        message: "Failed to connect to backend verification service. Ensure Flask is running on port 5000.",
        status: "ERROR"
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    setCameraError("");
    setCameraActive(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader-container");
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          stopCamera();
          performVerification(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setCameraError("Camera access denied or unsupported on this device. Use image upload or manual input.");
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && cameraActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {}
    }
    setCameraActive(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5Qr = new Html5Qrcode("qr-file-detector");
      const decodedText = await html5Qr.scanFile(file, true);
      html5Qr.clear();
      performVerification(decodedText);
    } catch (err) {
      setResult({
        success: false,
        message: "Could not detect a valid QR code in the uploaded image. Please try another clear image or enter ID manually.",
        status: "SCAN_FAILED"
      });
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    performVerification(manualInput);
  };

  const handleCreateApaarWithAi = async (e) => {
    if (e) e.preventDefault();
    if (!newStudentForm.student_consent) {
      alert("Mandatory Consent: Please authorize Aadhaar demographic verification under AICTE guidelines.");
      return;
    }
    setAiLoading(true);
    setAiNotice(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/ai-verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStudentForm,
          auto_enroll: true
        })
      });

      const data = await res.json();
      if (data.success && data.verified && data.apaar_id) {
        setShowAiModal(false);
        setManualInput(data.apaar_id);
        performVerification(data.apaar_id);
      } else {
        setAiNotice({
          status: data.status,
          score: data.ai_trust_score,
          message: data.message || "AI detected discrepancy or missing mandatory documents.",
          flags: data.report?.flags || [],
          workflow_id: data.workflow_record?.workflow_id || "WF-PENDING"
        });
      }
    } catch (err) {
      alert("Error contacting AI Verification service: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <QrCode className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Major Authentication Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Student APAAR ID Scanner & Authenticator
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Verify student academic identity, DigiLocker e-KYC, and Academic Bank of Credits in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <a
              href="https://apaar.education.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Create on Official APAAR Portal</span>
            </a>
            <a
              href="https://www.digilocker.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#0F172A] font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>DigiLocker Portal</span>
            </a>
            <button
              onClick={() => {
                setShowAiModal(true);
                setAiNotice(null);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#142B4A] font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AI Simulator</span>
            </button>
          </div>
        </div>

        {/* 1-Click Evaluation Presets */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#142B4A] flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Quick Demo Profiles (Evaluator 1-Click Test)</span>
            </span>
            <span className="text-[11px] text-slate-500">Click any card to simulate instant scan</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setManualInput(p.id);
                  performVerification(p.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all hover:shadow-sm flex flex-col justify-between ${
                  p.type === "fraud"
                    ? "bg-rose-50 border-rose-200 hover:bg-rose-100/70"
                    : "bg-white border-[#E2E8F0] hover:border-[#142B4A]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.type === "fraud"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}>
                    {p.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">{p.branch}</span>
                </div>
                <div className="font-bold text-[#0F172A] text-sm">{p.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{p.inst}</div>
                <div className="mt-2 pt-2 border-t border-[#E2E8F0] text-[10px] font-mono font-bold text-[#142B4A]">
                  {p.id}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Scanner Section & Result Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Scanner Tools */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
              
              {/* Tab Selector */}
              <div className="flex border-b border-[#E2E8F0] bg-slate-50 p-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("camera");
                    stopCamera();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "camera"
                      ? "bg-[#142B4A] text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-[#0F172A] hover:bg-white"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Live Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("upload");
                    stopCamera();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "upload"
                      ? "bg-[#142B4A] text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-[#0F172A] hover:bg-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("manual");
                    stopCamera();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === "manual"
                      ? "bg-[#142B4A] text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-[#0F172A] hover:bg-white"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Manual ID</span>
                </button>
              </div>

              {/* Tab Content 1: Live Camera */}
              {activeTab === "camera" && (
                <div className="p-6 text-center">
                  <div
                    id="qr-reader-container"
                    className="w-full min-h-[260px] bg-slate-50 rounded-xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    {!cameraActive ? (
                      <div className="p-6 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center mb-3 shadow-sm">
                          <QrCode className="w-7 h-7 text-[#142B4A]" />
                        </div>
                        <h4 className="font-bold text-[#0F172A] text-sm mb-1">
                          Camera Scanner Ready
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs mb-4">
                          Point your webcam or phone camera at the student’s APAAR card QR code.
                        </p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4 text-[#22D3EE]" />
                          <span>Start Camera Scanner</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="absolute top-3 right-3 z-20 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow"
                        >
                          Stop Camera
                        </button>
                      </div>
                    )}
                  </div>
                  {cameraError && (
                    <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Upload Image */}
              {activeTab === "upload" && (
                <div className="p-6">
                  <div id="qr-file-detector" className="hidden" />
                  <label className="w-full min-h-[260px] bg-slate-50 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#142B4A] cursor-pointer flex flex-col items-center justify-center p-6 transition-all group">
                    <div className="w-14 h-14 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-[#142B4A]" />
                    </div>
                    <span className="font-bold text-[#0F172A] text-sm mb-1">
                      Upload APAAR Card or QR Image
                    </span>
                    <span className="text-xs text-slate-500 text-center max-w-xs mb-3">
                      Accepts PNG, JPG, or screenshot of student&apos;s digital APAAR card
                    </span>
                    <span className="text-[11px] px-3.5 py-1.5 rounded-lg bg-[#142B4A] text-white font-bold">
                      Browse Files
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Tab Content 3: Manual Input */}
              {activeTab === "manual" && (
                <div className="p-6">
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                        Enter 12-Digit APAAR ID / Token
                      </label>
                      <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="e.g. 9283-4710-8521"
                        className="w-full bg-slate-50 border border-[#E2E8F0] focus:border-[#142B4A] rounded-xl p-3 text-[#0F172A] text-sm font-mono placeholder-slate-400 focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Format: 12 numeric digits or formatted with hyphens.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !manualInput.trim()}
                      className="w-full py-3 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify APAAR ID"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Recent Scans Widget */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Recent Verification Activity</span>
                </span>
                <button
                  type="button"
                  onClick={fetchRecentVerifications}
                  className="text-slate-400 hover:text-[#0F172A]"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {recentScans.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-4">No recent scans logged</div>
                ) : (
                  recentScans.map((log, i) => (
                    <div
                      key={log.id || i}
                      className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {log.status === "SUCCESS_VERIFIED" || log.status === "SUCCESS" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <div className="font-bold text-[#0F172A] truncate">
                            {log.student_name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {log.apaar_id}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status === "SUCCESS_VERIFIED" || log.status === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}>
                        {log.status === "SUCCESS_VERIFIED" || log.status === "SUCCESS" ? "PASS" : "FLAG"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Verification Result Panel */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="h-full min-h-[400px] bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <RefreshCw className="w-10 h-10 text-[#142B4A] animate-spin mb-4" />
                <h3 className="text-base font-bold text-[#0F172A] mb-1">Querying National APAAR Registry</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Validating cryptographic token, DigiLocker e-KYC record, and Academic Bank of Credits...
                </p>
              </div>
            ) : result?.student ? (
              /* Verified Student Profile Display */
              <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
                
                {/* Result Header Banner */}
                <div className={`p-6 border-b ${
                  result.status === "Flagged" || result.code === "ALERT_FRAUD_FLAGGED"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-950"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        result.status === "Flagged" || result.code === "ALERT_FRAUD_FLAGGED"
                          ? "bg-rose-100 text-rose-700 border border-rose-300"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      }`}>
                        {result.status === "Flagged" || result.code === "ALERT_FRAUD_FLAGGED" ? (
                          <AlertTriangle className="w-7 h-7" />
                        ) : (
                          <ShieldCheck className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                            Authentication Status
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            result.status === "Flagged" || result.code === "ALERT_FRAUD_FLAGGED"
                              ? "bg-rose-600 text-white"
                              : "bg-emerald-600 text-white"
                          }`}>
                            {result.status === "Flagged" ? "ALERT: FRAUD DETECTED" : "VERIFIED & AUTHENTICATED"}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5">
                          {result.student.full_name}
                        </h2>
                      </div>
                    </div>

                    <Link
                      href={`/student/${encodeURIComponent(result.student.apaar_id)}`}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#142B4A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm self-start"
                    >
                      <span>Full Passport & Card</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
                    </Link>
                  </div>

                  {/* Fraud Alert Callout */}
                  {(result.status === "Flagged" || result.code === "ALERT_FRAUD_FLAGGED") && (
                    <div className="mt-4 p-3.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-0.5">
                          DUAL-ENROLLMENT OR COMPLIANCE WARNING:
                        </strong>
                        <span>{result.student.compliance_notes || "Duplicate registration detected in another AICTE institution."}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Student Details Grid */}
                <div className="p-6 space-y-6">
                  
                  {/* Photo & Primary Identifiers */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-slate-50 p-4 rounded-2xl border border-[#E2E8F0]">
                    <img
                      src={result.student.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                      alt={result.student.full_name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-sm"
                    />
                    <div className="space-y-1.5 text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="font-mono text-sm font-extrabold text-[#142B4A] bg-white px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                          APAAR: {result.student.apaar_id}
                        </span>
                        <span className="font-mono text-xs text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-semibold">
                          {result.student.abc_id}
                        </span>
                        {result.student.ai_verification_report ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-[#22D3EE] bg-cyan-50 text-[#142B4A] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#22D3EE]" />
                            <span>{result.student.ai_verification_report.trust_score}% AI Verified</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aadhaar e-KYC Pass</span>
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-[#0F172A] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span>{result.student.institution}</span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                        <span>{result.student.program}</span>
                        <span>•</span>
                        <span>Sem {result.student.current_semester}</span>
                        <span>•</span>
                        <span className="text-[#142B4A] font-bold">CGPA: {result.student.cgpa}</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Verification Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                        DigiLocker KYC
                      </div>
                      <div className="text-xs font-black text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{result.student.kyc_status}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                        ABC Credits
                      </div>
                      <div className="text-xs font-black text-[#142B4A]">
                        {result.student.abc_credits_total} Credits
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                        AICTE Institute ID
                      </div>
                      <div className="text-xs font-black text-blue-900 font-mono">
                        {result.student.aicte_id}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                        Biometric Auth
                      </div>
                      <div className="text-xs font-black text-purple-800 flex items-center justify-center gap-1">
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span>{result.student.biometric_verified ? "Matched 99%" : "Pending"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Credits Breakdown */}
                  {result.student.academic_history?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#142B4A]" />
                        <span>Verified Semester Progression</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {result.student.academic_history.map((sem) => (
                          <div
                            key={sem.semester}
                            className="bg-slate-50 border border-[#E2E8F0] p-2.5 rounded-xl text-xs flex justify-between items-center"
                          >
                            <span className="font-bold text-[#0F172A]">Sem {sem.semester}</span>
                            <div className="text-right">
                              <span className="text-[#142B4A] font-bold">{sem.credits} Cr</span>
                              {sem.sgpa > 0 && (
                                <span className="text-[10px] text-slate-500 block">
                                  SGPA: {sem.sgpa}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Hash Proof */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                    <span>Cryptographic Seal: {result.security_hash || "SHA256:VERIFIED"}</span>
                    <span>AICTE National Node #04</span>
                  </div>
                </div>
              </div>
            ) : result?.status === "NOT_FOUND" ? (
              /* Not Found Card with Direct Official Link & AI Generator CTA */
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center shadow-sm space-y-4">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">APAAR Record Not Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {result.message || "No verified student matched the supplied APAAR ID in the AICTE registry."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <a
                    href="https://apaar.education.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Create on Official APAAR Portal</span>
                  </a>
                  <a
                    href="https://www.digilocker.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#0F172A] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
                    <span>DigiLocker Portal</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAiModal(true);
                      setAiNotice(null);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-[#142B4A] hover:bg-slate-200 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
                    <span>AI Simulator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setManualInput("9283-4710-8521");
                      performVerification("9283-4710-8521");
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs"
                  >
                    Try Sample Verified ID
                  </button>
                </div>
              </div>
            ) : (
              /* Idle Standby Display */
              <div className="h-full min-h-[440px] bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-[#142B4A] mb-4">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-1">Student Identity & APAAR Scanner</h3>
                <p className="text-xs text-slate-500 max-w-sm mb-5">
                  Scan your student APAAR QR card or enter your 12-digit ID. If you do not have an APAAR ID yet, generate one on the official Government portal or DigiLocker.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href="https://apaar.education.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Create on Official APAAR Portal</span>
                  </a>
                  <a
                    href="https://www.digilocker.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#0F172A] font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
                    <span>DigiLocker Portal</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowAiModal(true);
                      setAiNotice(null);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#142B4A] font-bold text-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#142B4A]" />
                    <span>AI Simulator</span>
                  </button>
                  <button
                    onClick={() => {
                      setManualInput("9283-4710-8521");
                      performVerification("9283-4710-8521");
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs"
                  >
                    Demo: Aarav Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Automated AI APAAR Creation for New Students */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-[#0F172A] my-8">
              <button
                onClick={() => setShowAiModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#142B4A] text-[#22D3EE] flex items-center justify-center font-bold">
                  <ExternalLink className="w-5 h-5 text-[#22D3EE]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#142B4A]">
                    Create Official APAAR ID
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official Government of India gateways for One Nation, One Student ID issuance & DigiLocker e-KYC.
                  </p>
                </div>
              </div>

              {/* Direct Government Portals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#142B4A]">Official APAAR Portal</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">MoE Portal</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ministry of Education national portal for student registration and ABC card generation.
                    </p>
                  </div>
                  <a
                    href="https://apaar.education.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Visit apaar.education.gov.in</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#142B4A]">DigiLocker Portal</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">e-KYC Verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Generate your APAAR ID through Aadhaar OTP and store it directly in your digital wallet.
                    </p>
                  </div>
                  <a
                    href="https://www.digilocker.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#142B4A] text-[#0F172A] font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Visit digilocker.gov.in</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#142B4A]" />
                  </a>
                </div>
              </div>

              {/* Instructions banner */}
              <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 mb-4 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Workflow:</strong> Create your ID on DigiLocker or the official APAAR portal. Once generated, return here and enter your 12-digit ID to view your student profile.
                </span>
              </div>

              {/* In-App SIH AI Pre-Enrollment Engine */}
              <div className="pt-3 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#142B4A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Campus AI Pre-Enrollment & Discrepancy Engine</span>
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                    SIH Demo Sandbox
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Simulate local institutional onboarding with AI multi-factor authentication and automatic routing to the Admin Panel.
                </p>

              {/* AI Discrepancy Notice if verification failed */}
              {aiNotice && (
                <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 text-[11px] text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>AI Verification Flagged (Routed to Admin Panel):</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">{aiNotice.message}</p>
                  {(aiNotice.flags || []).length > 0 && (
                    <div className="text-[10px] text-rose-800 font-semibold pt-1 border-t border-amber-200">
                      Discrepancies: {aiNotice.flags.join(" • ")}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-600 pt-1">
                    Your record has been forwarded to the <strong>Institution & AICTE Admin Panel</strong> for manual review. Case Ref: <span className="font-mono font-bold text-[#142B4A]">{aiNotice.workflow_id}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateApaarWithAi} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Full Legal Name (as per 10th / Aadhaar) *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.full_name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">12-Digit Aadhaar / VID *</label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.aadhaar_number}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, aadhaar_number: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 font-mono text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newStudentForm.dob}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Institution</label>
                    <input
                      type="text"
                      value={newStudentForm.institution}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, institution: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0F172A] mb-1">Branch</label>
                    <input
                      type="text"
                      value={newStudentForm.branch}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, branch: e.target.value })}
                      className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-2.5 text-[#0F172A] focus:outline-none focus:border-[#142B4A]"
                    />
                  </div>
                </div>

                {/* Mandatory Consent Box */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-[#142B4A]/30">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStudentForm.student_consent}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, student_consent: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-[#142B4A] focus:ring-[#142B4A]"
                    />
                    <div className="text-[11px] text-[#0F172A] leading-relaxed">
                      <strong className="text-[#142B4A]">Student Consent Authorization:</strong>
                      <span className="text-slate-600 block mt-0.5">
                        I hereby provide consent under the Aadhaar Act 2016 and AICTE DigiLocker Policy for demographic verification and issuance of my APAAR ID.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-[#22D3EE] ${aiLoading ? "animate-spin" : ""}`} />
                    <span>{aiLoading ? "Running AI Multi-Factor Engine..." : "Create & Authenticate with AI"}</span>
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 bg-slate-50 text-slate-600">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#142B4A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading APAAR Scanner...</p>
          </div>
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}
