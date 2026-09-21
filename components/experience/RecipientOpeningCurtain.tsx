"use client";

import React, { useState } from "react";
import { Sparkles, Volume2, ArrowRight } from "lucide-react";
import { soundManager } from "@/lib/audio/soundManager";

interface RecipientOpeningCurtainProps {
  recipientName?: string;
  senderName?: string;
  templateSlug?: string;
  musicPreset?: string;
  onOpen: () => void;
}

export function RecipientOpeningCurtain({
  recipientName,
  senderName,
  templateSlug,
  musicPreset = "happy",
  onOpen,
}: RecipientOpeningCurtainProps) {
  const [isOpening, setIsOpening] = useState(false);
  const isProposal = templateSlug === "the-golden-proposal";

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Initialize Web Audio playback on user touch/click gesture
    try {
      soundManager.playSoundEffect("sparkle");
      soundManager.startBgm(isProposal ? "romantic" : musicPreset);
    } catch {
      // Audio autoplay fallback handled gracefully
    }

    // Smooth exit animation before unmounting curtain
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none touch-manipulation transition-all duration-700 ${
        isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic ambient particles & glowing nebulae */}
      <div
        className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse ${
          isProposal ? "bg-rose-500/25" : "bg-pink-500/20"
        }`}
      />
      <div
        className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse ${
          isProposal ? "bg-amber-500/20" : "bg-purple-600/20"
        }`}
      />

      {/* Floating Envelope Box */}
      <div className="relative z-10 max-w-sm w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Pulsing 3D Icon Container */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-60 animate-ping ${
              isProposal
                ? "bg-gradient-to-tr from-rose-500 to-amber-400"
                : "bg-gradient-to-tr from-pink-500 to-purple-600"
            }`}
          />
          <div
            className={`relative w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transform hover:scale-110 transition-transform duration-300 ${
              isProposal
                ? "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 shadow-rose-500/40"
                : "bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 shadow-pink-500/30"
            }`}
          >
            {isProposal ? "💍" : "🎁"}
          </div>
        </div>

        {/* Cinematic Opening Text */}
        <div className="space-y-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase ${
              isProposal
                ? "bg-rose-950/60 border-rose-500/30 text-rose-300"
                : "bg-white/10 border-white/15 text-pink-300"
            }`}
          >
            <Sparkles className={`w-3 h-3 ${isProposal ? "text-amber-400" : "text-pink-400"}`} />
            <span>{isProposal ? "A Heartfelt Proposal Surprise" : "A Special Surprise"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {isProposal
              ? `${recipientName ? `${recipientName}, someone` : "Someone"} has a question from the heart for you...`
              : "Someone has prepared something special for you..."}
          </h1>

          {senderName && (
            <p className={`text-xs font-semibold ${isProposal ? "text-rose-300" : "text-pink-400"}`}>
              Crafted with all their love by <strong>{senderName}</strong> 💕
            </p>
          )}

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Turn up your volume for romantic music & chimes</span>
          </p>
        </div>

        {/* Intentional OPEN Button */}
        <div className="pt-2">
          <button
            id="btn-open-surprise"
            onClick={handleOpenClick}
            disabled={isOpening}
            className={`w-full py-4 px-8 rounded-2xl text-white font-black text-base tracking-wider uppercase shadow-xl transform hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group ${
              isProposal
                ? "bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-rose-500/35"
                : "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-pink-500/30"
            }`}
          >
            <span>{isOpening ? "Opening..." : isProposal ? "OPEN SURPRISE 💖" : "OPEN"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Subtle Brand Tagline */}
        <p className="text-[11px] text-slate-500 font-medium">
          {isProposal
            ? "SurpriseSpark • Every great love story begins with a single moment."
            : "SurpriseSpark • A message takes seconds. A surprise becomes a memory."}
        </p>
      </div>
    </div>
  );
}
