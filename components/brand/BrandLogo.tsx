"use client";

import React, { useState, useEffect, useRef, useId, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
  autoPlayOnMount?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  color: string;
  type: "heart" | "sparkle" | "dot";
}

// Cursive path traced along the authentic "Partner in Crime" lettering and red heart stroke
const SIGNATURE_PATH_D = [
  "M 9 95",
  "C 40 85 70 85 110 86",
  // P descender and loop
  "C 130 86 138 120 142 152",
  "C 142 110 138 60 140 25",
  "C 145 12 178 12 182 45",
  "C 184 75 155 85 140 85",
  // artner
  "C 170 85 195 48 220 52",
  "C 240 52 245 95 255 85",
  "C 265 52 278 52 295 85",
  // t ascender & crossbar area
  "C 305 60 312 16 316 16",
  "C 320 16 318 65 325 85",
  // ner
  "C 345 55 365 55 380 85",
  "C 395 55 415 55 425 85",
  "C 435 55 445 70 455 85",
  // in
  "C 470 50 480 30 485 50",
  "C 490 85 505 55 520 55",
  "C 535 55 540 80 550 85",
  // C big cursive flourish loop
  "C 610 25 615 10 580 10",
  "C 545 10 540 60 555 95",
  "C 560 128 590 142 625 128",
  "C 645 118 655 75 665 60",
  // rime
  "C 675 52 685 52 700 85",
  "C 708 55 710 35 715 55",
  "C 720 85 735 60 750 60",
  "C 765 60 770 78 780 85",
  // red underline connecting into heart
  "C 795 85 815 108 835 108",
  "C 850 108 860 95 865 85",
  // heart left lobe
  "C 850 55 805 45 805 28",
  "C 805 14 835 12 850 22",
  "C 862 32 866 50 868 65",
  // heart right lobe
  "C 872 45 885 18 905 14",
  "C 928 14 938 32 932 55",
  "C 925 78 890 92 865 92",
  // trailing flourish tail
  "C 890 95 930 100 985 95"
].join(" ");

