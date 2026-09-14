"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";

export type ParticleType = "confetti" | "sparkles" | "stars" | "hearts";

export interface ParticleSystemProps {
  type?: ParticleType;
  count?: number;
  speed?: number;
  spread?: number;
  colors?: string[];
  active?: boolean;
}

const DEFAULT_CONFETTI_COLORS = [
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#eab308", // Gold
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
];

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  color: THREE.Color;
  scale: number;
}

export function ParticleSystem({
  type = "confetti",
  count,
  speed = 1,
  spread = 8,
  colors = DEFAULT_CONFETTI_COLORS,
  active = true,
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Compute adaptive particle count based on hardware capabilities
  const particleCount = useMemo(() => {
    if (typeof count === "number") return count;
    const caps = getDeviceCapabilities();
    if (caps.reducedMotion) return 0;
    return type === "confetti" ? caps.recommendedParticleCount : Math.floor(caps.recommendedParticleCount * 0.7);
  }, [count, type]);

  // Generate particle simulation data
  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: particleCount }, () => {
      const isRising = type === "sparkles" || type === "hearts";
      const yPos = isRising
        ? (Math.random() - 0.5) * spread
        : 2 + Math.random() * (spread * 0.8);

      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          yPos,
          (Math.random() - 0.5) * spread
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02 * speed,
          isRising ? (0.015 + Math.random() * 0.025) * speed : (-0.02 - Math.random() * 0.035) * speed,
          (Math.random() - 0.5) * 0.02 * speed
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08
        ),
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
        scale: type === "confetti" ? 0.08 + Math.random() * 0.08 : 0.05 + Math.random() * 0.06,
      };
    });
  }, [particleCount, speed, spread, colors, type]);

  // Set instance colors on mount
  useFrame(() => {
    if (!meshRef.current || !active || particleCount === 0) return;

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];

      // Update position
      p.position.add(p.velocity);

      // Boundary wraps
      if (type === "confetti" && p.position.y < -4) {
        p.position.y = 5 + Math.random() * 2;
        p.position.x = (Math.random() - 0.5) * spread;
        p.position.z = (Math.random() - 0.5) * spread;
      } else if ((type === "sparkles" || type === "hearts") && p.position.y > 6) {
        p.position.y = -3 - Math.random() * 2;
        p.position.x = (Math.random() - 0.5) * spread;
        p.position.z = (Math.random() - 0.5) * spread;
      }

      // Update rotation
      p.rotation.x += p.rotationSpeed.x;
      p.rotation.y += p.rotationSpeed.y;
      p.rotation.z += p.rotationSpeed.z;

      // Update transform matrix
      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);

      if (type === "confetti") {
        // Flat fluttering rectangle
        dummy.scale.set(p.scale * 1.8, p.scale, 0.01);
      } else {
        dummy.scale.set(p.scale, p.scale, p.scale);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (!active || particleCount === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particleCount]}
      frustumCulled={false}
    >
      {type === "confetti" ? (
        <planeGeometry args={[1, 1]} />
      ) : type === "stars" ? (
        <octahedronGeometry args={[1, 0]} />
      ) : (
        <sphereGeometry args={[1, 8, 8]} />
      )}
      <meshStandardMaterial
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.4}
      />
    </instancedMesh>
  );
}
