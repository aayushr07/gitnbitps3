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
      <body className="min-h-screen bg-[#FAF8F5] text-[#0A2947] flex flex-col font-sans selection:bg-[#F3E4C9] selection:text-[#0A2947]">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col bg-[#FAF8F5]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
