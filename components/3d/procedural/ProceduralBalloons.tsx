"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ProceduralBalloonsProps {
  count?: number;
  flyUp?: boolean;
  colors?: string[];
  spread?: number;
}

interface BalloonItem {
  offset: [number, number, number];
  color: string;
  speed: number;
  swaySpeed: number;
  phase: number;
  scale: number;
}

const DEFAULT_BALLOON_COLORS = [
  "#ec4899", // Vibrant pink
  "#8b5cf6", // Purple
  "#38bdf8", // Sky blue
  "#fbbf24", // Gold
  "#34d399", // Emerald
  "#f43f5e", // Rose
];

export function ProceduralBalloons({
  count = 6,
  flyUp = false,
  colors = DEFAULT_BALLOON_COLORS,
  spread = 1.8,
}: ProceduralBalloonsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate randomized positions and speeds for the balloons cluster
  const balloons = useMemo<BalloonItem[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.4 + Math.random() * (spread * 0.6);
      return {
        offset: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3,
          0.8 + Math.random() * 1.5,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3,
        ],
        color: colors[i % colors.length],
        speed: 1.2 + Math.random() * 0.8,
        swaySpeed: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.8 + Math.random() * 0.4,
      };
    });
  }, [count, colors, spread]);

  // Frame animation: sway when hovering, or rapidly float up when flyUp is active
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (flyUp) {
      groupRef.current.position.y += 0.04;
      if (groupRef.current.position.y > 10) {
        groupRef.current.position.y = -3;
      }
    } else {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {balloons.map((b, idx) => (
        <SingleBalloon key={idx} data={b} />
      ))}
    </group>
  );
}

function SingleBalloon({ data }: { data: BalloonItem }) {
  const balloonRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!balloonRef.current) return;
    const t = state.clock.getElapsedTime() + data.phase;
    // Gentle sway in x and z
    balloonRef.current.rotation.z = Math.sin(t * data.swaySpeed) * 0.1;
    balloonRef.current.rotation.x = Math.cos(t * data.swaySpeed * 0.8) * 0.1;
    balloonRef.current.position.y = data.offset[1] + Math.sin(t * data.speed) * 0.12;
  });

  return (
    <group
      ref={balloonRef}
      position={[data.offset[0], data.offset[1], data.offset[2]]}
      scale={[data.scale, data.scale, data.scale]}
    >
      {/* Balloon Egg Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>

      {/* Balloon Tie / Knot (Tiny cone) */}
      <mesh position={[0, -0.55, 0]}>
        <coneGeometry args={[0.08, 0.1, 12]} />
        <meshStandardMaterial color={data.color} roughness={0.3} />
      </mesh>

      {/* Balloon Hanging String (Thin line / cylinder) */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.1, 6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
