/**
 * WebGL & Device Capability Detection
 * Dynamically scales 3D rendering parameters based on hardware capabilities and user preferences.
 */

export type QualityTier = "low" | "medium" | "high";

export interface DeviceCapabilities {
  isWebGLAvailable: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  qualityTier: QualityTier;
  enableShadows: boolean;
  maxDpr: number;
  recommendedParticleCount: number;
  hardwareConcurrency: number;
  deviceMemory?: number;
}

let cachedCapabilities: DeviceCapabilities | null = null;

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      isWebGLAvailable: true,
      isMobile: false,
      reducedMotion: false,
      qualityTier: "medium",
      enableShadows: true,
      maxDpr: 1.5,
      recommendedParticleCount: 60,
      hardwareConcurrency: 4,
    };
  }

  if (cachedCapabilities) {
    return cachedCapabilities;
  }

  // 1. WebGL Support Check
  let isWebGLAvailable = false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    isWebGLAvailable = Boolean(
      (gl && gl instanceof WebGLRenderingContext) ||
        (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext)
    );
  } catch {
    isWebGLAvailable = false;
  }

  // 2. Mobile Device Detection
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  // 3. Reduced Motion Preference
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 4. Hardware concurrency & memory constraint check
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const navAny = navigator as unknown as { deviceMemory?: number };
  const deviceMemory = navAny.deviceMemory;
  const isHardwareConstrained =
    hardwareConcurrency <= 2 || (typeof deviceMemory === "number" && deviceMemory < 4);

  // 5. Derive Adaptive Quality Tier
  let qualityTier: QualityTier = "high";
  if (!isWebGLAvailable || isHardwareConstrained) {
    qualityTier = "low";
  } else if (isMobile) {
    qualityTier = "medium";
  } else {
    qualityTier = "high";
  }

  // 6. Quality-Tier Configured Parameters
  let recommendedParticleCount = 120;
  let enableShadows = true;
  let maxDpr = 2;

  if (qualityTier === "low") {
    recommendedParticleCount = 25;
    enableShadows = false;
    maxDpr = 1;
  } else if (qualityTier === "medium") {
    recommendedParticleCount = 60;
    enableShadows = true;
    maxDpr = 1.5;
  } else {
    recommendedParticleCount = 120;
    enableShadows = true;
    maxDpr = 2;
  }

  if (reducedMotion) {
    recommendedParticleCount = 0;
  }

  cachedCapabilities = {
    isWebGLAvailable,
    isMobile,
    reducedMotion,
    qualityTier,
    enableShadows,
    maxDpr,
    recommendedParticleCount,
    hardwareConcurrency,
    deviceMemory,
  };

  return cachedCapabilities;
}

export function resetCapabilitiesCache() {
  cachedCapabilities = null;
}
