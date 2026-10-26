"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DataQualityRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/institution");
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 text-[#0F172A]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#142B4A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Redirecting to Automated APAAR Validation Engine...</p>
      </div>
    </div>
  );
}
