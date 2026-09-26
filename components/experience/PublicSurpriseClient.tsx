"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  TemplateModel,
  TemplateVersionModel,
  SceneModel,
  PersonalizationData,
  SurpriseModel,
} from "@/lib/engine/types";
import { ExperiencePlayer } from "@/components/engine/ExperiencePlayer";
import { getDraft, incrementViewCount } from "@/lib/creator/draftStorage";
import { templateRegistry } from "@/lib/engine/templateRegistry";
import { THEMES } from "@/lib/engine/themes";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";
import { detectDeviceCapabilities } from "@/lib/utils/deviceCapabilities";
import { RecipientOpeningCurtain } from "./RecipientOpeningCurtain";
import { RecipientFinalScreen } from "./RecipientFinalScreen";
import { RecipientShareModal } from "./RecipientShareModal";
import { ExperienceErrorState, ExperienceErrorType } from "./ExperienceErrorState";
import { ExperienceWebGLFallback } from "./ExperienceWebGLFallback";
import { SweetCelebrationExperience } from "./SweetCelebrationExperience";
import { soundManager } from "@/lib/audio/soundManager";
import { trackSurpriseEvent, trackFunnel, trackPerformance } from "@/lib/analytics/tracker";

interface PublicSurpriseClientProps {
  publicId: string;
  initialTemplate: TemplateModel;
  initialVersion: TemplateVersionModel;
  initialScenes: SceneModel[];
  initialPersonalization: PersonalizationData;
  initialSurprise: SurpriseModel;
  endearment?: string;
  question?: string;
  dodgeText?: string;
  audioUrl?: string;
  audioStartTime?: number;
  audioDuration?: number;
}

