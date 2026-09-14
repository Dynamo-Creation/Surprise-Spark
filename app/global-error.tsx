"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center text-2xl">
            ⚠️
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">System Interruption</h1>
            <p className="text-sm text-slate-400">
              An unexpected layout issue occurred. Refreshing the session should resolve it.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload Page
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white font-medium text-xs inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
