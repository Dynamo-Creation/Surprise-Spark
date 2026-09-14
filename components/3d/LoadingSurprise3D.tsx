"use client";

import React from "react";
import { Gift, Sparkles } from "lucide-react";

export interface LoadingSurprise3DProps {
  message?: string;
}

export function LoadingSurprise3D({
  message = "Preparing your 3D surprise...",
}: LoadingSurprise3DProps) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Glow Ring Behind */}
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500/30 to-purple-600/30 blur-xl animate-pulse" />

        {/* Bouncing Gift Icon */}
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[2px] shadow-2xl animate-bounce">
          <div className="w-full h-full rounded-[14px] bg-slate-950/90 flex items-center justify-center">
            <Gift className="w-9 h-9 text-pink-400 animate-pulse" />
          </div>
        </div>

        {/* Message & Status */}
        <div className="mt-6 flex items-center gap-2 text-white font-medium text-sm tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{message}</span>
        </div>

        {/* Shimmer loading bar */}
        <div className="mt-3 w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 to-amber-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
