"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export interface ProceduralDoorProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  isOpen?: boolean;
  onOpen?: () => void;
}

export function ProceduralDoor({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  isOpen = false,
  onOpen,
}: ProceduralDoorProps) {
  const hingeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);

  useEffect(() => {
    if (!hingeRef.current) return;
    if (isOpen) {
      // Swing door open on its hinge
      gsap.to(hingeRef.current.rotation, {
        y: -Math.PI * 0.55,
        duration: 1.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(hingeRef.current.rotation, {
        y: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onOpen?.();
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
      {/* 1. Outer Door Frame */}
      {/* Left Frame Post */}
      <mesh position={[-1.15, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 3.2, 0.2]} />
        <meshStandardMaterial color="#3b1f50" roughness={0.3} />
      </mesh>
      {/* Right Frame Post */}
      <mesh position={[1.15, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 3.2, 0.2]} />
        <meshStandardMaterial color="#3b1f50" roughness={0.3} />
      </mesh>
      {/* Top Frame Header */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[2.45, 0.15, 0.2]} />
        <meshStandardMaterial color="#3b1f50" roughness={0.3} />
      </mesh>

      {/* 2. Hinged Door Panel */}
      {/* Hinge anchor positioned at the left edge */}
      <group ref={hingeRef} position={[-1.05, 0, 0]}>
        {/* Door Leaf: offset by half-width so pivot is at the hinge */}
        <mesh position={[1.05, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 3.0, 0.08]} />
          <meshStandardMaterial
            color={hovered ? "#ec4899" : "#be185d"}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Decorative Door Panels */}
        <mesh position={[1.05, 0.7, 0.045]}>
          <boxGeometry args={[1.7, 1.1, 0.02]} />
          <meshStandardMaterial color="#9d174d" roughness={0.3} />
        </mesh>
        <mesh position={[1.05, -0.7, 0.045]}>
          <boxGeometry args={[1.7, 1.1, 0.02]} />
          <meshStandardMaterial color="#9d174d" roughness={0.3} />
        </mesh>

        {/* Golden Door Handle / Knob */}
        <mesh position={[1.85, 0, 0.08]} castShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.85, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
