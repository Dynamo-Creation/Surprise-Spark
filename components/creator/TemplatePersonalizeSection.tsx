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
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { BorderBeam } from "@/components/magicui/border-beam";
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
}: TemplatePersonalizeSectionProps) {
  const isGoldenProposal = template.slug === "the-golden-proposal";
  const isSweetCelebration = template.slug === "sweet-celebration";
  const isLoveAnimation = template.slug === "love-animation";

  const templateDuration = isGoldenProposal ? 60 : 120;

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
      ) : (
        /* ========================================================================= */
        /* 💌 TEMPLATE 2 & 3: SWEET CELEBRATION / LOVE ANIMATION / OTHER TEMPLATES */
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
      />
    </div>
  );
}
