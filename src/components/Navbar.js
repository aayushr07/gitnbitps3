"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  UploadCloud,
  Users,
  BarChart3,
  QrCode,
  Home
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Institution Portal", href: "/institution", icon: UploadCloud },
    { name: "Student Records", href: "/students", icon: Users },
    { name: "Admissions Monitoring", href: "/analytics", icon: BarChart3 },
    { name: "Verify APAAR", href: "/scan", icon: QrCode },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] text-[#0F172A] shadow-sm">
      {/* Top AICTE Gov Banner */}
      <div className="bg-[#142B4A] text-white px-4 py-1 text-xs border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
          <span className="font-medium tracking-wide">Government of India • Ministry of Education • AICTE Portal</span>
        </div>
        <div className="text-[11px] text-slate-300 font-medium hidden sm:block">
          Automated Permanent Academic Account Registry (APAAR)
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#142B4A] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-[#142B4A]">
                  AICTE APAAR
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                One Nation • One Student ID
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean & Consistent) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-100 text-[#142B4A]"
                      : "text-slate-600 hover:text-[#142B4A] hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#142B4A]" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Clean User Auth Button */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {session?.user ? (
              <div className="flex items-center space-x-2 bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-[#142B4A] flex items-center justify-center font-bold text-xs text-white">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#0F172A] truncate max-w-[130px]">
                    {session.user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[130px]">
                    {session.user.role_title || session.user.role || "Officer"}
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-xs font-bold bg-[#142B4A] hover:bg-[#0F172A] text-white px-3.5 py-2 rounded-xl transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#0F172A] hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive ? "bg-slate-100 text-[#142B4A]" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#E2E8F0]">
            {session?.user ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-slate-700">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-rose-600 font-bold px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold bg-[#142B4A] text-white rounded-xl block"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
