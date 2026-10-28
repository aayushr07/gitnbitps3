"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/config/api";
import {
  Users,
  Search,
  Plus,
  UploadCloud,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Sparkles,
  Building2,
  GraduationCap,
  Award,
  Globe2,
  RefreshCw,
  QrCode,
  FileBadge,
  Eye,
  Check,
  X
} from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedInstitution, setSelectedInstitution] = useState("All");
  const [selectedQuota, setSelectedQuota] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [notification, setNotification] = useState("");

  const branches = ["All", "CSE", "AI & DS", "ENTC", "ME", "EE", "PGDM"];
  const quotas = [
    { label: "All Categories", value: "All" },
    { label: "Regular Intake (Cutoff 60)", value: "Regular" },
    { label: "TFWS (Tuition Fee Waiver - 5%)", value: "TFWS" },
    { label: "EWS (Economically Weaker Section - 10%)", value: "EWS" },
    { label: "Supernumerary Seats", value: "Supernumerary" },
    { label: "NRI Category", value: "NRI" },
    { label: "OCI Status", value: "OCI" },
    { label: "Foreign Nationals (FN)", value: "FN" },
  ];
  const statuses = ["All", "Verified", "Flagged"];

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, selectedBranch, selectedInstitution, selectedQuota, selectedStatus]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const fetchInstitutions = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.institutions);
      if (res.ok) {
        const data = await res.json();
        setInstitutions(data.institutions || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedBranch !== "All") params.append("branch", selectedBranch);
      if (selectedInstitution !== "All") params.append("institution", selectedInstitution);
      if (selectedQuota !== "All") params.append("quota", selectedQuota);
      if (selectedStatus !== "All") params.append("status", selectedStatus);

      const res = await fetch(`${API_ENDPOINTS.students}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (apaarId, name) => {
    if (!confirm(`Are you sure you want to remove record for ${name} (${apaarId})?`)) return;
    try {
      const res = await fetch(API_ENDPOINTS.studentDetail(apaarId), {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Student record removed: ${apaarId}`);
        fetchStudents();
      }
    } catch (err) {
      showToast("Delete failed.");
    }
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] text-[#0A2947] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0A2947] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#D3D4C0] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#F3E4C9]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D3D4C0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E4C9]/70 text-[#0A2947] text-xs font-bold mb-2 border border-[#D3D4C0]">
              <Users className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>AICTE National Student Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A2947]">
              Central Student Repository
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              National database of student records using APAAR ID as unique academic identifier linked with institutional enrollment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start">
            <Link
              href="/institution"
              className="px-4 py-2.5 rounded-xl bg-[#0A2947] hover:bg-[#8B5E3C] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <UploadCloud className="w-4 h-4 text-[#F3E4C9]" />
              <span>Upload / Ingest Records</span>
            </Link>

            <button
              onClick={fetchStudents}
              className="p-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#D3D4C0] text-[#0A2947] shadow-xs transition-all"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#8B5E3C]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#D3D4C0] rounded-2xl p-4 shadow-xs space-y-3">
          
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 12-digit APAAR ID, Student ID / Roll No, Student Name, or Institution..."
              className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-[#0A2947] placeholder-slate-400 focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>

          {/* Bottom Filter Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            
            {/* Institution Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Institution</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
              >
                <option value="All">All Institutions</option>
                {institutions.map((i) => (
                  <option key={i.aicte_id} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quota / Category Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Quota / Category</label>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
              >
                {quotas.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Branch / Discipline</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b === "All" ? "All Branches" : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Verification Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D3D4C0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#0A2947] focus:outline-none focus:border-[#8B5E3C]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Found {students.length} authentic record(s)</span>
          <span>Primary Identifier: 12-Digit APAAR ID</span>
        </div>

        {/* Student Records Table */}
        <div className="bg-white border border-[#D3D4C0] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A2947] text-[#F3E4C9]">
                <tr>
                  <th className="p-3.5 font-bold">APAAR ID & Student ID</th>
                  <th className="p-3.5 font-bold">Student Name & Photo</th>
                  <th className="p-3.5 font-bold">Institution & Program</th>
                  <th className="p-3.5 font-bold">Intake Quota & Category</th>
                  <th className="p-3.5 font-bold">ABC Credits</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Certificate & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3D4C0]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#8B5E3C]" />
                      <span>Loading Central Repository...</span>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <span>No student records match the selected query and filters.</span>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const isFlagged = student.status === "Flagged";
                    return (
                      <tr key={student.apaar_id} className={isFlagged ? "bg-rose-50/40 hover:bg-rose-50/60" : "hover:bg-[#FAF8F5]"}>
                        
                        {/* APAAR ID & Student ID */}
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-[#0A2947] block">
                            {student.apaar_id}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-medium block mt-0.5">
                            Roll: {student.student_id || "PENDING"}
                          </span>
                        </td>

                        {/* Student Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {student.photo_url ? (
                              <img
                                src={student.photo_url}
                                alt={student.full_name}
                                className="w-8 h-8 rounded-full object-cover border border-[#D3D4C0]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#0A2947] text-[#F3E4C9] font-bold flex items-center justify-center text-xs">
                                {student.full_name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[#0A2947] block">{student.full_name}</span>
                              <span className="text-[10px] text-slate-400 block">{student.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Institution & Program */}
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">{student.institution}</span>
                          <span className="text-[10px] text-slate-500 block">{student.program}</span>
                        </td>

                        {/* Quota / Category Badges */}
                        <td className="p-3.5">
                          {student.supernumerary_type === "TFWS" || student.admission_category === "TFWS" || student.tfws_eligible ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold inline-block border border-emerald-300">
                              TFWS: 100% Fee Waiver (5% Quota)
                            </span>
                          ) : student.supernumerary_type === "EWS" || student.admission_category === "EWS" || student.ews_eligible ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold inline-block border border-amber-300">
                              EWS: 10% Supernumerary Quota
                            </span>
                          ) : student.supernumerary_seat ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#F3E4C9] text-[#0A2947] text-[10px] font-bold inline-block border border-[#D3D4C0]">
                              Supernumerary: {student.supernumerary_type || "Quota"}
                            </span>
                          ) : student.nri_category && student.nri_category !== "Not Applicable" ? (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold inline-block border border-purple-200">
                              NRI: {student.nri_category}
                            </span>
                          ) : student.foreign_national_status ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#0A2947] text-[10px] font-bold inline-block border border-[#D3D4C0]">
                              FN: {student.passport_country}
                            </span>
                          ) : student.oci_status ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#0A2947] text-[10px] font-bold inline-block border border-[#D3D4C0]">
                              OCI Status
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-slate-700 text-[10px] font-semibold inline-block border border-[#D3D4C0]">
                              Regular Merit Intake (60 Cutoff)
                            </span>
                          )}
                        </td>

                        {/* ABC Credits */}
                        <td className="p-3.5">
                          <span className="font-bold text-[#0A2947] block">{student.abc_credits_total || 0} pts</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {student.abc_id || "ABC-SYNCED"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {isFlagged ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Flagged Anomaly
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified Record
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            href={`/student/${encodeURIComponent(student.apaar_id)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0A2947] hover:bg-[#8B5E3C] text-white text-[11px] font-bold shadow-xs transition-all"
                            title="View Degree Certificate with APAAR ID & Student ID"
                          >
                            <Award className="w-3.5 h-3.5 text-[#F3E4C9]" />
                            <span>Certificate / ID</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(student.apaar_id, student.full_name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
