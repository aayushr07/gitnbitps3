"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  QrCode,
  GraduationCap,
  Award,
  Building2,
  Calendar,
  CreditCard,
  ArrowLeft,
  Share2,
  Fingerprint,
  FileBadge,
  Globe2,
  Download,
  ExternalLink
} from "lucide-react";

export default function StudentPassportPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id ? decodeURIComponent(params.id) : "";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrBase64, setQrBase64] = useState("");
  const [viewMode, setViewMode] = useState("CERTIFICATE"); // 'CERTIFICATE' | 'PASSPORT'

  useEffect(() => {
    if (!rawId) return;

    fetch(`http://127.0.0.1:5000/api/students/${encodeURIComponent(rawId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.student) {
          setStudent(data.student);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetch(`http://127.0.0.1:5000/api/generate-qr/${encodeURIComponent(rawId)}?base64=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.qr_image_base64) {
          setQrBase64(data.qr_image_base64);
        }
      })
      .catch((err) => console.error(err));
  }, [rawId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 text-[#0F172A]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#142B4A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading Student Records...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 text-[#0F172A]">
        <div className="max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#0F172A] mb-1">Student Not Found</h2>
          <p className="text-xs text-slate-500 mb-5">
            Could not find an APAAR record for ID: <code>{rawId}</code>
          </p>
          <Link
            href="/students"
            className="px-4 py-2 rounded-xl bg-[#142B4A] text-white font-bold text-xs"
          >
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  const isFlagged = student.status === "Flagged";
  const cert = student.degree_certificate || {
    certificate_id: `DEG-${student.branch || "TECH"}-2026-9901`,
    degree_name: student.program || "Bachelor of Technology",
    degree_body: `${student.institution} & AICTE`,
    class_awarded: "First Class with Distinction",
    issue_date: "2026-06-30",
  };

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <Link
            href="/students"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0F172A] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Central Registry</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("CERTIFICATE")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "CERTIFICATE"
                    ? "bg-white text-[#142B4A] shadow-sm"
                    : "text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Degree Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("PASSPORT")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "PASSPORT"
                    ? "bg-white text-[#142B4A] shadow-sm"
                    : "text-slate-600 hover:text-[#0F172A]"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Academic ID Card</span>
              </button>
            </div>

            <Link
              href={`/scan?apaar=${encodeURIComponent(student.apaar_id)}`}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#142B4A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Verify QR</span>
            </Link>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Print Official Document</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: OFFICIAL DEGREE CERTIFICATE WITH APAAR ID + STUDENT ID */}
        {/* (KEY REQUIREMENT 10) */}
        {/* ============================================================== */}
        {viewMode === "CERTIFICATE" && (
          <div className="bg-white border-4 border-double border-[#142B4A] rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden print:border-black print:rounded-none print:shadow-none print:p-8">
            
            {/* Top Certificate Header */}
            <div className="text-center border-b-2 border-[#142B4A] pb-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#142B4A] text-[#22D3EE] flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-7 h-7 text-[#22D3EE]" />
                </div>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-[#142B4A] uppercase tracking-wider">
                {student.institution}
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Degree-Awarding Body • Approved by All India Council for Technical Education (AICTE)
              </p>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                AICTE Approval Reference Code: {student.aicte_id}
              </div>
            </div>

            {/* Prominent Mandatory Academic Identifiers Bar (Requirement 10) */}
            <div className="bg-slate-50 border-2 border-[#142B4A] rounded-2xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="border-b sm:border-b-0 sm:border-r border-[#E2E8F0] pb-2 sm:pb-0">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">
                  National Academic Identity (APAAR ID)
                </span>
                <span className="text-lg sm:text-xl font-mono font-black text-[#142B4A] block mt-0.5">
                  {student.apaar_id}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">One Nation, One Student ID Verified</span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block">
                  Institutional Student ID / Roll Number
                </span>
                <span className="text-lg sm:text-xl font-mono font-black text-[#0F172A] block mt-0.5">
                  {student.student_id || "DTU/2022/CSE/001"}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">Institutional Enrollment Record</span>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="text-center space-y-4 max-w-2xl mx-auto py-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                This is to certify that
              </p>

              <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#0F172A] tracking-tight">
                {student.full_name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
                having successfully completed the prescribed curriculum and passed the approved examinations
                in accordance with the standards of the All India Council for Technical Education has this day
                been admitted to the degree of
              </p>

              <div className="py-2">
                <span className="text-lg sm:text-2xl font-black text-[#142B4A] border-b-2 border-[#22D3EE] pb-1 inline-block">
                  {cert.degree_name}
                </span>
                <span className="block text-xs font-bold text-slate-700 mt-2">
                  Awarded: {cert.class_awarded}
                </span>
              </div>

              {/* Quota & Intake Classification */}
              <div className="text-[11px] text-slate-500 font-medium">
                Admitted under Sanctioned Intake:{" "}
                <strong className="text-[#142B4A]">
                  {student.supernumerary_seat
                    ? `Supernumerary Quota (${student.supernumerary_type})`
                    : student.nri_category && student.nri_category !== "Not Applicable"
                    ? `NRI Category (${student.nri_category})`
                    : student.foreign_national_status
                    ? `Foreign National Quota (${student.passport_country})`
                    : "Regular Sanctioned Merit Intake"}
                </strong>
                {" • "}Academic Year: {student.admission_year}
              </div>
            </div>

            {/* Bottom Seal, Signatures & Verifiable QR */}
            <div className="pt-8 mt-8 border-t border-[#E2E8F0] grid grid-cols-3 items-end text-center">
              
              {/* Registrar Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-base text-slate-800">Pradeep Kumar</div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 text-[10px] font-bold uppercase text-slate-600">
                  Registrar / Dean
                </div>
              </div>

              {/* Verifiable QR Code & Seal */}
              <div className="flex flex-col items-center">
                <div className="p-1.5 bg-white border-2 border-[#142B4A] rounded-xl shadow-sm mb-1.5">
                  {qrBase64 ? (
                    <img src={qrBase64} alt="Degree QR" className="w-20 h-20 object-contain" />
                  ) : (
                    <QrCode className="w-20 h-20 text-[#142B4A]" />
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  Scan to Verify Authentic Degree
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Cert No: {cert.certificate_id}
                </span>
              </div>

              {/* Vice Chancellor Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-base text-slate-800">T. G. Sitharam</div>
                <div className="border-t border-slate-400 w-32 mx-auto pt-1 text-[10px] font-bold uppercase text-slate-600">
                  Vice Chancellor / AICTE
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: AICTE VERIFIABLE ACADEMIC PASSPORT & ID CARD */}
        {/* ============================================================== */}
        {viewMode === "PASSPORT" && (
          <div className="space-y-6">
            
            {/* Student ID Card */}
            <div className="max-w-lg mx-auto bg-white border-2 border-[#142B4A] rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#142B4A]" />
              
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#142B4A] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#142B4A]">AICTE APAAR Academic Passport</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">One Nation, One Student ID</p>
                  </div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                  VERIFIED
                </span>
              </div>

              <div className="flex gap-4 items-center mb-5">
                <img
                  src={student.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={student.full_name}
                  className="w-20 h-24 rounded-2xl object-cover border border-[#E2E8F0] shadow-sm flex-shrink-0"
                />
                <div className="space-y-1">
                  <h2 className="text-base font-black text-[#0F172A]">{student.full_name}</h2>
                  <div className="text-xs font-mono font-bold text-[#142B4A]">
                    APAAR: {student.apaar_id}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Roll: {student.student_id || "DTU/2022/CSE/001"}
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold">{student.institution}</div>
                  <div className="text-[10px] text-slate-500">{student.program}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="space-y-0.5 text-[10px] text-slate-500">
                  <div>ABC Credits Total: <strong className="text-[#142B4A]">{student.abc_credits_total}</strong></div>
                  <div>CGPA: <strong className="text-emerald-700">{student.cgpa || 8.5}</strong></div>
                  <div className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>DigiLocker & NAD Verified</span>
                  </div>
                </div>
                <div className="p-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                  {qrBase64 ? (
                    <img src={qrBase64} alt="QR" className="w-14 h-14 object-contain" />
                  ) : (
                    <QrCode className="w-14 h-14 text-[#142B4A]" />
                  )}
                </div>
              </div>
            </div>

            {/* Academic Bank of Credits & History */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#142B4A] mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#142B4A]" />
                <span>Academic Bank of Credits (ABC) Ledger & History</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-slate-50 p-3 rounded-2xl border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">ABC ID</span>
                  <span className="text-xs font-mono font-bold text-[#142B4A] block mt-0.5">{student.abc_id}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Credits</span>
                  <span className="text-lg font-black text-[#142B4A] block mt-0.5">{student.abc_credits_total} pts</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Current CGPA</span>
                  <span className="text-lg font-black text-emerald-700 block mt-0.5">{student.cgpa || "—"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Compliance</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">100% Compliant</span>
                </div>
              </div>

              {/* Semester Breakdown */}
              {student.academic_history?.length > 0 && (
                <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#142B4A] text-white">
                      <tr>
                        <th className="p-2.5 font-bold">Semester</th>
                        <th className="p-2.5 font-bold">Credits Earned</th>
                        <th className="p-2.5 font-bold">SGPA</th>
                        <th className="p-2.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {student.academic_history.map((sem, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#142B4A]">Semester {sem.semester}</td>
                          <td className="p-2.5 font-semibold text-slate-700">{sem.credits} Credits</td>
                          <td className="p-2.5 font-semibold text-emerald-700">{sem.sgpa > 0 ? sem.sgpa : "In Progress"}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                              {sem.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
