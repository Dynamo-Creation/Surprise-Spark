"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Floating3DParticlesProps
  extends Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, "width" | "height" | "color"> {
  /**
   * Number of particles rendered on desktop viewports.
   * On mobile screens (< 768px), particle count automatically scales down
   * to 25% to preserve buttery-smooth frame rates.
   * @default 250
   */
  quantity?: number;
  /**
   * Particle color — 3 or 6 digit hex string, or array of hex strings for multi-tone sparkles.
   * @default "#8B5CF6"
   */
  color?: string | string[];
  /**
   * Mean particle radius in px. Each particle is randomly assigned a size
   * within ±40% of this value.
   * @default 5
   */
  size?: number;
  /**
   * Mean particle opacity (0–1). Each particle randomly varies within
   * ±0.2 of this value, clamped to [0, 1].
   * @default 0.35
   */
  opacity?: number;
  /**
   * Vertical floating speed in px per frame. Positive values drift upward,
   * negative values downward.
   * @default 0.7
   */
  drift?: number;
  /**
   * 3-D depth intensity on a 0–1 scale. `0` produces a flat 2D plane; `1`
   * creates strong perspective with pronounced near/far scaling.
   * @default 0.55
   */
  depth?: number;
}

// ---------------------------------------------------------------------------
// Particle State (Polar coordinates + 3D perspective projection)
// ---------------------------------------------------------------------------

interface Particle {
  angle: number;
  radius: number;
  y: number;
  size: number;
  angularSpeed: number;
  opacity: number;
  colorHex: string;
  screenX: number;
  screenY: number;
  projectedScale: number;
}

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

