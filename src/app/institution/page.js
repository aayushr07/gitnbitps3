"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/config/api";
import {
  Building2,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Globe2,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
  Code2
} from "lucide-react";

export default function InstitutionPortalPage() {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstId, setSelectedInstId] = useState("1-33271891");
  const [activeTab, setActiveTab] = useState("UPLOAD"); // 'UPLOAD' | 'PROGRAMS' | 'BATCH'
  const [loading, setLoading] = useState(true);
  const [validationLoading, setValidationLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Single Student Registration Form
  const [singleForm, setSingleForm] = useState({
    apaar_id: "5512-8890-1122",
    student_id: "DTU/2024/CSE/055",
    full_name: "Ananya Mukherjee",
    dob: "2005-04-12",
    gender: "Female",
    email: "ananya.m@dtu.ac.in",
    phone: "+91 98110 55128",
    program: "B.Tech Computer Science & Engineering",
    branch: "CSE",
    admission_year: 2024,
    supernumerary_seat: true,
    supernumerary_type: "TFWS",
    tfws_eligible: true,
    family_annual_income: "₹3,80,000 / annum",
    ews_eligible: false,
    ews_certificate_no: "",
    nri_category: "Not Applicable",
    oci_status: false,
    oci_number: "",
    foreign_national_status: false,
    passport_country: "India",
    admission_category: "TFWS",
    admission_date: "2024-08-11",
    student_consent: true,
  });

  // Bulk Upload State
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [validationResults, setValidationResults] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4500);
  };

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.institutions);
      if (res.ok) {
        const data = await res.json();
        setInstitutions(data.institutions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentInstitution = institutions.find(
    (i) => i.aicte_id === selectedInstId
  ) || institutions[0] || {
    name: "Delhi Technological University",
    aicte_id: "1-33271891",
    state: "Delhi",
    approved_intake: 240,
    actual_enrolment: 224,
    registered_students: 4,
    programs: [
      { branch: "CSE", program: "B.Tech Computer Science & Engineering", approved_intake: 60, actual_enrolment: 58, tfws_approved: 3, tfws_enrolled: 2, ews_approved: 6, ews_enrolled: 4 },
      { branch: "AI & DS", program: "B.Tech Artificial Intelligence & Data Science", approved_intake: 60, actual_enrolment: 56, tfws_approved: 3, tfws_enrolled: 1, ews_approved: 6, ews_enrolled: 3 },
      { branch: "ME", program: "B.Tech Mechanical Engineering", approved_intake: 60, actual_enrolment: 54, tfws_approved: 3, tfws_enrolled: 1, ews_approved: 6, ews_enrolled: 2 },
      { branch: "EE", program: "B.Tech Electrical Engineering", approved_intake: 60, actual_enrolment: 56, tfws_approved: 3, tfws_enrolled: 1, ews_approved: 6, ews_enrolled: 2 },
    ]
  };

  const handleValidateSingle = async (e) => {
    e.preventDefault();
    setValidationLoading(true);
    setValidationResults(null);

    const recordToValidate = {
      ...singleForm,
      institution: currentInstitution?.name,
      aicte_id: currentInstitution?.aicte_id,
    };

    try {
      const res = await fetch(API_ENDPOINTS.institutionValidate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: recordToValidate,
          institution_id: currentInstitution?.aicte_id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setValidationResults({
          type: "SINGLE",
          validation: data.validation,
        });
        showToast("Automated APAAR & Intake validation completed.");
      }
    } catch (err) {
      showToast("Validation failed: Could not connect to validation engine.");
    } finally {
      setValidationLoading(false);
    }
  };

  const handleLoadSampleBatch = async () => {
    setValidationLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.sampleAdmissionBatch);
      const data = await res.json();
      if (data.records) {
        const valRes = await fetch(API_ENDPOINTS.institutionValidate, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            records: data.records,
            institution_id: currentInstitution?.aicte_id,
          }),
        });
        const valData = await valRes.json();
        setValidationResults({
          type: "BATCH",
          validation: valData.validation,
        });
        showToast(
          `Demo batch loaded: ${valData.validation.valid_count} compliant, ${valData.validation.flagged_count} flagged anomalies.`
        );
      }
    } catch (err) {
      showToast("Error loading demo batch.");
    } finally {
      setValidationLoading(false);
    }
  };

  const handleCommitValidRecords = async () => {
    if (!validationResults) return;
    setSubmitLoading(true);

    let recordsToCommit = [];
    if (validationResults.type === "SINGLE") {
      if (validationResults.validation?.is_valid) {
        recordsToCommit = [
          {
            ...singleForm,
            institution: currentInstitution?.name,
            aicte_id: currentInstitution?.aicte_id,
          },
        ];
      }
    } else if (validationResults.type === "BATCH") {
      recordsToCommit = validationResults.validation?.results
        ?.filter((r) => r.is_valid)
        ?.map((r) => ({
          ...r.record,
          institution: currentInstitution?.name,
          aicte_id: currentInstitution?.aicte_id,
        }));
    }

    if (!recordsToCommit || recordsToCommit.length === 0) {
      showToast("No valid records available to commit. Please resolve anomalies first.");
      setSubmitLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.institutionUpload, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: recordsToCommit,
          institution_id: currentInstitution?.aicte_id,
          user: {
            name: "Dr. Pradeep Kumar (Dean Academics)",
            role: "INSTITUTION_VERIFIER",
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Success: ${data.result?.saved_count} student(s) enrolled into AICTE Central Repository!`);
        fetchInstitutions();
        setValidationResults(null);
      }
    } catch (err) {
      showToast("Submission failed: Database connection error.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] text-[#0A2947] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A2947] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#D3D4C0] text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#F3E4C9]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header & Institution Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D3D4C0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E4C9]/70 text-[#0A2947] text-xs font-bold mb-2 border border-[#D3D4C0]">
              <Building2 className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>AICTE Approved Institution Admissions Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A2947]">
              Post-Admission Student Data Ingestion
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Upload and update authentic student records using APAAR ID as unique identifier with automated intake enforcement.
            </p>
          </div>

          {/* Active Institution Selector */}
          <div className="bg-white border border-[#D3D4C0] p-2 rounded-2xl shadow-xs flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 pl-2">Institution:</label>
            <select
              value={selectedInstId}
              onChange={(e) => {
                setSelectedInstId(e.target.value);
                setValidationResults(null);
              }}
              className="bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-1.5 text-xs font-bold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
            >
              {institutions.map((inst) => (
                <option key={inst.aicte_id} value={inst.aicte_id}>
                  {inst.name} ({inst.state}) {inst.intake_status === "VIOLATION_EXCESS_INTAKE" ? "⚠️ EXCESS" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Institution Intake Capacity & Quota Summary Cards */}
        {currentInstitution && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            {/* Approved Intake vs Actual */}
            <div className={`bg-white border rounded-2xl p-4 shadow-xs ${
              currentInstitution.actual_enrolment > currentInstitution.approved_intake 
                ? "border-rose-300 bg-rose-50/20" 
                : "border-[#D3D4C0]"
            }`}>
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">Sanctioned Intake</span>
                <Users className="w-4 h-4 text-[#0A2947]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-[#0A2947]">
                  {currentInstitution.actual_enrolment}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  / {currentInstitution.approved_intake} seats
                </span>
              </div>
              <div className="mt-2 w-full bg-[#FAF8F5] rounded-full h-1.5 overflow-hidden border border-[#D3D4C0]/40">
                <div
                  className={`h-full rounded-full transition-all ${
                    currentInstitution.actual_enrolment > currentInstitution.approved_intake
                      ? "bg-rose-500"
                      : "bg-[#0A2947]"
                  }`}
                  style={{
                    width: `${Math.min(100, (currentInstitution.actual_enrolment / currentInstitution.approved_intake) * 100)}%`,
                  }}
                />
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 block ${
                currentInstitution.actual_enrolment > currentInstitution.approved_intake
                  ? "text-rose-600 font-bold"
                  : currentInstitution.actual_enrolment === currentInstitution.approved_intake
                  ? "text-[#8B5E3C] font-bold"
                  : "text-slate-500"
              }`}>
                {currentInstitution.actual_enrolment > currentInstitution.approved_intake
                  ? `⚠️ +${currentInstitution.actual_enrolment - currentInstitution.approved_intake} Over Cutoff!`
                  : currentInstitution.actual_enrolment === currentInstitution.approved_intake
                  ? `100% Full Capacity (0 open • ${currentInstitution.registered_students || 0} registered)`
                  : `Cutoff: 60/dept (${currentInstitution.approved_intake - currentInstitution.actual_enrolment} open • ${currentInstitution.registered_students || 0} registered)`}
              </span>
            </div>

            {/* TFWS Quota (5% = 3 Seats / Dept) */}
            <div className="bg-white border border-[#D3D4C0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">TFWS Quota (5%)</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-emerald-700">
                {currentInstitution.programs?.reduce((acc, p) => acc + (p.tfws_enrolled || 0), 0) || 0}
                <span className="text-[11px] text-slate-500 font-normal">
                  {" "}/ {currentInstitution.programs?.reduce((acc, p) => acc + (p.tfws_approved || 3), 0) || 12} seats
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Tuition Fee Waiver Scheme
              </span>
            </div>

            {/* EWS Quota (10% = 6 Seats / Dept) */}
            <div className="bg-white border border-[#D3D4C0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">EWS Quota (10%)</span>
                <Building2 className="w-4 h-4 text-[#8B5E3C]" />
              </div>
              <div className="text-xl font-black text-[#8B5E3C]">
                {currentInstitution.programs?.reduce((acc, p) => acc + (p.ews_enrolled || 0), 0) || 0}
                <span className="text-[11px] text-slate-500 font-normal">
                  {" "}/ {currentInstitution.programs?.reduce((acc, p) => acc + (p.ews_approved || 6), 0) || 24} seats
                </span>
              </div>
              <span className="text-[10px] text-[#8B5E3C] font-semibold mt-1 block">
                Economically Weaker Section
              </span>
            </div>

            {/* Supernumerary Total */}
            <div className="bg-white border border-[#D3D4C0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">Supernumerary</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-black text-[#0A2947]">
                {currentInstitution.programs?.reduce((acc, p) => acc + (p.supernumerary_enrolled || 0), 0) || 0}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                TFW + PMSSS + Sports + Defense
              </span>
            </div>

            {/* International (NRI / OCI / FN) */}
            <div className="bg-white border border-[#D3D4C0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">NRI / FN / OCI</span>
                <Globe2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xl font-black text-purple-700">
                {(currentInstitution.programs?.reduce((acc, p) => acc + (p.nri_enrolled || 0), 0) || 0) +
                  (currentInstitution.programs?.reduce((acc, p) => acc + (p.fn_enrolled || 0), 0) || 0)}
              </div>
              <span className="text-[10px] text-purple-600 font-semibold mt-1 block">
                Foreign & Non-Resident
              </span>
            </div>

          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#D3D4C0] space-x-4">
          <button
            onClick={() => setActiveTab("UPLOAD")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "UPLOAD"
                ? "border-[#8B5E3C] text-[#0A2947]"
                : "border-transparent text-slate-500 hover:text-[#0A2947]"
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#8B5E3C]" />
            <span>Single Student Post-Admission Form</span>
          </button>

          <button
            onClick={() => setActiveTab("BATCH")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "BATCH"
                ? "border-[#8B5E3C] text-[#0A2947]"
                : "border-transparent text-slate-500 hover:text-[#0A2947]"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#8B5E3C]" />
            <span>Batch Ingestion & SIH Anomaly Tester</span>
          </button>

          <button
            onClick={() => setActiveTab("PROGRAMS")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "PROGRAMS"
                ? "border-[#8B5E3C] text-[#0A2947]"
                : "border-transparent text-slate-500 hover:text-[#0A2947]"
            }`}
          >
            <Building2 className="w-4 h-4 text-[#8B5E3C]" />
            <span>Department-wise Approved Intake Matrix</span>
          </button>

          <Link
            href="/integration"
            className="pb-3 text-xs font-bold text-slate-500 hover:text-[#8B5E3C] transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Code2 className="w-4 h-4 text-[#0A2947]" />
            <span>ERP & SIS Integration API &rarr;</span>
          </Link>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: SINGLE STUDENT POST-ADMISSION REGISTRATION FORM */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "UPLOAD" && (
          <div className="bg-white border border-[#D3D4C0] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h2 className="text-lg font-black text-[#0A2947]">
                Post-Admission Student Registration Form
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory data fields for Approved Intake verification, supernumerary quotas, NRI/OCI status, and APAAR validation.
              </p>
            </div>

            <form onSubmit={handleValidateSingle} className="space-y-6">
              
              {/* Row 1: APAAR ID & Student ID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    12-Digit APAAR ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={singleForm.apaar_id}
                    onChange={(e) => setSingleForm({ ...singleForm, apaar_id: e.target.value })}
                    placeholder="9283-4710-8521"
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs font-mono text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">National Academic Identifier</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    Student ID / Roll No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={singleForm.student_id}
                    onChange={(e) => setSingleForm({ ...singleForm, student_id: e.target.value })}
                    placeholder="DTU/2024/CSE/055"
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Printed on Degree Certificate</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={singleForm.full_name}
                    onChange={(e) => setSingleForm({ ...singleForm, full_name: e.target.value })}
                    placeholder="Ananya Mukherjee"
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">As registered in APAAR / Aadhaar</p>
                </div>
              </div>

              {/* Row 2: Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={singleForm.dob}
                    onChange={(e) => setSingleForm({ ...singleForm, dob: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">Gender</label>
                  <select
                    value={singleForm.gender}
                    onChange={(e) => setSingleForm({ ...singleForm, gender: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={singleForm.email}
                    onChange={(e) => setSingleForm({ ...singleForm, email: e.target.value })}
                    placeholder="student@institution.edu.in"
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={singleForm.phone}
                    onChange={(e) => setSingleForm({ ...singleForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              {/* Row 3: Program & Approved Intake Branch Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    AICTE Approved Program & Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={singleForm.branch}
                    onChange={(e) => {
                      const branchCode = e.target.value;
                      const prog = currentInstitution?.programs?.find((p) => p.branch === branchCode);
                      setSingleForm({
                        ...singleForm,
                        branch: branchCode,
                        program: prog ? prog.program : branchCode,
                      });
                    }}
                    className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    {currentInstitution?.programs?.map((prog) => (
                      <option key={prog.branch} value={prog.branch}>
                        {prog.program} ({prog.branch}) — Sanctioned Cutoff: {prog.approved_intake || 60} Seats | Enrolled: {prog.actual_enrolment}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">Admission Year</label>
                  <input
                    type="number"
                    value={singleForm.admission_year}
                    onChange={(e) => setSingleForm({ ...singleForm, admission_year: parseInt(e.target.value) })}
                    className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              {/* Row 4: Quota Specific Fields (Supernumerary, TFWS, EWS, NRI, FN) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F3E4C9]/40 border border-[#D3D4C0]">
                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    Intake Seat Category
                  </label>
                  <select
                    value={singleForm.supernumerary_type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSingleForm({
                        ...singleForm,
                        supernumerary_type: val,
                        supernumerary_seat: val !== "None",
                        tfws_eligible: val === "TFWS",
                        ews_eligible: val === "EWS",
                        admission_category: val === "None" ? "Regular Merit" : val,
                      });
                    }}
                    className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="None">Regular Sanctioned Seat (Cutoff: 60)</option>
                    <option value="TFWS">TFWS (Tuition Fee Waiver - 3 seats max / 5%)</option>
                    <option value="EWS">EWS (Economically Weaker Section - 6 seats max / 10%)</option>
                    <option value="PMSSS">PMSSS (J&K Special Quota - Supernumerary)</option>
                    <option value="Sports">Sports / Defense Quota (Supernumerary)</option>
                  </select>
                </div>

                {singleForm.supernumerary_type === "TFWS" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#0A2947] mb-1">
                      Parental Annual Income
                    </label>
                    <input
                      type="text"
                      value={singleForm.family_annual_income || ""}
                      onChange={(e) => setSingleForm({ ...singleForm, family_annual_income: e.target.value })}
                      placeholder="e.g. ₹3,80,000 / annum"
                      className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                ) : singleForm.supernumerary_type === "EWS" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#0A2947] mb-1">
                      EWS Certificate Number
                    </label>
                    <input
                      type="text"
                      value={singleForm.ews_certificate_no || ""}
                      onChange={(e) => setSingleForm({ ...singleForm, ews_certificate_no: e.target.value })}
                      placeholder="e.g. EWS/2024/DEL/8821"
                      className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#0A2947] mb-1">
                      NRI Category
                    </label>
                    <select
                      value={singleForm.nri_category}
                      onChange={(e) => setSingleForm({ ...singleForm, nri_category: e.target.value })}
                      className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                    >
                      <option value="Not Applicable">Not Applicable</option>
                      <option value="NRI">NRI (Non-Resident Indian)</option>
                      <option value="NRI-Sponsored">NRI-Sponsored</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    Foreign National (FN)?
                  </label>
                  <select
                    value={singleForm.foreign_national_status ? "Yes" : "No"}
                    onChange={(e) => {
                      const isFn = e.target.value === "Yes";
                      setSingleForm({
                        ...singleForm,
                        foreign_national_status: isFn,
                        passport_country: isFn ? "Nepal" : "India",
                      });
                    }}
                    className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="No">No (Indian Citizen)</option>
                    <option value="Yes">Yes (Foreign Citizen)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0A2947] mb-1">
                    Passport / Country
                  </label>
                  <input
                    type="text"
                    value={singleForm.passport_country}
                    onChange={(e) => setSingleForm({ ...singleForm, passport_country: e.target.value })}
                    placeholder="India / Nepal / USA"
                    className="w-full bg-white border border-[#D3D4C0] rounded-xl px-3 py-2 text-xs text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              {/* Consent mechanism checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={singleForm.student_consent}
                  onChange={(e) => setSingleForm({ ...singleForm, student_consent: e.target.checked })}
                  className="mt-0.5 rounded text-[#0A2947] focus:ring-[#8B5E3C]"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-600">
                  <span className="font-bold text-[#0A2947]">Mandatory Aadhaar & APAAR Consent Granted:</span> Student has signed digital consent authorizing AICTE to verify and seed APAAR ID into the National Academic Registry in compliance with the Digital Personal Data Protection Act.
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D3D4C0]">
                <button
                  type="submit"
                  disabled={validationLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#0A2947] hover:bg-[#8B5E3C] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <FileCheck2 className="w-4 h-4 text-[#F3E4C9]" />
                  <span>{validationLoading ? "Running Automated Validation..." : "Validate Record Against Approved Intake"}</span>
                </button>

                {validationResults && validationResults.type === "SINGLE" && (
                  <button
                    type="button"
                    disabled={!validationResults.validation?.is_valid || submitLoading}
                    onClick={handleCommitValidRecords}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>{submitLoading ? "Registering to AICTE..." : "Commit Valid Student to Central Repository"}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: BATCH INGESTION & SIH ANOMALY TESTER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "BATCH" && (
          <div className="bg-white border border-[#D3D4C0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-[#0A2947]">
                  Bulk CSV Ingestion & AICTE Anomaly Detection Sandbox
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate college admission cohort uploads and trigger automated anomaly alerts.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadSampleBatch}
                disabled={validationLoading}
                className="px-4 py-2.5 rounded-xl bg-[#F3E4C9]/70 border border-[#D3D4C0] hover:bg-[#F3E4C9] text-[#0A2947] font-bold text-xs transition-all flex items-center gap-2 self-start shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
                <span>1-Click Load SIH Demo Batch (With Anomaly Triggers)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D3D4C0] text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-[#0A2947] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#8B5E3C]" />
                <span>Evaluator Testing Guide (Problem Statement Requirements & Quota Rules):</span>
              </div>
              <p>
                Clicking the 1-click button loads 8 realistic admission records with comprehensive AICTE quota and cutoff checks:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong>Record 1 (Compliant Regular):</strong> B.Tech CSE at DTU admitted within the 60-seat department cutoff (58/60 enrolled).</li>
                <li><strong>Record 2 (Compliant TFWS):</strong> 2nd TFWS seat in DTU AI&DS within the sanctioned 3-seat (5%) TFWS cap.</li>
                <li><strong>Record 3 (Compliant EWS):</strong> Valid EWS admission in DTU ME within the sanctioned 6-seat (10%) EWS cap.</li>
                <li><strong>Record 4 (TFWS Quota Exceeded Violation):</strong> Siddharth Jain attempting 4th TFWS seat in DTU CSE where all 3/3 TFWS seats are already filled &rarr; triggers <code className="text-rose-600 font-bold">EXCEEDING_TFWS_QUOTA</code>!</li>
                <li><strong>Record 5 (EWS Quota Exceeded Violation):</strong> Pooja Hegde attempting 7th EWS seat in DTU AI&DS where all 6/6 EWS seats are filled &rarr; triggers <code className="text-rose-600 font-bold">EXCEEDING_EWS_QUOTA</code>!</li>
                <li><strong>Record 6 (Department Regular Cutoff Exceeded):</strong> Sunil Chawla attempting admission to Apex Institute CSE where 68 students are already enrolled against the 60 approved cutoff &rarr; triggers <code className="text-rose-600 font-bold">ADMISSION_EXCEEDING_APPROVED_INTAKE</code>!</li>
                <li><strong>Record 7 (Cross-Institutional Duplicate Fraud):</strong> Vikramaditya Rao attempting dual full-time enrolment while already registered at Apex Institute &rarr; triggers <code className="text-rose-600 font-bold">CROSS_INSTITUTION_DUPLICATE_ENROLMENT</code>!</li>
                <li><strong>Record 8 (Malformed APAAR ID):</strong> Ramesh Kumar Verma submitting an invalid format token &rarr; triggers <code className="text-rose-600 font-bold">INVALID_APAAR_FORMAT</code>!</li>
              </ul>
            </div>

            {validationResults && validationResults.type === "BATCH" && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-[#0A2947]">
                    Automated Batch Validation Summary:
                  </div>
                  <button
                    type="button"
                    disabled={validationResults.validation?.valid_count === 0 || submitLoading}
                    onClick={handleCommitValidRecords}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commit {validationResults.validation?.valid_count} Valid Students to Central Repository</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#D3D4C0] text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Ingested</span>
                    <span className="text-xl font-black text-[#0A2947]">{validationResults.validation?.total_submitted}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600 uppercase font-bold block">Passed Validation</span>
                    <span className="text-xl font-black text-emerald-700">{validationResults.validation?.valid_count}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[10px] text-rose-600 uppercase font-bold block">Flagged Anomalies</span>
                    <span className="text-xl font-black text-rose-700">{validationResults.validation?.flagged_count}</span>
                  </div>
                </div>

                {/* Batch Records Table */}
                <div className="border border-[#D3D4C0] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A2947] text-[#F3E4C9]">
                      <tr>
                        <th className="p-3 font-bold">APAAR ID</th>
                        <th className="p-3 font-bold">Student Name</th>
                        <th className="p-3 font-bold">Branch & Category</th>
                        <th className="p-3 font-bold">Validation Status</th>
                        <th className="p-3 font-bold">Identified Violations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D3D4C0] bg-white">
                      {validationResults.validation?.results?.map((res, idx) => (
                        <tr key={idx} className={res.is_valid ? "hover:bg-[#FAF8F5]" : "bg-rose-50/30"}>
                          <td className="p-3 font-mono font-bold text-[#0A2947]">
                            {res.record?.apaar_id || "MISSING"}
                          </td>
                          <td className="p-3 font-semibold text-[#0A2947]">
                            {res.record?.full_name}
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {res.record?.student_id}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-700">{res.record?.branch}</span>
                            <span className="block text-[10px] text-slate-500">
                              {res.record?.admission_category || "Regular"}
                            </span>
                          </td>
                          <td className="p-3">
                            {res.is_valid ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Valid Record
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Flagged
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            {res.errors?.length > 0 ? (
                              <div className="space-y-1">
                                {res.errors.map((err, errIdx) => (
                                  <div key={errIdx} className="text-rose-700 font-medium">
                                    • {err.message}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-700 font-semibold">
                                Compliant with Approved Intake & AICTE Norms
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DEPARTMENT-WISE APPROVED INTAKE MATRIX */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "PROGRAMS" && currentInstitution && (
          <div className="bg-white border border-[#D3D4C0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-black text-[#0A2947]">
                {currentInstitution?.name} — Approved Intake Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                AICTE Sanctioned capacity breakdown for each program, supernumerary allowances, and international quotas.
              </p>
            </div>

            <div className="border border-[#D3D4C0] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A2947] text-[#F3E4C9]">
                  <tr>
                    <th className="p-3 font-bold">Program & Branch</th>
                    <th className="p-3 font-bold">Approved Cutoff</th>
                    <th className="p-3 font-bold">Regular Enrolled</th>
                    <th className="p-3 font-bold">TFWS (5% Quota)</th>
                    <th className="p-3 font-bold">EWS (10% Quota)</th>
                    <th className="p-3 font-bold">Supernumerary</th>
                    <th className="p-3 font-bold">NRI (5%)</th>
                    <th className="p-3 font-bold">FN (15%)</th>
                    <th className="p-3 font-bold">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3D4C0] bg-white">
                  {currentInstitution?.programs?.map((prog, idx) => {
                    const isExcess = prog.actual_enrolment > prog.approved_intake;
                    const isTfwsFull = (prog.tfws_enrolled || 0) >= (prog.tfws_approved || 3);
                    const isEwsFull = (prog.ews_enrolled || 0) >= (prog.ews_approved || 6);

                    return (
                      <tr key={idx} className={isExcess ? "bg-rose-50/40" : "hover:bg-[#FAF8F5]"}>
                        <td className="p-3 font-bold text-[#0A2947]">
                          {prog.program}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Code: {prog.branch}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-[#0A2947]">{prog.approved_intake || 60} seats</td>
                        <td className="p-3 font-bold text-[#0A2947]">{prog.actual_enrolment} enrolled</td>
                        <td className="p-3 font-semibold">
                          <span className={isTfwsFull ? "text-[#8B5E3C] font-bold" : "text-emerald-700 font-bold"}>
                            {prog.tfws_enrolled || 0} / {prog.tfws_approved || 3}
                          </span>
                          <span className="block text-[9px] text-slate-400">
                            {isTfwsFull ? "Capacity Full (3/3)" : `${(prog.tfws_approved || 3) - (prog.tfws_enrolled || 0)} open`}
                          </span>
                        </td>
                        <td className="p-3 font-semibold">
                          <span className={isEwsFull ? "text-[#8B5E3C] font-bold" : "text-emerald-700 font-bold"}>
                            {prog.ews_enrolled || 0} / {prog.ews_approved || 6}
                          </span>
                          <span className="block text-[9px] text-slate-400">
                            {isEwsFull ? "Capacity Full (6/6)" : `${(prog.ews_approved || 6) - (prog.ews_enrolled || 0)} open`}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {prog.supernumerary_enrolled || 0} / {prog.supernumerary_approved || 11}
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {prog.nri_enrolled || 0} / {prog.nri_approved || 3}
                        </td>
                        <td className="p-3 font-semibold text-slate-700">
                          {prog.fn_enrolled || 0} / {prog.fn_approved || 9}
                        </td>
                        <td className="p-3">
                          {isExcess ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
                              EXCESS (+{prog.actual_enrolment - prog.approved_intake} OVER CUTOFF)
                            </span>
                          ) : prog.actual_enrolment === prog.approved_intake ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#F3E4C9] text-[#0A2947] text-[10px] font-black border border-[#D3D4C0]">
                              INTAKE FULL (60/60)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              COMPLIANT ({(prog.approved_intake || 60) - prog.actual_enrolment} OPEN)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Validation Results Drawer (For Single Record) */}
        {validationResults && validationResults.type === "SINGLE" && (
          <div className="bg-white border-2 border-[#0A2947] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {validationResults.validation?.is_valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                <h3 className="text-sm font-black text-[#0A2947]">
                  Automated Validation Report for {singleForm.full_name}
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                validationResults.validation?.is_valid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}>
                {validationResults.validation?.status}
              </span>
            </div>

            {validationResults.validation?.errors?.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-1">
                <span className="font-bold block">Validation Errors Detected:</span>
                {validationResults.validation.errors.map((err, i) => (
                  <div key={i}>• [{err.code}]: {err.message}</div>
                ))}
              </div>
            )}

            {validationResults.validation?.warnings?.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 space-y-1">
                <span className="font-bold block">Compliance Warnings:</span>
                {validationResults.validation.warnings.map((w, i) => (
                  <div key={i}>• {w.message}</div>
                ))}
              </div>
            )}

            {validationResults.validation?.is_valid && (
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>12-Digit APAAR Validated. No duplicate records found. Admissible within Approved Intake capacity. Ready to commit.</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
