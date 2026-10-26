"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Key,
  Copy,
  Check,
  Send,
  Terminal,
  ShieldCheck,
  Server,
  FileCode2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function IntegrationPage() {
  const [apiKey, setApiKey] = useState("aicte_sec_dtu_2026_98a7b");
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("INTAKE_STATUS");
  const [activeCodeTab, setActiveCodeTab] = useState("curl"); // 'curl' | 'python' | 'node'

  // Live Tester State
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        students: [
          {
            apaar_id: "5512-8890-1122",
            student_id: "DTU/2024/CSE/055",
            full_name: "Ananya Mukherjee",
            dob: "2005-04-12",
            gender: "Female",
            email: "ananya.m@dtu.ac.in",
            program: "B.Tech Computer Science & Engineering",
            branch: "CSE",
            admission_year: 2024,
            supernumerary_seat: true,
            supernumerary_type: "TFW",
            nri_category: "Not Applicable",
            student_consent: true,
          },
        ],
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleSendTestRequest = async () => {
    setApiLoading(true);
    setApiResponse(null);

    const startTime = performance.now();
    try {
      let res;
      if (selectedEndpoint === "INTAKE_STATUS") {
        res = await fetch("http://127.0.0.1:5000/api/v1/institution/intake-status", {
          headers: {
            "X-AICTE-API-KEY": apiKey,
          },
        });
      } else {
        let parsed;
        try {
          parsed = JSON.parse(testPayload);
        } catch (e) {
          alert("Invalid JSON payload.");
          setApiLoading(false);
          return;
        }

        res = await fetch("http://127.0.0.1:5000/api/v1/institution/submit-admissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-AICTE-API-KEY": apiKey,
          },
          body: JSON.stringify(parsed),
        });
      }

      const duration = Math.round(performance.now() - startTime);
      const data = await res.json();
      setApiResponse({
        status: res.status,
        duration: `${duration}ms`,
        body: data,
      });
    } catch (err) {
      setApiResponse({
        status: 500,
        duration: "0ms",
        body: { error: "Network connection error", details: err.message },
      });
    } finally {
      setApiLoading(false);
    }
  };

  const curlSnippet =
    selectedEndpoint === "INTAKE_STATUS"
      ? `curl -X GET "http://127.0.0.1:5000/api/v1/institution/intake-status" \\
  -H "X-AICTE-API-KEY: ${apiKey}"`
      : `curl -X POST "http://127.0.0.1:5000/api/v1/institution/submit-admissions" \\
  -H "Content-Type: application/json" \\
  -H "X-AICTE-API-KEY: ${apiKey}" \\
  -d '${testPayload.replace(/\n/g, "").replace(/\s+/g, " ")}'`;

  const pythonSnippet =
    selectedEndpoint === "INTAKE_STATUS"
      ? `import requests

url = "http://127.0.0.1:5000/api/v1/institution/intake-status"
headers = {"X-AICTE-API-KEY": "${apiKey}"}

response = requests.get(url, headers=headers)
print("Approved Intake Status:", response.json())`
      : `import requests

url = "http://127.0.0.1:5000/api/v1/institution/submit-admissions"
headers = {
    "Content-Type": "application/json",
    "X-AICTE-API-KEY": "${apiKey}"
}
payload = ${testPayload}

response = requests.post(url, json=payload, headers=headers)
print("Submission Result:", response.json())`;

  return (
    <div className="flex-1 bg-slate-50 text-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* Header */}
        <div className="border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#142B4A] text-xs font-semibold mb-2 border border-[#E2E8F0]">
            <Code2 className="w-3.5 h-3.5 text-[#142B4A]" />
            <span>Institutional ERP & SIS Integration Gateway (Requirement 7)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#142B4A]">
            AICTE Developer API & Institutional Integration
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Programmatic REST APIs for institutions to sync student admission rosters from university ERPs (SAP, PeopleSoft, Ellucian, or custom SIS) directly into the AICTE Central Repository.
          </p>
        </div>

        {/* API Credentials Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                Active Institutional API Key
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Key className="w-4 h-4 text-[#142B4A]" />
                <code className="text-xs sm:text-sm font-mono font-bold text-[#142B4A] bg-slate-100 px-3 py-1 rounded-lg border border-[#E2E8F0]">
                  {apiKey}
                </code>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Assigned to: Delhi Technological University (DTU Delhi) • AICTE ID: 1-33271891
              </p>
            </div>

            <button
              onClick={handleCopyKey}
              className="px-4 py-2 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 self-start transition-all"
            >
              {copiedKey ? <Check className="w-4 h-4 text-[#22D3EE]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? "Copied Key!" : "Copy Header Key"}</span>
            </button>
          </div>
        </div>

        {/* Interactive API Tester & Documentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Endpoints & Request Editor */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Endpoint Selector */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#0F172A] block">Select Target REST Endpoint:</span>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedEndpoint("INTAKE_STATUS")}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedEndpoint === "INTAKE_STATUS"
                      ? "border-[#142B4A] bg-slate-50 font-bold"
                      : "border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                      GET
                    </span>
                    <span className="font-mono text-[#0F172A]">/api/v1/institution/intake-status</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEndpoint("SUBMIT_ADMISSIONS")}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedEndpoint === "SUBMIT_ADMISSIONS"
                      ? "border-[#142B4A] bg-slate-50 font-bold"
                      : "border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                      POST
                    </span>
                    <span className="font-mono text-[#0F172A]">/api/v1/institution/submit-admissions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Request Payload Editor (for POST) */}
            {selectedEndpoint === "SUBMIT_ADMISSIONS" && (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block">JSON Request Payload:</span>
                <textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={9}
                  className="w-full bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>
            )}

            {/* Send Request Button */}
            <button
              onClick={handleSendTestRequest}
              disabled={apiLoading}
              className="w-full py-3 rounded-xl bg-[#142B4A] hover:bg-[#0F172A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#22D3EE]" />
              <span>{apiLoading ? "Sending Live API Call..." : "Execute Test API Call"}</span>
            </button>

            {/* Code Snippets Tabs */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-xs font-bold text-[#0F172A]">Implementation Snippet:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveCodeTab("curl")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeCodeTab === "curl" ? "bg-[#142B4A] text-white" : "text-slate-500 hover:text-black"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("python")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeCodeTab === "python" ? "bg-[#142B4A] text-white" : "text-slate-500 hover:text-black"
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-slate-900 text-slate-200 text-[10px] font-mono rounded-xl overflow-x-auto whitespace-pre-wrap">
                {activeCodeTab === "curl" ? curlSnippet : pythonSnippet}
              </pre>
            </div>

          </div>

          {/* Right Column: API Response Inspector */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#142B4A]" />
                  <span className="text-xs font-bold text-[#0F172A]">Live API Response</span>
                </div>
                {apiResponse && (
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      apiResponse.status < 400 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      Status: {apiResponse.status}
                    </span>
                    <span className="text-slate-400">Latency: {apiResponse.duration}</span>
                  </div>
                )}
              </div>

              {apiResponse ? (
                <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-[500px]">
                  {JSON.stringify(apiResponse.body, null, 2)}
                </pre>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Click &ldquo;Execute Test API Call&rdquo; to test endpoint response.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
