"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Share2,
  Gift,
  Heart,
  Eye,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipientFinalScreenProps {
  recipientName?: string;
  senderName?: string;
  onReplay: () => void;
  onShare: () => void;
}

export function RecipientFinalScreen({
  recipientName,
  senderName,
  onReplay,
  onShare,
}: RecipientFinalScreenProps) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setMinimized(false)}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          className="shadow-2xl text-xs font-bold cursor-pointer"
        >
          View Celebration Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/15 text-center shadow-2xl space-y-6 relative">
        
        {/* Floating Heart Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-pink-500/30 animate-bounce">
          <Heart className="w-8 h-8 fill-white" />
        </div>

        {/* Required Headline */}
        <div className="space-y-2">
          <h2 id="final-screen-headline" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Did this make you smile? 😊
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
            {senderName
              ? `${senderName} crafted this special memory just for you.`
              : "A message takes seconds to read. A surprise becomes a memory."}
          </p>
        </div>

        {/* Primary Viral Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* 1. Create Your Own Surprise (The Viral Growth Loop CTA) */}
          <Link href="/create" className="block">
            <button
              id="btn-viral-create"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm tracking-wide shadow-xl shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4 text-amber-200" />
              <span>Create Your Own Surprise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          {/* 2. Replay & Share Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="btn-final-replay"
              onClick={onReplay}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              id="btn-final-share"
              onClick={onShare}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-pink-300 hover:text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Dismiss / Minimize to gaze at 3D scene */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center">
          <button
            onClick={() => setMinimized(true)}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Look around the 3D scene</span>
          </button>
        </div>
      </div>
    </div>
  );
}
