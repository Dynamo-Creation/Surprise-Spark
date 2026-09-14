"use client";

import React from "react";

export interface PointLightConfig {
  color: string;
  intensity: number;
  position: [number, number, number];
  distance?: number;
}

export interface SceneLightingProps {
  ambientColor?: string;
  ambientIntensity?: number;
  directionalColor?: string;
  directionalIntensity?: number;
  directionalPosition?: [number, number, number];
  pointLights?: PointLightConfig[];
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

const DEFAULT_POINT_LIGHTS: PointLightConfig[] = [
  { color: "#ec4899", intensity: 1.5, position: [-3, 2, 2], distance: 10 },
  { color: "#8b5cf6", intensity: 1.5, position: [3, 2, -2], distance: 10 },
  { color: "#fbbf24", intensity: 1.2, position: [0, 4, 3], distance: 12 },
];

export function SceneLighting({
  ambientColor = "#ffffff",
  ambientIntensity = 0.8,
  directionalColor = "#fff7ed",
  directionalIntensity = 1.6,
  directionalPosition = [4, 8, 5],
  pointLights = DEFAULT_POINT_LIGHTS,
  fogColor,
  fogNear = 6,
  fogFar = 22,
}: SceneLightingProps) {
  return (
    <>
      {/* 1. Global Ambient Base Light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* 2. Key Directional Sun/Studio Light with Shadow Casting */}
      <directionalLight
        color={directionalColor}
        intensity={directionalIntensity}
        position={directionalPosition}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />

      {/* 3. Soft Fill Light (Rim) */}
      <directionalLight
        color="#a5b4fc"
        intensity={0.5}
        position={[-directionalPosition[0], directionalPosition[1] * 0.5, -directionalPosition[2]]}
      />

      {/* 4. Atmospheric Colored Point Lights */}
      {pointLights.map((pt, idx) => (
        <pointLight
          key={idx}
          color={pt.color}
          intensity={pt.intensity}
          position={pt.position}
          distance={pt.distance ?? 10}
          decay={2}
        />
      ))}

      {/* 5. Optional Fog Depth */}
      {fogColor && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
    </>
  );
}
