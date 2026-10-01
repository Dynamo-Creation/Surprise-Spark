"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Module Error]:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center text-slate-200">
      <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900/90 border border-red-500/30 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-base font-bold text-white">Admin Console Telemetry Error</h2>
          <p className="text-xs text-slate-400 mt-1">
            {error.message || "An unexpected error occurred while loading administrative telemetry."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2.5 pt-2">
          <Button
            size="sm"
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Loading
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/admin")}
            className="border-white/[0.1] text-slate-300 hover:text-white text-xs"
            leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
          >
            Reload Admin
          </Button>
        </div>

        {error.digest && (
          <p className="text-[10px] text-slate-500 font-mono">Digest: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
