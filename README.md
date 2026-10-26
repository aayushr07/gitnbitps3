# AICTE APAAR ID Platform - Frontend Web Application

Modern Next.js 14 web application for the All India Council for Technical Education (AICTE) APAAR ID Student Data Management and Verification System (*One Nation, One Student ID*).

---

## 🎨 Official Color Scheme

- **AICTE Deep Navy**: `#142B4A`
- **Gov Dark Slate**: `#0F172A`
- **Cyan Accent**: `#22D3EE`
- **Borders**: `#E2E8F0`
- **Surfaces**: `#F8FAFC` & `#FFFFFF`

---

## 🚀 Key Portal Features

1. **Home (`/`)**:
   - National overview, real-time admission metrics, and interactive 6-stage lifecycle visualizer.
2. **Institution Portal (`/institution`)**:
   - Approved Intake capacity monitoring per program.
   - Post-admission student data upload (Single Form + Bulk CSV).
   - Pre-commit automated APAAR validation & anomaly checks (excess intake, duplicate enrollment).
3. **AICTE Central Repository (`/students`)**:
   - Master national registry with APAAR ID as unique academic identifier.
   - Filters: Institution, Discipline, Supernumerary (TFW/EWS), NRI, OCI, and Foreign National (FN).
4. **Admissions Monitoring & Governance (`/analytics`)**:
   - Real-time intake vs enrolment monitoring dashboard.
   - Excess intake anomaly sentinel banner.
   - Policy-making & accreditation reports (1-click CSV export & print format).
5. **Authorized Stakeholder Verification (`/scan`)**:
   - Secure verification gateway for AICTE, employers, and regulatory bodies.
   - Live camera QR scanning, image upload, and 12-digit APAAR query with SHA-256 seal.
6. **Official Degree Certificate (`/student/[id]`)**:
   - Prominently displays **both APAAR ID and Student ID / Roll No** on degree certificates issued by degree-awarding bodies.
   - Print-ready convocation certificate layout.
7. **Institutional ERP / API Integration (`/integration`)**:
   - API sandbox with `X-AICTE-API-KEY` credentials and code snippets (cURL, Python, Node.js).
8. **Stakeholder Authentication (`/login`)**:
   - 1-Click persona logins for AICTE Admin, Institution Registrar, Employer Verifier, and Student.

---

## ⚙️ Setup & Development

```bash
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*
