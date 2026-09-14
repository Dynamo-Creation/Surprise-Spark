"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export interface ProceduralCakeProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  baseColor?: string;
  frostingColor?: string;
  candleColor?: string;
  isLit?: boolean;
  onBlowCandle?: () => void;
}

export function ProceduralCake({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  baseColor = "#fdf2f8", // Warm vanilla / strawberry cream
  frostingColor = "#ec4899", // Raspberry pink
  candleColor = "#38bdf8", // Sky blue candle
  isLit: initialIsLit = true,
  onBlowCandle,
}: ProceduralCakeProps) {
  const cakeGroup = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);
  const [lit, setLit] = useState(initialIsLit);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setLit(initialIsLit);
  }, [initialIsLit]);

  // Candle extinguish animation
  const handleBlow = () => {
    if (!lit) return;
    if (flameRef.current && flameLightRef.current) {
      gsap.to(flameRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setLit(false);
          onBlowCandle?.();
        },
      });
      gsap.to(flameLightRef.current, {
        intensity: 0,
        duration: 0.3,
      });
    } else {
      setLit(false);
      onBlowCandle?.();
    }
  };

  // Flame flickering & gentle cake floating
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cakeGroup.current) {
      cakeGroup.current.position.y = position[1] + Math.sin(t * 1.8) * 0.05;
      cakeGroup.current.rotation.y = Math.sin(t * 0.4) * 0.1;
    }

    if (lit && flameRef.current && flameLightRef.current) {
      const flicker = 1 + Math.sin(t * 18) * 0.15 + Math.cos(t * 26) * 0.1;
      flameRef.current.scale.set(flicker, flicker * 1.2, flicker);
      flameLightRef.current.intensity = 1.8 * flicker;
    }
  });

  return (
    <group
      ref={cakeGroup}
      position={position}
      scale={hovered ? [scale[0] * 1.05, scale[1] * 1.05, scale[2] * 1.05] : scale}
      onClick={(e) => {
        e.stopPropagation();
        handleBlow();
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
      {/* 1. Cake Plate */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.7, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.04, 32]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* 2. Bottom Cake Tier */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.7, 32]} />
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Frosting Ribbon / Pearls on Bottom Tier */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <torusGeometry args={[1.31, 0.06, 16, 32]} />
        <meshStandardMaterial color={frostingColor} roughness={0.3} />
      </mesh>

      {/* 3. Top Cake Tier */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
        <meshStandardMaterial color={baseColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Frosting drips on top tier */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.08, 32]} />
        <meshStandardMaterial color={frostingColor} roughness={0.2} />
      </mesh>

      {/* Frosting Pearls on Top Tier Edge */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.91, 0.05, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* 4. Birthday Candle */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
        <meshStandardMaterial color={candleColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Candle Spiral Stripe */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.35, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Candle Wick */}
      <mesh position={[0, 1.33, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.07, 8]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* 5. Glowing Candle Flame */}
      {lit && (
        <group position={[0, 1.45, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={2.5}
              roughness={0}
            />
          </mesh>
          {/* Flame Light Point */}
          <pointLight
            ref={flameLightRef}
            color="#fb923c"
            intensity={2}
            distance={4}
            decay={2}
          />
        </group>
      )}

      {/* Extinguished Smoke puff indicator if unlit */}
      {!lit && (
        <group position={[0, 1.45, 0]}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}
