"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TemplateModel,
  TemplateVersionModel,
  SceneModel,
  PersonalizationData,
  SurpriseModel,
} from "@/lib/engine/types";
import { resolveSceneVariables } from "@/lib/engine/variableResolver";
import { TriggerEngine } from "@/lib/engine/triggerEngine";
import { SceneRenderer } from "./SceneRenderer";
import { soundManager } from "@/lib/audio/soundManager";
import { ThemeConfig, applyThemeToScene } from "@/lib/engine/themes";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Heart,
  ArrowRight,
  Share2,
  Check,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Rewind,
  SkipForward,
} from "lucide-react";

export interface ExperiencePlayerProps {
  template: TemplateModel;
  version: TemplateVersionModel;
  scenes: SceneModel[];
  personalization: PersonalizationData;
  surprise?: Partial<SurpriseModel>;
  showCreatorControls?: boolean;
  themeOverride?: ThemeConfig;
  onSceneChange?: (sceneIndex: number) => void;
  onCompleted?: () => void;
  reducedMotion?: boolean;
}

export function ExperiencePlayer({
  template,
  version,
  scenes,
  personalization,
  surprise,
  showCreatorControls = false,
  themeOverride,
  onSceneChange,
  onCompleted,
  reducedMotion = false,
}: ExperiencePlayerProps) {
  const router = useRouter();
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [objectAnimations, setObjectAnimations] = useState<Record<string, string>>({});
  const [objectVisibility, setObjectVisibility] = useState<Record<string, boolean>>({});
  const [spawnedEffects, setSpawnedEffects] = useState<Array<{ id: string; type: string }>>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3D Engine Camera & Shake State
  const [cameraPosition, setCameraPosition] = useState<[number, number, number] | undefined>(undefined);
  const [cameraFov, setCameraFov] = useState<number | undefined>(undefined);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Scene count safety
  const safeScenes = scenes && scenes.length > 0 ? scenes : version.scenes;
  const totalScenes = safeScenes.length;

  // Scene transition handler
  const handleTransitionScene = useCallback(
    (target: number | "next" | "previous" | "first") => {
      setObjectAnimations({});
      setSpawnedEffects([]);
      setCameraPosition(undefined);
      setCameraFov(undefined);

      if (target === "next") {
        setCurrentSceneIndex((prev) => Math.min(prev + 1, totalScenes - 1));
      } else if (target === "previous") {
        setCurrentSceneIndex((prev) => Math.max(prev - 1, 0));
      } else if (target === "first") {
        setCurrentSceneIndex(0);
      } else if (typeof target === "number") {
        const bounded = Math.max(0, Math.min(target, totalScenes - 1));
        setCurrentSceneIndex(bounded);
      }
    },
    [totalScenes]
  );

  // Share handler
  const handleShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `A Special Birthday Surprise for ${personalization.recipient_name}! 🎁`;
    const text = `I made an interactive 3D birthday surprise for ${personalization.recipient_name}. Open it here:`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3000);
      });
    } else {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  }, [personalization.recipient_name]);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  // Initialize Trigger Engine instance with callbacks
  const triggerEngine = useMemo(() => {
    return new TriggerEngine({
      onPlayAnimation: (objectId, animationName) => {
        setObjectAnimations((prev) => ({ ...prev, [objectId]: animationName }));
        if (animationName === "shake") {
          setShakeTrigger((prev) => prev + 1);
        }
      },
      onStopAnimation: (objectId) => {
        setObjectAnimations((prev) => {
          const next = { ...prev };
          delete next[objectId];
          return next;
        });
      },
      onSetObjectVisibility: (objectId, visible) => {
        setObjectVisibility((prev) => ({ ...prev, [objectId]: visible }));
      },
      onChangeCamera: (camPos, fov) => {
        if (camPos) setCameraPosition(camPos);
        if (fov) setCameraFov(fov);
      },
      onSpawnEffect: (effectType) => {
        const id = "effect-" + Math.random().toString(36).substring(2, 9);
        setSpawnedEffects((prev) => [...prev, { id, type: effectType }]);
        setTimeout(() => {
          setSpawnedEffects((prev) => prev.filter((e) => e.id !== id));
        }, 4000);
      },
      onPlaySound: (soundUrl) => {
        soundManager.playSoundEffect(soundUrl);
      },
      onTransitionScene: handleTransitionScene,
      onCustomEvent: (eventName) => {
        if (eventName === "open_share_dialog") {
          handleShare();
        } else if (eventName === "navigate_create") {
          router.push("/create");
        }
      },
    });
  }, [handleTransitionScene, handleShare, router]);

  // Load triggers whenever active scene changes & play ambient audio
  useEffect(() => {
    const rawScene = safeScenes[currentSceneIndex];
    if (rawScene && rawScene.triggers) {
      triggerEngine.loadTriggers(rawScene.triggers);
    }

    // Start gentle background soundtrack on user engagement
    soundManager.startBgm();

    return () => {
      triggerEngine.clearTimeouts();
    };
  }, [currentSceneIndex, safeScenes, triggerEngine]);

  // Notify parent of scene changes & completion
  useEffect(() => {
    onSceneChange?.(currentSceneIndex);
    if (currentSceneIndex >= safeScenes.length - 1 && safeScenes.length > 0) {
      onCompleted?.();
    }
  }, [currentSceneIndex, onSceneChange, onCompleted, safeScenes.length]);

  // Handle Fullscreen state
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        soundManager.stopBgm();
      } else {
        soundManager.startBgm(themeOverride?.id || "happy");
      }
      return next;
    });
  }, [themeOverride]);

  // Resolve dynamic variables & theme styling for current scene
  const activeScene = useMemo(() => {
    const rawScene = safeScenes[currentSceneIndex] || safeScenes[0];
    const themed = themeOverride ? applyThemeToScene(rawScene, themeOverride) : rawScene;
    return resolveSceneVariables(themed, personalization);
  }, [currentSceneIndex, safeScenes, personalization, themeOverride]);

  // Object and Button Click Handlers
  const handleObjectClick = (objectId: string) => {
    if (isPaused) return;
    soundManager.startBgm(themeOverride?.id || "happy");
    triggerEngine.dispatchEvent("object_clicked", { targetObjectId: objectId });
    triggerEngine.dispatchEvent("click", { targetObjectId: objectId });
  };

  const handleButtonClick = (objectId: string) => {
    if (isPaused) return;
    soundManager.startBgm(themeOverride?.id || "happy");
    triggerEngine.dispatchEvent("button_clicked", { targetObjectId: objectId });
  };

  const handleReset = () => {
    soundManager.playSoundEffect("whoosh");
    handleTransitionScene("first");
  };

  // Accessibility: Full Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea" || targetTag === "select") return;

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        // Trigger primary action in current scene
        const currentScene = safeScenes[currentSceneIndex];
        const interactiveObj = currentScene?.objects.find(
          (o) => Boolean(o.interaction) || o.type === "button" || o.type === "model3d"
        );
        if (interactiveObj) {
          triggerEngine.dispatchEvent("object_clicked", { targetObjectId: interactiveObj.id });
          triggerEngine.dispatchEvent("click", { targetObjectId: interactiveObj.id });
        } else {
          handleTransitionScene("next");
        }
      } else if (e.code === "ArrowRight" || e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleTransitionScene("next");
      } else if (e.code === "ArrowLeft" || e.key.toLowerCase() === "p") {
        e.preventDefault();
        handleTransitionScene("previous");
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    safeScenes,
    currentSceneIndex,
    triggerEngine,
    handleTransitionScene,
    handleToggleMute,
    handleToggleFullscreen,
  ]);

  return (
    <div
      ref={playerContainerRef}
      tabIndex={0}
      role="region"
      aria-label={`Interactive 3D celebration surprise for ${personalization.recipient_name}`}
      className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between select-none touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
    >
      {/* Top Experience Header */}
      <header className="relative z-30 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-white tracking-wide truncate max-w-[180px] sm:max-w-xs">
              For {personalization.recipient_name} 🎂
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {template.name} {themeOverride ? `• ${themeOverride.name} Theme` : ""}
            </p>
          </div>
        </div>

        {/* Scene Sequence Indicator & Audio Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold">
            {safeScenes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleTransitionScene(idx)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none ${
                  idx === currentSceneIndex ? "bg-pink-500 scale-125 ring-2 ring-pink-400/50" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Jump to Scene ${idx + 1}: ${s.name}`}
                title={`Jump to Scene ${idx + 1}: ${s.name}`}
              />
            ))}
            <span className="ml-1 text-slate-300 text-[10px] sm:text-xs">
              {currentSceneIndex + 1}/{totalScenes}
            </span>
          </div>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
            aria-label={isMuted ? "Unmute background music" : "Mute background music"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
            aria-label="Share this celebration surprise"
            title="Share surprise"
          >
            <Share2 className="w-4 h-4 text-slate-300" />
          </button>

          {currentSceneIndex > 0 && (
            <button
              onClick={handleReset}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              aria-label="Restart celebration from first scene"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Experience Viewport: Perfectly Clamped for Mobile 390x844 */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-2 sm:p-6 max-w-[420px] mx-auto w-full">
        {activeScene && (
          <SceneRenderer
            scene={activeScene}
            objectAnimations={objectAnimations}
            objectVisibility={objectVisibility}
            spawnedEffects={spawnedEffects}
            cameraPosition={cameraPosition}
            cameraFov={cameraFov}
            shakeTrigger={reducedMotion ? 0 : shakeTrigger}
            onObjectClick={handleObjectClick}
            onButtonClick={handleButtonClick}
          />
        )}
      </main>

      {/* Creator Studio Interactive Controls Overlay */}
      {showCreatorControls && (
        <div className="relative z-40 w-full max-w-sm sm:max-w-md mx-auto px-4 py-2.5 mb-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTogglePlay}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title={isPaused ? "Play animation" : "Pause animation"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              <span>{isPaused ? "Play" : "Pause"}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Restart from Scene 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTransitionScene("previous")}
              disabled={currentSceneIndex === 0}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
              title="Previous scene"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-bold text-slate-300 px-1">
              {currentSceneIndex + 1} / {totalScenes}
            </span>

            <button
              onClick={() => handleTransitionScene("next")}
              disabled={currentSceneIndex === totalScenes - 1}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-colors cursor-pointer"
              title="Next scene"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Floating Share Toast Feedback */}
      {shareToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4" />
          <span>Surprise link copied to clipboard!</span>
        </div>
      )}

      {/* Experience Footer with Viral Loop */}
      <footer className="relative z-30 w-full px-5 py-3.5 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          <span>Crafted with SurpriseSpark</span>
        </p>

        <Link
          href="/create"
          className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
        >
          <span>Create an interactive surprise for someone</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </footer>
    </div>
  );
}
