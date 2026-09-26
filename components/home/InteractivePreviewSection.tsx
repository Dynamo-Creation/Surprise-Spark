"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartBlossomCanvas } from "@/components/home/HeartBlossomCanvas";
import confetti from "canvas-confetti";

type ActType = "arrow" | "blossom" | "wish";

export function InteractivePreviewSection() {
  const [activeAct, setActiveAct] = useState<ActType>("arrow");
  const [arrowState, setArrowState] = useState<"idle" | "pulling" | "flying" | "hit">("idle");
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAudioSimulated, setIsAudioSimulated] = useState<boolean>(true);
  const [, setUserInteracted] = useState<boolean>(false);

  const startYRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Fire arrow to the heart
  const fireArrow = () => {
    setArrowState("flying");
    setUserInteracted(true);

    setTimeout(() => {
      setArrowState("hit");
      setPullDistance(0);

      // Fire romantic confetti explosion
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.45 },
        colors: ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24", "#e879f9"],
        ticks: 200,
      });

      // Transition to Act 2 (Blossom) after impact
      timerRef.current = setTimeout(() => {
        setActiveAct("blossom");
      }, 1500);
    }, 280);
  };

  // Interactive Pull & Release Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (arrowState === "flying" || arrowState === "hit") return;
    setIsDragging(true);
    setArrowState("pulling");
    startYRef.current = e.clientY;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || arrowState === "flying" || arrowState === "hit") return;
    const delta = e.clientY - startYRef.current;
    // Pull downward (0 to 75px)
    const clamped = Math.max(0, Math.min(75, delta));
    setPullDistance(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (pullDistance >= 22) {
      // Released with sufficient tension -> SHOOT!
      fireArrow();
    } else {
      // Insufficient pull -> spring back smoothly
      setArrowState("idle");
      setPullDistance(0);
    }
  };

  // Programmatic pull-and-fire helper
  const handleAutoPullAndFire = () => {
    if (arrowState === "flying" || arrowState === "hit" || isDragging) return;
    setArrowState("pulling");
    let current = 0;
    const step = 10;
    const interval = setInterval(() => {
      current += step;
      if (current >= 65) {
        clearInterval(interval);
        setPullDistance(65);
        setTimeout(() => {
          fireArrow();
        }, 120);
      } else {
        setPullDistance(current);
      }
    }, 24);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setArrowState("idle");
    setPullDistance(0);
    setIsDragging(false);
    setActiveAct("arrow");
  };

  // Calculated SVG Bowstring tension coordinates
  const nockY = 96 + pullDistance * 1.1;
  const tensionPercent = Math.min(100, Math.round((pullDistance / 65) * 100));

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-950 via-[#0a0614] to-slate-950 text-white relative overflow-hidden">
      {/* 1. Ambient Dynamic Aurora Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Subtle Star / Dust Motes */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge
            variant="outline"
            size="md"
            className="border-rose-500/40 text-rose-300 bg-rose-500/10 backdrop-blur-md px-4 py-1.5 shadow-lg shadow-rose-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Interactive Mobile Playground</span>
          </Badge>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Experience The Magic
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            See exactly what your recipient feels when they open your surprise link on their smartphone.
            Pull back the bow, watch the heart bloom, and reveal the handwritten wish.
          </p>
        </div>

        {/* 2-Column Split: Custom Smartphone Mockup on Left, Story Act Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Phone Simulator Console (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Simulator Top Controls Bar */}
            <div className="w-full max-w-[340px] flex items-center justify-between px-3 py-2 mb-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-xs text-slate-400 shadow-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold text-slate-200 text-[11px]">Smartphone Preview</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAudioSimulated(!isAudioSimulated)}
                  className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                  title="Toggle simulated lo-fi music"
                >
                  {isAudioSimulated ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span className="hidden sm:inline">Lo-Fi</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Muted</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Restart simulation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* The Smartphone Mockup from postponed-wedding-announcement */}
            <div className="relative group w-full max-w-[340px]">
              
              {/* Dynamic Aura behind the phone */}
              <div
                className={`absolute -inset-4 rounded-[60px] blur-2xl opacity-70 transition-all duration-700 pointer-events-none -z-10 ${
                  activeAct === "arrow"
                    ? "bg-gradient-to-tr from-rose-600/30 via-pink-600/30 to-amber-500/20"
                    : activeAct === "blossom"
                    ? "bg-gradient-to-tr from-purple-600/30 via-rose-600/30 to-fuchsia-500/20"
                    : "bg-gradient-to-tr from-amber-500/30 via-rose-500/30 to-amber-600/20"
                }`}
              />

              {/* Physical Smartphone Chassis (White face with dark charcoal border, matching 3900029.jpg) */}
              <div className="relative rounded-[52px] bg-white border-[3.5px] border-[#2c3238] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center pt-5 pb-5 px-3">
                
                {/* Physical Left Side Buttons */}
                <div className="absolute -left-[7px] top-[95px] w-[4px] h-[22px] bg-[#2c3238] rounded-l-md" />
                <div className="absolute -left-[7px] top-[140px] w-[4px] h-[48px] bg-[#2c3238] rounded-l-md" />
                <div className="absolute -left-[7px] top-[205px] w-[4px] h-[48px] bg-[#2c3238] rounded-l-md" />
                
                {/* Physical Right Side Power Button */}
                <div className="absolute -right-[7px] top-[135px] w-[4px] h-[64px] bg-[#2c3238] rounded-r-md" />

                {/* Top Bezel: Centered Speaker Pill + Camera Dot */}
                <div className="w-full flex items-center justify-center gap-3 mb-3.5 px-4 pointer-events-none">
                  <div className="w-14 h-2 bg-[#2c3238] rounded-full shadow-inner" />
                  <div className="w-2.5 h-2.5 bg-[#2c3238] rounded-full shadow-inner" />
                </div>

                {/* Inner Screen Display Viewport */}
                <div className="relative w-full h-[510px] rounded-sm overflow-hidden bg-slate-950 flex flex-col select-none border border-slate-200 shadow-inner">
                  
                  {/* Simulated Audio Indicator Bar */}
                  {isAudioSimulated && (
                    <div className="absolute top-2.5 left-0 right-0 z-30 flex items-center justify-center gap-1.5 pointer-events-none">
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[10px] text-white/90 shadow-sm">
                        <span className="w-1 h-2.5 bg-rose-400 rounded-full animate-bounce" />
                        <span className="w-1 h-3.5 bg-rose-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        <span className="ml-1 font-medium text-[9px] text-rose-200">Birthday Lo-Fi</span>
                      </div>
                    </div>
                  )}

                  {/* ACT 1: CUPID'S ARROW (THE INVITATION) - PULL & RELEASE */}
                  {activeAct === "arrow" && (
                    <div className="relative w-full h-full flex flex-col items-center justify-between pt-10 pb-4 px-3 overflow-hidden bg-[radial-gradient(120%_88%_at_50%_24%,#fff8f1_0%,#fff6ee_38%,#f9e2d2_74%,#f2c9b8_100%)] text-slate-800 transition-all duration-500">
                      
                      {/* Floating Light Motes */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <span className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-amber-200/60 blur-[1px] animate-float" />
                        <span className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-rose-300/50 blur-[1px] animate-float [animation-delay:1s]" />
                        <span className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-amber-100/70 blur-[2px] animate-float [animation-delay:2s]" />
                      </div>

                      {/* Header Eyebrow */}
                      <div className="text-center space-y-0.5 relative z-10">
                        <p className="font-cormorant italic text-rose-800 font-semibold text-base tracking-wider drop-shadow-sm">
                          a little something, for my love
                        </p>
                        <p className="text-[10px] text-rose-900/70 font-semibold tracking-wide uppercase">
                          Pull back bowstring &amp; release
                        </p>
                      </div>

                      {/* The Target Heart */}
                      <div className="relative flex items-center justify-center my-auto">
                        {/* Radial aura behind heart */}
                        <div
                          className={`absolute w-32 h-32 rounded-full bg-rose-500/25 blur-xl transition-all duration-300 pointer-events-none ${
                            arrowState === "hit" ? "scale-150 opacity-90 bg-rose-500/50" : "scale-100 opacity-60 animate-pulse-glow"
                          }`}
                        />

                        {/* Heart SVG */}
                        <div
                          className={`relative transition-transform duration-300 ${
                            arrowState === "hit"
                              ? "scale-125 translate-y-2 animate-bounce"
                              : "scale-100 animate-pulse"
                          }`}
                        >
                          <svg
                            viewBox="0 0 100 92"
                            className="w-24 h-24 drop-shadow-[0_10px_20px_rgba(168,15,64,0.35)]"
                          >
                            <defs>
                              <radialGradient id="hg-target-mockup" cx="38%" cy="30%" r="80%">
                                <stop offset="0%" stopColor="#ffd9e4" />
                                <stop offset="42%" stopColor="#ff6f97" />
                                <stop offset="82%" stopColor="#d81e57" />
                                <stop offset="100%" stopColor="#9d0f3e" />
                              </radialGradient>
                              <linearGradient id="hsheen-target-mockup" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                                <stop offset="34%" stopColor="rgba(255,255,255,0)" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z"
                              fill="url(#hg-target-mockup)"
                            />
                            <path
                              d="M50 86.5C26 68 10.5 53.6 10.5 34.6 10.5 20.4 21 11 33.2 11c8.6 0 14.2 4.7 16.8 11.4C52.6 15.7 58.2 11 66.8 11 79 11 89.5 20.4 89.5 34.6 89.5 53.6 74 68 50 86.5Z"
                              fill="url(#hsheen-target-mockup)"
                              opacity="0.7"
                            />
                            <ellipse
                              cx="34"
                              cy="30"
                              rx="8.5"
                              ry="5.4"
                              fill="#fff"
                              opacity="0.72"
                              style={{ mixBlendMode: "screen" }}
                            />
                          </svg>

                          {/* Hit flash sparkles */}
                          {arrowState === "hit" && (
                            <span className="absolute -top-3 -right-3 text-2xl animate-ping">
                              ✨
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Archery Rig: PULL & RELEASE ZONE */}
                      <div
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className="relative w-full flex flex-col items-center pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
                        style={{ touchAction: "none" }}
                        role="slider"
                        aria-label="Pull back bowstring and release to shoot arrow"
                        aria-valuenow={tensionPercent}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAutoPullAndFire();
                          }
                        }}
                      >
                        {/* Aim guide line (Glows brighter as user pulls) */}
                        <div
                          className={`w-0.5 h-20 bg-gradient-to-t from-rose-500 to-transparent transition-opacity duration-150 pointer-events-none mb-1 ${
                            pullDistance > 0 ? "opacity-100 shadow-[0_0_8px_rgba(244,63,94,0.8)]" : "opacity-25"
                          }`}
                        />

                        {/* Interactive Bow & Arrow SVG with Dynamic String Deformation */}
                        <div className="relative group">
                          <svg
                            viewBox="0 0 460 260"
                            className="w-44 h-auto drop-shadow-[0_8px_16px_rgba(90,40,15,0.35)] overflow-visible"
                          >
                            <defs>
                              <linearGradient id="limb-grad-pull" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#4a2a1a" />
                                <stop offset="0.18" stopColor="#6b3f24" />
                                <stop offset="0.5" stopColor="#8a5127" />
                                <stop offset="0.82" stopColor="#6b3f24" />
                                <stop offset="1" stopColor="#4a2a1a" />
                              </linearGradient>
                              <linearGradient id="gold-arrow-pull" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#ffe38c" />
                                <stop offset="0.45" stopColor="#f4a626" />
                                <stop offset="1" stopColor="#a85f0e" />
                              </linearGradient>
                            </defs>

                            {/* Bow Wooden Limbs with dynamic flex */}
                            <path
                              d={
                                pullDistance > 0
                                  ? `M34 96 C 118 ${168 + pullDistance * 0.15}, 168 ${240 + pullDistance * 0.15}, 230 252 C 292 ${240 + pullDistance * 0.15}, 342 ${168 + pullDistance * 0.15}, 426 96`
                                  : "M34 96 C 118 168, 168 240, 230 252 C 292 240, 342 168, 426 96"
                              }
                              fill="none"
                              stroke="url(#limb-grad-pull)"
                              strokeWidth={14 + pullDistance * 0.05}
                              strokeLinecap="round"
                              className="transition-all duration-75"
                            />
                            {/* Grip */}
                            <rect x="216" y="206" width="28" height="60" rx="9" fill="#2a1a10" />

                            {/* Bowstring Left: Anchored at tip (40, 70), pulled back to dynamic nock */}
                            <line
                              x1="40"
                              y1="70"
                              x2="230"
                              y2={nockY}
                              stroke="#9a8068"
                              strokeWidth={pullDistance > 0 ? "2.8" : "2.2"}
                              strokeLinecap="round"
                            />
                            {/* Bowstring Right: Anchored at tip (420, 70), pulled back to dynamic nock */}
                            <line
                              x1="420"
                              y1="70"
                              x2="230"
                              y2={nockY}
                              stroke="#9a8068"
                              strokeWidth={pullDistance > 0 ? "2.8" : "2.2"}
                              strokeLinecap="round"
                            />
                            {/* Center Serving Nock Bead */}
                            <circle
                              cx="230"
                              cy={nockY}
                              r={5 + pullDistance * 0.03}
                              fill="#6f5137"
                            />
                          </svg>

                          {/* The Arrow attached to string during draw / shooting */}
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all ${
                              arrowState === "flying"
                                ? "-top-52 opacity-90 scale-95 duration-200 ease-in"
                                : arrowState === "hit"
                                ? "-top-48 opacity-0 duration-150"
                                : "duration-75"
                            }`}
                            style={{
                              top: arrowState === "flying" || arrowState === "hit" ? undefined : `${12 + pullDistance * 0.9}px`,
                            }}
                          >
                            <svg viewBox="0 0 64 220" className="w-7 h-auto drop-shadow-md">
                              {/* Shaft */}
                              <rect x="29.4" y="30" width="5.2" height="168" rx="2.6" fill="#4a2c14" />
                              {/* Wings */}
                              <path
                                d="M31 30 C 10 16, 2 20, 4 34 C 12 30, 20 32, 31 40 Z"
                                fill="#ffffff"
                                stroke="rgba(196,132,58,0.7)"
                                strokeWidth="1"
                              />
                              <path
                                d="M33 30 C 54 16, 62 20, 60 34 C 52 30, 44 32, 33 40 Z"
                                fill="#ffffff"
                                stroke="rgba(196,132,58,0.7)"
                                strokeWidth="1"
                              />
                              {/* Arrowhead Heart in Gold */}
                              <path
                                d="M32 12 C 30 7, 22 6.5, 21.5 13 C 21 18, 27 22, 32 27 C 37 22, 43 18, 42.5 13 C 42 6.5, 34 7, 32 12 Z"
                                fill="url(#gold-arrow-pull)"
                                stroke="#a5701a"
                                strokeWidth="0.8"
                              />
                              {/* Fletchings */}
                              <path
                                d="M32 150 C 16 156, 10 178, 15 200 C 24 194, 30 184, 32 176 Z"
                                fill="#ff7f9c"
                              />
                              <path
                                d="M32 150 C 48 156, 54 178, 49 200 C 40 194, 34 184, 32 176 Z"
                                fill="#e6396a"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Interactive Drag Tension Bar & Dynamic Instructions */}
                        <div className="mt-3 flex flex-col items-center gap-1.5 w-full max-w-[210px]">
                          {/* Live Tension Bar */}
                          <div className="w-full bg-rose-950/15 rounded-full h-1.5 overflow-hidden border border-rose-900/20">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600 transition-all duration-75"
                              style={{ width: `${tensionPercent}%` }}
                            />
                          </div>

                          {/* Dynamic Instructional Cue */}
                          <div className="flex items-center gap-1 text-[11px] font-bold">
                            {arrowState === "hit" ? (
                              <span className="text-emerald-700 animate-pulse">🎉 Heart Unlocked!</span>
                            ) : pullDistance >= 22 ? (
                              <span className="text-rose-600 animate-bounce font-extrabold">
                                ⚡ Release now to shoot!
                              </span>
                            ) : isDragging ? (
                              <span className="text-amber-800">
                                Pull down further... ({tensionPercent}%)
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleAutoPullAndFire}
                                className="cursor-pointer text-rose-800 hover:text-rose-950 underline decoration-rose-400 underline-offset-2 transition-colors flex items-center gap-1 font-semibold"
                              >
                                <span>↓ Drag down bow &amp; release</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACT 2: BIRTHDAY BLOSSOM (CANVAS CHERRY HEART TREE) */}
                  {activeAct === "blossom" && (
                    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#12060c] text-white">
                      
                      {/* Cinema Letterbox Bars */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-[#12040b] z-20 pointer-events-none border-b border-rose-900/30 flex items-center justify-center">
                        <span className="text-[9px] tracking-widest text-rose-300/80 uppercase font-mono">
                          Act II • Bloom
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-9 bg-[#12040b] z-20 pointer-events-none border-t border-rose-900/30 flex items-center justify-between px-3">
                        <span className="text-[9px] text-rose-200/70 font-cormorant italic">
                          to the sweetest soul in the world
                        </span>
                        <span className="text-[9px] text-amber-300 font-semibold flex items-center gap-1">
                          <span>✨</span>
                          <span>Make a wish</span>
                        </span>
                      </div>

                      {/* Kinetic Typography Overlay */}
                      <div className="absolute top-10 left-0 right-0 z-10 text-center px-4 pointer-events-none">
                        <p className="font-cormorant italic text-xs tracking-wider text-rose-300 drop-shadow">
                          make a wish…
                        </p>
                        <h3 className="font-serif font-black text-base sm:text-lg text-[#ffdfd2] tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(255,180,90,0.5)]">
                          Happy Birthday, My Love
                        </h3>
                        {/* Gold hand-drawn underline */}
                        <svg
                          viewBox="0 0 300 26"
                          fill="none"
                          className="w-32 mx-auto text-amber-400 drop-shadow-[0_2px_6px_rgba(255,180,90,0.6)] -mt-1"
                        >
                          <path
                            d="M8 16C56 7 132 4 178 6c30 1 78 5 114 12-40 3-108 4-176 3"
                            stroke="currentColor"
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* The Heart Blossom Canvas Component */}
                      <div className="w-full h-full pt-8 pb-9">
                        <HeartBlossomCanvas speedMultiplier={1.1} />
                      </div>

                      {/* Quick Advance Button inside Phone */}
                      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-30">
                        <button
                          onClick={() => setActiveAct("wish")}
                          className="cursor-pointer px-3.5 py-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white font-semibold text-[11px] backdrop-blur-md shadow-md border border-rose-300/30 flex items-center gap-1.5 transition-all"
                        >
                          <span>Next: The Wish</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACT 3: THE WISH (CALLIGRAPHIC FOREVER & ALWAYS) */}
                  {activeAct === "wish" && (
                    <div className="relative w-full h-full flex flex-col justify-between pt-12 pb-6 px-5 overflow-hidden bg-gradient-to-b from-[#fffaf4] via-[#fff5eb] to-[#f9e5d8] text-slate-800">
                      
                      {/* Film Grain & Soft Vignette Layer */}
                      <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_42%,transparent_54%,rgba(60,18,30,0.12)_84%,rgba(40,12,22,0.25)_100%)] pointer-events-none z-10" />

                      {/* Background Floating Petals in Act 3 */}
                      <div className="absolute -top-10 -right-10 w-44 h-44 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

                      {/* Top Romantic Eyebrow */}
                      <div className="relative z-20 space-y-0.5">
                        <p className="font-cormorant italic text-xs text-[#9c4f63] font-semibold tracking-wider">
                          and… forever &amp; always
                        </p>
                        
                        {/* Calligraphic Handwriting Headline in Great Vibes */}
                        <div className="relative inline-block py-0.5">
                          <h1 className="font-vibes text-4xl leading-tight bg-gradient-to-b from-[#e85a83] via-[#c41f52] to-[#9c0f42] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(130,18,55,0.3)] animate-in fade-in zoom-in-95 duration-700">
                            Happy Birthday
                          </h1>
                          <span className="absolute -right-3 -top-1 text-amber-400 text-lg animate-pulse">
                            ✦
                          </span>
                        </div>

                        {/* Gold Rule */}
                        <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent shadow-sm" />

                        <p className="font-cormorant italic font-semibold text-[11px] text-[#6e3f4a] pt-0.5">
                          here&rsquo;s to us and a love that blooms
                        </p>
                      </div>

                      {/* Personalized Love Letter Note Card */}
                      <div className="relative z-20 p-3.5 rounded-2xl bg-white/75 backdrop-blur-md border border-rose-200/60 shadow-lg shadow-rose-950/5 space-y-2">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                          <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-xs">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span>Secret Note Unlocked</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">09:42 PM</span>
                        </div>

                        <p className="font-cormorant text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                          &ldquo;Maya, every year with you feels like the greatest adventure. You fill my world with warmth, laughter, and so much color. Here&rsquo;s to your best chapter yet!&rdquo;
                        </p>

                        <div className="pt-0.5 flex items-center justify-between text-[10px] text-rose-800 font-bold">
                          <span>With all my love ❤️</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-mono">
                            #WhispersOfLove
                          </span>
                        </div>
                      </div>

                      {/* Replay Button in Phone */}
                      <div className="relative z-20 flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={handleReset}
                          className="cursor-pointer px-3.5 py-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/30 flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Replay From Act 1</span>
                        </button>

                        <Link href="/create">
                          <button className="cursor-pointer px-3 py-1.5 rounded-full bg-slate-900 text-amber-300 font-bold text-xs hover:bg-black transition-all flex items-center gap-1">
                            <span>Send This</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Chin: Iconic Circular Home Touch Button (from 3900029.jpg) */}
                <div className="w-full flex items-center justify-center pt-3 pb-1">
                  <button
                    onClick={handleReset}
                    type="button"
                    title="Click home button to reset simulation"
                    className="w-12 h-12 rounded-full border-2 border-[#d5d9de] bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] shadow-inner flex items-center justify-center cursor-pointer hover:border-rose-400 active:scale-95 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full border border-slate-300/70 bg-[#e5e7eb]/80 group-hover:bg-rose-100/50 transition-colors" />
                  </button>
                </div>

              </div>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              Drag down the bowstring &amp; release inside the phone simulator.
            </p>
          </div>

          {/* RIGHT: Story Act Cards & Action Console (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            <div className="space-y-1 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
                Interactive Narrative Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Three Acts That Turn A Link Into An Unforgettable Memory
              </h3>
            </div>

            {/* ACT CARD 1: Cupid's Arrow */}
            <div
              onClick={() => {
                setActiveAct("arrow");
                if (arrowState === "hit") setArrowState("idle");
              }}
              className={`p-5 rounded-3xl transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                activeAct === "arrow"
                  ? "bg-slate-900/90 border-rose-500/70 shadow-2xl shadow-rose-950/60 ring-1 ring-rose-500/50 scale-[1.02]"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-4">
                {/* Mini Preview Icon / Thumbnail */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/25 border border-white/20">
                  <span className="text-2xl">🏹</span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                        Act I • The Invitation
                      </span>
                      {activeAct === "arrow" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Active in Simulator
                        </span>
                      )}
                    </div>
                    <span className="text-rose-400 text-xs font-semibold">01</span>
                  </div>

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Cupid&rsquo;s Arrow &amp; Radiant Heart</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Instead of a cold greeting text, your partner receives an ancient archery ritual.
                    Drawing back the bowstring sends Cupid&rsquo;s golden arrow deep into a glowing 3D heart with confetti fireworks.
                  </p>
                </div>
              </div>
            </div>

            {/* ACT CARD 2: Birthday Blossom */}
            <div
              onClick={() => setActiveAct("blossom")}
              className={`p-5 rounded-3xl transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                activeAct === "blossom"
                  ? "bg-slate-900/90 border-purple-500/70 shadow-2xl shadow-purple-950/60 ring-1 ring-purple-500/50 scale-[1.02]"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-4">
                {/* Mini Preview Icon / Thumbnail */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-500/25 border border-white/20">
                  <span className="text-2xl">🌸</span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                        Act II • The Cinematic Bloom
                      </span>
                      {activeAct === "blossom" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          Active in Simulator
                        </span>
                      )}
                    </div>
                    <span className="text-purple-400 text-xs font-semibold">02</span>
                  </div>

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>The Heart Tree &amp; Drifting Petals</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Cinema letterbox bars glide across the screen while cinematic acoustic lo-fi rises.
                    A cherry blossom tree grows from the ground, its canopy blossoming into a heart made of 220+ glowing floral petals.
                  </p>
                </div>
              </div>
            </div>

            {/* ACT CARD 3: The Wish */}
            <div
              onClick={() => setActiveAct("wish")}
              className={`p-5 rounded-3xl transition-all duration-300 cursor-pointer border relative overflow-hidden ${
                activeAct === "wish"
                  ? "bg-slate-900/90 border-amber-500/70 shadow-2xl shadow-amber-950/60 ring-1 ring-amber-500/50 scale-[1.02]"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start gap-4">
                {/* Mini Preview Icon / Thumbnail */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/25 border border-white/20">
                  <span className="text-2xl">✍️</span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                        Act III • The Secret Note
                      </span>
                      {activeAct === "wish" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Active in Simulator
                        </span>
                      )}
                    </div>
                    <span className="text-amber-400 text-xs font-semibold">03</span>
                  </div>

                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Calligraphic Handwriting &amp; Forever</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Golden flourish rules sweep across vintage cream parchment with delicate film grain.
                    Your personal heart-to-heart message unlocks in cursive script with a wax seal that they will treasure forever.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Conversion Call To Action Panel */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/50 via-purple-950/50 to-slate-900 border border-rose-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-5 mt-2 shadow-xl shadow-rose-950/30">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ready to surprise someone special?</span>
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free to build</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2 mins setup</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Plays on any phone</span>
                  </span>
                </div>
              </div>

              <Link href="/create">
                <Button
                  variant="primary"
                  size="lg"
                  className="shadow-xl shadow-rose-500/30 font-bold px-6 py-5 text-sm bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Your Surprise Link
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
