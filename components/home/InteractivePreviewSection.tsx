"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gift, Sparkles, PartyPopper, Heart, RotateCcw, ArrowRight, Music, Cake, Image as ImageIcon, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ripple } from "@/components/magicui/ripple";
import { BorderBeam } from "@/components/magicui/border-beam";
import confetti from "canvas-confetti";

export function InteractivePreviewSection() {
  const [activeTab, setActiveTab] = useState<"unwrap" | "cake" | "photo">("unwrap");
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleUnwrap = () => {
    setIsUnwrapped(true);
    setActiveTab("cake");
    confetti({
      particleCount: 100,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#d946ef", "#8b5cf6", "#f59e0b", "#10b981"],
    });
  };

  const handleBlowCandles = () => {
    setCandlesBlown(!candlesBlown);
    if (!candlesBlown) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.55 },
        colors: ["#f59e0b", "#fbbf24", "#ec4899"],
      });
    }
  };

  const handleReset = () => {
    setIsUnwrapped(false);
    setCandlesBlown(false);
    setActiveTab("unwrap");
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-950 via-[#0d0a1a] to-slate-950 text-white relative overflow-hidden">
      
      {/* 1. Visibly Vibrant Concentric Ripple Rings */}
      <Ripple
        mainCircleSize={300}
        numCircles={8}
        mainCircleOpacity={0.7}
        borderColor="rgba(244, 63, 94, 0.55)"
        className="opacity-95 pointer-events-none"
      />

      {/* Additional ambient radial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" size="md" className="border-pink-500/50 text-pink-400 bg-pink-500/15 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Interactive Playground</span>
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Try The Surprise Interaction
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Experience what your recipient feels when they open your magic link on their smartphone.
          </p>
        </div>

        {/* Redesigned Premium Sandbox Device / Experience Console */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 relative overflow-hidden">
          
          {/* Laser BorderBeam */}
          <BorderBeam
            size={180}
            duration={8}
            delay={0}
            colorFrom="#ec4899"
            colorTo="#a855f7"
            borderWidth={2}
          />

          {/* Top Bar with Live Audio Simulation & Controls */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">Live Simulator</span>
              <span className="hidden sm:inline-block text-slate-500">•</span>
              <span className="hidden sm:flex items-center gap-1 text-purple-300 text-[11px]">
                <Music className="w-3 h-3 text-pink-400" /> &ldquo;Birthday Acoustic Lo-Fi&rdquo;
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isUnwrapped && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors font-semibold cursor-pointer text-xs whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Scene Switcher Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <button
              onClick={() => setActiveTab("unwrap")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "unwrap"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Gift className="w-3.5 h-3.5 shrink-0" />
              <span>1. 3D Gift Box</span>
            </button>
            <button
              onClick={() => {
                setIsUnwrapped(true);
                setActiveTab("cake");
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "cake"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cake className="w-3.5 h-3.5 shrink-0" />
              <span>2. Cake & Candles</span>
            </button>
            <button
              onClick={() => {
                setIsUnwrapped(true);
                setActiveTab("photo");
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === "photo"
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              <span>3. Polaroid Memory</span>
            </button>
          </div>

          {/* Sandbox Stage Canvas */}
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 relative">
            
            {/* Tab 1: Unwrap Stage */}
            {activeTab === "unwrap" && (
              <div className="space-y-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <div
                  onClick={handleUnwrap}
                  className="relative group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleUnwrap()}
                  aria-label="Click to unwrap surprise"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
                  
                  <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:scale-110 active:scale-95 duration-200 border-2 border-white/20">
                    <Gift className="w-16 h-16 animate-bounce duration-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-lg font-black text-white">
                    You have 1 surprise package waiting! 🎁
                  </p>
                  <p className="text-xs text-pink-300 font-semibold bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30 inline-block">
                    Tap the gift box to unwrap with confetti
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Blowable Birthday Cake */}
            {activeTab === "cake" && (
              <div className="space-y-5 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 w-full max-w-md">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300 bg-clip-text text-transparent">
                    Happy 25th Birthday Maya!
                  </span>
                  <PartyPopper className="w-5 h-5 text-pink-400 animate-bounce" />
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full text-center space-y-4">
                  <div className="text-5xl py-2 transition-transform duration-300">
                    {candlesBlown ? "🎂✨" : "🎂🕯️🕯️🕯️"}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {candlesBlown
                        ? "🎉 Your wish was made! May all your dreams sparkle."
                        : "Blow the 3D candles to unlock your secret note!"}
                    </p>
                  </div>

                  <button
                    onClick={handleBlowCandles}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 text-xs font-bold bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg shadow-pink-500/30 hover:bg-pink-600 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <Flame className="w-3.5 h-3.5 shrink-0" />
                    <span>{candlesBlown ? "Relight Candles 🕯️" : "Blow Out Candles 💨"}</span>
                  </button>

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 italic">
                    &ldquo;Maya, you make the whole world brighter! Here is to your greatest year yet!&rdquo;
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Polaroid Photo Memory */}
            {activeTab === "photo" && (
              <div className="space-y-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white text-slate-900 p-3.5 pb-5 rounded-xl shadow-2xl rotate-1 transform hover:rotate-0 transition-transform duration-300 max-w-[240px]">
                  <div className="w-48 h-48 bg-gradient-to-tr from-pink-200 via-rose-200 to-amber-200 rounded-lg flex items-center justify-center text-4xl shadow-inner mb-3">
                    📸 ✨
                  </div>
                  <p className="font-handwriting font-bold text-center text-xs text-slate-800">
                    Paris Trip 2025 ❤️ Best memories!
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  Recipients can flip polaroids and view personalized photo memories.
                </p>
              </div>
            )}

          </div>

          {/* Bottom Call to Action */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 text-center sm:text-left">
              Loved this interaction? Create yours in 2 minutes.
            </span>
            <Link href="/create">
              <Button
                variant="primary"
                size="sm"
                className="shadow-lg shadow-pink-500/25 text-xs font-bold whitespace-nowrap"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
              >
                Build A Real Surprise
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
