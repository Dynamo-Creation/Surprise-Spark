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
  animationState?: string; // "idle" | "shake" | "open_lid" | "opened"
  onClick?: () => void;
}

/**
 * Luxury & Gold Procedural Gift Box
 *
 * Features:
 * 1. Hollow 5-panel box architecture with realistic wall thickness
 * 2. Deep royal velvet interior lining & tufted velvet cushion with gold studs
 * 3. Beveled metallic gold lip moldings along the top perimeter
 * 4. Finished lid underside with matching velvet and gold trim
 * 5. Dynamic golden inner glow (point light) activating on lid open with breathing pulse
 * 6. Rising faceted 3D golden star centerpiece with floating starlight motes
 */
export function ProceduralGiftBox({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#be123c", // Rich luxury ruby/crimson
  ribbonColor = "#fbbf24", // Warm metallic gold
  animationState = "idle",
  onClick,
}: ProceduralGiftBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const surpriseGroupRef = useRef<THREE.Group>(null);
  const starCoreRef = useRef<THREE.Group>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  // Velvet lining color: Deep Royal Midnight Sapphire/Plum
  const velvetColor = "#172554";
  const goldMetalColor = "#fbbf24";

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
      // 1. Open lid: fly up and tilt backwards
      gsap.to(lidRef.current.position, {
        y: 2.3,
        z: -0.6,
        duration: 0.85,
        ease: "back.out(1.6)",
      });
      gsap.to(lidRef.current.rotation, {
        x: -0.85,
        z: 0.25,
        duration: 0.85,
        ease: "power2.out",
      });

      // 2. Elevate emerging surprise centerpiece from inside cushion
      if (surpriseGroupRef.current) {
        gsap.to(surpriseGroupRef.current.position, {
          y: 0.6,
          duration: 1.0,
          delay: 0.2,
          ease: "back.out(1.8)",
        });
        gsap.to(surpriseGroupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.9,
          delay: 0.2,
          ease: "back.out(1.6)",
        });
      }

      // 3. Ignite warm golden inner light
      if (innerLightRef.current) {
        gsap.to(innerLightRef.current, {
          intensity: 3.6,
          duration: 0.7,
          delay: 0.15,
          ease: "power2.out",
        });
      }
    } else if (animationState === "opened") {
      // Immediately open state (for preview or later scenes)
      lidRef.current.position.set(0, 2.3, -0.6);
      lidRef.current.rotation.set(-0.85, 0, 0.25);
      if (surpriseGroupRef.current) {
        surpriseGroupRef.current.position.y = 0.6;
        surpriseGroupRef.current.scale.set(1, 1, 1);
      }
      if (innerLightRef.current) {
        innerLightRef.current.intensity = 3.6;
      }
    } else if (animationState === "idle") {
      // Reset lid
      gsap.to(lidRef.current.position, { y: 0.62, z: 0, duration: 0.4 });
      gsap.to(lidRef.current.rotation, { x: 0, z: 0, duration: 0.4 });
      if (surpriseGroupRef.current) {
        gsap.to(surpriseGroupRef.current.position, { y: -0.32, duration: 0.4 });
        gsap.to(surpriseGroupRef.current.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 0.4 });
      }
      if (innerLightRef.current) {
        gsap.to(innerLightRef.current, { intensity: 0, duration: 0.3 });
      }
    }
  }, [animationState]);

  // Frame loop for gentle idle float, centerpiece spin & inner light pulse
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Gentle box hover when idle
    if (groupRef.current && (animationState === "idle" || animationState === "shake")) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.12;
    }

    // Dynamic rotation and hover of rising star centerpiece
    if (starCoreRef.current && (animationState === "open_lid" || animationState === "opened")) {
      starCoreRef.current.rotation.y = t * 0.7;
      starCoreRef.current.rotation.x = Math.sin(t * 0.8) * 0.15;
      starCoreRef.current.position.y = Math.sin(t * 2) * 0.06;
    }

    // Inner light breathing pulse when opened
    if (innerLightRef.current && (animationState === "open_lid" || animationState === "opened")) {
      innerLightRef.current.intensity = 3.4 + Math.sin(t * 3.5) * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={hovered ? [scale[0] * 1.04, scale[1] * 1.04, scale[2] * 1.04] : scale}
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
      {/* =================================================================== */}
      {/* 1. HOLLOW 5-PANEL LUXURY BOX CHAMBER */}
      {/* =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Exterior Bottom Floor */}
        <mesh position={[0, -0.54, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 1.5]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 0, -0.71]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.16, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>
        {/* Front Wall */}
        <mesh position={[0, 0, 0.71]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.16, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-0.71, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.16, 1.34]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[0.71, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.16, 1.34]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>

        {/* ================================================================= */}
        {/* 2. INNER VELVET LINING (Deep Royal Sapphire / Plum) */}
        {/* ================================================================= */}
        {/* Inside Back Wall Velvet */}
        <mesh position={[0, 0, -0.665]}>
          <boxGeometry args={[1.34, 1.08, 0.01]} />
          <meshStandardMaterial color={velvetColor} roughness={0.88} metalness={0.05} />
        </mesh>
        {/* Inside Front Wall Velvet */}
        <mesh position={[0, 0, 0.665]}>
          <boxGeometry args={[1.34, 1.08, 0.01]} />
          <meshStandardMaterial color={velvetColor} roughness={0.88} metalness={0.05} />
        </mesh>
        {/* Inside Left Wall Velvet */}
        <mesh position={[-0.665, 0, 0]}>
          <boxGeometry args={[0.01, 1.08, 1.32]} />
          <meshStandardMaterial color={velvetColor} roughness={0.88} metalness={0.05} />
        </mesh>
        {/* Inside Right Wall Velvet */}
        <mesh position={[0.665, 0, 0]}>
          <boxGeometry args={[0.01, 1.08, 1.32]} />
          <meshStandardMaterial color={velvetColor} roughness={0.88} metalness={0.05} />
        </mesh>

        {/* ================================================================= */}
        {/* 3. TUFTED PLUSH VELVET CUSHION WITH GOLD ACCENT STUDS */}
        {/* ================================================================= */}
        {/* Main Base Pillow Cushion */}
        <mesh position={[0, -0.42, 0]} receiveShadow>
          <boxGeometry args={[1.32, 0.22, 1.32]} />
          <meshStandardMaterial color={velvetColor} roughness={0.92} metalness={0.02} />
        </mesh>

        {/* Tufted Gold Accent Beads (3x3 Grid) */}
        {[
          [-0.38, -0.3, -0.38],
          [0, -0.3, -0.38],
          [0.38, -0.3, -0.38],
          [-0.38, -0.3, 0],
          [0, -0.3, 0],
          [0.38, -0.3, 0],
          [-0.38, -0.3, 0.38],
          [0, -0.3, 0.38],
          [0.38, -0.3, 0.38],
        ].map((pt, i) => (
          <mesh key={`stud-${i}`} position={pt as [number, number, number]} castShadow>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color={goldMetalColor} roughness={0.15} metalness={0.9} />
          </mesh>
        ))}

        {/* ================================================================= */}
        {/* 4. BEVELED METALLIC GOLD RIM MOLDINGS */}
        {/* ================================================================= */}
        {/* Back Gold Rim */}
        <mesh position={[0, 0.58, -0.71]} castShadow>
          <boxGeometry args={[1.52, 0.04, 0.09]} />
          <meshStandardMaterial color={goldMetalColor} roughness={0.16} metalness={0.88} />
        </mesh>
        {/* Front Gold Rim */}
        <mesh position={[0, 0.58, 0.71]} castShadow>
          <boxGeometry args={[1.52, 0.04, 0.09]} />
          <meshStandardMaterial color={goldMetalColor} roughness={0.16} metalness={0.88} />
        </mesh>
        {/* Left Gold Rim */}
        <mesh position={[-0.71, 0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.04, 1.34]} />
          <meshStandardMaterial color={goldMetalColor} roughness={0.16} metalness={0.88} />
        </mesh>
        {/* Right Gold Rim */}
        <mesh position={[0.71, 0.58, 0]} castShadow>
          <boxGeometry args={[0.09, 0.04, 1.34]} />
          <meshStandardMaterial color={goldMetalColor} roughness={0.16} metalness={0.88} />
        </mesh>

        {/* ================================================================= */}
        {/* 5. EXTERIOR RIBBONS */}
        {/* ================================================================= */}
        {/* Vertical Ribbon Front */}
        <mesh position={[0, 0, 0.755]} castShadow>
          <boxGeometry args={[0.22, 1.16, 0.015]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Vertical Ribbon Back */}
        <mesh position={[0, 0, -0.755]} castShadow>
          <boxGeometry args={[0.22, 1.16, 0.015]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Horizontal Ribbon Left */}
        <mesh position={[-0.755, 0, 0]} castShadow>
          <boxGeometry args={[0.015, 1.16, 0.22]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Horizontal Ribbon Right */}
        <mesh position={[0.755, 0, 0]} castShadow>
          <boxGeometry args={[0.015, 1.16, 0.22]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>
      </group>

      {/* =================================================================== */}
      {/* 6. DYNAMIC INNER GOLDEN LIGHT */}
      {/* =================================================================== */}
      <pointLight
        ref={innerLightRef}
        position={[0, -0.05, 0]}
        color="#fbbf24"
        intensity={0}
        distance={4.8}
        decay={1.8}
      />

      {/* =================================================================== */}
      {/* 7. EMERGING CELEBRATION CENTERPIECE (Faceted 3D Golden Star) */}
      {/* =================================================================== */}
      <group
        ref={surpriseGroupRef}
        position={[0, -0.32, 0]}
        scale={[0.4, 0.4, 0.4]}
      >
        <group ref={starCoreRef}>
          {/* Central Radiant Gemstone Core */}
          <mesh castShadow>
            <octahedronGeometry args={[0.24, 0]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              roughness={0.12}
              metalness={0.92}
            />
          </mesh>

          {/* Secondary Interlocking Facet Core */}
          <mesh rotation={[0, Math.PI / 4, Math.PI / 4]} castShadow>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.4}
              roughness={0.12}
              metalness={0.95}
            />
          </mesh>

          {/* 6 Radiant Star Spikes */}
          {[
            // +Y
            { pos: [0, 0.24, 0], rot: [0, 0, 0] },
            // -Y
            { pos: [0, -0.24, 0], rot: [Math.PI, 0, 0] },
            // +X
            { pos: [0.24, 0, 0], rot: [0, 0, -Math.PI / 2] },
            // -X
            { pos: [-0.24, 0, 0], rot: [0, 0, Math.PI / 2] },
            // +Z
            { pos: [0, 0, 0.24], rot: [Math.PI / 2, 0, 0] },
            // -Z
            { pos: [0, 0, -0.24], rot: [-Math.PI / 2, 0, 0] },
          ].map((spike, idx) => (
            <mesh
              key={`spike-${idx}`}
              position={spike.pos as [number, number, number]}
              rotation={spike.rot as [number, number, number]}
              castShadow
            >
              <coneGeometry args={[0.07, 0.32, 4]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={0.95}
              />
            </mesh>
          ))}

          {/* 8 Diagonal Spikes for Moravian / 14-Pointed Star Brilliance */}
          {[
            [0.15, 0.15, 0.15],
            [-0.15, 0.15, 0.15],
            [0.15, -0.15, 0.15],
            [-0.15, -0.15, 0.15],
            [0.15, 0.15, -0.15],
            [-0.15, 0.15, -0.15],
            [0.15, -0.15, -0.15],
            [-0.15, -0.15, -0.15],
          ].map((diag, idx) => (
            <mesh
              key={`diag-${idx}`}
              position={diag as [number, number, number]}
              castShadow
            >
              <sphereGeometry args={[0.038, 8, 8]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#fbbf24"
                emissiveIntensity={0.8}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          ))}

          {/* Floating Orbiting Starlight Motes */}
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const angle = (idx / 6) * Math.PI * 2;
            const r = 0.42;
            return (
              <mesh
                key={`mote-${idx}`}
                position={[Math.cos(angle) * r, Math.sin(idx * 1.5) * 0.15, Math.sin(angle) * r]}
              >
                <octahedronGeometry args={[0.03, 0]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#fef08a"
                  emissiveIntensity={1.2}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* =================================================================== */}
      {/* 8. SEPARATE ANIMATED LID GROUP (Lined Underside & Gold Bow) */}
      {/* =================================================================== */}
      <group ref={lidRef} position={[0, 0.62, 0]}>
        {/* Lid Top Box Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.22, 1.6]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.18} />
        </mesh>

        {/* Finished Underside Velvet Lining */}
        <mesh position={[0, -0.11, 0]}>
          <boxGeometry args={[1.46, 0.015, 1.46]} />
          <meshStandardMaterial color={velvetColor} roughness={0.88} metalness={0.05} />
        </mesh>

        {/* Underside Gold Perimeter Trim */}
        <mesh position={[0, -0.112, 0]}>
          <boxGeometry args={[1.52, 0.01, 1.52]} />
          <meshStandardMaterial color={goldMetalColor} roughness={0.16} metalness={0.88} />
        </mesh>

        {/* Lid Ribbon - X */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[1.62, 0.23, 0.24]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Lid Ribbon - Z */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.24, 0.23, 1.62]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Elegant Gold Bow on Top */}
        <mesh position={[0, 0.18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <torusGeometry args={[0.2, 0.065, 14, 28]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0.18, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <torusGeometry args={[0.2, 0.065, 14, 28]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.75} />
        </mesh>
        {/* Bow Center Knot */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color={ribbonColor} roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

