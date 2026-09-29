"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, PartyPopper, Heart, ShieldCheck, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Ballpit } from "@/components/reactbits/Ballpit";
import confetti from "canvas-confetti";
import {
  BRAND_SUBTITLE,
  BRAND_SUPPORTING_LINE,
} from "@/lib/constants";

export function HeroSection() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#a855f7", "#3b82f6", "#f59e0b", "#10b981", "#06b6d4"],
    });
  };

  return (
    <section className="relative overflow-hidden min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] flex items-center justify-center pt-10 pb-16 md:pt-16 md:pb-24">
      {/* 1. React Bits Ballpit: Physics-Powered 3D Interactive Spheres for ALL Devices */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto">
        <Ballpit
          count={80}
          gravity={0.15}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}
          minSize={0.65}
          maxSize={1.25}
          colors={[0xec4899, 0xa855f7, 0x3b82f6, 0xf43f5e, 0xfbbf24, 0x06b6d4]}
          className="w-full h-full"
        />
      </div>

      {/* 2. Subtle ambient glow behind canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-purple-500/5 to-transparent pointer-events-none -z-10" />

      {/* 3. Hero Content Container: Pointer-events-none on wrapper so cursor & touch interact with Ballpit */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
        
        {/* Top Celebration Pill Badge */}
        <div className="inline-flex items-center mb-5 pointer-events-auto">
          <Badge
            variant="gradient"
            size="md"
            className="gap-2 shadow-lg backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-pink-500/30 px-3.5 py-1.5 hover:scale-105 transition-transform cursor-default"
          >
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0 animate-pulse" />
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              Next-Gen Celebration Experiences
            </span>
          </Badge>
        </div>

        {/* Grand Headline with High-Contrast Legibility & Glow */}
        <div className="space-y-1 sm:space-y-2 mb-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] drop-shadow-xs">
            DON’T JUST SEND A WISH.
          </h1>
          <SparklesText
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-[1.08] drop-shadow-sm"
            colors={{ first: "#ec4899", second: "#f59e0b" }}
            sparklesCount={10}
          >
            SEND A SURPRISE.
          </SparklesText>
        </div>

        {/* Subtitle with Frosted Card for Flawless Readability */}
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-base sm:text-lg md:text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed px-4 py-2 rounded-2xl backdrop-blur-xs bg-white/40 dark:bg-slate-950/40 border border-white/20 dark:border-white/10 shadow-xs inline-block">
            {BRAND_SUBTITLE}
          </p>
        </div>

        {/* Action CTA Buttons (Fully Interactive) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8 pointer-events-auto">
          <Link href="/create" className="w-full sm:w-auto" onClick={triggerConfetti}>
            <ShimmerButton
              shimmerColor="#f472b6"
              shimmerSize="0.12em"
              shimmerDuration="2.5s"
              background="linear-gradient(to right, #ec4899, #d946ef, #8b5cf6)"
              borderRadius="16px"
              className="w-full sm:w-auto shadow-xl shadow-pink-500/25 px-7 py-3.5 text-base font-bold text-white flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 transition-transform"
            >
              <PartyPopper className="w-5 h-5 text-amber-200 shrink-0" />
              <span>Create a Birthday Surprise</span>
            </ShimmerButton>
          </Link>
          
          <Link href="/templates" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto whitespace-nowrap backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-700 font-bold hover:bg-white dark:hover:bg-slate-800 shadow-md active:scale-95 transition-transform"
              rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
            >
              Explore Experiences
            </Button>
          </Link>

          <Link href="/preview" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto whitespace-nowrap text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:bg-pink-50/50 dark:hover:bg-pink-950/30 font-bold active:scale-95 transition-transform"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />}
            >
              Test Live View
            </Button>
          </Link>
        </div>

        {/* Interactive Ballpit Play Hint & Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-pink-500/25 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>🏀 Touch or move cursor to scatter 3D spheres</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Instant delivery</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% private links</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
            <Smartphone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Seamless on any device</span>
          </div>
        </div>

        {/* Supporting Quote */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic pt-4">
          ✨ &ldquo;{BRAND_SUPPORTING_LINE}&rdquo;
        </p>

      </div>
    </section>
  );
}
