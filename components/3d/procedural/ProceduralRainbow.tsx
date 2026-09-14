"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ProceduralRainbowProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  glow?: boolean;
}

const RAINBOW_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#10b981", // Green
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#a855f7", // Violet
];

export function ProceduralRainbow({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  glow = true,
}: ProceduralRainbowProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Concentric Rainbow Arcs */}
      {RAINBOW_COLORS.map((col, idx) => {
        const radius = 2.4 - idx * 0.12;
        const tube = 0.06;
        return (
          <mesh key={col} rotation={[0, 0, 0]}>
            {/* Upper half-arc torus */}
            <torusGeometry args={[radius, tube, 16, 48, Math.PI]} />
            <meshStandardMaterial
              color={col}
              emissive={glow ? col : "#000000"}
              emissiveIntensity={glow ? 0.35 : 0}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* 2. Left Cloud Base */}
      <group position={[-2.1, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, -0.05, 0.1]}>
          <sphereGeometry args={[0.26, 14, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, -0.05, 0.1]}>
          <sphereGeometry args={[0.24, 14, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      </group>

      {/* 3. Right Cloud Base */}
      <group position={[2.1, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[-0.2, -0.05, 0.1]}>
          <sphereGeometry args={[0.24, 14, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, -0.05, 0.1]}>
          <sphereGeometry args={[0.26, 14, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
