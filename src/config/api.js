/**
 * AICTE APAAR Platform - Central API Configuration
 * Connects Frontend (https://gitnbitps3.vercel.app) to Backend (https://gitnbitps3b.vercel.app)
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://gitnbitps3b.vercel.app";

export const API_ENDPOINTS = {
  status: `${API_BASE_URL}/api/status`,
  institutions: `${API_BASE_URL}/api/institutions`,
  institutionDetail: (id) => `${API_BASE_URL}/api/institutions/${id}`,
  institutionValidate: `${API_BASE_URL}/api/institution/validate`,
  institutionUpload: `${API_BASE_URL}/api/institution/upload-students`,
  sampleAdmissionBatch: `${API_BASE_URL}/api/sample-admission-batch`,
  students: `${API_BASE_URL}/api/students`,
  studentDetail: (id) => `${API_BASE_URL}/api/students/${encodeURIComponent(id)}`,
  generateQr: (id) => `${API_BASE_URL}/api/generate-qr/${encodeURIComponent(id)}?base64=true`,
  verifyApaar: `${API_BASE_URL}/api/verify-apaar`,
  analytics: `${API_BASE_URL}/api/analytics`,
  reportsAdmissions: `${API_BASE_URL}/api/reports/admissions`,
  reportsAdmissionsCsv: `${API_BASE_URL}/api/reports/admissions?format=csv`,
  auditLogs: `${API_BASE_URL}/api/audit-logs`,
  verifications: `${API_BASE_URL}/api/verifications`,
  authLogin: `${API_BASE_URL}/api/auth/login`,
  erpIntakeStatus: `${API_BASE_URL}/api/v1/institution/intake-status`,
  erpSubmitAdmissions: `${API_BASE_URL}/api/v1/institution/submit-admissions`,
};
