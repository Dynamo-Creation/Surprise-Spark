/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Gift,
  Check,
  Save,
  Lock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ALL_BIRTHDAY_TEMPLATES } from "@/lib/engine/templates";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { isTemplateDeleted } from "@/lib/admin/adminStore";
import { ShareModal } from "@/components/creator/ShareModal";
import { saveDraft, getDraft } from "@/lib/creator/draftStorage";
import { useAuth } from "@/hooks/useAuth";
import { trackFunnel } from "@/lib/analytics/tracker";
import { sanitizeText } from "@/lib/security/sanitizer";
import {
  TemplatePersonalizeSection,
  GoldenProposalConfig,
  GenericCelebrationConfig,
} from "@/components/creator/TemplatePersonalizeSection";
import { StudioLiveCanvas } from "@/components/creator/StudioLiveCanvas";

function CreateStudioContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const editId = searchParams.get("edit") || searchParams.get("draftId");
  const templateSlugParam = searchParams.get("template");

  const [draftId, setDraftId] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");

  // Selected Template
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(
    templateSlugParam || "the-golden-proposal"
  );

  // Template-Specific Personalization Configuration: The Golden Proposal
  const [goldenConfig, setGoldenConfig] = useState<GoldenProposalConfig>({
    recipientName: "Maya",
    recipientEndearment: "My Everything",
    senderName: "Alex",
    confessionLine1: "Hey... I've been holding onto a secret for so long 💕",
    confessionLine2: "Every time I see your smile, my world gets a little brighter ✨",
    confessionLine3: "Today, I finally gathered the courage to tell you... 🌹",
    proposalQuestion: "Will You Be Mine?",
    loveQuote: "Of all the love stories in the world, ours will forever be my favorite.",
    dodgeTooltipText: "Maya, aise kaise mana kar sakti ho! 😉💖",
    replyChoice1: "I was actually hoping you'd say something... 😊✨",
    replyChoice2: "Accha?... 😊💖",
    replyChoice3: "My heart is beating so fast right now... 💓",
  });

  const DEFAULT_WHISPERS_MESSAGE =
    "There are not enough words in any language to describe what you mean to me. You are the warmth of the morning sun, the calm of a quiet night, and the joy in between. Every day with you feels like a beautiful dream I never want to wake up from. You have changed my world in the most wonderful way, and I am so grateful that our paths crossed. Thank you for being you — for your laughter, your kindness, and your love. I carry you in my heart, always. 💕";
  const DEFAULT_BIRTHDAY_MESSAGE =
    "Happy Birthday! You make every ordinary day extraordinary. Let's make this year unforgettable!";
  const DEFAULT_BIRTHDAY_GIFT_MESSAGE =
    "here’s to us and a love that blooms. Wishing you a year filled with laughter, wonder, and endless love.";

  // Generic Personalization Configuration (Birthday Gift, Sweet Celebration, Whispers of Love, Love Animation, etc.)
  const [genericConfig, setGenericConfig] = useState<GenericCelebrationConfig>({
    recipientName: "Sophia",
    senderName: "Alex",
    specialDate: "2026-09-14",
    message: DEFAULT_BIRTHDAY_GIFT_MESSAGE,
    photos: [],
    introEyebrow: "a little something, for my love",
    introHint: "pull & release to strike the heart 🏹",
    line1: "Happy Birthday",
    line2: "Sophia",
    kineticSub: "to the sweetest soul in the world",
    wishEyebrow: "and… forever & always",
    theme: "sakura",
  });

  // Audio / Voice Note Configuration
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioStartTime, setCustomAudioStartTime] = useState<number>(0);
  const [customAudioDuration, setCustomAudioDuration] = useState<number | undefined>(undefined);
  const [isAudioUploading, setIsAudioUploading] = useState(false);

  // Publishing & Share State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [draftSaveFeedback, setDraftSaveFeedback] = useState(false);

  // Load existing draft if editing
  useEffect(() => {
    if (editId) {
      const existing = getDraft(editId);
      if (existing) {
        setDraftId(existing.id);
        setPublicId(existing.publicId);
        setSelectedTemplateSlug(existing.templateSlug || "the-golden-proposal");
        if (existing.templateSlug === "the-golden-proposal") {
          setGoldenConfig((prev) => ({
            ...prev,
            recipientName: existing.recipientName || "Maya",
            senderName: existing.senderName || "Alex",
            loveQuote: existing.message || prev.loveQuote,
          }));
        } else {
          setGenericConfig((prev) => ({
            ...prev,
            recipientName: existing.recipientName || "Sophia",
            senderName: existing.senderName || "",
            message: existing.message || "",
            specialDate: existing.specialDate || "",
            photos: existing.photos || [],
            introEyebrow: existing.introEyebrow || prev.introEyebrow,
            introHint: existing.introHint || prev.introHint,
            line1: existing.line1 || prev.line1,
            line2: existing.line2 || prev.line2,
            kineticSub: existing.kineticSub || prev.kineticSub,
            wishEyebrow: existing.wishEyebrow || prev.wishEyebrow,
            theme: existing.theme || prev.theme,
          }));
        }
        if (existing.status === "published") {
          setIsPublished(true);
        }
        // Restore saved audio URL from draft — only if it's a permanent cloud URL
        if (existing.audioUrl && existing.audioUrl.startsWith("http")) {
          setCustomAudioUrl(existing.audioUrl);
        }
        if (existing.audioStartTime !== undefined) {
          setCustomAudioStartTime(existing.audioStartTime);
        }
        if (existing.audioDuration !== undefined) {
          setCustomAudioDuration(existing.audioDuration);
        }
      }
    }
  }, [editId]);

  const availableTemplates = useMemo(() => {
    return ALL_BIRTHDAY_TEMPLATES.filter((tpl) => !isTemplateDeleted(tpl.slug));
  }, []);

  useEffect(() => {
    if (templateSlugParam && !isTemplateDeleted(templateSlugParam)) {
      setSelectedTemplateSlug(templateSlugParam);
      if (templateSlugParam === "whispers-of-love" && !editId) {
        setGenericConfig((prev) => {
          if (!prev.message || prev.message.includes("Happy Birthday")) {
            return { ...prev, message: DEFAULT_WHISPERS_MESSAGE };
          }
          return prev;
        });
      }
    }
  }, [templateSlugParam, editId]);

  // Resolve template from registry
  const currentTemplate = useMemo(() => {
    return (
      templateRegistry.getTemplate(selectedTemplateSlug) ||
      templateRegistry.getTemplate("the-golden-proposal") ||
      templateRegistry.getTemplate("sweet-celebration") ||
      ALL_BIRTHDAY_TEMPLATES[0]
    );
  }, [selectedTemplateSlug]);

  // Analytics tracking
  useEffect(() => {
    trackFunnel("editor_started", { templateId: selectedTemplateSlug });
  }, [selectedTemplateSlug]);

  // Update handlers
  const handleUpdateGoldenConfig = (newVals: Partial<GoldenProposalConfig>) => {
    setGoldenConfig((prev) => ({ ...prev, ...newVals }));
  };

  const handleUpdateGenericConfig = (newVals: Partial<GenericCelebrationConfig>) => {
    setGenericConfig((prev) => ({ ...prev, ...newVals }));
  };

  // Draft Auto-saving
  const handleSaveCurrentDraft = (notify = true) => {
    trackFunnel("draft_saved", { templateId: selectedTemplateSlug });

    const isGolden = selectedTemplateSlug === "the-golden-proposal";
    const rawRecipient = isGolden ? goldenConfig.recipientName : genericConfig.recipientName;
    const rawSender = isGolden ? goldenConfig.senderName : genericConfig.senderName;
    const rawMessage = isGolden ? goldenConfig.loveQuote : genericConfig.message;

    const cleanRecipient = sanitizeText(rawRecipient, 40);
    const cleanSender = sanitizeText(rawSender, 40);
    const cleanMessage = sanitizeText(rawMessage, 1000);

    const draft = saveDraft({
      id: draftId || undefined,
      publicId: publicId || undefined,
      userId: user?.id || "demo-user-1",
      templateSlug: selectedTemplateSlug,
      recipientName: cleanRecipient,
      senderName: cleanSender,
      message: cleanMessage,
      specialDate: genericConfig.specialDate,
      photos: genericConfig.photos,
      status: isPublished ? "published" : "draft",
      endearment: isGolden ? goldenConfig.recipientEndearment : undefined,
      question: isGolden ? goldenConfig.proposalQuestion : undefined,
      dodgeText: isGolden ? goldenConfig.dodgeTooltipText : undefined,
      audioUrl: customAudioUrl || undefined,
      goldenConfig: isGolden ? goldenConfig : undefined,
      introEyebrow: genericConfig.introEyebrow,
      introHint: genericConfig.introHint,
      line1: genericConfig.line1,
      line2: genericConfig.line2,
      kineticSub: genericConfig.kineticSub,
      wishEyebrow: genericConfig.wishEyebrow,
      theme: genericConfig.theme,
    });

    setDraftId(draft.id);
    setPublicId(draft.publicId);

    if (notify) {
      setDraftSaveFeedback(true);
      setTimeout(() => setDraftSaveFeedback(false), 2500);
    }

    return draft;
  };

  // Handle Publish Flow (Enforces authentication before publishing)
  const handlePublish = async () => {
    // 1. Strict Authentication Gate: Require authenticated account
    if (!user?.id) {
      const saved = handleSaveCurrentDraft(false);
      if (saved?.id) {
        setDraftId(saved.id);
      }
      setShowLoginPrompt(true);
      return;
    }

    if (isAudioUploading) {
      alert("Please wait a moment — your audio is uploading to cloud storage so it will play for your recipient!");
      return;
    }

    setIsPublishing(true);

    try {
      const isGolden = selectedTemplateSlug === "the-golden-proposal";
      const rawRecipient = isGolden ? goldenConfig.recipientName : genericConfig.recipientName;
      const rawSender = isGolden ? goldenConfig.senderName : genericConfig.senderName;
      const rawMessage = isGolden ? goldenConfig.loveQuote : genericConfig.message;

      const cleanRecipient = sanitizeText(rawRecipient, 40);
      const cleanSender = sanitizeText(rawSender, 40);
      const cleanMessage = sanitizeText(rawMessage, 1000);

      // Only store permanent cloud URLs (never ephemeral browser blobs)
      const safeAudioUrl =
        customAudioUrl && (customAudioUrl.startsWith("http") || customAudioUrl.startsWith("/"))
          ? customAudioUrl
          : undefined;

      const draft = saveDraft({
        id: draftId || undefined,
        publicId: publicId || undefined,
        userId: user.id,
        templateSlug: selectedTemplateSlug,
        recipientName: cleanRecipient,
        senderName: cleanSender,
        message: cleanMessage,
        specialDate: genericConfig.specialDate,
        photos: genericConfig.photos,
        status: "published",
        publishedAt: new Date().toISOString(),
        endearment: isGolden ? goldenConfig.recipientEndearment : undefined,
        question: isGolden ? goldenConfig.proposalQuestion : undefined,
        dodgeText: isGolden ? goldenConfig.dodgeTooltipText : undefined,
        audioUrl: safeAudioUrl,
        audioStartTime: customAudioStartTime,
        audioDuration: customAudioDuration,
        goldenConfig: isGolden ? goldenConfig : undefined,
        introEyebrow: genericConfig.introEyebrow,
        introHint: genericConfig.introHint,
        line1: genericConfig.line1,
        line2: genericConfig.line2,
        kineticSub: genericConfig.kineticSub,
        wishEyebrow: genericConfig.wishEyebrow,
        theme: genericConfig.theme,
      });

      // Synchronize published surprise to Supabase cloud published_surprises
      const response = await fetch("/api/surprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: draft.publicId,
          templateSlug: selectedTemplateSlug,
          recipientName: cleanRecipient,
          senderName: cleanSender,
          customMessage: cleanMessage,
          endearment: isGolden ? goldenConfig.recipientEndearment : undefined,
          question: isGolden ? goldenConfig.proposalQuestion : undefined,
          dodgeText: isGolden ? goldenConfig.dodgeTooltipText : undefined,
          audioUrl: safeAudioUrl,
          photos: genericConfig.photos,
          metadata: {
            ...(isGolden ? { goldenConfig } : {}),
            introEyebrow: genericConfig.introEyebrow,
            introHint: genericConfig.introHint,
            line1: genericConfig.line1,
            line2: genericConfig.line2,
            kineticSub: genericConfig.kineticSub,
            wishEyebrow: genericConfig.wishEyebrow,
            theme: genericConfig.theme,
            audioStartTime: customAudioStartTime,
            audioDuration: customAudioDuration,
          },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        if (response.status === 401) {
          setShowLoginPrompt(true);
          return;
        }
        alert(errJson?.error || "Failed to publish surprise to the cloud. Please try again.");
        return;
      }

      setDraftId(draft.id);
      setPublicId(draft.publicId);
      setIsPublished(true);
      setShowShareModal(true);
      trackFunnel("surprise_published", {
        templateId: selectedTemplateSlug,
        surpriseId: draft.publicId,
      });
    } catch (publishErr) {
      console.error("[Publish Flow] Error publishing surprise:", publishErr);
      alert("An unexpected network error occurred while publishing. Your draft has been safely saved.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* ========================================================================= */}
      {/* 🌟 STUDIO TOP NAV BAR (Magic UI Shimmer & Glassmorphic Accents) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Link
              href="/templates"
              className="hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Templates</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Gift className="w-3 h-3" /> Interactive Surprise Studio
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Personalize Your Celebration</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
        </div>

        {/* Template Selector Pills & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Active Template Switcher */}
          <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/60 dark:border-slate-700/60">
            {availableTemplates.map((tpl) => {
              const isSelected = selectedTemplateSlug === tpl.slug;
              const emoji =
                tpl.slug === "birthday-gift"
                  ? "🏹"
                  : tpl.slug === "the-golden-proposal"
                  ? "💍"
                  : tpl.slug === "love-animation"
                  ? "💖"
                  : tpl.slug === "whispers-of-love"
                  ? "🌹"
                  : "💌";

              return (
                <button
                  key={tpl.slug}
                  type="button"
                  onClick={() => {
                    setSelectedTemplateSlug(tpl.slug);
                    if (tpl.slug === "birthday-gift") {
                      setGenericConfig((prev) => ({
                        ...prev,
                        message:
                          prev.message &&
                          prev.message !== DEFAULT_WHISPERS_MESSAGE &&
                          prev.message !== DEFAULT_BIRTHDAY_MESSAGE
                            ? prev.message
                            : DEFAULT_BIRTHDAY_GIFT_MESSAGE,
                        introEyebrow: prev.introEyebrow || "a little something, for my love",
                        introHint: prev.introHint || "pull & release to strike the heart 🏹",
                        line1: prev.line1 || "Happy Birthday",
                        line2: prev.line2 || prev.recipientName || "Sophia",
                        kineticSub: prev.kineticSub || "to the sweetest soul in the world",
                        wishEyebrow: prev.wishEyebrow || "and… forever & always",
                        theme: prev.theme || "sakura",
                      }));
                    } else if (tpl.slug === "whispers-of-love") {
                      setGenericConfig((prev) => {
                        if (!prev.message || prev.message.includes("Happy Birthday")) {
                          return { ...prev, message: DEFAULT_WHISPERS_MESSAGE };
                        }
                        return prev;
                      });
                    } else if (tpl.slug === "sweet-celebration") {
                      setGenericConfig((prev) => {
                        if (!prev.message || prev.message === DEFAULT_WHISPERS_MESSAGE) {
                          return { ...prev, message: DEFAULT_BIRTHDAY_MESSAGE };
                        }
                        return prev;
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="hidden sm:inline">{tpl.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Draft Saved Status */}
          {draftSaveFeedback && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {/* Save Draft */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSaveCurrentDraft(true)}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            className="h-9 font-bold"
          >
            Save
          </Button>

          {/* Publish Action with Magic UI ShimmerButton */}
          <ShimmerButton
            onClick={handlePublish}
            disabled={isPublishing || isAudioUploading}
            shimmerColor={selectedTemplateSlug === "the-golden-proposal" ? "#fbbf24" : "#f472b6"}
            background="linear-gradient(135deg, #e11d48 0%, #be185d 50%, #9d174d 100%)"
            className="h-9 px-4 text-xs font-bold shadow-lg cursor-pointer"
          >
            {isPublishing
              ? "Publishing..."
              : isAudioUploading
              ? "Uploading Audio... ⏳"
              : "Publish & Share 🚀"}
          </ShimmerButton>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ SPLIT-SCREEN WORKSPACE (Left: Adaptive Form | Right: Live Canvas) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personalize Your Celebration (Template Adaptive) */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-6">
          <TemplatePersonalizeSection
            template={currentTemplate}
            goldenConfig={goldenConfig}
            onGoldenConfigChange={handleUpdateGoldenConfig}
            genericConfig={genericConfig}
            onGenericConfigChange={handleUpdateGenericConfig}
            onAudioChange={(audioData) => {
              setCustomAudioUrl(audioData?.url || null);
              setCustomAudioStartTime(audioData?.startTime ?? 0);
              setCustomAudioDuration(audioData?.duration);
            }}
            onUploadingChange={setIsAudioUploading}
            initialAudioUrl={customAudioUrl || undefined}
            initialAudioStartTime={customAudioStartTime}
            initialAudioDuration={customAudioDuration}
          />

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              size="md"
              onClick={() => handleSaveCurrentDraft(true)}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Progress
            </Button>

            <ShimmerButton
              onClick={handlePublish}
              disabled={isPublishing || isAudioUploading}
              shimmerColor="#fbbf24"
              background="linear-gradient(135deg, #e11d48 0%, #be185d 100%)"
              className="px-6 py-2.5 text-xs font-bold shadow-md cursor-pointer"
            >
              {isPublishing
                ? "Preparing..."
                : isAudioUploading
                ? "Uploading Audio... ⏳"
                : "Ready? Publish Surprise 🎉"}
            </ShimmerButton>
          </div>
        </div>

        {/* Right Column: Real-Time Live Preview Canvas */}
        <div className="lg:col-span-6 xl:col-span-6 sticky top-6 self-start">
          <StudioLiveCanvas
            template={currentTemplate}
            goldenConfig={goldenConfig}
            genericConfig={genericConfig}
            customAudioUrl={customAudioUrl}
          />
        </div>
      </div>

      {/* Login Prompt Modal / Warning */}
      {showLoginPrompt && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Account Required to Publish
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log in or sign up with your Google or Gmail account to generate your permanent share link, protect your surprise from tampering, and track when your recipient opens it.
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Your draft is saved locally. You won&apos;t lose any customizations.</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoginPrompt(false)}
              >
                Continue Editing
              </Button>
              <Link href={`/login?redirect=${encodeURIComponent(`/create?draftId=${draftId || "latest"}`)}`}>
                <Button variant="primary" size="sm" className="bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md">
                  Log In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal when published */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        publicId={publicId}
        templateSlug={selectedTemplateSlug}
        recipientName={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.recipientName
            : genericConfig.recipientName
        }
        senderName={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.senderName
            : genericConfig.senderName
        }
        templateName={currentTemplate.name}
        customMessage={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.loveQuote
            : genericConfig.message
        }
        endearment={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.recipientEndearment
            : undefined
        }
        question={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.proposalQuestion
            : undefined
        }
        dodgeText={
          selectedTemplateSlug === "the-golden-proposal"
            ? goldenConfig.dodgeTooltipText
            : undefined
        }
        audioUrl={customAudioUrl || undefined}
        photos={genericConfig.photos}
      />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CreateStudioContent />
    </Suspense>
  );
}
