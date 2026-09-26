"use client";

import React from "react";
import {
  Heart,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Smile,
  Calendar,
  Gift,
  Check,
  Camera,
  PenTool,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ShineBorder } from "@/components/magicui/shine-border";
import { AudioTrimmerStudio } from "@/components/creator/AudioTrimmerStudio";
import { PhotoManager } from "@/components/creator/PhotoManager";
import { TemplateModel } from "@/lib/engine/types";

export interface GoldenProposalConfig {
  recipientName: string;
  recipientEndearment: string;
  senderName: string;
  confessionLine1: string;
  confessionLine2: string;
  confessionLine3: string;
  proposalQuestion: string;
  loveQuote: string;
  dodgeTooltipText: string;
  replyChoice1: string;
  replyChoice2: string;
  replyChoice3: string;
}

export interface GenericCelebrationConfig {
  recipientName: string;
  senderName: string;
  specialDate: string;
  message: string;
  photos: string[];
}

interface TemplatePersonalizeSectionProps {
  template: TemplateModel;
  goldenConfig: GoldenProposalConfig;
  onGoldenConfigChange: (newConfig: Partial<GoldenProposalConfig>) => void;
  genericConfig: GenericCelebrationConfig;
  onGenericConfigChange: (newConfig: Partial<GenericCelebrationConfig>) => void;
  onAudioChange?: (audioData: {
    url: string;
    blob?: Blob;
    startTime: number;
    duration: number;
    name: string;
    type: "voice_note" | "custom_music";
  } | null) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  initialAudioUrl?: string;
  initialAudioStartTime?: number;
  initialAudioDuration?: number;
}

