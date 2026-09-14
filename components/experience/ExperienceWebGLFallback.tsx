"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExperienceWebGLFallbackProps {
  recipientName: string;
  senderName?: string;
  message: string;
  photos?: string[];
  onFinish?: () => void;
}

export function ExperienceWebGLFallback({
  recipientName,
  senderName,
  message,
  photos = [],
  onFinish,
}: ExperienceWebGLFallbackProps) {
  const [stage, setStage] = useState<"gift" | "revealed">("gift");

  return (
    <div className="min-h-[500px] w-full flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Dynamic ambient CSS glows */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {stage === "gift" ? (
        <div className="relative z-10 space-y-6 max-w-sm w-full animate-in fade-in duration-300">
          <div
            onClick={() => setStage("revealed")}
            className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-7xl shadow-2xl shadow-pink-500/40 transform hover:scale-110 active:scale-95 transition-all cursor-pointer animate-bounce"
            title="Tap to unwrap"
          >
            🎁
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">
              A Gift for {recipientName}
            </h3>
            <p className="text-xs text-slate-300">
              Tap the gift box above to unwrap your surprise!
            </p>
          </div>

          <button
            onClick={() => setStage("revealed")}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Tap to Unwrap ✨
          </button>
        </div>
      ) : (
        <div className="relative z-10 space-y-6 max-w-md w-full animate-in zoom-in-95 duration-500">
          {/* Confetti Celebration Header */}
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mx-auto shadow-lg text-3xl">
            🎉
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">
              Happy Birthday, {recipientName}! 🎂
            </h3>
            {senderName && (
              <p className="text-xs text-pink-400 font-bold">
                From {senderName} with love
              </p>
            )}
          </div>

          {/* Photo Gallery if present */}
          {photos.length > 0 && photos[0] && (
            <div className="relative mx-auto max-w-[280px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[0]}
                alt="Celebration moment"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Heartfelt Letter */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-2 shadow-xl">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-300 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              <span>A Personal Message</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              &ldquo;{message}&rdquo;
            </p>
          </div>

          {onFinish && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={onFinish}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full text-xs font-bold shadow-lg cursor-pointer"
              >
                Continue to Celebration
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
