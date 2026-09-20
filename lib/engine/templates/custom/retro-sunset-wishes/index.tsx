"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Gift, Play, Volume2 } from "lucide-react";

interface RetroSunsetProps {
  recipientName?: string;
  senderName?: string;
  message?: string;
  photos?: string[];
  audioUrl?: string;
}

export default function RetroSunsetWishesTemplate({
  recipientName = "Friend",
  senderName = "With Love",
  message = "Wishing you a warm, sunny and joyful birthday!",
  photos = [],
  audioUrl,
}: RetroSunsetProps) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-950 to-purple-950 text-amber-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-amber-950/60 border border-amber-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Retro Sunset Wishes</span>
        </div>

        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <h1 className="text-3xl font-black text-amber-200">
              Happy Birthday, {recipientName}! 🌅
            </h1>
            <p className="text-sm text-amber-300/80 leading-relaxed">
              Someone prepared a heartfelt retro celebration just for you.
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-black hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-amber-500/25"
            >
              Open Your Surprise 🎁
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-base text-amber-100 font-medium italic">
              "{message}"
            </p>
            <p className="text-xs text-amber-400 font-bold">— {senderName}</p>
          </div>
        )}
      </div>
    </div>
  );
}
