"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Clock,
  ArrowRight,
  Eye,
  Gift,
  Cake,
  PartyPopper,
  Music,
  Mail,
  Heart,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { cn } from "@/lib/utils";
import { MOCK_TEMPLATES } from "@/lib/constants";
import { Template } from "@/types/template";
import styles from "./Featured3DCard.module.css";

const TEMPLATE_META: Record<
  string,
  {
    gradientClass: string;
    circleClass: string;
    emoji: string;
    shimmerColor: string;
    buttonGradient: string;
    demoBorderHover: string;
    demoGlow: string;
    demoIconColor: string;
    accentColor: string;
    microActions: Array<{
      icon: LucideIcon;
      color: string;
      title: string;
    }>;
  }
> = {
  "magic-gift": {
    gradientClass: styles.gradientGift,
    circleClass: styles.circleGift,
    emoji: "🎁",
    shimmerColor: "#fda4af",
    buttonGradient: "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
    demoBorderHover: "hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:shadow-[0_0_14px_rgba(244,63,94,0.35)]",
    demoGlow: "bg-rose-50/80 dark:bg-rose-950/40",
    demoIconColor: "text-rose-500",
    accentColor: "text-rose-600 dark:text-rose-400",
    microActions: [
      { icon: Gift, color: "text-pink-500", title: "3D Scene Unwrap" },
      { icon: Music, color: "text-purple-500", title: "Celebration Audio" },
      { icon: Sparkles, color: "text-amber-500", title: "Sparkle Magic" },
    ],
  },
  "birthday-cake-reveal": {
    gradientClass: styles.gradientCake,
    circleClass: styles.circleCake,
    emoji: "🎂",
    shimmerColor: "#fef08a",
    buttonGradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 45%, #ec4899 100%)",
    demoBorderHover: "hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:shadow-[0_0_14px_rgba(245,158,11,0.35)]",
    demoGlow: "bg-amber-50/80 dark:bg-amber-950/40",
    demoIconColor: "text-amber-500",
    accentColor: "text-amber-600 dark:text-amber-400",
    microActions: [
      { icon: Cake, color: "text-amber-500", title: "Tiered Cake Reveal" },
      { icon: Flame, color: "text-rose-500", title: "Blowable Candles" },
      { icon: Sparkles, color: "text-pink-500", title: "Confetti Shower" },
    ],
  },
  "sweet-celebration": {
    gradientClass: styles.gradientSweet,
    circleClass: styles.circleSweet,
    emoji: "💌",
    shimmerColor: "#ffe4e6",
    buttonGradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 50%, #f43f5e 100%)",
    demoBorderHover: "hover:border-pink-400 hover:text-pink-600 dark:hover:text-pink-300 hover:shadow-[0_0_14px_rgba(255,117,140,0.35)]",
    demoGlow: "bg-pink-50/80 dark:bg-pink-950/40",
    demoIconColor: "text-pink-500",
    accentColor: "text-rose-600 dark:text-rose-400",
    microActions: [
      { icon: Mail, color: "text-rose-500", title: "Interactive Letterbox" },
      { icon: Heart, color: "text-pink-500", title: "Heartfelt Wishes" },
      { icon: Sparkles, color: "text-amber-500", title: "Celebration Bunting" },
    ],
  },
  "balloon-room": {
    gradientClass: styles.gradientBalloon,
    circleClass: styles.circleBalloon,
    emoji: "🎈",
    shimmerColor: "#67e8f9",
    buttonGradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)",
    demoBorderHover: "hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-300 hover:shadow-[0_0_14px_rgba(6,182,212,0.35)]",
    demoGlow: "bg-sky-50/80 dark:bg-sky-950/40",
    demoIconColor: "text-sky-500",
    accentColor: "text-sky-600 dark:text-sky-400",
    microActions: [
      { icon: PartyPopper, color: "text-sky-500", title: "Balloon Cloud" },
      { icon: Music, color: "text-blue-500", title: "Party Soundtrack" },
      { icon: Sparkles, color: "text-purple-500", title: "Floating Sparkles" },
    ],
  },
};

