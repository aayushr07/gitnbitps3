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
  FileBadge
} from "lucide-react";

export default function StudentPassportPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id ? decodeURIComponent(params.id) : "";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrBase64, setQrBase64] = useState("");

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
          <p className="text-xs text-slate-500 font-semibold">Loading Student Passport...</p>
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

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-7">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/students"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0F172A] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Registry</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/scan?apaar=${encodeURIComponent(student.apaar_id)}`}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#142B4A] border border-[#E2E8F0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>Verify in Scanner</span>
            </Link>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Print Official Card</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OFFICIAL AICTE & APAAR STUDENT ID CARD */}
        {/* ============================================================== */}
        <div className="max-w-lg mx-auto bg-white border-2 border-[#142B4A] rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden print:border-black print:text-black print:bg-white">
          
          {/* Top Navy Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#142B4A]" />
          
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#142B4A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#142B4A]">
                  All India Council for Technical Education
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  APAAR • One Nation, One Student ID
                </p>
              </div>
            </div>

            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
              isFlagged
                ? "bg-rose-50 text-rose-800 border-rose-300"
                : "bg-emerald-50 text-emerald-800 border border-emerald-300"
            }`}>
              {isFlagged ? "FLAGGED" : "OFFICIAL ID"}
            </span>
          </div>

          {/* Student Photo & Primary Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-5">
            
            <div className="sm:col-span-4 flex flex-col items-center">
              <img
                src={student.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt={student.full_name}
                className="w-24 h-28 rounded-2xl object-cover border border-[#E2E8F0] shadow-sm"
              />
              <span className="mt-2 text-[10px] font-bold text-slate-500 font-mono">
                {student.blood_group ? `Blood: ${student.blood_group}` : "DigiLocker KYC"}
              </span>
            </div>

            <div className="sm:col-span-8 space-y-2 text-center sm:text-left">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                  {student.full_name}
                </h2>
                <div className="text-xs font-mono font-bold text-[#142B4A]">
                  APAAR: {student.apaar_id}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5">
                <div className="font-bold text-[#0F172A]">{student.institution}</div>
                <div className="text-slate-500 text-[11px]">{student.program}</div>
                <div className="text-slate-500 text-[11px]">
                  AICTE Institute Code: <strong className="text-[#0F172A] font-mono">{student.aicte_id}</strong>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono font-bold text-[#142B4A] border border-[#E2E8F0]">
                  {student.abc_id}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[11px] font-bold text-blue-900 border border-blue-200">
                  Credits: {student.abc_credits_total}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code & Security Stamp Footer */}
          <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="space-y-0.5 text-[10px] text-slate-500">
              <div>Govt of India • National Academic Depository (NAD)</div>
              <div className="font-mono text-slate-400">
                Token: {student.qr_token ? student.qr_token.slice(0, 22) + "..." : "APAAR-AUTH-SEC"}
              </div>
              <div className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>e-KYC & Biometric Match Verified</span>
              </div>
            </div>

            {/* Dynamic QR Code */}
            <div className="p-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex-shrink-0">
              {qrBase64 ? (
                <img
                  src={qrBase64}
                  alt="APAAR QR"
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <QrCode className="w-16 h-16 text-[#142B4A]" />
              )}
            </div>
          </div>
        </div>

        {/* Academic Details & ABC Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          
          {/* Card: Academic Progress */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-[#142B4A]" />
              <h3 className="text-base font-bold text-[#0F172A]">Academic Bank of Credits (ABC)</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#E2E8F0]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Credits</div>
                <div className="text-2xl font-black text-[#142B4A] mt-0.5">
                  {student.abc_credits_total}
                </div>
                <div className="text-[10px] text-slate-400">Degree Req: 160 Cr</div>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#E2E8F0]">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cumulative GPA</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {student.cgpa || "—"}
                </div>
                <div className="text-[10px] text-slate-400">Scale of 10.0</div>
              </div>
            </div>

            {/* Semester History Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Semester Breakdown
              </h4>
              {(student.academic_history || []).length === 0 ? (
                <div className="text-xs text-slate-400 py-3">No semester history recorded yet</div>
              ) : (
                student.academic_history.map((sem) => (
                  <div
                    key={sem.semester}
                    className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-[#0F172A]">Semester {sem.semester}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono">SGPA: {sem.sgpa || "—"}</span>
                      <span className="font-black text-[#142B4A]">{sem.credits} Credits</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {sem.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card: Online SWAYAM / NPTEL Credits */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#142B4A]" />
                <h3 className="text-base font-bold text-[#0F172A]">SWAYAM / NPTEL Transferred Credits</h3>
              </div>

              {(student.swayam_nptel_credits || []).length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0] text-xs text-slate-500 text-center">
                  No online MOOC credits transferred yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {student.swayam_nptel_credits.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-slate-50 border border-[#E2E8F0] text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-[#0F172A]">{c.course}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Cert ID: {c.certificate_id}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#142B4A] font-bold border border-blue-200">
                        +{c.credits} Cr
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AICTE Regulatory Notes */}
            <div className="pt-3 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                AICTE Regulatory Compliance & Notes
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-[#E2E8F0] leading-relaxed">
                {student.compliance_notes || "Fully compliant with AICTE curriculum guidelines and student retention norms."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
