"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/analytics");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-[#FAF8F5] text-[#0A2947]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#0A2947] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Redirecting to Admissions Monitoring & Governance...</p>
      </div>
    </div>
  );
}
