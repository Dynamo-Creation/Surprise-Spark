"use client";

import React, { useState } from "react";
import { Gift, Cake, Sparkles } from "lucide-react";

export interface FallbackRendererProps {
  sceneType?: string;
  onObjectClick?: () => void;
  className?: string;
}

export function FallbackRenderer({
  sceneType = "gift",
  onObjectClick,
  className = "",
}: FallbackRendererProps) {
  const [opened, setOpened] = useState(false);
  const [candleLit, setCandleLit] = useState(true);

  const handleClick = () => {
    if (sceneType === "gift") {
      setOpened(true);
    } else if (sceneType === "cake") {
      setCandleLit(false);
    }
    onObjectClick?.();
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-8 select-none ${className}`}
    >
      {/* Decorative backdrop glow */}
      <div className="absolute w-72 h-72 rounded-full bg-pink-500/20 blur-3xl animate-pulse" />
      <div className="absolute w-60 h-60 rounded-full bg-purple-500/15 blur-2xl" />

      {/* Floating interactive element */}
      <div
        onClick={handleClick}
        className="relative z-10 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 flex flex-col items-center"
      >
        {sceneType === "cake" ? (
          <div className="flex flex-col items-center">
            {/* Candle Flame */}
            <div
              className={`w-4 h-6 rounded-full transition-all duration-300 ${
                candleLit
                  ? "bg-amber-400 shadow-[0_0_20px_#f59e0b] animate-bounce"
                  : "bg-slate-500 opacity-20 scale-50"
              }`}
            />
            {/* Candle stick */}
            <div className="w-2.5 h-6 bg-cyan-400 rounded-sm mb-1" />

            {/* Cake Body */}
            <div className="w-28 h-16 rounded-t-2xl bg-gradient-to-b from-pink-400 to-rose-500 shadow-xl border-b-4 border-amber-300 flex items-center justify-center text-white">
              <Cake className="w-10 h-10" />
            </div>
            {/* Cake Base */}
            <div className="w-36 h-4 bg-slate-200/90 rounded-full shadow-md mt-1" />

            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {candleLit ? "Tap to blow the candle" : "Wish Made! ✨"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Gift Box Container */}
            <div
              className={`relative w-28 h-28 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 shadow-2xl flex items-center justify-center text-white transition-all duration-500 ${
                opened ? "-translate-y-2 scale-110 shadow-pink-500/40" : "animate-bounce"
              }`}
            >
              <Gift className="w-14 h-14" />
              {opened && (
                <div className="absolute -top-3 -right-3 text-2xl animate-spin">
                  ✨
                </div>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-pink-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {opened ? "Surprise Unlocked!" : "Tap the gift to open"}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 text-[11px] text-slate-400/80 tracking-wide">
        Simplified 2D experience (WebGL not active)
      </div>
    </div>
  );
}
