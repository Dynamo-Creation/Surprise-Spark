"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally in dev without exposing stack trace to users
    if (process.env.NODE_ENV === "development") {
      console.error("App Error Boundary Captured:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Playful Floating Visual */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-pink-400 shadow-xl shadow-purple-500/10 animate-bounce">
          <Sparkles className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
            A Momentary Glitch
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Oops! Something went sideways 🎈
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The celebration hit an unexpected bump in the road. Don&apos;t worry—your memories and surprises are safe and sound.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-800 text-slate-300 hover:text-white"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
        </div>

        {/* Error Code Safe Digest */}
        {error.digest && (
          <p className="text-[10px] text-slate-600 font-mono">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
