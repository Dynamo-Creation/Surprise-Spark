"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export interface ProceduralCharacterProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  animationState?: string; // "idle" | "walk" | "celebrate"
  onClick?: () => void;
}

export function ProceduralCharacter({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#f59e0b", // Warm golden honey / caramel bear
  animationState = "idle",
  onClick,
}: ProceduralCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    if (animationState === "walk") {
      // Walk forward toward camera with lively steps
      gsap.to(groupRef.current.position, {
        z: position[2] + 1.2,
        y: position[1] + 0.1,
        duration: 1.5,
        ease: "power1.inOut",
      });
    } else if (animationState === "celebrate") {
      // Joyful bouncy celebration
      gsap.to(groupRef.current.position, {
        y: position[1] + 0.4,
        duration: 0.25,
        repeat: 6,
        yoyo: true,
        ease: "power1.inOut",
      });
      if (leftArmRef.current && rightArmRef.current) {
        gsap.to(leftArmRef.current.rotation, { z: 1.2, duration: 0.2, repeat: 6, yoyo: true });
        gsap.to(rightArmRef.current.rotation, { z: -1.2, duration: 0.2, repeat: 6, yoyo: true });
      }
    }
  }, [animationState, position]);

  // Frame idle bobbing
  useFrame((state) => {
    if (groupRef.current && animationState === "idle") {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 2.2) * 0.06;
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 1. Body */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Belly Patch */}
      <mesh position={[0, -0.2, 0.45]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>

      {/* 2. Head */}
      <group position={[0, 0.55, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.48, 24, 24]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.38, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[-0.38, 0.35, 0.08]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#f472b6" roughness={0.5} />
        </mesh>

        <mesh position={[0.38, 0.35, 0]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0.38, 0.35, 0.08]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#f472b6" roughness={0.5} />
        </mesh>

        {/* Muzzle */}
        <mesh position={[0, -0.08, 0.42]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        {/* Dark Nose */}
        <mesh position={[0, -0.02, 0.58]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.2} />
        </mesh>

        {/* Eyes with white reflection sparkle */}
        <mesh position={[-0.16, 0.08, 0.43]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        <mesh position={[-0.14, 0.1, 0.47]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0.16, 0.08, 0.43]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.1, 0.47]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Party Hat */}
        <group position={[0, 0.5, 0]} rotation={[0.08, 0, -0.08]}>
          <mesh castShadow>
            <coneGeometry args={[0.2, 0.5, 16]} />
            <meshStandardMaterial color="#ec4899" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 3. Arms */}
      <mesh ref={leftArmRef} position={[-0.55, -0.15, 0.1]} rotation={[0, 0, 0.4]} castShadow>
        <capsuleGeometry args={[0.12, 0.35, 8, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.55, -0.15, 0.1]} rotation={[0, 0, -0.4]} castShadow>
        <capsuleGeometry args={[0.12, 0.35, 8, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* 4. Feet */}
      <mesh position={[-0.25, -0.75, 0.1]} castShadow>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.25, -0.75, 0.1]} castShadow>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}
