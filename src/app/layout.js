import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AICTE APAAR ID Platform | Student Data & Verification",
  description: "One Nation, One Student ID: APAAR Verification & Academic Data Management Platform for AICTE-Approved Institutions (SIH26263)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-[#0F172A] flex flex-col font-sans selection:bg-[#22D3EE] selection:text-[#0F172A]">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col bg-slate-50">
            {children}
          </main>
          <footer className="border-t border-[#E2E8F0] bg-white py-5 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#142B4A]">AICTE • SIH26263</span>
                <span>— Development of APAAR ID Student Data Management & Verification Platform</span>
              </div>
              <div className="text-slate-400">
                National Educational Technology Forum (NETF) & Academic Bank of Credits (ABC)
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