const MOBILE_BREAKPOINT = 768;
const SPREAD_FACTOR = 1.25;
const MAX_DPR = 2;

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(139,92,246,${alpha})`;

  const n = Number.parseInt(full, 16);
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
}

function deriveProjection(depth: number) {
  const t = Math.max(0, Math.min(1, depth));
  const fov = 800 - t * 600; // [800, 200]
  const perspectiveDistance = 100 + t * 700; // [100, 800]
  // depthRange stays below fov + pd - 1 to ensure positive denominator
  const depthRange = t * Math.min(400, fov + perspectiveDistance - 1);
  return { fov, perspectiveDistance, depthRange };
}

function getRandomColor(colorInput: string | string[]): string {
  if (Array.isArray(colorInput)) {
    return colorInput[Math.floor(Math.random() * colorInput.length)] || "#8b5cf6";
  }
  return colorInput || "#8b5cf6";
}

function spawnParticle(
  width: number,
  height: number,
  size: number,
  opacity: number,
  colorInput: string | string[]
): Particle {
  const sizeVariance = size * 0.5;
  const opacityVariance = 0.25;
  return {
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * Math.max(width, height) * SPREAD_FACTOR,
    y: (Math.random() - 0.5) * height * 2.2,
    size: Math.max(1.5, size - sizeVariance + Math.random() * sizeVariance * 2),
    angularSpeed: 0.001 + Math.random() * 0.0015,
    opacity: Math.min(
      1,
      Math.max(0.15, opacity - opacityVariance + Math.random() * opacityVariance * 2)
    ),
    colorHex: getRandomColor(colorInput),
    screenX: 0,
    screenY: 0,
    projectedScale: 1,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Floating3DParticles({
  quantity = 220,
  color = ["#ec4899", "#8b5cf6", "#a855f7", "#f43f5e"],
  size = 4.5,
  opacity = 0.35,
  drift = 0.7,
  depth = 0.55,
  className,
  style,
  ...canvasProps
}: Floating3DParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const ioRef = React.useRef<IntersectionObserver | null>(null);
  const stateRef = React.useRef({
    mounted: false,
    paused: false,
    reducedMotion: false,
    rafId: null as number | null,
  });

  const colorRef = React.useRef(color);

  React.useEffect(() => {
    colorRef.current = color;
  }, [color]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const s = stateRef.current;
    s.mounted = true;
    s.paused = false;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let staticDirty = true;

    const { fov, perspectiveDistance, depthRange } = deriveProjection(depth);

    // Reduced-motion media query (built-in a11y)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      s.reducedMotion = mq.matches;
    };
    syncReducedMotion();

    // Draw single 3D particle with soft glowing depth
    const draw = (p: Particle) => {
      const r = Math.max(0, p.size * p.projectedScale * 1.5);
      if (r <= 0) return;

      ctx.beginPath();
      // Near particles get higher relative opacity, far particles fade softly
      const dynamicAlpha = Math.min(0.9, Math.max(0.12, p.opacity * Math.pow(p.projectedScale, 0.7)));

      if (r > 3) {
        ctx.shadowBlur = Math.min(12, r * 1.5);
        ctx.shadowColor = p.colorHex;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = hexToRgba(p.colorHex, dynamicAlpha);
      ctx.arc(p.screenX, p.screenY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Static frame for reduced motion
    const staticFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (const p of particles) {
        const denom = Math.max(1, fov + perspectiveDistance);
        const scale = fov / denom;
        p.screenX = cx + Math.cos(p.angle) * p.radius * scale;
        p.screenY = cy + p.y * scale;
        p.projectedScale = scale;
        draw(p);
      }
    };

    // Animation loop: continuous 3D field rotation and buoyant upward drift
    const tick = () => {
      if (!s.mounted) return;

      if (s.paused) {
        s.rafId = requestAnimationFrame(tick);
        return;
      }

      if (s.reducedMotion) {
        if (staticDirty) {
          staticDirty = false;
          staticFrame();
        }
        s.rafId = requestAnimationFrame(tick);
        return;
      }

      staticDirty = true;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (const p of particles) {
        // Continuous organic rotation around the 3D central axis
        p.angle += p.angularSpeed;
        p.y -= drift;

        // Respawn smoothly on the opposite edge
        if (p.y < -height) {
          p.y = height;
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR;
        } else if (p.y > height) {
          p.y = -height;
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR;
        }

        // 3D Perspective Projection calculation
        const denom = Math.max(
          1,
          fov + perspectiveDistance + Math.sin(p.angle) * depthRange
        );
        const scale = fov / denom;

        p.screenX = cx + Math.cos(p.angle) * p.radius * scale;
        p.screenY = cy + p.y * scale;
        p.projectedScale = scale;
      }

      // Painter's algorithm: draw farthest particles first for true 3D spatial overlap
      particles.sort((a, b) => a.projectedScale - b.projectedScale);
      for (const p of particles) {
        draw(p);
      }

      s.rafId = requestAnimationFrame(tick);
    };

    // Resize handling with automatic mobile count scaling
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const count = isMobile ? Math.round(quantity * 0.3) : quantity;

      particles = Array.from({ length: Math.max(0, count) }, () =>
        spawnParticle(width, height, size, opacity, colorRef.current)
      );

      staticDirty = true;
    };

    const onVisibilityChange = () => {
      s.paused = document.hidden;
    };

    // ResizeObserver
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (ro) {
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    // IntersectionObserver (built-in performance pause when scrolled off-screen)
    if (typeof IntersectionObserver !== "undefined") {
      ioRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry) s.paused = document.hidden || !entry.isIntersecting;
        },
        { threshold: 0 }
      );
      ioRef.current.observe(canvas);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    mq.addEventListener("change", syncReducedMotion);

    resize();
    s.rafId = requestAnimationFrame(tick);

    return () => {
      s.mounted = false;
      if (s.rafId !== null) {
        cancelAnimationFrame(s.rafId);
        s.rafId = null;
      }
      ro?.disconnect();
      if (!ro) window.removeEventListener("resize", resize);
      ioRef.current?.disconnect();
      ioRef.current = null;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mq.removeEventListener("change", syncReducedMotion);
    };
  }, [quantity, size, opacity, drift, depth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      style={style}
      {...canvasProps}
    />
  );
}
