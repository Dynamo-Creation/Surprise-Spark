"use client";

import React, { useMemo } from "react";
import { SceneModel, SceneObjectModel } from "@/lib/engine/types";
import { ExperienceCanvas } from "./ExperienceCanvas";
import { CameraController } from "./CameraController";
import { SceneLighting } from "./SceneLighting";
import { ProceduralGiftBox } from "./procedural/ProceduralGiftBox";
import { ProceduralCake } from "./procedural/ProceduralCake";
import { ProceduralBalloons } from "./procedural/ProceduralBalloons";
import { ProceduralDoor } from "./procedural/ProceduralDoor";
import { ProceduralCharacter } from "./procedural/ProceduralCharacter";
import { ProceduralRainbow } from "./procedural/ProceduralRainbow";
import { ParticleSystem, ParticleType } from "./particles/ParticleSystem";

import { assetStore } from "@/lib/assets/assetStore";
import { ModelRenderer } from "./ModelRenderer";

export interface Scene3DViewProps {
  scene: SceneModel;
  objectAnimations: Record<string, string>;
  objectVisibility: Record<string, boolean>;
  spawnedEffects: Array<{ id: string; type: string }>;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  shakeTrigger?: number;
  onObjectClick: (objectId: string) => void;
  className?: string;
}

