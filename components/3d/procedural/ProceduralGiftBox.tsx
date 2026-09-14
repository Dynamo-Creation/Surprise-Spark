"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export interface ProceduralGiftBoxProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  ribbonColor?: string;
  animationState?: string; // "idle" | "shake" | "open_lid"
  onClick?: () => void;
}

export function ProceduralGiftBox({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#ec4899", // Vibrant pink/rose
  ribbonColor = "#fbbf24", // Warm golden yellow
  animationState = "idle",
  onClick,
}: ProceduralGiftBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Handle animation transitions via GSAP
  useEffect(() => {
    if (!groupRef.current || !lidRef.current) return;

    if (animationState === "shake") {
      // Shake animation
      gsap.fromTo(
        groupRef.current.rotation,
        { z: -0.15, y: -0.1 },
        {
          z: 0.15,
          y: 0.1,
          duration: 0.08,
          repeat: 6,
          yoyo: true,
          ease: "power1.inOut",
          onComplete: () => {
            if (groupRef.current) {
              groupRef.current.rotation.z = 0;
              groupRef.current.rotation.y = 0;
            }
          },
        }
      );
    } else if (animationState === "open_lid") {
      // Open lid animation: fly up and tilt backwards
      gsap.to(lidRef.current.position, {
        y: 2.2,
        z: -0.5,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
      gsap.to(lidRef.current.rotation, {
        x: -0.8,
        z: 0.3,
        duration: 0.8,
        ease: "power2.out",
      });
    } else if (animationState === "idle") {
      // Reset lid
      gsap.to(lidRef.current.position, { y: 0.65, z: 0, duration: 0.4 });
      gsap.to(lidRef.current.rotation, { x: 0, z: 0, duration: 0.4 });
    }
  }, [animationState]);

  // Gentle idle float on frame
  useFrame((state) => {
    if (groupRef.current && animationState === "idle") {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={hovered ? [scale[0] * 1.05, scale[1] * 1.05, scale[2] * 1.05] : scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* 1. Base Box Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      {/* Base Ribbon - Vertical */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.52, 1.21, 0.25]} />
        <meshStandardMaterial
          color={ribbonColor}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Base Ribbon - Horizontal */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.25, 1.21, 1.52]} />
        <meshStandardMaterial
          color={ribbonColor}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* 2. Separate Animated Lid Group */}
      <group ref={lidRef} position={[0, 0.65, 0]}>
        {/* Lid Top Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.28, 1.6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Lid Ribbon - X */}
        <mesh>
          <boxGeometry args={[1.62, 0.29, 0.26]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Lid Ribbon - Z */}
        <mesh>
          <boxGeometry args={[0.26, 0.29, 1.62]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Bow on Top */}
        <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <torusGeometry args={[0.18, 0.06, 12, 24]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <torusGeometry args={[0.18, 0.06, 12, 24]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
