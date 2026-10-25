"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  QrCode, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Database, 
  Sparkles,
  GitPullRequest,
  Wand2,
  Bell
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, mode: "Checking..." });
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({
            online: true,
            mode: data.database?.mode || "Online",
            mongo: data.database?.connected_to_mongo
          });
        } else {
          setBackendStatus({ online: false, mode: "Offline" });
        }
      } catch (err) {
        setBackendStatus({ online: false, mode: "Offline / Standalone" });
      }
    };
    checkBackend();

    // Check pending AI-failed approval count
    fetch("http://127.0.0.1:5000/api/admin/failed-approvals")
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setPendingCount(d.count || 0);
        }
      })
      .catch(() => {});

    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Sparkles },
    { name: "Student Portal", href: "/scan", icon: QrCode, highlight: true },
    { name: "Admin Panel", href: "/admin", icon: ShieldCheck, badge: pendingCount > 0 ? pendingCount : null },
    { name: "Student Records", href: "/students", icon: Users },
    { name: "Audit & Sentinel", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] text-[#0F172A] shadow-sm">
      {/* Top AICTE Gov Banner */}
      <div className="bg-[#142B4A] text-white px-4 py-1 text-xs border-b border-slate-700/60 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse"></span>
          <span className="font-medium tracking-wide">Government of India • Ministry of Education • AICTE Portal</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-[#22D3EE] font-semibold">SIH26263</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-slate-200 flex items-center gap-1.5 font-mono">
            <Database className="w-3 h-3 text-[#22D3EE]" />
            <span className={backendStatus.online ? "text-[#22D3EE]" : "text-amber-300"}>
              {backendStatus.mode}
            </span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#142B4A] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-[#142B4A]">
                  APAAR
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#142B4A] border border-[#E2E8F0]">
                  AICTE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                One Nation • One Student ID
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    item.highlight
                      ? "bg-[#142B4A] text-white hover:bg-[#0F172A] shadow-sm"
                      : isActive
                      ? "bg-slate-100 text-[#142B4A] border-b-2 border-[#142B4A]"
                      : "text-[#0F172A] hover:text-[#142B4A] hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? "text-[#22D3EE]" : isActive ? "text-[#142B4A]" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full font-bold ml-1">
                      {item.badge}
                    </span>
                  )}
                  {item.newBadge && (
                    <span className="text-[9px] bg-cyan-100 text-[#142B4A] border border-[#22D3EE] px-1 py-0.2 rounded font-bold ml-1">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Compact tablet navigation */}
          <nav className="hidden md:flex xl:hidden items-center space-x-1">
            <Link href="/scan" className="px-3 py-1.5 rounded-lg bg-[#142B4A] text-white text-xs font-bold flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Student Portal</span>
            </Link>
            <Link href="/admin" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-100">
              Admin Panel
            </Link>
            <Link href="/students" className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-100">
              Records
            </Link>
          </nav>

          {/* Auth Button (NextAuth) */}
          <div className="hidden md:flex items-center space-x-3">
            {session?.user ? (
              <div className="flex items-center space-x-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-[#142B4A] flex items-center justify-center font-bold text-xs text-white">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#0F172A] truncate max-w-[130px]">
                    {session.user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[130px]">
                    {session.user.role_title || session.user.role || "Authority"}
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
                className="flex items-center space-x-2 text-xs font-bold bg-[#142B4A] hover:bg-[#0F172A] text-white px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/scan"
              className="bg-[#142B4A] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Scan</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#0F172A] hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
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
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold ${
                  item.highlight
                    ? "bg-[#142B4A] text-white"
                    : isActive
                    ? "bg-slate-100 text-[#142B4A]"
                    : "text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
            {session?.user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-700 font-semibold">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-rose-600 font-bold px-2 py-1 rounded bg-rose-50 border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold bg-[#142B4A] text-white rounded-lg block"
              >
                Sign In with Authority Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
