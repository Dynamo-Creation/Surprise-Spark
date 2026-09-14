"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  PartyPopper,
  Flame,
  ArrowRight,
} from "lucide-react";
import { SurpriseExperience } from "@/types/experience";
import { Button } from "@/components/ui/button";

export function RecipientExperienceView({
  surprise,
}: {
  surprise: SurpriseExperience;
}) {
  const [unwrapped, setUnwrapped] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleReset = () => {
    setUnwrapped(false);
    setCandlesBlown(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* Background Animated Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Recipient Top Status Bar */}
      <header className="relative z-20 w-full px-5 py-4 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">
            For {surprise.recipient.name} 🎂
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle background audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
          </button>

          {unwrapped && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-xl mx-auto w-full text-center">
        {!unwrapped ? (
          /* Stage 1: The Closed Mystery Gift Box */
          <div className="space-y-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Special Delivery
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Someone Sent You A Surprise!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                With heartfelt love from <span className="text-pink-400 font-semibold">{surprise.sender.name}</span>.
              </p>
            </div>

            {/* Interactive Gift Trigger */}
            <div
              onClick={() => setUnwrapped(true)}
              className="relative group cursor-pointer my-4"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setUnwrapped(true)}
              aria-label="Tap to unwrap surprise"
            >
              <div className="absolute -inset-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full blur-2xl opacity-60 group-hover:opacity-90 animate-pulse-glow" />
              
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-pink-500/30 transform transition-transform group-hover:scale-105 group-active:scale-95 duration-200">
                <Gift className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce duration-700" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-white tracking-wide uppercase">
                Tap Box To Unwrap
              </p>
              <p className="text-xs text-slate-400">
                Turn on your volume for the full experience 🎧
              </p>
            </div>

          </div>
        ) : (
          /* Stage 2: Celebration Reveal */
          <div className="w-full space-y-6 animate-in zoom-in-90 duration-500">
            
            {/* Header Cheers */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-amber-300 font-semibold text-xs bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Happy Birthday {surprise.recipient.name}!</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-300 via-rose-200 to-purple-300 bg-clip-text text-transparent">
                Make A Wish & Celebrate!
              </h1>
            </div>

            {/* Interactive 3D Cake / Candle Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Interactive Scene 1/2</span>
                <button
                  onClick={() => setCandlesBlown(!candlesBlown)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/30 transition-colors cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  {candlesBlown ? "Relight Candles" : "Blow Candles"}
                </button>
              </div>

              <div className="py-6 flex flex-col items-center">
                <div className="text-6xl sm:text-7xl mb-3 transform hover:scale-105 transition-transform duration-300">
                  {candlesBlown ? "🎂✨🎉" : "🎂🕯️🕯️🕯️"}
                </div>
                <p className="text-sm font-semibold text-white">
                  {candlesBlown
                    ? "✨ The candles are blown! Wishes sent to the universe!"
                    : "Tap 'Blow Candles' to make your wish!"}
                </p>
              </div>

              {/* Heartfelt Sender Letter */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  A Letter From {surprise.sender.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal italic">
                  &ldquo;{surprise.customMessage}&rdquo;
                </p>
                <p className="text-right text-xs text-pink-400 font-semibold pt-1">
                  — Forever your {surprise.sender.relationship || "friend"}, {surprise.sender.name}
                </p>
              </div>
            </div>

            {/* Photo Memories Strip */}
            {surprise.photos.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shared Memories
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {surprise.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="p-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-1"
                    >
                      <div className="w-full h-24 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-500 overflow-hidden">
                        {/* Photo placeholder */}
                        <div className="w-full h-full bg-gradient-to-tr from-pink-900/30 to-purple-900/30 flex items-center justify-center text-pink-300 text-xs font-semibold">
                          📸 Memory #{photo.id}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate px-1">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Replay & Action */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="border-slate-800 text-slate-300"
              >
                Replay Surprise
              </Button>
            </div>

          </div>
        )}
      </main>

      {/* Recipient Experience Footer - Viral loop */}
      <footer className="relative z-20 w-full px-5 py-4 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>Made with SurpriseSpark</span>
        </p>

        <Link href="/create" className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1">
          <span>Create a surprise for someone you love</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>

    </div>
  );
}
