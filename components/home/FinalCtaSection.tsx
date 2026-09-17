"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

// 3D Glossy Heart SVG Component matching the mockup
function GlossyHeart({
  size = 28,
  primaryColor = "#f43f5e",
  secondaryColor = "#be123c",
  className = "",
  style = {},
}: {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const gradId = `heartGrad-${primaryColor.replace("#", "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="30%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </radialGradient>
        <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={primaryColor} floodOpacity="0.65" />
        </filter>
      </defs>
      <path
        d="M16 28.5C14.5 27 3 18.5 2 11.5 1 5.5 5.5 2 10.5 2c3.5 0 5.5 2.5 5.5 2.5S18 2 21.5 2c5 0 9.5 3.5 8.5 9.5-1 7-12.5 15.5-14 16.5z"
        fill={`url(#${gradId})`}
        filter="url(#glowFilter)"
      />
      {/* Specular high-gloss reflection */}
      <ellipse cx="9.5" cy="7.5" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.75" transform="rotate(-35 9.5 7.5)" />
    </svg>
  );
}

// 3D Sender Mail Envelope Icon matching mockup
function Mail3D({ className = "" }: { className?: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="mailBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="mailFlap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="sealGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff758c" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <filter id="mailShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Envelope Body */}
      <rect x="6" y="12" width="36" height="26" rx="4" fill="url(#mailBody)" filter="url(#mailShadow)" />
      {/* Flap fold lines */}
      <path d="M6 14L24 28L42 14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 38L18 26" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
      <path d="M42 38L30 26" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
      {/* Wax Heart Seal */}
      <circle cx="24" cy="28" r="7" fill="url(#sealGrad)" />
      <path d="M24 31.5s-4-2.5-4.8-4.5c-.6-1.5.5-2.5 1.8-2.5 1.2 0 1.8.8 1.8.8s.6-.8 1.8-.8c1.3 0 2.4 1 1.8 2.5-.8 2-4.2 4.5-4.2 4.5z" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

// 3D Pastel Gift Box matching mockup
function Gift3D({ className = "" }: { className?: string }) {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" className={className}>
      <defs>
        {/* Box Base Gradients */}
        <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="boxLid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        {/* Ribbon Gradients */}
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <filter id="boxGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Box Lower Body */}
      <rect x="14" y="24" width="40" height="32" rx="4" fill="url(#boxFront)" filter="url(#boxGlow)" />
      {/* Vertical Ribbon on Box */}
      <rect x="30" y="24" width="8" height="32" fill="url(#ribbonGrad)" />
      {/* Box Lid */}
      <rect x="10" y="19" width="48" height="10" rx="3" fill="url(#boxLid)" stroke="#e0f2fe" strokeWidth="0.8" />
      {/* Vertical Ribbon on Lid */}
      <rect x="30" y="19" width="8" height="10" fill="url(#ribbonGrad)" />
      {/* Ribbon Bow Loops */}
      <path
        d="M34 19C28 12 21 13 22 17C23 20 31 19 34 19Z"
        fill="url(#ribbonGrad)"
      />
      <path
        d="M34 19C40 12 47 13 46 17C45 20 37 19 34 19Z"
        fill="url(#ribbonGrad)"
      />
      <circle cx="34" cy="18.5" r="3" fill="#fbcfe8" />
    </svg>
  );
}

// 3D Smartphone Icon matching mockup
function Phone3D({ className = "" }: { className?: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="phoneScreen" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#090d16" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Phone Outer Bezel */}
      <rect x="12" y="6" width="24" height="36" rx="5" fill="url(#phoneBody)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#phoneShadow)" />
      {/* Screen */}
      <rect x="14" y="9" width="20" height="30" rx="3" fill="url(#phoneScreen)" />
      {/* Speaker bar */}
      <rect x="21" y="7.5" width="6" height="1" rx="0.5" fill="#64748b" />
      {/* App grid icons on screen */}
      <rect x="16" y="12" width="3" height="3" rx="0.8" fill="#f43f5e" />
      <rect x="21" y="12" width="3" height="3" rx="0.8" fill="#38bdf8" />
      <rect x="26" y="12" width="3" height="3" rx="0.8" fill="#facc15" />
      <rect x="16" y="17" width="3" height="3" rx="0.8" fill="#a855f7" />
      <rect x="21" y="17" width="3" height="3" rx="0.8" fill="#10b981" />
      <rect x="26" y="17" width="3" height="3" rx="0.8" fill="#ec4899" />
      {/* Live Surprise Heart Notification Pill */}
      <rect x="16" y="24" width="16" height="6" rx="3" fill="#ec4899" opacity="0.9" />
      <circle cx="19" cy="27" r="1.5" fill="#ffffff" />
      <rect x="22" y="26" width="7" height="1.5" rx="0.75" fill="#ffffff" />
      {/* Home indicator bar */}
      <rect x="20" y="37" width="8" height="1" rx="0.5" fill="#94a3b8" />
    </svg>
  );
}

export function FinalCtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const senderRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const recipientRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-[#0e111a] text-white border-t border-slate-800/80">
      
      {/* Background Soft Concentric Radial Glows exactly matching Mockup */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-cyan-900/15 via-purple-900/20 to-pink-900/15 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-purple-500/15 pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] h-[660px] rounded-full border border-purple-500/10 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Animated Beam Surprise Journey Visualization (Directly suspended in space, matching Mockup) */}
        <div
          ref={containerRef}
          className="relative max-w-3xl mx-auto mb-16 py-10 px-4 sm:px-12 flex items-center justify-between"
        >
          {/* Node 1: Sender 💌 */}
          <div className="flex flex-col items-center z-20">
            <div
              ref={senderRef}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-500/50 via-blue-500/30 to-purple-500/50 border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.4)] flex items-center justify-center backdrop-blur-md"
            >
              <div className="w-full h-full rounded-full bg-[#11162b] flex items-center justify-center shadow-inner">
                <Mail3D />
              </div>
            </div>
            <span className="mt-3.5 text-xs sm:text-sm font-bold text-white tracking-wide">
              You (Sender) 💌
            </span>
          </div>

          {/* Node 2: SurpriseSpark Magic Engine 🎁 */}
          <div className="flex flex-col items-center z-20">
            <div
              ref={engineRef}
              className="w-28 h-28 sm:w-34 sm:h-34 rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-sky-400 to-purple-500 border-2 border-cyan-300 shadow-[0_0_55px_rgba(56,189,248,0.6)] flex items-center justify-center backdrop-blur-md animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-full h-full rounded-full bg-[#131936] flex items-center justify-center shadow-inner relative">
                <Gift3D />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400" />
                </span>
              </div>
            </div>
            <div className="mt-3.5 text-center leading-tight">
              <span className="text-xs sm:text-sm font-black text-white block">
                Partner in Crime
              </span>
              <span className="text-[11px] sm:text-xs text-purple-300 font-bold">
                Magic Engine 🎁
              </span>
            </div>
          </div>

          {/* Node 3: Recipient 📱💖 */}
          <div className="flex flex-col items-center z-20">
            <div
              ref={recipientRef}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-blue-500/50 via-purple-500/40 to-pink-500/50 border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(168,85,247,0.4)] flex items-center justify-center backdrop-blur-md"
            >
              <div className="w-full h-full rounded-full bg-[#11162b] flex items-center justify-center shadow-inner">
                <Phone3D />
              </div>
            </div>
            <span className="mt-3.5 text-xs sm:text-sm font-bold text-white tracking-wide">
              Recipient&apos;s Joy 📱💖
            </span>
          </div>

          {/* Animated Curved Energy Beams: Sender -> Engine */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={senderRef}
            toRef={engineRef}
            duration={3}
            gradientStartColor="#38bdf8"
            gradientStopColor="#818cf8"
            pathColor="rgba(56, 189, 248, 0.25)"
            pathWidth={3.5}
            curvature={-22}
          />

          {/* Animated Curved Energy Beams: Engine -> Recipient */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={engineRef}
            toRef={recipientRef}
            duration={3}
            gradientStartColor="#818cf8"
            gradientStopColor="#ec4899"
            pathColor="rgba(236, 72, 153, 0.25)"
            pathWidth={3.5}
            curvature={22}
          />

          {/* Glossy 3D Floating Hearts & Sparkles along Right Beam (exact match to mockup) */}
          <div className="hidden sm:flex absolute left-[56%] top-[34%] -translate-y-1/2 items-center gap-3 pointer-events-none z-25 select-none">
            <GlossyHeart
              size={20}
              primaryColor="#f43f5e"
              secondaryColor="#9f1239"
              className="animate-bounce drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]"
              style={{ animationDuration: "2.2s", animationDelay: "0.2s" }}
            />
            <GlossyHeart
              size={26}
              primaryColor="#ec4899"
              secondaryColor="#be185d"
              className="animate-pulse drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]"
              style={{ animationDuration: "1.8s", animationDelay: "0.5s" }}
            />
            <span className="text-xs text-amber-300 animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.8s" }}>
              ✨
            </span>
            <GlossyHeart
              size={18}
              primaryColor="#a855f7"
              secondaryColor="#6b21a8"
              className="animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]"
              style={{ animationDuration: "2.0s", animationDelay: "1.1s" }}
            />
            <GlossyHeart
              size={28}
              primaryColor="#e11d48"
              secondaryColor="#881337"
              className="animate-bounce drop-shadow-[0_0_14px_rgba(225,29,72,0.8)]"
              style={{ animationDuration: "2.4s", animationDelay: "1.4s" }}
            />
          </div>

          {/* Electric Cyan Sparkles on Left Beam (matching mockup) */}
          <div className="hidden sm:flex absolute left-[26%] top-[32%] -translate-y-1/2 items-center gap-2.5 pointer-events-none z-25 select-none">
            <span className="text-xs text-cyan-300 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]" style={{ animationDuration: "1.6s" }}>
              ✨
            </span>
            <span className="text-sm text-sky-200 animate-bounce" style={{ animationDuration: "2.1s" }}>
              ⚡
            </span>
          </div>
        </div>

        {/* Copy & Call to Action Layout (exact match to Mockup) */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Every unforgettable memory begins with a single click.
          </h2>

          <p className="text-base sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            No apps to install. Instant delight on any smartphone.
          </p>

          {/* Aligned Badges & Centered Glowing ShimmerButton Row (exact match to Mockup) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 shadow-md whitespace-nowrap flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>Instant Delivery • Free to Start</span>
            </div>

            <Link href="/create">
              <ShimmerButton
                shimmerColor="#a855f7"
                shimmerSize="0.1em"
                shimmerDuration="2.5s"
                background="linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)"
                borderRadius="9999px"
                className="shadow-[0_0_35px_rgba(139,92,246,0.45)] px-8 py-3.5 text-base sm:text-lg font-black text-white hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Create A Surprise Now ✨</span>
              </ShimmerButton>
            </Link>

            <div className="px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 shadow-md whitespace-nowrap flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Delight Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
