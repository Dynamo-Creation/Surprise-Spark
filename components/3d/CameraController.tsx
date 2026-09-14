"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";

export interface CameraControllerProps {
  position?: [number, number, number];
  fov?: number;
  lookAt?: [number, number, number];
  shakeTrigger?: number; // Increment this to trigger a camera shake
  transitionDuration?: number;
  allowOrbit?: boolean;
}

export function CameraController({
  position = [0, 1.2, 4.5],
  fov = 48,
  lookAt = [0, 0, 0],
  shakeTrigger = 0,
  transitionDuration = 1.0,
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(...lookAt));
  const isFirstRender = useRef(true);

  // 1. Initial setup and smooth position/fov transitions
  useEffect(() => {
    const persCamera = camera as THREE.PerspectiveCamera;

    if (isFirstRender.current) {
      persCamera.position.set(...position);
      persCamera.fov = fov;
      persCamera.lookAt(...lookAt);
      persCamera.updateProjectionMatrix();
      targetLookAt.current.set(...lookAt);
      isFirstRender.current = false;
      return;
    }

    const caps = getDeviceCapabilities();
    const duration = caps.reducedMotion ? 0.3 : transitionDuration;

    // Smooth camera transition via GSAP
    gsap.to(persCamera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        persCamera.lookAt(targetLookAt.current);
      },
    });

    if (persCamera.fov !== fov) {
      gsap.to(persCamera, {
        fov: fov,
        duration: duration,
        ease: "power2.out",
        onUpdate: () => {
          persCamera.updateProjectionMatrix();
        },
      });
    }

    // Smooth lookAt target transition
    gsap.to(targetLookAt.current, {
      x: lookAt[0],
      y: lookAt[1],
      z: lookAt[2],
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        persCamera.lookAt(targetLookAt.current);
      },
    });
  }, [camera, position, fov, lookAt, transitionDuration]);

  // 2. Camera Shake Effect (respects reduced motion preference)
  useEffect(() => {
    if (shakeTrigger === 0) return;
    const caps = getDeviceCapabilities();
    if (caps.reducedMotion) return; // Suppress shake for vestibular accessibility

    const persCamera = camera as THREE.PerspectiveCamera;
    const originalPos = {
      x: persCamera.position.x,
      y: persCamera.position.y,
      z: persCamera.position.z,
    };

    const shakeTl = gsap.timeline();
    const intensity = 0.12;

    shakeTl
      .to(persCamera.position, {
        x: originalPos.x + (Math.random() - 0.5) * intensity,
        y: originalPos.y + (Math.random() - 0.5) * intensity,
        duration: 0.04,
      })
      .to(persCamera.position, {
        x: originalPos.x + (Math.random() - 0.5) * intensity * 0.8,
        y: originalPos.y + (Math.random() - 0.5) * intensity * 0.8,
        duration: 0.04,
      })
      .to(persCamera.position, {
        x: originalPos.x + (Math.random() - 0.5) * intensity * 0.5,
        y: originalPos.y + (Math.random() - 0.5) * intensity * 0.5,
        duration: 0.05,
      })
      .to(persCamera.position, {
        x: originalPos.x,
        y: originalPos.y,
        z: originalPos.z,
        duration: 0.08,
        ease: "power2.out",
        onUpdate: () => {
          persCamera.lookAt(targetLookAt.current);
        },
      });

    return () => {
      shakeTl.kill();
    };
  }, [camera, shakeTrigger]);

  return null;
}
