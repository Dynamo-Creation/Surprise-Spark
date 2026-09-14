/**
 * Device Capability & Accessibility Detection
 * Detects low-end hardware, memory constraints, and user accessibility preferences.
 */

export interface DeviceCapabilities {
  isLowEnd: boolean;
  reducedMotion: boolean;
  particleScale: number; // 0.3 for low-end, 1.0 for standard
  hardwareConcurrency: number;
  deviceMemory?: number;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      isLowEnd: false,
      reducedMotion: false,
      particleScale: 1.0,
      hardwareConcurrency: 4,
    };
  }

  // 1. Check user preference for reduced motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 2. Hardware specs detection
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const navAny = navigator as unknown as { deviceMemory?: number };
  const deviceMemory = navAny.deviceMemory;

  // Low-end definition: <= 2 CPU cores OR < 4GB RAM, or mobile screen with high pixel ratio
  const isCpuConstrained = hardwareConcurrency <= 2;
  const isMemoryConstrained = typeof deviceMemory === "number" && deviceMemory < 4;
  const isLowEnd = isCpuConstrained || isMemoryConstrained;

  // Scale particle density down to protect 60fps frame rate
  let particleScale = 1.0;
  if (isLowEnd) {
    particleScale = 0.4;
  } else if (hardwareConcurrency <= 4) {
    particleScale = 0.7;
  }

  return {
    isLowEnd,
    reducedMotion,
    particleScale,
    hardwareConcurrency,
    deviceMemory,
  };
}
