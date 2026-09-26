"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Gift, PartyPopper, Heart, Music, Cake, Camera, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Floating3DParticles } from "@/components/magicui/floating-3d-particles";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import confetti from "canvas-confetti";
import {
  BRAND_SUBTITLE,
  BRAND_SUPPORTING_LINE,
} from "@/lib/constants";

export function HeroSection() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#a855f7", "#3b82f6", "#f59e0b", "#10b981"],
    });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* 1. Ambient Background Layer: RetroGrid + Magic UI Floating 3D Particles Field */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <RetroGrid className="opacity-25 dark:opacity-20" angle={65} />
      </div>

      <Floating3DParticles
        className="absolute inset-0 pointer-events-none z-0"
        quantity={220}
        color={["#ec4899", "#d946ef", "#a855f7", "#c084fc", "#f43f5e", "#fbbf24"]}
        size={6}
        depth={0.7}
        drift={0.65}
        opacity={0.6}
      />

      {/* Decorative Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300/15 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Hero Copy */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6 relative z-10">
            <div className="inline-flex items-center">
              <Badge variant="gradient" size="md" className="gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Next-Gen Celebration Experiences</span>
              </Badge>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                DON’T JUST SEND A WISH.
              </h1>
              <SparklesText
                className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-[1.08]"
                colors={{ first: "#ec4899", second: "#f59e0b" }}
                sparklesCount={8}
              >
                SEND A SURPRISE.
              </SparklesText>
            </div>

            <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              {BRAND_SUBTITLE}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/create" className="w-full sm:w-auto">
                <ShimmerButton
                  shimmerColor="#f472b6"
                  shimmerSize="0.1em"
                  shimmerDuration="2.5s"
                  background="linear-gradient(to right, #ec4899, #d946ef, #8b5cf6)"
                  borderRadius="16px"
                  className="w-full sm:w-auto shadow-xl shadow-pink-500/25 px-7 py-3.5 text-base font-bold text-white flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <PartyPopper className="w-5 h-5 text-amber-200 shrink-0" />
                  <span>Create a Birthday Surprise</span>
                </ShimmerButton>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto whitespace-nowrap"
                  rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                >
                  Explore Experiences
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic pt-1">
              ✨ &ldquo;{BRAND_SUPPORTING_LINE}&rdquo;
            </p>
          </div>

          {/* Right Column: 3D Celestial Preview (Concentric Sphere & Orbiting Rings) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[560px]">
            
            {/* Concentric Orb & Orbit Container (Defines the exact geometric center for both) */}
            <div className="relative w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] flex items-center justify-center">
              
              {/* Concentric Orbiting Circles: Centered precisely on the sphere (origin 50% / 50%) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-visible">
                {/* Inner Orbit (Radius 225px): Cake, Music, Camera */}
                <OrbitingCircles
                  radius={225}
                  duration={24}
                  iconSize={44}
                  pathClassName="stroke-pink-600/65 dark:stroke-pink-400/25 stroke-[1.5]"
                >
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-pink-300/60 dark:border-pink-500/40 text-pink-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-purple-300/60 dark:border-purple-500/40 text-purple-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-amber-300/60 dark:border-amber-500/40 text-amber-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                </OrbitingCircles>

                {/* Outer Orbit (Radius 295px): Candle, Heart, Sparkles */}
                <OrbitingCircles
                  radius={295}
                  duration={34}
                  reverse
                  iconSize={44}
                  pathClassName="stroke-purple-600/65 dark:stroke-purple-400/25 stroke-[1.5]"
                >
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-rose-300/60 dark:border-rose-500/40 text-rose-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-pink-300/60 dark:border-pink-500/40 text-pink-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 fill-pink-500" />
                  </div>
                  <div className="p-2.5 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-xl border border-indigo-300/60 dark:border-indigo-500/40 text-indigo-500 flex items-center justify-center hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </OrbitingCircles>
              </div>

              {/* Ambient Floating Badges */}
              <div className="absolute -top-3 -left-4 z-30 animate-float pointer-events-none">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md shadow-lg border border-pink-500/40 text-[11px] font-bold text-pink-400">
                  <Gift className="w-3.5 h-3.5 text-pink-400" />
                  <span>3D Crystal Orb</span>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 -translate-y-1/2 z-30 animate-float pointer-events-none" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md shadow-lg border border-purple-500/40 text-[11px] font-bold text-purple-400">
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                  <span>Interactive Audio</span>
                </div>
              </div>

              {/* Spherical 3D Glass Crystal Orb (fills container 100%) */}
              <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-cyan-400/70 via-purple-400/50 to-pink-500/70 shadow-[0_0_60px_rgba(168,85,247,0.4),inset_0_0_35px_rgba(56,189,248,0.25)] backdrop-blur-xl z-10">
                
                {/* Specular Crescent Highlight (Glass Reflection) */}
                <div className="absolute top-2 left-1/4 w-1/2 h-14 bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-full blur-[1px] pointer-events-none z-20" />
                <div className="absolute bottom-3 inset-x-12 h-10 bg-gradient-to-t from-pink-500/25 to-transparent rounded-full blur-md pointer-events-none z-20" />

                {/* Inner Holographic Crystal Core */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#13172e]/95 via-[#0d0f1f]/98 to-[#070914] p-5 text-white flex flex-col items-center justify-between relative overflow-hidden border border-white/20">
                  
                  {/* Concentric rotating cosmic dashed ring inside */}
                  <div className="absolute inset-5 rounded-full border border-dashed border-cyan-400/20 animate-spin-around pointer-events-none" style={{ animationDuration: "40s" }} />

                  {/* Top Status Indicator */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200 shadow-sm mt-1 z-20">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Live Recipient View • Maya 🎂</span>
                  </div>

                  {/* Center Interactive Suspended 3D Surprise Gift Box */}
                  <div className="my-auto flex flex-col items-center text-center space-y-2 py-1 z-20">
                    <button
                      onClick={triggerConfetti}
                      className="relative group cursor-pointer focus:outline-none"
                      aria-label="Tap to unwrap surprise and trigger celebration confetti"
                    >
                      <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
                      <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-[0_12px_30px_rgba(236,72,153,0.5)] transform transition-transform group-hover:scale-110 active:scale-95 duration-200 border border-white/30">
                        <Gift className="w-11 h-11 sm:w-12 sm:h-12 animate-bounce duration-1000 text-white" />
                      </div>
                    </button>

                    <div className="space-y-0.5">
                      <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center justify-center gap-1.5">
                        <span>Tap To Unwrap</span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      </h2>
                      <p className="text-[10.5px] text-slate-300 max-w-[200px] leading-tight">
                        Interactive letterbox • Floating polaroids • Music & animations
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-pink-300 font-semibold bg-pink-500/20 px-3 py-0.5 rounded-full border border-pink-500/35 whitespace-nowrap">
                      <Heart className="w-3 h-3 fill-pink-400 shrink-0" />
                      <span>From Alex with love</span>
                    </div>
                  </div>

                  {/* Subtle lower depth text */}
                  <div className="text-[10px] text-slate-500 font-medium mb-1 z-20">
                    ✨ Recipient Smartphone Preview
                  </div>

                </div>
              </div>

            </div>

            {/* Detached Floating Iridescent Action Capsule Button - placed cleanly below with zero overlap */}
            <div className="mt-8 sm:mt-10 relative z-30">
              <Link href="/preview" className="group">
                <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_12px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(168,85,247,0.45)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_40px_rgba(236,72,153,0.7)] transition-all duration-300 transform group-hover:scale-105 active:scale-95">
                  <div className="px-6 py-2.5 rounded-full bg-[#0a0d1a]/98 border border-white/10 flex items-center gap-2 text-xs sm:text-sm font-black text-white tracking-wide backdrop-blur-xl">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                    <span>Test Live Recipient Experience</span>
                    <ArrowRight className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
