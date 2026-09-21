"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  Music,
  Image as ImageIcon,
  Gift,
  Check,
  Save,
  Palette,
  Volume2,
  VolumeX,
  Play,
  Square,
  AlertTriangle,
  Lock,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MOCK_TEMPLATES } from "@/lib/constants";
import { ALL_BIRTHDAY_TEMPLATES } from "@/lib/engine/templates";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { isTemplateDeleted } from "@/lib/admin/adminStore";
import { THEMES, THEME_LIST, ThemeId, ThemeConfig } from "@/lib/engine/themes";
import { MUSIC_CATEGORIES, MUSIC_TRACKS, MusicCategory, MusicTrack } from "@/lib/engine/musicCatalog";
import { soundManager } from "@/lib/audio/soundManager";
import { PhotoManager } from "@/components/creator/PhotoManager";
import { ShareModal } from "@/components/creator/ShareModal";
import { ExperiencePlayer } from "@/components/engine/ExperiencePlayer";
import { SweetCelebrationExperience } from "@/components/experience/SweetCelebrationExperience";
import { saveDraft, getDraft, DraftSurprise } from "@/lib/creator/draftStorage";
import { useAuth } from "@/hooks/useAuth";
import { trackFunnel } from "@/lib/analytics/tracker";
import { sanitizeText } from "@/lib/security/sanitizer";

const STEPS = [
  { number: 1, title: "Template", icon: Gift },
  { number: 2, title: "Personalize", icon: Sparkles },
  { number: 3, title: "Photos", icon: ImageIcon },
  { number: 4, title: "Theme", icon: Palette },
  { number: 5, title: "Music", icon: Music },
  { number: 6, title: "Preview", icon: Eye },
  { number: 7, title: "Publish", icon: Share2 },
];

function CreateStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isAuthLoading } = useAuth();

  const editId = searchParams.get("edit") || searchParams.get("draftId");
  const templateSlugParam = searchParams.get("template");

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");

  // Step 1: Template
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>(
    templateSlugParam || "sweet-celebration"
  );
  const [pendingTemplateSlug, setPendingTemplateSlug] = useState<string | null>(null);
  const [showTemplateWarnModal, setShowTemplateWarnModal] = useState(false);

  // Step 2: Personalization
  const [recipientName, setRecipientName] = useState("Maya");
  const [senderName, setSenderName] = useState("Alex");
  const [customMessage, setCustomMessage] = useState(
    "Happy Birthday! You make every ordinary day extraordinary. Let's make this year unforgettable!"
  );
  const [specialDate, setSpecialDate] = useState("2026-09-14");

  // Step 3: Photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 4: Theme
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>("candy");

  // Step 5: Music
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<MusicCategory>("happy");
  const [selectedTrackId, setSelectedTrackId] = useState<string>("track-happy-sunshine");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Step 7: Publishing & Share
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
        setSelectedTemplateSlug(existing.templateSlug || "sweet-celebration");
        setRecipientName(existing.recipientName || "Maya");
        setSenderName(existing.senderName || "");
        setCustomMessage(existing.message || "");
        setSpecialDate(existing.specialDate || "");
        setPhotos(existing.photos || []);
        setSelectedThemeId(existing.themeId || "candy");
        setSelectedTrackId(existing.musicTrackId || "track-happy-sunshine");
        setCurrentStep(existing.currentStep || 1);
        if (existing.status === "published") {
          setIsPublished(true);
        }
      }
    }
  }, [editId]);

  const availableBirthdayTemplates = useMemo(() => {
    return ALL_BIRTHDAY_TEMPLATES.filter((tpl) => !isTemplateDeleted(tpl.slug));
  }, []);

  useEffect(() => {
    if (templateSlugParam && !isTemplateDeleted(templateSlugParam)) {
      setSelectedTemplateSlug(templateSlugParam);
    }
  }, [templateSlugParam]);

  useEffect(() => {
    if (isTemplateDeleted(selectedTemplateSlug)) {
      const active = ALL_BIRTHDAY_TEMPLATES.find((tpl) => !isTemplateDeleted(tpl.slug));
      if (active) {
        setSelectedTemplateSlug(active.slug);
      }
    }
  }, [selectedTemplateSlug]);

  // Resolve template from registry
  const currentTemplate = useMemo(() => {
    return (
      templateRegistry.getTemplate(selectedTemplateSlug) ||
      templateRegistry.getTemplate("sweet-celebration") ||
      templateRegistry.listTemplates()[0] ||
      ALL_BIRTHDAY_TEMPLATES[0]
    );
  }, [selectedTemplateSlug]);

  const currentVersion = useMemo(() => {
    return (
      currentTemplate?.versions?.[0] ||
      templateRegistry.getTemplateVersion("ver-sweet-celebration-1-0-0") ||
      ALL_BIRTHDAY_TEMPLATES[0]?.versions?.[0]
    );
  }, [currentTemplate]);

  // Resolve scenes according to photo limits
  const resolvedScenes = useMemo(() => {
    const raw = currentVersion.scenes || [];
    return raw.filter((s) => {
      if (!s.requiresPhotoIndex) return true;
      const idx = s.requiresPhotoIndex - 1;
      return idx >= 0 && idx < photos.length && Boolean(photos[idx]);
    });
  }, [currentVersion, photos]);

  // Analytics tracking on step change
  useEffect(() => {
    if (currentStep === 1) {
      trackFunnel("template_viewed", { templateId: selectedTemplateSlug });
    } else if (currentStep === 2) {
      trackFunnel("editor_started", { templateId: selectedTemplateSlug });
    }
  }, [currentStep, selectedTemplateSlug]);

  // Check if changing template would affect entered personalization
  const handleSelectTemplateWithWarning = (slug: string) => {
    if (slug === selectedTemplateSlug) return;
    trackFunnel("template_selected", { templateId: slug });
    const hasPersonalizedData =
      photos.length > 0 || customMessage.length > 100 || recipientName !== "Maya";

    if (hasPersonalizedData) {
      setPendingTemplateSlug(slug);
      setShowTemplateWarnModal(true);
    } else {
      setSelectedTemplateSlug(slug);
    }
  };

  const confirmTemplateChange = () => {
    if (pendingTemplateSlug) {
      trackFunnel("template_selected", { templateId: pendingTemplateSlug });
      setSelectedTemplateSlug(pendingTemplateSlug);
      // Clamp photos if new template supports fewer photos
      const targetTpl = templateRegistry.getTemplate(pendingTemplateSlug);
      if (targetTpl && !targetTpl.supportsPhotos) {
        setPhotos([]);
      } else if (targetTpl && targetTpl.maxPhotos < photos.length) {
        setPhotos(photos.slice(0, targetTpl.maxPhotos));
      }
    }
    setShowTemplateWarnModal(false);
    setPendingTemplateSlug(null);
  };

  // Draft Auto-saving
  const handleSaveCurrentDraft = (notify = true) => {
    trackFunnel("draft_saved", { templateId: selectedTemplateSlug });
    const cleanRecipient = sanitizeText(recipientName, 40);
    const cleanSender = sanitizeText(senderName, 40);
    const cleanMessage = sanitizeText(customMessage, 500);

    const draft = saveDraft({
      id: draftId || undefined,
      publicId: publicId || undefined,
      userId: user?.id || "demo-user-1",
      templateSlug: selectedTemplateSlug,
      recipientName: cleanRecipient,
      senderName: cleanSender,
      message: cleanMessage,
      specialDate,
      photos,
      themeId: selectedThemeId,
      musicTrackId: selectedTrackId,
      status: isPublished ? "published" : "draft",
    });

    setDraftId(draft.id);
    setPublicId(draft.publicId);

    if (notify) {
      setDraftSaveFeedback(true);
      setTimeout(() => setDraftSaveFeedback(false), 2500);
    }
  };

  // Music Audition Play / Stop
  const handleToggleAudition = (track: MusicTrack) => {
    if (playingTrackId === track.id) {
      soundManager.stopBgm();
      setPlayingTrackId(null);
    } else {
      soundManager.startBgm(track.soundPreset);
      setPlayingTrackId(track.id);
    }
  };

  // Stop audition when leaving step 5
  useEffect(() => {
    if (currentStep !== 5 && playingTrackId) {
      soundManager.stopBgm();
      setPlayingTrackId(null);
    }
  }, [currentStep, playingTrackId]);

  // Handle Publish Flow
  const handlePublish = async () => {
    // Check authenticated user or local demo session
    let activeUserId = user?.id;
    if (!activeUserId && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("demo_user_session");
        if (saved) {
          const parsed = JSON.parse(saved);
          activeUserId = parsed.id;
        }
      } catch {
        // ignore
      }
    }

    // Require login before publishing
    if (!activeUserId) {
      setShowLoginPrompt(true);
      handleSaveCurrentDraft(false);
      return;
    }

    setIsPublishing(true);

    try {
      const cleanRecipient = sanitizeText(recipientName, 40);
      const cleanSender = sanitizeText(senderName, 40);
      const cleanMessage = sanitizeText(customMessage, 500);

      const draft = saveDraft({
        id: draftId || undefined,
        publicId: publicId || undefined,
        userId: activeUserId,
        templateSlug: selectedTemplateSlug,
        recipientName: cleanRecipient,
        senderName: cleanSender,
        message: cleanMessage,
        specialDate,
        photos,
        themeId: selectedThemeId,
        musicTrackId: selectedTrackId,
        status: "published",
        publishedAt: new Date().toISOString(),
      });

      setDraftId(draft.id);
      setPublicId(draft.publicId);
      setIsPublished(true);
      setShowShareModal(true);
      trackFunnel("surprise_published", {
        templateId: selectedTemplateSlug,
        surpriseId: draft.publicId,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Draft Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 mb-1 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Interactive Surprise Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Personalize Your Celebration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {draftSaveFeedback && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Draft Saved
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSaveCurrentDraft(true)}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleSaveCurrentDraft(false);
              setCurrentStep(6);
            }}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* 7-Step Navigation Indicator */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STEPS.map((step) => {
          const isActive = currentStep === step.number;
          const isDone = currentStep > step.number;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(step.number);
              }}
              className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-600 dark:text-pink-300 font-bold shadow-xs ring-2 ring-pink-500/10"
                  : isDone
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 text-emerald-700 dark:text-emerald-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono">#{step.number}</span>
                {isDone ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <p className="text-xs font-semibold truncate">{step.title}</p>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: CHOOSE TEMPLATE */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              <span>Step 1 — Choose 3D Experience Template</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the Sweet Celebration experience or custom editions. You can customize personal details at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {availableBirthdayTemplates.map((tpl) => {
              const isSelected = selectedTemplateSlug === tpl.slug;
              const mock = MOCK_TEMPLATES.find((m) => m.slug === tpl.slug);

              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplateWithWarning(tpl.slug)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/20 dark:bg-pink-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div>
                    <div
                      className={`h-24 w-full rounded-xl bg-gradient-to-tr ${
                        mock?.coverGradient || "from-pink-500 to-purple-600"
                      } mb-3 flex items-center justify-between p-2.5 text-white`}
                    >
                      <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full">
                        {tpl.categoryId}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Selected
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {tpl.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{tpl.versions?.[0]?.scenes?.length || 7} scenes</span>
                    <span>{tpl.supportsPhotos ? `Up to ${tpl.maxPhotos} photos` : "No photos req."}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(2);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Personalize
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PERSONALIZE */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>Step 2 — Personalization Details</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize every line of text, name mentions, and secret notes that appear in the 3D world.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Recipient Name *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {recipientName.length}/40
                    </span>
                  </div>
                  <Input
                    id="recipient-name"
                    value={recipientName}
                    maxLength={40}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Maya"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="sender-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Sender Name
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {senderName.length}/40
                    </span>
                  </div>
                  <Input
                    id="sender-name"
                    value={senderName}
                    maxLength={40}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="special-date" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Special Celebration Date
                  </label>
                </div>
                <Input
                  id="special-date"
                  type="date"
                  value={specialDate}
                  onChange={(e) => setSpecialDate(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="custom-message" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Heartfelt Personal Letter / Message *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {customMessage.length}/300
                  </span>
                </div>
                <Textarea
                  id="custom-message"
                  rows={4}
                  maxLength={300}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write a sweet, funny, or emotional note for their big day..."
                  helperText="Appears after the 3D climatic reveal sequence."
                />
              </div>
            </div>

            {/* Live Preview Card Column */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded-full">
                  Live Preview Card
                </span>
                <h3 className="text-xl font-black text-white mt-3">
                  Happy Birthday, {recipientName || "Someone"}! 🎂
                </h3>
                <p className="text-xs text-slate-300 mt-2 italic leading-relaxed line-clamp-6">
                  &quot;{customMessage || "Your message will appear here..."}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>With love,</span>
                <strong className="text-pink-400">{senderName || "Secret Sender"}</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(3);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Photos
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PHOTOS */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-500" />
              <span>Step 3 — Photo Memories</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload photos to float as 3D polaroids in the celebration scenes.
            </p>
          </div>

          <PhotoManager
            photos={photos}
            onChange={(newPhotos) => {
              setPhotos(newPhotos);
              handleSaveCurrentDraft(false);
            }}
            maxPhotos={currentTemplate.maxPhotos}
            templateName={currentTemplate.name}
            supportsPhotos={currentTemplate.supportsPhotos}
          />

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(2)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(4);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Theme
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: THEME */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-500" />
              <span>Step 4 — Select Aesthetic Theme</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the ambiance, background gradients, lighting tone, and particle effects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {THEME_LIST.map((th) => {
              const isSelected = selectedThemeId === th.id;
              return (
                <div
                  key={th.id}
                  onClick={() => {
                    setSelectedThemeId(th.id);
                    handleSaveCurrentDraft(false);
                  }}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-pink-500 ring-2 ring-pink-500/20 bg-pink-50/20 dark:bg-pink-950/30 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{th.icon}</span>
                      <div className="flex items-center gap-1.5">
                        {th.colorSwatch.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {th.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {th.tagline}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">Particles: {th.particlesPreset}</span>
                    {isSelected && (
                      <span className="font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(5);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Music
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: MUSIC */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-pink-500" />
              <span>Step 5 — Ambient Soundtrack</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only royalty-cleared original music. Audition tracks by clicking the play button.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MUSIC_CATEGORIES.map((cat) => {
              const isCatActive = selectedMusicCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedMusicCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCatActive
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Track List */}
          <div className="space-y-3">
            {MUSIC_TRACKS.filter((t) => t.category === selectedMusicCategory).map((track) => {
              const isSelected = selectedTrackId === track.id;
              const isAuditioning = playingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    handleSaveCurrentDraft(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "border-pink-500 bg-pink-50/20 dark:bg-pink-950/30 ring-2 ring-pink-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudition(track);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isAuditioning
                          ? "bg-pink-500 text-white scale-105 animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                      title={isAuditioning ? "Stop audio preview" : "Audition audio"}
                    >
                      {isAuditioning ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {track.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {track.description} • {track.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full hidden sm:inline">
                      Royalty-Free
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(4)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(6);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Preview
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: PREVIEW */}
      {/* ========================================================================= */}
      {currentStep === 6 && (
        <Card className="p-4 sm:p-6 space-y-6 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-pink-500" />
                <span>Step 6 — Recipient Interactive Preview</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rendered with the exact same 3D experience player your recipient will see.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(7)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Publish
            </Button>
          </div>

          {/* Embedded Player using the exact same rendering engine */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl min-h-[640px] flex flex-col">
            {currentTemplate.slug === "sweet-celebration" ? (
              <SweetCelebrationExperience
                recipientName={recipientName}
                senderName={senderName}
                specialDate={specialDate}
                message={customMessage}
                photos={photos}
                onFinish={() => setCurrentStep(7)}
              />
            ) : currentTemplate.slug === "love-animation" ? (
              <iframe
                src={`/api/admin/templates/preview?slug=love-animation&recipientName=${encodeURIComponent(recipientName)}&senderName=${encodeURIComponent(senderName)}&message=${encodeURIComponent(customMessage)}`}
                className="w-full h-[640px] border-none"
                title="Love Animation Interactive Preview"
              />
            ) : currentTemplate.slug === "the-golden-proposal" ? (
              <iframe
                src={`/api/admin/templates/preview?slug=the-golden-proposal&recipientName=${encodeURIComponent(recipientName)}&senderName=${encodeURIComponent(senderName)}&message=${encodeURIComponent(customMessage)}`}
                className="w-full h-[640px] border-none"
                title="The Golden Proposal Interactive Preview"
              />
            ) : (
              <ExperiencePlayer
                template={currentTemplate}
                version={currentVersion}
                scenes={resolvedScenes}
                personalization={{
                  recipient_name: recipientName,
                  sender_name: senderName,
                  message: customMessage,
                  special_date: specialDate,
                  photo_1: photos[0] || "",
                  photo_2: photos[1] || "",
                  photo_3: photos[2] || "",
                  photo_4: photos[3] || "",
                  photo_5: photos[4] || "",
                }}
                showCreatorControls={true}
                themeOverride={THEMES[selectedThemeId]}
              />
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(5)}>
              Back to Music
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleSaveCurrentDraft(false);
                setCurrentStep(7);
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Publish & Share
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: PUBLISH */}
      {/* ========================================================================= */}
      {currentStep === 7 && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-pink-500/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to Send Your Surprise? 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your customized experience for <strong className="text-pink-600 dark:text-pink-400">{recipientName}</strong> is prepared. Publishing creates an immutable public link.
            </p>
          </div>

          {/* Authentication Check Notice */}
          {!user && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-left flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <p className="font-bold mb-0.5">Account Required to Publish</p>
                <p>
                  To manage your surprise, view stats, and track when it is unwrapped, please log in or create a free account. Your draft will be saved automatically.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/login?redirect=/create?draftId=${draftId || "new"}`}>
                    <Button size="sm" variant="primary" className="text-xs">
                      Log In / Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(6)}
              className="w-full sm:w-auto"
            >
              Back to Preview
            </Button>

            <Button
              id="btn-publish-experience"
              variant="primary"
              size="md"
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full sm:w-auto text-xs sm:text-sm px-6"
            >
              {isPublishing ? "Publishing Experience..." : "Publish & Generate Link 🚀"}
            </Button>
          </div>
        </Card>
      )}

      {/* Template Change Warning Modal */}
      {showTemplateWarnModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold">Switch Experience Template?</h3>
              <p className="text-xs text-slate-400">
                Changing your template may alter supported photo limits or scene choreography. Your personalization text will be preserved.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={() => {
                  setShowTemplateWarnModal(false);
                  setPendingTemplateSlug(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-1/2"
                onClick={confirmTemplateChange}
              >
                Confirm Switch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        publicId={publicId || "sample-birthday-123"}
        recipientName={recipientName}
        senderName={senderName}
      />
    </div>
  );
}

export default function CreateSurprisePage() {
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