export function Scene3DView({
  scene,
  objectAnimations,
  objectVisibility,
  spawnedEffects,
  cameraPosition,
  cameraFov,
  shakeTrigger = 0,
  onObjectClick,
  className = "",
}: Scene3DViewProps) {
  const { camera, lighting, environment, objects } = scene;

  // Identify 3D objects in the scene
  const giftBoxObj = objects.find(
    (o) => o.type === "model3d" && (o.assetRef?.includes("gift-box") || o.id.includes("gift") || o.props?.slotId === "main_gift")
  );

  const cakeObj = objects.find(
    (o) => o.type === "model3d" && (o.assetRef?.includes("cake") || o.id.includes("cake") || o.props?.slotId === "cake")
  );

  const doorObj = objects.find(
    (o) => o.type === "model3d" && (o.assetRef?.includes("door") || o.id.includes("door") || o.props?.slotId === "door")
  );

  const characterObj = objects.find(
    (o) =>
      o.type === "model3d" &&
      (o.assetRef?.includes("character") ||
        o.id.includes("character") ||
        o.assetRef?.includes("mascot") ||
        o.props?.slotId === "birthday_character")
  );

  const rainbowObj = objects.find(
    (o) => o.type === "model3d" && (o.assetRef?.includes("rainbow") || o.id.includes("rainbow"))
  );

  // Slot resolutions from central assetStore
  const characterSlot = useMemo(() => {
    try {
      return assetStore.resolveSlot("birthday_character");
    } catch {
      return null;
    }
  }, []);

  const giftSlot = useMemo(() => {
    try {
      return assetStore.resolveSlot("main_gift");
    } catch {
      return null;
    }
  }, []);

  // Check if balloons effect is active or spawned
  const hasBalloons = useMemo(() => {
    return (
      environment.particlesPreset === "balloons" ||
      spawnedEffects.some((e) => e.type === "balloons")
    );
  }, [environment.particlesPreset, spawnedEffects]);

  // Determine active particle types
  const particleTypes = useMemo<ParticleType[]>(() => {
    const list: ParticleType[] = [];
    if (environment.particlesPreset === "confetti" || spawnedEffects.some((e) => e.type === "confetti")) {
      list.push("confetti");
    }
    if (
      environment.particlesPreset === "stars" ||
      spawnedEffects.some((e) => e.type === "sparkles")
    ) {
      list.push("stars");
    }
    if (environment.particlesPreset === "hearts" || spawnedEffects.some((e) => e.type === "hearts")) {
      list.push("hearts");
    }
    return list;
  }, [environment.particlesPreset, spawnedEffects]);

  // Fallback scene type for 2D fallback
  const fallbackSceneType = cakeObj ? "cake" : "gift";

  return (
    <div className={`relative w-full h-full min-h-[360px] sm:min-h-[420px] ${className}`}>
      <ExperienceCanvas
        fallbackSceneType={fallbackSceneType}
        onFallbackClick={() => {
          if (giftBoxObj) onObjectClick(giftBoxObj.id);
          else if (cakeObj) onObjectClick("obj-candle-flame");
        }}
      >
        {/* 1. Dynamic Camera Controller */}
        <CameraController
          position={cameraPosition || camera.position}
          fov={cameraFov || camera.fov}
          lookAt={camera.target}
          shakeTrigger={shakeTrigger}
        />

        {/* 2. Realistic Studio / Celebration Lighting */}
        <SceneLighting
          ambientColor={lighting.ambientColor}
          ambientIntensity={lighting.ambientIntensity}
          directionalColor={lighting.directionalColor}
          directionalPosition={lighting.directionalPosition}
          pointLights={lighting.pointLights}
          fogColor={environment.fogColor}
        />

        {/* 3. Main Gift Box (Slot-Aware) */}
        {giftBoxObj && objectVisibility[giftBoxObj.id] !== false && (
          giftSlot?.hasCustomModel && giftSlot.fileUrl && !giftSlot.fileUrl.includes("procedural") ? (
            <ModelRenderer
              url={giftSlot.fileUrl}
              category="gifts"
              transform={{
                position: giftBoxObj.transform.position,
                scale: giftBoxObj.transform.scale,
              }}
              activeAnimation={objectAnimations[giftBoxObj.id] || "Idle"}
              onClick={() => onObjectClick(giftBoxObj.id)}
            />
          ) : (
            <ProceduralGiftBox
              position={giftBoxObj.transform.position}
              scale={giftBoxObj.transform.scale}
              color={(giftBoxObj.props.color as string) || "#ec4899"}
              animationState={objectAnimations[giftBoxObj.id] || "idle"}
              onClick={() => onObjectClick(giftBoxObj.id)}
            />
          )
        )}

        {/* 4. 3D Birthday Cake */}
        {cakeObj && objectVisibility[cakeObj.id] !== false && (
          <ProceduralCake
            position={cakeObj.transform.position}
            scale={cakeObj.transform.scale}
            isLit={objectVisibility["obj-candle-flame"] !== false}
            onBlowCandle={() => onObjectClick("obj-candle-flame")}
          />
        )}

        {/* 5. 3D Mystery Door */}
        {doorObj && objectVisibility[doorObj.id] !== false && (
          <ProceduralDoor
            position={doorObj.transform.position}
            scale={doorObj.transform.scale}
            isOpen={objectAnimations[doorObj.id] === "open" || objectAnimations[doorObj.id] === "opened"}
            onOpen={() => onObjectClick(doorObj.id)}
          />
        )}

        {/* 6. 3D Character / Mascot (Slot-Aware) */}
        {characterObj && objectVisibility[characterObj.id] !== false && (
          characterSlot?.hasCustomModel && characterSlot.fileUrl && !characterSlot.fileUrl.includes("procedural") ? (
            <ModelRenderer
              url={characterSlot.fileUrl}
              category="characters"
              transform={{
                position: characterObj.transform.position,
                scale: characterObj.transform.scale,
              }}
              activeAnimation={objectAnimations[characterObj.id] || "Idle"}
              animationMappings={characterSlot.model?.animationMappings}
              onClick={() => onObjectClick(characterObj.id)}
            />
          ) : (
            <ProceduralCharacter
              position={characterObj.transform.position}
              scale={characterObj.transform.scale}
              color={(characterObj.props.color as string) || "#f59e0b"}
              animationState={objectAnimations[characterObj.id] || "idle"}
              onClick={() => onObjectClick(characterObj.id)}
            />
          )
        )}

        {/* 7. 3D Procedural Rainbow */}
        {rainbowObj && objectVisibility[rainbowObj.id] !== false && (
          <ProceduralRainbow
            position={rainbowObj.transform.position}
            scale={rainbowObj.transform.scale}
          />
        )}

        {/* 8. 3D Procedural Balloons Cluster */}
        {hasBalloons && (
          <ProceduralBalloons
            count={7}
            flyUp={spawnedEffects.some((e) => e.type === "balloons")}
          />
        )}

        {/* 9. Active Instanced Particle Systems */}
        {particleTypes.map((pt) => (
          <ParticleSystem key={pt} type={pt} active={true} />
        ))}
      </ExperienceCanvas>
    </div>
  );
}