export function FeaturedSection() {
  // Spotlight signature featured birthday wonder templates including Sweet Celebration
  const FEATURED_SLUGS = [
    "magic-gift",
    "birthday-cake-reveal",
    "sweet-celebration",
    "balloon-room",
  ];

  const featuredTemplates = FEATURED_SLUGS.map((slug) =>
    MOCK_TEMPLATES.find((t) => t.slug === slug)
  ).filter(Boolean) as Template[];

  return (
    <section className="py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex">
            <Badge variant="primary" size="md" className="gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Signature Experiences</span>
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Featured Birthday Wonders
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Handcrafted interactive 3D worlds ready to be personalized and delivered in minutes.
          </p>
        </div>

        {/* 3D Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-7">
          {featuredTemplates.map((template) => {
            const meta = TEMPLATE_META[template.slug] || {
              gradientClass: styles.gradientGift,
              circleClass: styles.circleGift,
              emoji: "✨",
              shimmerColor: "#fda4af",
              buttonGradient: "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
              demoBorderHover: "hover:border-rose-400 hover:text-rose-600 hover:shadow-[0_0_14px_rgba(244,63,94,0.35)]",
              demoGlow: "bg-rose-50/80",
              demoIconColor: "text-rose-500",
              accentColor: "text-rose-600 dark:text-rose-400",
              microActions: [
                { icon: Gift, color: "text-pink-500", title: "Interactive Experience" },
                { icon: Music, color: "text-purple-500", title: "Celebration Audio" },
                { icon: Sparkles, color: "text-amber-500", title: "Magical Surprise" },
              ],
            };

            // Clean title without trailing emoji to avoid wrapping
            const cleanTitle = template.name
              .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
              .trim();

            return (
              <div key={template.id} className={styles.parent}>
                <div className={`${styles.card} ${meta.gradientClass} group`}>
                  
                  {/* Concentric Floating 3D Orbs neatly in the top-right corner */}
                  <div className={styles.logo}>
                    <span className={`${styles.circle} ${styles.circle1} ${meta.circleClass}`} />
                    <span className={`${styles.circle} ${styles.circle2} ${meta.circleClass}`} />
                    <span className={`${styles.circle} ${styles.circle3} ${meta.circleClass}`} />
                    <span className={`${styles.circle} ${styles.circle4} ${meta.circleClass}`} />
                    <div className={`${styles.circle} ${styles.circle5}`}>
                      <span className="text-lg select-none transform transition-transform group-hover:scale-115 duration-300">
                        {meta.emoji}
                      </span>
                    </div>
                  </div>

                  {/* The 3D Glass Layer with graceful corner cutout */}
                  <div className={styles.glass}>
                    <div className={styles.content}>
                      {/* Category & New Badges with dedicated spacing away from corner orbs */}
                      <div className="flex items-center gap-2 mb-2 pr-16">
                        <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50/90 dark:bg-pink-950/70 px-2.5 py-0.5 rounded-full border border-pink-200/60 dark:border-pink-900/60 shadow-xs">
                          {template.category}
                        </span>
                        {template.isNew && (
                          <span className="text-[10px] font-black text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2.5 py-0.5 rounded-full shadow-xs">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Cleaned Title with dedicated room and uniform height baseline */}
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight pr-14 tracking-tight min-h-[48px] flex items-center">
                        {cleanTitle}
                      </h3>

                      {/* Tagline */}
                      <p className={cn("text-xs font-bold mt-1.5 line-clamp-1", meta.accentColor)}>
                        {template.tagline}
                      </p>

                      {/* Description with full width below orbs */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed font-normal">
                        {template.description}
                      </p>

                      {/* Scene count & duration info */}
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mt-3.5">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                          {template.sceneCount} Scenes
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          {template.estimatedDuration}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {template.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* The Bottom 3D Action Row with Template-Themed Live Demo & Magic UI ShimmerButton */}
                    <div className={styles.bottom}>
                      {/* Feature micro buttons lifting forward in 3D */}
                      <div className={styles.socialButtonsContainer}>
                        {meta.microActions.map((action, idx) => {
                          const IconComp = action.icon;
                          return (
                            <button
                              key={idx}
                              className={styles.socialButton}
                              title={action.title}
                              type="button"
                            >
                              <IconComp className={`w-3.5 h-3.5 ${action.color}`} />
                            </button>
                          );
                        })}
                      </div>

                      {/* Template-Accented Action Buttons: Frosted Aura Live Demo & Magic UI ShimmerButton */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Live Demo: Frosted Aura Button with Template Border Glow */}
                        <Link href={`/preview?template=${template.slug}`} className="block">
                          <button
                            type="button"
                            className={cn(
                              "group/demo relative inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer",
                              "bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/90",
                              "text-slate-700 dark:text-slate-200 transition-all duration-300",
                              "hover:scale-[1.04] active:scale-95 shadow-xs",
                              meta.demoBorderHover
                            )}
                          >
                            <Eye className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/demo:scale-115", meta.demoIconColor)} />
                            <span>Live Demo</span>
                          </button>
                        </Link>

                        {/* Customize: Magic UI ShimmerButton with Template Custom Gradient & Light Beam */}
                        <Link href={`/create?template=${template.slug}`} className="block">
                          <ShimmerButton
                            shimmerColor={meta.shimmerColor}
                            background={meta.buttonGradient}
                            borderRadius="12px"
                            shimmerDuration="2.4s"
                            shimmerSize="0.08em"
                            className="h-8 px-3 text-xs font-bold tracking-tight whitespace-nowrap shadow-md hover:scale-[1.04] transition-transform cursor-pointer"
                          >
                            <span className="flex items-center gap-1">
                              <span>Customize</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                          </ShimmerButton>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
