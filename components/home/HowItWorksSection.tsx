"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Target,
  Music,
  Send,
  Heart,
  Flame,
  CheckCircle2,
  Gift,
  Volume2,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import styles from "./RotaryWheelSection.module.css";

interface StepDetail {
  stepNumber: string;
  dialLabel: string;
  tagline: string;
  title: string;
  description: string;
  accentColor: string;
  themeGlow: string;
  ledClass: string;
  numClass: string;
  icon: React.ComponentType<{ className?: string }>;
  features: Array<{ icon: React.ComponentType<{ className?: string }>; label: string }>;
}

const STEPS: StepDetail[] = [
  {
    stepNumber: "01",
    dialLabel: "PICK",
    tagline: "Choose The Moment",
    title: "Pick An Interactive Story",
    description:
      "Select an experience crafted for your favorite person: shoot a love arrow into a blooming heart with archery, test them with a playful proposal question, blow out birthday candles, or unwrap a romantic love letter.",
    accentColor: "from-pink-500 via-rose-500 to-purple-500",
    themeGlow: "rgba(244, 63, 94, 0.18)",
    ledClass: styles.ledPink,
    numClass: styles.numPink,
    icon: Target,
    features: [
      { icon: Target, label: "Birthday Blossom Archery" },
      { icon: Heart, label: "The Golden Proposal" },
      { icon: Flame, label: "Interactive Candle Blowout" },
      { icon: Gift, label: "Whispers of Love Letters" },
    ],
  },
  {
    stepNumber: "02",
    dialLabel: "TUNE",
    tagline: "Soundtrack & Soul",
    title: "Add Your Song, Words & Photos",
    description:
      "Upload the exact song that defines your bond. Use our Studio Audio Trimmer to start right at the chorus. Write words only the two of you understand, and attach private photo memories to surprise them.",
    accentColor: "from-purple-500 via-indigo-500 to-pink-500",
    themeGlow: "rgba(168, 85, 247, 0.18)",
    ledClass: styles.ledPurple,
    numClass: styles.numPurple,
    icon: Music,
    features: [
      { icon: Volume2, label: "Studio Audio Waveform Trimmer" },
      { icon: Heart, label: "Heartfelt Personalized Letter" },
      { icon: Sparkles, label: "Private Photo Gallery" },
      { icon: RotateCcw, label: "Custom Chorus Start Time" },
    ],
  },
  {
    stepNumber: "03",
    dialLabel: "SEND",
    tagline: "The Instant Reveal",
    title: "Send One Magic Link via WhatsApp",
    description:
      "Generate a single private link that opens instantly in any phone browser. No app install needed. When they tap to open the curtain, your music starts playing, and the celebration comes alive.",
    accentColor: "from-amber-500 via-orange-500 to-rose-500",
    themeGlow: "rgba(245, 158, 11, 0.18)",
    ledClass: styles.ledAmber,
    numClass: styles.numAmber,
    icon: Send,
    features: [
      { icon: Link2, label: "One-Tap WhatsApp & iMessage Link" },
      { icon: CheckCircle2, label: "100% Web-Based (Zero App Download)" },
      { icon: Music, label: "Curtain Unboxing & Song Playback" },
      { icon: Sparkles, label: "Instant Emotion & Happy Tears" },
    ],
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleNextStep = () => {
    setActiveStep((prev) => (prev % 3) + 1);
  };

  const current = STEPS[activeStep - 1];
  const StepIcon = current.icon;

  // Rotation angles for 3 items based on byllzz Uiverse CSS:
  // Step 1: +30deg offset
  // Step 2: 0deg offset
  // Step 3: -30deg offset
  const getRotationAngle = (itemStep: number) => {
    const baseAngles = [-30, 0, 30]; // for item 1, 2, 3
    const baseAngle = baseAngles[itemStep - 1];

    if (activeStep === 1) return baseAngle + 30;
    if (activeStep === 2) return baseAngle;
    return baseAngle - 30;
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <Badge variant="secondary" size="md">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>Seamless Creation</span>
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          How A Surprise Comes To Life
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          In 3 simple steps, turn heartfelt words and personal songs into an interactive celebration they will cherish forever.
        </p>
      </div>

      {/* Main Interactive Console (Inspired by byllzz Uiverse Radio) */}
      <div className={styles.consoleWrapper}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
          
          {/* Left Column: Tactile Mechanical Rotary Wheel */}
          <div className={`lg:col-span-5 ${styles.wheelHousing}`}>
            <div
              className={styles.wheelSelector}
              onClick={handleNextStep}
              title="Click to spin to the next step"
            >
              <div className={styles.hintPop}>
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Tap To Spin</span>
              </div>

              {/* Rotary Drum Dial */}
              <div className={styles.radioInput}>
                {/* Glowing LED status dot */}
                <div className={`${styles.ledDot} ${current.ledClass}`} />

                {/* Glass reflection overlay */}
                <div className={styles.glassOverlay} />

                {/* 3 Step Labels rotating on the 3D drum cylinder */}
                {STEPS.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = activeStep === stepNum;
                  const rotation = getRotationAngle(stepNum);

                  return (
                    <div
                      key={step.stepNumber}
                      className={`${styles.wheelLabel} ${isActive ? styles.activeLabel : ""}`}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      <span className={`${styles.num} ${step.numClass}`}>{step.stepNumber}</span>
                      <span className={styles.label}>{step.dialLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick-Jump Step Indicators */}
            <div className={styles.dialTicks}>
              {STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = activeStep === stepNum;
                return (
                  <button
                    key={step.stepNumber}
                    type="button"
                    onClick={() => setActiveStep(stepNum)}
                    className={`${styles.dialTickBtn} ${isActive ? styles.dialTickActive : ""}`}
                    aria-label={`Jump to step ${step.stepNumber}`}
                  >
                    <span>{step.stepNumber}</span>
                    <span className="ml-1 text-[10px] uppercase opacity-75">{step.dialLabel}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
              Click drum or buttons to rotate
            </p>
          </div>

          {/* Right Column: Dynamic Stage Content Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow matching the active step */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-10"
              style={{ background: current.themeGlow }}
            />

            <div>
              {/* Step Sub-badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <StepIcon className="w-3.5 h-3.5 text-pink-500" />
                  <span>
                    Step {current.stepNumber} of 03 &bull; {current.tagline}
                  </span>
                </div>
                <span className="text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
                  {current.stepNumber}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {current.description}
              </p>

              {/* Real Feature Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6">
                {current.features.map((feat, i) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-xs text-xs font-medium text-slate-800 dark:text-slate-200 transition-all hover:border-pink-400/50"
                    >
                      <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                        <FeatIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{feat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
              >
                <span>Rotate To Next Step</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <Link href="/create">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-pink-500/20"
                >
                  <span>Start Creating</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
