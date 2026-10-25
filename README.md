# AICTE APAAR ID Platform - Frontend Portal

A modern Next.js web application for AICTE-approved institutions providing APAAR ID QR verification, multi-level approval workflows, AI-powered student onboarding, and pre-submission data quality audits.

Built for Smart India Hackathon (SIH26263).

---

## 🎨 Design System & Theme

Designed in a **clean light theme** using the official palette:
- **Navy Primary**: `#142B4A`
- **Dark Slate**: `#0F172A`
- **Cyan Accent**: `#22D3EE`
- **Border Slate**: `#E2E8F0`
- **Surfaces**: `#F8FAFC` & `#FFFFFF`

---

## 🚀 Key Portal Features

1. **Student Gateway & QR Scanner (`/scan`)**:
   - Web camera and image upload scanner decoding student APAAR QR tokens.
   - Real-time cryptographic validation with DigiLocker e-KYC and Academic Bank of Credits (ABC) breakdown.

2. **AI-Powered New Student Onboarding (`/students`)**:
   - Aadhaar consent authorization compliance under the Aadhaar Act 2016.
   - Demographic fuzzy matching, nationwide duplicate/ghost student detection, and AICTE accreditation check.
   - Evaluator demo test presets for 1-click hackathon evaluation.

3. **Multi-Level Verification Workflow (`/workflow`)**:
   - 4-Tier structured approval state machine:
     1. College Operator (submits data & fixes remarks)
     2. Institution Verifier (checks marksheets & verifies records)
     3. Authorized Reviewer (resolves flagged dual-enrollment cases)
     4. AICTE Central Admin (grants national digital seal)
   - Cryptographic audit trail with timestamps and role actions.

4. **AI-Powered Data Quality Assistant (`/data-quality`)**:
   - Pre-submission dataset sanitizer detecting missing mandatory fields, institution name abbreviations, and out-of-bounds CGPA.
   - 1-click suggested corrections and departmental quality scorecard.

5. **Official Printable Student Card (`/student/[id]`)**:
   - High-fidelity, print-ready AICTE ID card featuring dynamic QR code and security stamps.

6. **AICTE Central Compliance & Fraud Sentinel (`/analytics`)**:
   - Cross-institutional statistics, dual-enrollment fraud alerts, and ABC credit trends.

---

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Configure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (defaults to `http://localhost:3000`).

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```
