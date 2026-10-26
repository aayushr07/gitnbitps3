"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    { label: "Regular Intake", value: "Regular" },
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
      const res = await fetch("http://127.0.0.1:5000/api/institutions");
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

      const res = await fetch(`http://127.0.0.1:5000/api/students?${params.toString()}`);
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
      const res = await fetch(`http://127.0.0.1:5000/api/students/${encodeURIComponent(apaarId)}`, {
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
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#142B4A] text-white px-4 py-3 rounded-2xl shadow-xl border border-cyan-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22D3EE]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
              <Users className="w-3.5 h-3.5 text-[#142B4A]" />
              <span>AICTE National Student Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
              Central Student Repository
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              National database of student records using APAAR ID as unique academic identifier linked with institutional enrollment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start">
            <Link
              href="/institution"
              className="px-4 py-2.5 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4 text-[#22D3EE]" />
              <span>Upload / Ingest Records</span>
            </Link>

            <button
              onClick={fetchStudents}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 shadow-sm transition-all"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#142B4A]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3">
          
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 12-digit APAAR ID, Student ID / Roll No, Student Name, or Institution..."
              className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#142B4A]"
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
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#142B4A] focus:outline-none focus:border-[#142B4A]"
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
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#142B4A] focus:outline-none focus:border-[#142B4A]"
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
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#142B4A] focus:outline-none focus:border-[#142B4A]"
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
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#142B4A] focus:outline-none focus:border-[#142B4A]"
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
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#142B4A] text-white">
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
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#142B4A]" />
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
                      <tr key={student.apaar_id} className={isFlagged ? "bg-rose-50/40 hover:bg-rose-50/60" : "hover:bg-slate-50"}>
                        
                        {/* APAAR ID & Student ID */}
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-[#142B4A] block">
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
                                className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-[#22D3EE] font-bold flex items-center justify-center text-xs">
                                {student.full_name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[#0F172A] block">{student.full_name}</span>
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
                          {student.supernumerary_seat ? (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-900 text-[10px] font-bold inline-block border border-cyan-200">
                              Supernumerary: {student.supernumerary_type || "Quota"}
                            </span>
                          ) : student.nri_category && student.nri_category !== "Not Applicable" ? (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold inline-block border border-purple-200">
                              NRI: {student.nri_category}
                            </span>
                          ) : student.foreign_national_status ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold inline-block border border-blue-200">
                              FN: {student.passport_country}
                            </span>
                          ) : student.oci_status ? (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[10px] font-bold inline-block border border-indigo-200">
                              OCI Status
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold inline-block border border-slate-200">
                              Regular Merit Intake
                            </span>
                          )}
                        </td>

                        {/* ABC Credits */}
                        <td className="p-3.5">
                          <span className="font-bold text-[#142B4A] block">{student.abc_credits_total || 0} pts</span>
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#142B4A] hover:bg-[#0F172A] text-white text-[11px] font-bold shadow-sm transition-all"
                            title="View Degree Certificate with APAAR ID & Student ID"
                          >
                            <Award className="w-3.5 h-3.5 text-[#22D3EE]" />
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