export function BrandLogo({
  size = "md",
  className,
  showTagline = false,
  autoPlayOnMount = true
}: BrandLogoProps) {
  const maskId = useId().replace(/:/g, "_");
  const pathRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particleAnimRef = useRef<number | null>(null);

  // Natural aspect ratio: 991 / 164 = 6.042
  const dimensions = {
    sm: { height: 26, width: 157, class: "h-[26px] w-[157px]" },
    md: { height: 36, width: 218, class: "h-[36px] w-[218px]" },
    lg: { height: 48, width: 290, class: "h-[48px] w-[290px]" },
    xl: { height: 60, width: 362, class: "h-[60px] w-[362px]" },
  }[size];

  const [isDrawing, setIsDrawing] = useState(false);
  const [isFullyDrawn, setIsFullyDrawn] = useState(true);
  const [progress, setProgress] = useState(1);
  const [totalLength, setTotalLength] = useState(2400);
  const [penPoint, setPenPoint] = useState<{ x: number; y: number; isRed: boolean }>({
    x: 985,
    y: 95,
    isRed: true,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [heartPulse, setHeartPulse] = useState(false);

  // Initialize path length
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          setTotalLength(len);
        }
      } catch {
        // Fallback length
      }
    }
  }, []);

  // Spawn celebration particles around the heart
  const spawnCelebrationParticles = useCallback((burstCount = 12) => {
    const heartCenter = { x: 875, y: 55 };
    const colors = ["#ef4444", "#f43f5e", "#fb7185", "#fda4af", "#ffe4e6", "#f472b6", "#fbbf24"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.6;
      const speed = 45 + Math.random() * 75;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: heartCenter.x + (Math.random() - 0.5) * 24,
        y: heartCenter.y + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 25,
        size: Math.random() > 0.3 ? 24 + Math.random() * 16 : 16 + Math.random() * 12,
        opacity: 1,
        rotation: (Math.random() - 0.5) * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: i % 2 === 0 ? "heart" : "sparkle",
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Particle physics tick
  useEffect(() => {
    if (particles.length === 0) return;

    let lastTime = performance.now();
    const updateParticles = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy + 40 * dt, // gentle gravity
            opacity: p.opacity - dt * 1.4, // fade out in ~0.7s
            rotation: p.rotation + 45 * dt,
          }))
          .filter((p) => p.opacity > 0.02)
      );

      particleAnimRef.current = requestAnimationFrame(updateParticles);
    };

    particleAnimRef.current = requestAnimationFrame(updateParticles);
    return () => {
      if (particleAnimRef.current) cancelAnimationFrame(particleAnimRef.current);
    };
  }, [particles.length]);

  // Signature animation runner
  const playSignature = useCallback(
    (withCelebration = false) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      setIsDrawing(true);
      setIsFullyDrawn(false);
      setProgress(0);
      setHeartPulse(false);

      const path = pathRef.current;
      const len = path ? path.getTotalLength() : totalLength;
      if (len > 0 && len !== totalLength) setTotalLength(len);

      const duration = 1600; // 1.6s signature duration
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Smooth cubic easeInOut for realistic handwriting velocity
        const easedProgress =
          rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        setProgress(easedProgress);

        // Update pen position
        if (path && len > 0) {
          try {
            const currentDist = easedProgress * len;
            const pt = path.getPointAtLength(currentDist);
            const isRedRegion = pt.x < 135 || pt.x > 780;
            setPenPoint({ x: pt.x, y: pt.y, isRed: isRedRegion });
          } catch {
            // fallback
          }
        }

        if (rawProgress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Signature complete!
          setProgress(1);
          setIsDrawing(false);
          setIsFullyDrawn(true);

          // Trigger heart pulse
          setHeartPulse(true);
          setTimeout(() => setHeartPulse(false), 800);

          // Trigger particle burst if requested or on click
          if (withCelebration) {
            spawnCelebrationParticles(12);
          } else {
            spawnCelebrationParticles(6);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    },
    [spawnCelebrationParticles, totalLength]
  );

  // Auto-play on mount (with short delay for smooth entrance)
  useEffect(() => {
    if (!autoPlayOnMount) return;
    const timer = setTimeout(() => {
      playSignature(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [autoPlayOnMount, playSignature]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (particleAnimRef.current) cancelAnimationFrame(particleAnimRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    playSignature(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSignature(true);
  };

  // Mask dash calculation:
  // When progress is 0, offset = totalLength (hidden).
  // When progress is 1, offset = 0 (fully drawn).
  const strokeDashoffset = isFullyDrawn ? 0 : totalLength * (1 - progress);

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-start justify-center select-none cursor-pointer group",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Partner in Crime — Animated Signature Logo (hover or click to sign)"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          playSignature(true);
        }
      }}
    >
      <div className="relative inline-flex items-center overflow-visible">
        {/* SVG Container holding both light & dark image layers masked by the signature stroke */}
        <svg
          viewBox="0 0 991 164"
          className={cn(
            dimensions.class,
            "overflow-visible transition-transform duration-300 group-hover:scale-[1.02]",
            heartPulse && "scale-[1.03]"
          )}
          style={{
            filter: isDrawing
              ? "drop-shadow(0 2px 10px rgba(239, 68, 68, 0.15))"
              : undefined,
          }}
        >
          <defs>
            {/* Dynamic Signature Reveal Mask */}
            <mask id={maskId}>
              {/* Black background hides unwritten parts */}
              <rect width="991" height="164" fill="black" />
              {/* White animated cursive stroke path reveals the letters as it signs */}
              <path
                ref={pathRef}
                d={SIGNATURE_PATH_D}
                fill="none"
                stroke="white"
                strokeWidth="94"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: totalLength,
                  strokeDashoffset: strokeDashoffset,
                  transition: "none",
                }}
              />
            </mask>

            {/* Glowing radial gradient for the pen nib */}
            <radialGradient id={`pen-glow-red-${maskId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#dc2626" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={`pen-glow-silver-${maskId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>

            {/* Filter for glowing pen spark */}
            <filter id={`spark-glow-${maskId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Light Mode Layer (Dark text + Red Heart) */}
          <g
            mask={isFullyDrawn ? undefined : `url(#${maskId})`}
            className="dark:hidden"
          >
            <image
              href="/brand/partner-in-crime-light.png"
              width="991"
              height="164"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Dark Mode Layer (White/Silver text + Red Heart) */}
          <g
            mask={isFullyDrawn ? undefined : `url(#${maskId})`}
            className="hidden dark:block"
          >
            <image
              href="/brand/partner-in-crime-dark.png"
              width="991"
              height="164"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          {/* Glowing Pen Nib Flare & Sparkle (active while drawing) */}
          {isDrawing && progress > 0.01 && progress < 0.99 && (
            <g
              transform={`translate(${penPoint.x}, ${penPoint.y})`}
              filter={`url(#spark-glow-${maskId})`}
              className="pointer-events-none"
            >
              {/* Soft outer glow halo */}
              <circle
                r="18"
                fill={
                  penPoint.isRed
                    ? `url(#pen-glow-red-${maskId})`
                    : `url(#pen-glow-silver-${maskId})`
                }
                opacity="0.85"
              />

              {/* Sparkling diamond nib point */}
              <polygon
                points="0,-8 2.5,-2.5 8,0 2.5,2.5 0,8 -2.5,2.5 -8,0 -2.5,-2.5"
                fill="#ffffff"
                className="animate-spin"
                style={{ animationDuration: "1.2s" }}
              />

              {/* Brilliant core spark */}
              <circle r="3.5" fill="#ffffff" />
            </g>
          )}

          {/* Floating Celebration Particles */}
          {particles.map((p) => (
            <g
              key={p.id}
              transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation})`}
              opacity={p.opacity}
              className="pointer-events-none transition-transform"
            >
              {p.type === "heart" ? (
                <path
                  d="M 0 -3 C -2 -7 -6 -7 -6 -3 C -6 1 0 5 0 7 C 0 5 6 1 6 -3 C 6 -7 2 -7 0 -3 Z"
                  fill={p.color}
                  transform={`scale(${p.size / 10})`}
                />
              ) : (
                <polygon
                  points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5"
                  fill={p.color}
                  transform={`scale(${p.size / 8})`}
                />
              )}
            </g>
          ))}
        </svg>

        {/* Subtle interactive hover badge hint */}
        <span className="sr-only">Partner in Crime</span>
      </div>

      {showTagline && (
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase pl-1.5 -mt-0.5">
          Interactive Wishes
        </span>
      )}
    </div>
  );
}