export function PublicSurpriseClient({
  publicId,
  initialTemplate,
  initialVersion,
  initialScenes,
  initialPersonalization,
  initialSurprise,
  endearment: initialEndearment,
  question: initialQuestion,
  dodgeText: initialDodgeText,
  audioUrl: initialAudioUrl,
  audioStartTime: initialAudioStartTime,
  audioDuration: initialAudioDuration,
}: PublicSurpriseClientProps) {
  const [template, setTemplate] = useState<TemplateModel>(initialTemplate);
  const [version, setVersion] = useState<TemplateVersionModel>(initialVersion);
  const [scenes, setScenes] = useState<SceneModel[]>(initialScenes);
  const [personalization, setPersonalization] = useState<PersonalizationData>(initialPersonalization);
  const [surprise, setSurprise] = useState<SurpriseModel>(initialSurprise);
  const [themeOverride, setThemeOverride] = useState(THEMES["candy"]);
  const [musicPreset, setMusicPreset] = useState("happy");

  const [endearment, setEndearment] = useState(initialEndearment || "My Everything");
  const [question, setQuestion] = useState(initialQuestion || "Will You Be Mine?");
  const [dodgeText, setDodgeText] = useState(initialDodgeText || "");
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl || "");

  // UX Stages: Opening Screen -> 3D Experience -> Final Screen
  const [hasEntered, setHasEntered] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [errorType, setErrorType] = useState<ExperienceErrorType | null>(null);
  const [playerKey, setPlayerKey] = useState(1);

  // Device & Accessibility Capabilities
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 1. Session & Draft Hydration
  useEffect(() => {
    try {
      // Check for explicitly invalid / not found IDs
      if (publicId.startsWith("invalid-") || publicId.startsWith("non-existent-")) {
        setErrorType("not_found");
        return;
      }

      // Check capabilities
      const caps = getDeviceCapabilities();
      setIsWebGLSupported(caps.isWebGLAvailable);
      setReducedMotion(caps.reducedMotion);

      // Check if we have a locally stored draft/surprise with this publicId
      const draft = getDraft(publicId);
      const isDraftId = publicId.includes("unpublished") || publicId.includes("draft");

      if (isDraftId || (draft && draft.status === "draft")) {
        // If unpublished and not accessed in local creator preview mode, show friendly unpublished state
        if (typeof window !== "undefined" && !window.location.search.includes("preview=true")) {
          setErrorType("unpublished");
          return;
        }
      }

      if (draft) {
        // Increment view count in local storage
        incrementViewCount(publicId);

        const targetSlug = draft.templateSlug || "sweet-celebration";
        const resolvedTpl = templateRegistry.getTemplate(targetSlug) || initialTemplate;
        const resolvedVer = resolvedTpl.versions?.[0] || initialVersion;

        // Construct surprise model
        const model: SurpriseModel = {
          id: draft.id,
          publicId: draft.publicId,
          creatorId: draft.userId || "creator",
          templateId: resolvedTpl.id,
          templateVersionId: resolvedVer.id,
          recipientName: draft.recipientName,
          senderName: draft.senderName,
          message: draft.message,
          specialDate: draft.specialDate,
          photos: draft.photos,
          status: draft.status,
          viewCount: (draft.viewCount || 0) + 1,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt,
        };

        const { scenes: resolvedScenes } = templateRegistry.resolveSurpriseExperience(model);

        const customPersonalization: PersonalizationData = {
          recipient_name: draft.recipientName,
          sender_name: draft.senderName,
          message: draft.message,
          special_date: draft.specialDate,
          photo_1: draft.photos[0] || "",
          photo_2: draft.photos[1] || "",
          photo_3: draft.photos[2] || "",
          photo_4: draft.photos[3] || "",
          photo_5: draft.photos[4] || "",
        };

        setTemplate(resolvedTpl);
        setVersion(resolvedVer);
        setScenes(resolvedScenes);
        setPersonalization(customPersonalization);
        setSurprise(model);

        if (draft.endearment) setEndearment(draft.endearment);
        if (draft.question) setQuestion(draft.question);
        if (draft.dodgeText) setDodgeText(draft.dodgeText);
        if (draft.audioUrl && draft.audioUrl.startsWith("http")) {
          setAudioUrl(draft.audioUrl);
        }

        if (draft.themeId && THEMES[draft.themeId]) {
          setThemeOverride(THEMES[draft.themeId]);
        }

        // Set audio mood preset from theme or track
        if (draft.themeId === "magical" || draft.themeId === "galaxy") {
          setMusicPreset("magical");
        } else if (draft.themeId === "party") {
          setMusicPreset("party");
        } else if (draft.themeId === "pastel") {
          setMusicPreset("sweet");
        }

        // Preload photos for smooth progressive loading
        if (draft.photos && draft.photos.length > 0) {
          draft.photos.forEach((src) => {
            if (src && typeof window !== "undefined") {
              const img = new Image();
              img.src = src;
            }
          });
        }
      }
    } catch {
      setErrorType("load_failure");
    }
  }, [publicId, initialTemplate, initialVersion]);

  // Track initial performance sample
  useEffect(() => {
    const loadTime = typeof performance !== "undefined" ? Math.round(performance.now()) : 350;
    trackPerformance({ loadTimeMs: loadTime, webGlAvailable: isWebGLSupported }, publicId);
  }, [publicId, isWebGLSupported]);

  // Replay Handler
  const handleReplay = useCallback(() => {
    trackSurpriseEvent("replay", { surpriseId: publicId, templateId: template.id });
    setShowFinalScreen(false);
    setPlayerKey((k) => k + 1);
    try {
      soundManager.playSoundEffect("whoosh");
      soundManager.startBgm(musicPreset);
    } catch {
      // Audio fallback
    }
  }, [musicPreset, publicId, template.id]);

  // Handle final scene reached
  const handleExperienceCompleted = useCallback(() => {
    trackSurpriseEvent("complete", { surpriseId: publicId, templateId: template.id });
    trackFunnel("surprise_completed", { surpriseId: publicId, templateId: template.id });
    // Delay slightly so recipient can enjoy the final celebration moment
    setTimeout(() => {
      setShowFinalScreen(true);
    }, 1800);
  }, [publicId, template.id]);

  // Sync iframe messages with parent soundManager and experience completion
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SURPRISE_TOGGLE_MUTE") {
        soundManager.toggleMute();
      }
      if (
        event.data?.type === "SURPRISE_EXPERIENCE_FINISHED" ||
        event.data?.type === "SURPRISE_COMPLETED"
      ) {
        handleExperienceCompleted();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleExperienceCompleted]);

  // 1. Error Screen Display
  if (errorType) {
    return (
      <ExperienceErrorState
        type={errorType}
        onRetry={() => {
          setErrorType(null);
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden select-none">
      {/* 1. Opening Curtain Screen (Intentional Entry + Audio Autoplay Unlock) */}
      {!hasEntered && (
        <RecipientOpeningCurtain
          recipientName={personalization.recipient_name}
          senderName={personalization.sender_name}
          templateSlug={template.slug}
          musicPreset={template.slug === "the-golden-proposal" ? "romantic" : musicPreset}
          audioUrl={audioUrl}
          audioStartTime={initialAudioStartTime}
          audioDuration={initialAudioDuration}
          onOpen={() => {
            setHasEntered(true);
            trackSurpriseEvent("open", { surpriseId: publicId, templateId: template.id });
            trackFunnel("surprise_opened", { surpriseId: publicId, templateId: template.id });
          }}
        />
      )}

      {/* 2. Main Experience Engine */}
      {hasEntered && (
        <>
          {template.slug === "sweet-celebration" ? (
            <iframe
              src={`/api/admin/templates/preview?slug=sweet-celebration&recipientName=${encodeURIComponent(
                personalization.recipient_name
              )}&senderName=${encodeURIComponent(
                personalization.sender_name
              )}&message=${encodeURIComponent(
                personalization.message
              )}&specialDate=${encodeURIComponent(
                personalization.special_date || ""
              )}&photoUrl=${encodeURIComponent(
                surprise.photos?.[0] || ""
              )}`}
              className="w-full h-screen border-none"
              title="Sweet Celebration Experience"
              allow="autoplay"
            />
          ) : template.slug === "whispers-of-love" ? (
            <iframe
              src={`/api/admin/templates/preview?slug=whispers-of-love&recipientName=${encodeURIComponent(
                personalization.recipient_name
              )}&senderName=${encodeURIComponent(
                personalization.sender_name
              )}&message=${encodeURIComponent(
                personalization.message
              )}&photos=${encodeURIComponent(
                (surprise.photos || []).join(",")
              )}&audioUrl=${encodeURIComponent(
                audioUrl || ""
              )}`}
              className="w-full h-screen border-none"
              title="Whispers of Love Experience"
              allow="autoplay"
            />
          ) : template.slug === "love-animation" ? (
            <iframe
              src={`/api/admin/templates/preview?slug=love-animation&recipientName=${encodeURIComponent(
                personalization.recipient_name
              )}&senderName=${encodeURIComponent(
                personalization.sender_name
              )}&message=${encodeURIComponent(personalization.message)}`}
              className="w-full h-screen border-none"
              title="Love Animation Experience"
              allow="autoplay"
            />
          ) : template.slug === "the-golden-proposal" ? (
            <iframe
              src={`/api/admin/templates/preview?slug=the-golden-proposal&recipientName=${encodeURIComponent(
                personalization.recipient_name
              )}&senderName=${encodeURIComponent(
                personalization.sender_name
              )}&message=${encodeURIComponent(
                personalization.message
              )}&endearment=${encodeURIComponent(
                endearment
              )}&question=${encodeURIComponent(
                question
              )}&dodgeText=${encodeURIComponent(
                dodgeText
              )}&audioUrl=${encodeURIComponent(
                audioUrl
              )}&audioStartTime=${initialAudioStartTime ?? 0}&audioDuration=${initialAudioDuration ?? 0}`}
              className="w-full h-screen border-none"
              title="The Golden Proposal Experience"
              allow="autoplay"
            />
          ) : isWebGLSupported ? (
            <ExperiencePlayer
              key={playerKey}
              template={template}
              version={version}
              scenes={scenes}
              personalization={personalization}
              surprise={surprise}
              themeOverride={themeOverride}
              reducedMotion={reducedMotion}
              onCompleted={handleExperienceCompleted}
            />
          ) : (
            <ExperienceWebGLFallback
              recipientName={personalization.recipient_name}
              senderName={personalization.sender_name}
              message={personalization.message}
              photos={surprise.photos}
              onFinish={handleExperienceCompleted}
            />
          )}
        </>
      )}

      {/* 3. Final Screen (Did this make you smile? 😊 Viral Growth Loop) */}
      {showFinalScreen && (
        <RecipientFinalScreen
          recipientName={personalization.recipient_name}
          senderName={personalization.sender_name}
          onReplay={handleReplay}
          onShare={() => {
            setShowShareModal(true);
            trackSurpriseEvent("share", { surpriseId: publicId, templateId: template.id });
            trackFunnel("surprise_shared", { surpriseId: publicId, templateId: template.id });
          }}
        />
      )}

      {/* 4. Recipient Multi-Channel Share Modal */}
      <RecipientShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        publicId={publicId}
        recipientName={personalization.recipient_name}
        senderName={personalization.sender_name}
      />

      {/* 5. Floating Audio Mute/Unmute Controller */}
      {hasEntered && !showFinalScreen && (
        <button
          onClick={() => {
            const currentMuted = soundManager.getMuted();
            soundManager.setMuted(!currentMuted);
          }}
          className="fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all duration-300 shadow-lg"
          title="Toggle audio"
          aria-label="Toggle audio mute"
        >
          <AudioToggleIcon />
        </button>
      )}
    </div>
  );
}

/** Small helper component so React re-renders the icon on mute state changes */
function AudioToggleIcon() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMuted(soundManager.getMuted());
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />;
}
