"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SceneModel } from "@/lib/engine/types";
import { ObjectRenderer } from "./ObjectRenderer";

// Dynamically import Scene3DView with SSR disabled to prevent hydration mismatch with Three.js Canvas
const Scene3DView = dynamic(
  () => import("@/components/3d/Scene3DView").then((mod) => mod.Scene3DView),
  { ssr: false }
);

export interface SceneRendererProps {
  scene: SceneModel;
  objectAnimations: Record<string, string>;
  objectVisibility: Record<string, boolean>;
  spawnedEffects: Array<{ id: string; type: string }>;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  shakeTrigger?: number;
  onObjectClick: (objectId: string) => void;
  onButtonClick: (objectId: string) => void;
}

export function SceneRenderer({
  scene,
  objectAnimations,
  objectVisibility,
  spawnedEffects,
  cameraPosition,
  cameraFov,
  shakeTrigger,
  onObjectClick,
  onButtonClick,
}: SceneRendererProps) {
  const { environment, objects } = scene;

  // Detect whether this scene contains 3D models or 3D particle presets
  const has3DContent =
    objects.some((obj) => obj.type === "model3d") ||
    environment.particlesPreset !== "none";

  // Filter 2D overlay objects (text, buttons, images) vs 3D models and 3D particles handled inside Three.js
  const overlayObjects = objects.filter(
    (obj) => obj.type !== "model3d" && (has3DContent ? obj.type !== "particle" : true)
  );
  const topTextObjects = overlayObjects.filter(
    (obj) => obj.type === "text" && obj.transform.position[1] > 0
  );
  const bottomObjects = overlayObjects.filter(
    (obj) => obj.type !== "text" || obj.transform.position[1] <= 0
  );

  return (
    <div
      className={`relative w-full h-full min-h-[580px] sm:min-h-[640px] rounded-[36px] bg-gradient-to-b ${
        environment.backgroundGradient || "from-slate-950 via-purple-950 to-slate-900"
      } p-6 sm:p-8 flex flex-col items-center justify-between overflow-hidden shadow-2xl border border-white/10`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Narrative & Heading Layer */}
      <div className="relative z-20 w-full flex flex-col items-center space-y-2 pt-4 px-2 text-center pointer-events-auto">
        {topTextObjects.map((obj) => {
          if (objectVisibility[obj.id] === false) return null;
          return (
            <ObjectRenderer
              key={obj.id}
              object={obj}
              currentAnimation={objectAnimations[obj.id]}
              onObjectClick={onObjectClick}
              onButtonClick={onButtonClick}
            />
          );
        })}
      </div>

      {/* 2. Central Interactive Stage: 3D Canvas or 2D Object Viewport */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center my-2 min-h-[300px]">
        {has3DContent ? (
          <Scene3DView
            scene={scene}
            objectAnimations={objectAnimations}
            objectVisibility={objectVisibility}
            spawnedEffects={spawnedEffects}
            cameraPosition={cameraPosition}
            cameraFov={cameraFov}
            shakeTrigger={shakeTrigger}
            onObjectClick={onObjectClick}
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            {objects
              .filter((obj) => obj.type === "model3d" || obj.type === "image")
              .map((obj) => {
                if (objectVisibility[obj.id] === false) return null;
                return (
                  <ObjectRenderer
                    key={obj.id}
                    object={obj}
                    currentAnimation={objectAnimations[obj.id]}
                    onObjectClick={onObjectClick}
                    onButtonClick={onButtonClick}
                  />
                );
              })}
          </div>
        )}
      </div>

      {/* 3. Bottom Controls, Buttons & Subtext Layer */}
      <div className="relative z-20 w-full flex flex-col items-center space-y-3 pb-2 text-center pointer-events-auto">
        {bottomObjects.map((obj) => {
          if (objectVisibility[obj.id] === false) return null;
          return (
            <ObjectRenderer
              key={obj.id}
              object={obj}
              currentAnimation={objectAnimations[obj.id]}
              onObjectClick={onObjectClick}
              onButtonClick={onButtonClick}
            />
          );
        })}
      </div>
    </div>
  );
}
