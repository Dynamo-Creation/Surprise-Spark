"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TransformDefaults, StandardAnimation } from "@/lib/assets/types";

// Enable Three.js global asset cache for high performance
THREE.Cache.enabled = true;

export interface ModelRendererProps {
  url?: string;
  category?: string;
  transform?: Partial<TransformDefaults>;
  activeAnimation?: string;
  animationMappings?: Record<string, StandardAnimation>;
  wireframe?: boolean;
  colorOverride?: string;
  onClick?: () => void;
  onAnimationWarning?: (warning: string) => void;
}

export function ModelRenderer({
  url,
  category = "characters",
  transform,
  activeAnimation = "Idle",
  animationMappings = {},
  wireframe = false,
  colorOverride,
  onClick,
  onAnimationWarning,
}: ModelRendererProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [clips, setClips] = useState<THREE.AnimationClip[]>([]);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Computed position, rotation, scale
  const pos: [number, number, number] = transform?.position || [0, 0, 0];
  const rot: [number, number, number] = transform?.rotation || [0, 0, 0];
  const scl: [number, number, number] = transform?.scale || [1, 1, 1];
  const anchor = transform?.anchor || "center";

  // Load GLB/GLTF model
  useEffect(() => {
    if (!url) {
      setScene(null);
      return;
    }

    let isMounted = true;
    setLoadError(false);

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (!isMounted) return;

        // Clone scene so multiple instances don't collide
        const clonedScene = gltf.scene.clone(true);

        // Adjust anchor based on bounding box
        const bbox = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        if (anchor === "bottom") {
          clonedScene.position.y = -bbox.min.y;
        } else if (anchor === "top") {
          clonedScene.position.y = -bbox.max.y;
        } else {
          // center
          const center = new THREE.Vector3();
          bbox.getCenter(center);
          clonedScene.position.sub(center);
        }

        // Apply materials and wireframe
        clonedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (m) {
              m.wireframe = wireframe;
              if (colorOverride) {
                m.color = new THREE.Color(colorOverride);
              }
            }
          }
        });

        setScene(clonedScene);

        if (gltf.animations && gltf.animations.length > 0) {
          const newMixer = new THREE.AnimationMixer(clonedScene);
          setMixer(newMixer);
          setClips(gltf.animations);
        } else {
          setMixer(null);
          setClips([]);
        }
      },
      undefined,
      () => {
        // Fall back gracefully to procedural presentation if remote GLB is not yet on server
        if (isMounted) {
          setLoadError(true);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url, wireframe, colorOverride, anchor]);

  // Handle animation playback with standard contract mapping
  useEffect(() => {
    if (!mixer || clips.length === 0) return;

    // Resolve target clip name
    // 1. Direct name match
    let targetClip = clips.find((c) => c.name.toLowerCase() === activeAnimation.toLowerCase());

    // 2. Mapped name match
    if (!targetClip) {
      const mappedClipName = Object.keys(animationMappings).find(
        (clipName) => animationMappings[clipName] === activeAnimation
      );
      if (mappedClipName) {
        targetClip = clips.find((c) => c.name === mappedClipName);
      }
    }

    // 3. Fallback to Idle or first clip with non-fatal warning
    if (!targetClip) {
      targetClip = clips.find((c) => c.name.toLowerCase().includes("idle")) || clips[0];
      if (targetClip) {
        onAnimationWarning?.(
          `Animation '${activeAnimation}' was not found in model clips. Falling back to '${targetClip.name}'.`
        );
      }
    }

    if (targetClip) {
      mixer.stopAllAction();
      const action = mixer.clipAction(targetClip);
      action.reset().fadeIn(0.2).play();
    }
  }, [mixer, clips, activeAnimation, animationMappings, onAnimationWarning]);

  // Update mixer per frame
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  // PROCEDURAL PREVIEW FALLBACK
  // If no external URL or if GLB URL is a placeholder in local environment,
  // renders a rich procedural geometry matching the asset category.
  const proceduralGeometry = useMemo(() => {
    switch (category) {
      case "characters":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0.4, 0]}>
              <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
              <meshStandardMaterial color={colorOverride || "#f59e0b"} wireframe={wireframe} roughness={0.3} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.32, 16, 16]} />
              <meshStandardMaterial color={colorOverride || "#fbbf24"} wireframe={wireframe} roughness={0.3} />
            </mesh>
            {/* Party Hat */}
            <mesh position={[0, 1.35, 0]}>
              <coneGeometry args={[0.16, 0.4, 16]} />
              <meshStandardMaterial color="#ec4899" wireframe={wireframe} />
            </mesh>
            {/* Eyes */}
            <mesh position={[-0.1, 0.98, 0.28]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.1, 0.98, 0.28]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
          </group>
        );

      case "gifts":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial color={colorOverride || "#ec4899"} wireframe={wireframe} roughness={0.2} />
            </mesh>
            {/* Ribbon horizontal */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.92, 0.15, 0.92]} />
              <meshStandardMaterial color="#fef08a" wireframe={wireframe} metalness={0.4} />
            </mesh>
            {/* Ribbon vertical */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.92, 0.92]} />
              <meshStandardMaterial color="#fef08a" wireframe={wireframe} metalness={0.4} />
            </mesh>
          </group>
        );

      case "cakes":
        return (
          <group>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
              <meshStandardMaterial color={colorOverride || "#f472b6"} wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.35, 32]} />
              <meshStandardMaterial color="#fbcfe8" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.25, 16]} />
              <meshStandardMaterial color="#fef08a" />
            </mesh>
          </group>
        );

      case "doors":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.0, 1.8, 0.1]} />
              <meshStandardMaterial color={colorOverride || "#6366f1"} wireframe={wireframe} />
            </mesh>
            <mesh position={[0.35, 0, 0.08]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <dodecahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color={colorOverride || "#8b5cf6"} wireframe={wireframe} roughness={0.3} />
          </mesh>
        );
    }
  }, [category, colorOverride, wireframe]);

  return (
    <group
      ref={groupRef}
      position={pos}
      rotation={rot}
      scale={scl}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {scene && !loadError ? (
        <primitive object={scene} />
      ) : (
        proceduralGeometry
      )}
    </group>
  );
}
