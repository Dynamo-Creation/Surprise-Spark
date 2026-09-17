"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Gift, PartyPopper, Heart, Music, Cake, Camera, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Particles } from "@/components/magicui/particles";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import confetti from "canvas-confetti";
import {
  BRAND_HEADLINE,
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
      {/* 1. Ambient Background Layer: RetroGrid + Dynamic Celebration Particles */}
      <RetroGrid className="opacity-35 dark:opacity-25" angle={65} />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={65}
        ease={80}
        color="#ec4899"
        refresh
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

          {/* Right Column: 3D Preview Box with Clearly Visible Wide Orbiting Circles */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[520px]">
            
            {/* Orbiting Circles Container with wide radii so circles orbit outside and in front */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-visible">
              {/* Inner Orbit (Radius 215px): Cake, Music, Camera */}
              <OrbitingCircles
                radius={215}
                duration={24}
                iconSize={44}
                pathClassName="stroke-pink-500/25 dark:stroke-pink-400/25 stroke-[1.5] stroke-dashed"
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

              {/* Outer Orbit (Radius 285px): Candle, Heart, Sparkles */}
              <OrbitingCircles
                radius={285}
                duration={34}
                reverse
                iconSize={44}
                pathClassName="stroke-purple-500/20 dark:stroke-purple-400/20 stroke-[1.5]"
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

            {/* Central 3D Preview Box: sleek, high-tech glassmorphism with BorderBeam */}
            <div className="relative w-full max-w-[310px] sm:max-w-[330px] z-10">
              
              {/* Ambient badge 1 */}
              <div className="absolute -top-3.5 -left-3 z-30 animate-float">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-pink-200 dark:border-pink-800 text-[11px] font-bold text-pink-600 dark:text-pink-400">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  <span>3D Gift Box</span>
                </div>
              </div>

              {/* Ambient badge 2 */}
              <div className="absolute -bottom-3.5 -right-3 z-30 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  <Music className="w-3.5 h-3.5 text-purple-500" />
                  <span>Interactive Audio</span>
                </div>
              </div>

              {/* Card Container with BorderBeam */}
              <div className="relative rounded-[28px] p-1.5 bg-gradient-to-b from-pink-400/40 via-purple-400/30 to-indigo-400/40 shadow-2xl shadow-purple-500/20 backdrop-blur-md">
                <div className="rounded-[24px] bg-slate-950/95 p-5 text-white flex flex-col items-center justify-between min-h-[440px] relative overflow-hidden border border-white/10">
                  
                  {/* Glowing Moving Laser BorderBeam */}
                  <BorderBeam
                    size={140}
                    duration={7}
                    delay={0}
                    colorFrom="#ec4899"
                    colorTo="#8b5cf6"
                    borderWidth={2}
                  />

                  {/* Top Phone Status Indicator */}
                  <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Recipient View
                    </span>
                    <span className="font-semibold text-slate-300">For Maya 🎂</span>
                  </div>

                  {/* Center Interactive 3D Mock Scene with Clickable Unwrap & Confetti Trigger */}
                  <div className="my-auto flex flex-col items-center text-center space-y-3.5 py-3">
                    <button
                      onClick={triggerConfetti}
                      className="relative group cursor-pointer focus:outline-none"
                      aria-label="Tap to unwrap surprise and trigger celebration confetti"
                    >
                      <div className="absolute -inset-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow" />
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-105 active:scale-95 duration-200">
                        <Gift className="w-12 h-12 animate-bounce duration-1000" />
                      </div>
                    </button>

                    <div className="space-y-1">
                      <h2 className="text-lg font-black tracking-tight">Tap To Unwrap</h2>
                      <p className="text-[11px] text-slate-400 max-w-[210px] leading-snug">
                        Interactive 3D scenes • Candles to blow • Floating memory gallery
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-pink-300 font-semibold bg-pink-500/15 px-3 py-1 rounded-full border border-pink-500/30 whitespace-nowrap">
                      <Heart className="w-3 h-3 fill-pink-400 shrink-0" />
                      <span>From Alex with love</span>
                    </div>
                  </div>

                  {/* Bottom Recipient Action Bar */}
                  <Link href="/s/sample-birthday-123" className="w-full relative z-10">
                    <Button variant="primary" size="md" className="w-full text-xs font-semibold py-2 shadow-md shadow-pink-500/20 whitespace-nowrap">
                      Test Live Recipient Link
                    </Button>
                  </Link>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
