"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Gift, Sparkles, PartyPopper, Heart, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InteractivePreviewSection() {
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleReset = () => {
    setIsUnwrapped(false);
    setCandlesBlown(false);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="outline" size="md" className="border-pink-500/40 text-pink-400 bg-pink-500/10">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Interactive Playground
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Try The Surprise Interaction
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Experience what your recipient feels when they receive your link. Click to interact below!
          </p>
        </div>

        {/* Interactive Playground Card */}
        <div className="max-w-xl mx-auto rounded-3xl bg-slate-800/80 border border-slate-700 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
          
          {/* Top Bar with simulation controls */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-700/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Recipient Live Preview Mode</span>
            </div>
            {isUnwrapped && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Preview
              </button>
            )}
          </div>

          {/* Surprise Stage */}
          <div className="min-h-[280px] flex flex-col items-center justify-center text-center p-4">
            {!isUnwrapped ? (
              <div className="space-y-6 flex flex-col items-center">
                <div
                  onClick={() => setIsUnwrapped(true)}
                  className="relative group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setIsUnwrapped(true)}
                  aria-label="Click to unwrap surprise"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
                  
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xl transform transition-transform group-hover:scale-105 group-active:scale-95 duration-200">
                    <Gift className="w-14 h-14 sm:w-16 sm:h-16 animate-bounce duration-700" />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-bold text-white">
                    You have 1 new surprise delivery 🎁
                  </p>
                  <p className="text-xs text-slate-400">
                    Tap the gift box to unlock the celebration
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex flex-col items-center animate-in zoom-in-90 duration-300 w-full">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-6 h-6 text-amber-400 animate-bounce" />
                  <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300 bg-clip-text text-transparent">
                    Happy Birthday Maya!
                  </span>
                  <PartyPopper className="w-6 h-6 text-pink-400 animate-bounce" />
                </div>

                {/* 3D Cake / Candle micro-interaction */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 w-full max-w-md text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      Step 2: Birthday Cake Scene
                    </span>
                    <button
                      onClick={() => setCandlesBlown(!candlesBlown)}
                      className="text-xs bg-pink-500/20 text-pink-300 px-2.5 py-1 rounded-full border border-pink-500/30 hover:bg-pink-500/30 transition-colors cursor-pointer"
                    >
                      {candlesBlown ? "Relight Candles 🕯️" : "Blow Candles 💨"}
                    </button>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">
                      {candlesBlown ? "🎂✨ (Wish Made!)" : "🎂🕯️🕯️🕯️"}
                    </div>
                    <p className="text-xs text-slate-300">
                      {candlesBlown
                        ? "✨ Candles blown! May all your heartfelt wishes come true."
                        : "Tap 'Blow Candles' or make a wish!"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                    &ldquo;Maya, you make every day brighter! Here is to the most wonderful 25th birthday adventure!&rdquo;
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Personalized 3D experience with spatial audio</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="mt-6 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 text-center sm:text-left">
              Ready to craft this for someone special?
            </span>
            <Link href="/create">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Build A Real Surprise
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