export function TemplatePersonalizeSection({
  template,
  goldenConfig,
  onGoldenConfigChange,
  genericConfig,
  onGenericConfigChange,
  onAudioChange,
  onUploadingChange,
  initialAudioUrl,
  initialAudioStartTime,
  initialAudioDuration,
}: TemplatePersonalizeSectionProps) {
  const isGoldenProposal = template.slug === "the-golden-proposal";
  const isSweetCelebration = template.slug === "sweet-celebration";
  const isLoveAnimation = template.slug === "love-animation";
  const isWhispersOfLove = template.slug === "whispers-of-love";

  const templateDuration = isGoldenProposal ? 60 : isWhispersOfLove ? 180 : 120;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 💍 TEMPLATE 1: THE GOLDEN PROPOSAL ADAPTIVE CUSTOMIZER */}
      {/* ========================================================================= */}
      {isGoldenProposal ? (
        <div className="space-y-6">
          {/* Card 1: Couple Names & Romantic Endearment */}
          <div className="relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-amber-200/80 dark:border-amber-900/40 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
            <BorderBeam size={220} duration={12} delay={0} colorFrom="#f59e0b" colorTo="#ec4899" />
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  1. Couple Names & Endearment
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Customizes the romantic opening title and story dialogue
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Her Name *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {goldenConfig.recipientName.length}/30
                  </span>
                </div>
                <Input
                  id="golden-her-name"
                  value={goldenConfig.recipientName}
                  maxLength={30}
                  onChange={(e) => onGoldenConfigChange({ recipientName: e.target.value })}
                  placeholder="e.g. Maya"
                  className="border-amber-300/80 dark:border-amber-800/80 focus:ring-amber-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Appears as: &quot;For {goldenConfig.recipientName || 'Maya'}, ...&quot;</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Her Endearment / Pet Name
                  </label>
                </div>
                <Input
                  id="golden-endearment"
                  value={goldenConfig.recipientEndearment}
                  maxLength={30}
                  onChange={(e) => onGoldenConfigChange({ recipientEndearment: e.target.value })}
                  placeholder="e.g. My Everything, Meri Jaan"
                  className="border-rose-300/80 dark:border-rose-800/80 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Sub-headline on the intro screen</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    His Name (Sender) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {goldenConfig.senderName.length}/30
                  </span>
                </div>
                <Input
                  id="golden-his-name"
                  value={goldenConfig.senderName}
                  maxLength={30}
                  onChange={(e) => onGoldenConfigChange({ senderName: e.target.value })}
                  placeholder="e.g. Alex"
                  className="border-amber-300/80 dark:border-amber-800/80 focus:ring-amber-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">&quot;See What {goldenConfig.senderName || 'Alex'} Wants To Say&quot;</p>
              </div>
            </div>
          </div>

          {/* Card 2: Act 1 Romantic Confession Lines */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  2. Act 1: Romantic Confession Story
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Three lines that appear gracefully on the intro screen before the proposal cutscene
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Confession Line 1
                </label>
                <Input
                  value={goldenConfig.confessionLine1}
                  onChange={(e) => onGoldenConfigChange({ confessionLine1: e.target.value })}
                  placeholder="Hey... I've been holding onto a secret for so long 💕"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Confession Line 2
                </label>
                <Input
                  value={goldenConfig.confessionLine2}
                  onChange={(e) => onGoldenConfigChange({ confessionLine2: e.target.value })}
                  placeholder="Every time I see your smile, my world gets a little brighter ✨"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Confession Line 3
                </label>
                <Input
                  value={goldenConfig.confessionLine3}
                  onChange={(e) => onGoldenConfigChange({ confessionLine3: e.target.value })}
                  placeholder="Today, I finally gathered the courage to tell you... 🌹"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Act 2 The Big Proposal Moment & Playful Dodge Banter */}
          <div className="relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-amber-300/80 dark:border-amber-900/60 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
            <BorderBeam size={240} duration={14} delay={3} colorFrom="#ec4899" colorTo="#d4af37" />
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  3. The Golden Proposal Question & Playful Dodge Physics
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  The climatic kneeling proposal moment with the playful dodging &quot;No&quot; button
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  The Proposal Question 💍
                </label>
                <Input
                  value={goldenConfig.proposalQuestion}
                  maxLength={50}
                  onChange={(e) => onGoldenConfigChange({ proposalQuestion: e.target.value })}
                  placeholder="Will You Be Mine?"
                  className="font-bold text-amber-700 dark:text-amber-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Playful Dodge &quot;No&quot; Tooltip Banter 😉
                </label>
                <Input
                  value={goldenConfig.dodgeTooltipText}
                  maxLength={60}
                  onChange={(e) => onGoldenConfigChange({ dodgeTooltipText: e.target.value })}
                  placeholder="Aise kaise mana kar sakti ho! 😉💖"
                />
                <p className="text-[10px] text-slate-400 mt-1">Appears when she tries to hover or tap &quot;No&quot;</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Heartfelt Proposal Quote / Personal Letter *
              </label>
              <Textarea
                rows={3}
                value={goldenConfig.loveQuote}
                maxLength={300}
                onChange={(e) => onGoldenConfigChange({ loveQuote: e.target.value })}
                placeholder="Of all the love stories in the world, ours will forever be my favorite."
                helperText="Displayed prominently under the proposal question and on the celebration screen."
              />
            </div>
          </div>

          {/* Card 4: Quick Reply Pills for Her */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  4. Her Quick Reply Suggestions
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tap-to-send reply pills displayed during the interactive dialogue cutscene
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Choice 1</label>
                <Input
                  value={goldenConfig.replyChoice1}
                  onChange={(e) => onGoldenConfigChange({ replyChoice1: e.target.value })}
                  placeholder="I was actually hoping you'd say something... 😊✨"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Choice 2</label>
                <Input
                  value={goldenConfig.replyChoice2}
                  onChange={(e) => onGoldenConfigChange({ replyChoice2: e.target.value })}
                  placeholder="Accha?... 😊💖"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Choice 3</label>
                <Input
                  value={goldenConfig.replyChoice3}
                  onChange={(e) => onGoldenConfigChange({ replyChoice3: e.target.value })}
                  placeholder="My heart is beating so fast right now... 💓"
                />
              </div>
            </div>
          </div>
        </div>
      ) : isLoveAnimation ? (
        /* ========================================================================= */
        /* 💖 TEMPLATE 3: LOVE ANIMATION — DEDICATED ROMANTIC PERSONALIZER           */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Card 1: Couple Names — The Only Data This Canvas Animation Needs */}
          <div className="relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-pink-200/80 dark:border-pink-900/40 shadow-xl backdrop-blur-md overflow-hidden space-y-5">
            <ShineBorder
              shineColor={["#ec4899", "#f43f5e", "#a855f7"]}
              borderWidth={1}
              duration={10}
            />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg">
                <Heart className="w-4.5 h-4.5 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Personalize Your Love Animation
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  These names appear in the glowing heart centerpiece & particle text
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-pink-500" />
                    Their Name *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {genericConfig.recipientName.length}/40
                  </span>
                </div>
                <Input
                  id="love-recipient-name"
                  value={genericConfig.recipientName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ recipientName: e.target.value })}
                  placeholder="e.g. Maya"
                  className="border-pink-300/80 dark:border-pink-800/80 focus:ring-pink-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-pink-400" />
                  Appears as: &quot;I Love ❤️ {genericConfig.recipientName || "Maya"}&quot;
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-rose-500" />
                    Your Name (Sender)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {genericConfig.senderName.length}/40
                  </span>
                </div>
                <Input
                  id="love-sender-name"
                  value={genericConfig.senderName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ senderName: e.target.value })}
                  placeholder="e.g. Alex"
                  className="border-rose-300/80 dark:border-rose-800/80 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                  Appears as: &quot;Always &amp; Forever — {genericConfig.senderName || "Alex"}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Animation Experience Timeline Preview */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-pink-950/40 border border-pink-500/20 shadow-2xl overflow-hidden space-y-5">
            {/* Ambient glow effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">
                  What Your Recipient Will Experience
                </h3>
                <p className="text-[11px] text-pink-300/70">
                  A mesmerizing 5-act particle animation journey
                </p>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative space-y-0 pl-5">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-pink-500/60 via-rose-400/40 to-pink-500/60" />

              {[
                {
                  step: "1",
                  icon: "💌",
                  title: "Tap to Play",
                  desc: "An enchanting pulsing heart overlay invites them to begin",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  step: "2",
                  icon: "⚡",
                  title: "Neon Scanline Reveal",
                  desc: "A glowing love scanline sweeps down, revealing floating heart particles",
                  color: "from-rose-500 to-red-500",
                },
                {
                  step: "3",
                  icon: "⏱️",
                  title: "3, 2, 1... Particle Countdown",
                  desc: "Thousands of white particles morph into countdown numbers with synth audio",
                  color: "from-red-500 to-pink-600",
                },
                {
                  step: "4",
                  icon: "💖",
                  title: "\"You Are My Love\"",
                  desc: "Particles sweep into romantic words one by one with chime transitions",
                  color: "from-pink-600 to-rose-600",
                },
                {
                  step: "5",
                  icon: "❤️",
                  title: "Glowing Heart Centerpiece",
                  desc: `Particles form a pulsing heart with "${genericConfig.recipientName || "Maya"}" and heartbeat audio`,
                  color: "from-rose-600 to-pink-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5 pb-4">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md shadow-pink-500/30`}>
                    <span className="text-[9px] font-black text-white">{item.step}</span>
                  </div>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature badges */}
            <div className="relative flex flex-wrap gap-2 pt-1">
              {["Interactive Touch", "Live Synth Audio", "1300+ Particles", "Heartbeat Sync", "Rose Petals"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/15 text-pink-300 border border-pink-500/25 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Info Note: No message/photos needed */}
          <div className="rounded-2xl p-4 bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/30 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-pink-800 dark:text-pink-300">
                Simple & Elegant — Only Names Needed
              </p>
              <p className="text-[11px] text-pink-600/80 dark:text-pink-400/70 mt-0.5 leading-relaxed">
                This template creates a fully automated particle animation experience. Your names are woven into the glowing heart centerpiece — no personal message or photos required. Add custom audio below to make it even more special!
              </p>
            </div>
          </div>
        </div>
      ) : isWhispersOfLove ? (
        /* ========================================================================= */
        /* 🌹 TEMPLATE 3: WHISPERS OF LOVE 6-CHAPTER ROMANTIC CUSTOMIZER             */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Card 1: Couple Names & Romance Heading */}
          <div className="relative rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-rose-200/80 dark:border-rose-900/40 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
            <BorderBeam size={220} duration={12} delay={0} colorFrom="#f43f5e" colorTo="#fb7185" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  1. Couple Names
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Personalizes the wax envelope greeting, parchment letter signature, and starry finale
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Their Name (Recipient) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {genericConfig.recipientName.length}/40
                  </span>
                </div>
                <Input
                  id="whispers-recipient-name"
                  value={genericConfig.recipientName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ recipientName: e.target.value })}
                  placeholder="e.g. Maya"
                  className="border-rose-300/80 dark:border-rose-800/80 focus:ring-rose-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Appears as: &quot;To {genericConfig.recipientName || "My Love"}, My Love...&quot;
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Name (Sender) *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {genericConfig.senderName.length}/40
                  </span>
                </div>
                <Input
                  id="whispers-sender-name"
                  value={genericConfig.senderName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ senderName: e.target.value })}
                  placeholder="e.g. Alex"
                  className="border-pink-300/80 dark:border-pink-800/80 focus:ring-pink-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Signed as: &quot;— Yours, forever &amp; always, {genericConfig.senderName || "Alex"} 💕&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Wax-Sealed Vintage Love Letter (Scene 4) */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white/90 dark:from-slate-900/90 dark:via-rose-950/20 dark:to-slate-900/90 border border-amber-200/80 dark:border-amber-900/40 shadow-xl backdrop-blur-md overflow-hidden space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center shadow-md text-sm">
                  💌
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    <span>2. The Wax-Sealed Love Letter</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                      Scene 4
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    When clicked, the wax seal breaks and this letter types out on antique parchment paper
                  </p>
                </div>
              </div>

              {/* Quick romantic letter templates */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onGenericConfigChange({
                      message:
                        "There are not enough words in any language to describe what you mean to me. You are the warmth of the morning sun, the calm of a quiet night, and the joy in between. Every day with you feels like a beautiful dream I never want to wake up from. You have changed my world in the most wonderful way, and I am so grateful that our paths crossed. Thank you for being you — for your laughter, your kindness, and your love. I carry you in my heart, always. 💕",
                    });
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 transition-colors border border-rose-200/60 dark:border-rose-800/40 cursor-pointer"
                >
                  🌹 Classic Romantic
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onGenericConfigChange({
                      message:
                        "From the very first moment you walked into my life, everything changed for the better. You are my safe place, my greatest adventure, and my truest best friend. Thank you for loving me as I am and making every single day feel magical. I fall in love with you a little more every day. 💕",
                    });
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 transition-colors border border-amber-200/60 dark:border-amber-800/40 cursor-pointer"
                >
                  ✨ Soulmate
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-rose-500" />
                  Parchment Letter Body *
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {genericConfig.message.length}/800
                </span>
              </div>
              <Textarea
                id="whispers-message"
                rows={5}
                maxLength={800}
                value={genericConfig.message}
                onChange={(e) => onGenericConfigChange({ message: e.target.value })}
                placeholder="Write your personal love letter here..."
                className="border-amber-300/80 dark:border-amber-800/80 focus:ring-rose-500 font-serif leading-relaxed text-sm bg-white/70 dark:bg-slate-900/70"
                required
              />
            </div>

            {/* Envelope & Parchment Live Preview Snippet */}
            <div className="rounded-2xl p-3.5 bg-amber-100/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
              <div className="text-[11px] font-serif italic text-amber-900 dark:text-amber-300">
                To {genericConfig.recipientName || "My Love"}, My Love...
              </div>
              <p className="text-[11px] font-serif text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {genericConfig.message || "Your personal letter will be animated here..."}
              </p>
              <div className="text-[11px] font-serif italic text-amber-800 dark:text-amber-400 text-right">
                With all my love, {genericConfig.senderName || "Alex"} 💕
              </div>
            </div>
          </div>

          {/* Card 3: Our Memories — 3D Polaroid Carousel 📸 (Up to 4 Photos) */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>3. Our Memories — 3D Polaroid Carousel 📸</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/25">
                    Scene 5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Upload up to 4 photos for the swipeable 3D polaroid memory deck with romantic captions
                </p>
              </div>
            </div>

            <PhotoManager
              photos={genericConfig.photos}
              onChange={(newPhotos) => onGenericConfigChange({ photos: newPhotos })}
              maxPhotos={4}
              templateName="Whispers of Love 💕"
              supportsPhotos={true}
            />

            <p className="text-[10px] text-slate-400 italic">
              💡 If you keep this empty, the template automatically displays 4 aesthetic sunset, rose garden, and candlelight couple memories.
            </p>
          </div>

          {/* Card 4: 6-Chapter Interactive Experience Timeline */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-rose-950/40 border border-rose-500/20 shadow-2xl overflow-hidden space-y-5">
            {/* Ambient glow effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">
                  The 6-Chapter Romantic Journey
                </h3>
                <p className="text-[11px] text-rose-300/70">
                  What {genericConfig.recipientName || "your recipient"} experiences step-by-step
                </p>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative space-y-0 pl-5">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-rose-500/60 via-pink-400/40 to-amber-500/60" />

              {[
                {
                  step: "1",
                  icon: "🌸",
                  title: "Petal Rain & Typewriter Greeting",
                  desc: "Soft rose petals drift down as typewriter text introduces your romantic story.",
                  color: "from-rose-500 to-pink-500",
                },
                {
                  step: "2",
                  icon: "🌙",
                  title: "Starry Night & Moon Glow",
                  desc: "Parallax night sky with glowing crescent moon and interactive mouse-tracking stars.",
                  color: "from-pink-500 to-purple-500",
                },
                {
                  step: "3",
                  icon: "🌹",
                  title: "Garden of Love (Pick a Rose)",
                  desc: "Interactive button that bursts rose petals & reveals 8 heartfelt love quotes.",
                  color: "from-purple-500 to-rose-600",
                },
                {
                  step: "4",
                  icon: "💌",
                  title: "The Wax-Sealed Letter",
                  desc: `They click the antique envelope; wax seal breaks and your personal letter to ${
                    genericConfig.recipientName || "My Love"
                  } types out smoothly.`,
                  color: "from-rose-600 to-amber-500",
                },
                {
                  step: "5",
                  icon: "📸",
                  title: "3D Polaroid Memory Deck",
                  desc: "Swipeable 3D rotating cards displaying your favorite captured moments together.",
                  color: "from-amber-500 to-pink-500",
                },
                {
                  step: "6",
                  icon: "💖",
                  title: "Confetti Shower & Finale Poem",
                  desc: `Colorful confetti rain, a 4-line rhyming poem, signed by "${
                    genericConfig.senderName || "Alex"
                  }" with audio fanfare.`,
                  color: "from-pink-500 to-rose-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5 pb-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md shadow-rose-500/30`}
                  >
                    <span className="text-[9px] font-black text-white">{item.step}</span>
                  </div>
                  <div className="pt-0.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs font-bold text-white">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature badges */}
            <div className="relative flex flex-wrap gap-2 pt-1">
              {[
                "Interactive Rose Picking",
                "Wax Seal Physics",
                "3D Polaroid Carousel",
                "Ambient Chimes Synthesizer",
                "Falling Petals & Confetti",
                "Touch & Swipe Support",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 💌 TEMPLATE 2: SWEET CELEBRATION / OTHER GENERIC TEMPLATES               */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Personalization Details for {template.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Customizes the recipient greeting, typewriter letterbox, and celebrant names
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Name *
                </label>
                <Input
                  id="generic-recipient-name"
                  value={genericConfig.recipientName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ recipientName: e.target.value })}
                  placeholder="e.g. Maya"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Sender Name
                </label>
                <Input
                  id="generic-sender-name"
                  value={genericConfig.senderName}
                  maxLength={40}
                  onChange={(e) => onGenericConfigChange({ senderName: e.target.value })}
                  placeholder="e.g. Alex"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Special Celebration Date
              </label>
              <Input
                id="generic-special-date"
                type="date"
                value={genericConfig.specialDate}
                onChange={(e) => onGenericConfigChange({ specialDate: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Heartfelt Personal Letter / Message *
              </label>
              <Textarea
                id="generic-message"
                rows={4}
                maxLength={400}
                value={genericConfig.message}
                onChange={(e) => onGenericConfigChange({ message: e.target.value })}
                placeholder="Write your sweet, heartfelt message..."
              />
            </div>
          </div>

          {/* Photo Memories (Only shown for templates that specifically support photos) */}
          {template.supportsPhotos && (
            <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    {template.slug === "sweet-celebration"
                      ? "Celebrant Photo (Center Circle Frame) 📸"
                      : "Photo Memories"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {template.slug === "sweet-celebration"
                      ? "Upload a photo to replace the default celebrant image inside the animated circle frame."
                      : "Add favorite moments to display in the surprise"}
                  </p>
                </div>
              </div>
              <PhotoManager
                photos={genericConfig.photos}
                onChange={(newPhotos) => onGenericConfigChange({ photos: newPhotos })}
                maxPhotos={template.maxPhotos}
                templateName={template.name}
                supportsPhotos={template.supportsPhotos}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎵 INSTAGRAM / WHATSAPP STYLE AUDIO TRIMMER & VOICE NOTE STUDIO */}
      {/* ========================================================================= */}
      <AudioTrimmerStudio
        maxDurationSec={templateDuration}
        templateName={template.name}
        onAudioChange={onAudioChange}
        onUploadingChange={onUploadingChange}
        initialAudioUrl={initialAudioUrl}
        initialStartTime={initialAudioStartTime}
        initialDuration={initialAudioDuration}
      />
    </div>
  );
}
