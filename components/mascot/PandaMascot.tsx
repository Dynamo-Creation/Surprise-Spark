"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type MascotReaction =
  | "blink"
  | "heart"
  | "sparkle"
  | "surprised"
  | "wink"
  | "bashful"
  | "sleepy"
  | "dizzy"
  | "delighted";

export type MascotDirection =
  | "up-left"
  | "up"
  | "up-right"
  | "left"
  | "center"
  | "right"
  | "down-left"
  | "down"
  | "down-right";

const DIRECTIONS: MascotDirection[] = [
  "up-left",
  "up",
  "up-right",
  "left",
  "center",
  "right",
  "down-left",
  "down",
  "down-right",
];

const REACTIONS: MascotReaction[] = [
  "blink",
  "heart",
  "sparkle",
  "surprised",
  "wink",
  "bashful",
  "sleepy",
  "dizzy",
  "delighted",
];

// Clockwise from right, matching atan2 with y pointing down
const CLOCKWISE: MascotDirection[] = [
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
  "up",
  "up-right",
];

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 70;
const PAYOFFS: MascotReaction[] = ["heart", "sparkle", "delighted"];
const BOOP_PAYOFF = 120;
const BOOP_END = 560;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1200;

const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];

function cell(index: number): React.CSSProperties {
  return {
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
}

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

const layerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "300% 300%",
  backgroundRepeat: "no-repeat",
};

export interface PandaMascotProps {
  size?: number;
  className?: string;
  reactionOverride?: MascotReaction | null;
  message?: string;
  directionsSrc?: string;
  reactionsSrc?: string;
  showSpeechBubble?: boolean;
}

export function PandaMascot({
  size = 130,
  className,
  reactionOverride = null,
  message,
  directionsSrc = "/mascots/panda-directions.webp",
  reactionsSrc = "/mascots/panda-reactions.webp",
  showSpeechBubble = true,
}: PandaMascotProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);
  const boopsRef = useRef({ count: 0, at: 0 });

  const [direction, setDirection] = useState<MascotDirection>("center");
  const [internalReaction, setInternalReaction] = useState<MascotReaction | null>(null);
  const [boopMessage, setBoopMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Determine active reaction (override takes precedence unless boop squash is active)
  const activeReaction = internalReaction ?? reactionOverride;

  // Pointer tracking across window
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let sector = -1;
    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) return;

      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection("center");
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (
        sector !== -1 &&
        Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS
      ) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", aim);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const boop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    const later = (ms: number, next: MascotReaction | null, msg?: string | null) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setInternalReaction(next);
          if (msg !== undefined) {
            setBoopMessage(msg);
          }
        }, ms)
      );
    };

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setInternalReaction("dizzy");
      setBoopMessage("Whoa, dizzy! 🌀");
      later(DIZZY_END, null, null);
    } else {
      setInternalReaction("blink");
      const payoffIdx = (boops.count - 1) % PAYOFFS.length;
      const payoff = PAYOFFS[payoffIdx];

      const messages = [
        "Boop! 🥰",
        "Sparkle time! ✨",
        "You're the best! 💖",
      ];
      setBoopMessage(messages[payoffIdx] || "Hehe! 🐾");

      later(BOOP_PAYOFF, payoff);
      later(BOOP_END, null);
      later(1100, null, null);
    }

    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      squashRef.current?.animate(SQUASH, {
        duration: SQUASH_MS,
        easing: "linear",
      });
    }
  };

  // Determine current contextual dialogue text
  let speechText = "Boop me! 🐾";
  if (boopMessage) {
    speechText = boopMessage;
  } else if (message) {
    speechText = message;
  } else if (reactionOverride === "bashful") {
    speechText = "I won't peek! 🙈";
  } else if (reactionOverride === "surprised") {
    speechText = "Oops! Let's check that 😯";
  } else if (reactionOverride === "heart" || reactionOverride === "delighted") {
    speechText = "Welcome back! 🎉💖";
  } else if (reactionOverride === "sparkle") {
    speechText = "Verifying credentials... ✨";
  } else if (isHovered) {
    speechText = "Give me a tap! 🐼";
  }

  return (
    <div className={cn("relative flex flex-col items-center select-none", className)}>
      {/* Speech bubble */}
      {showSpeechBubble && (
        <div
          className={cn(
            "relative z-20 mb-1 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 shadow-sm border pointer-events-none whitespace-nowrap",
            reactionOverride === "bashful"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800 scale-105"
              : reactionOverride === "surprised"
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse"
              : reactionOverride === "heart" || reactionOverride === "delighted"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 scale-105"
              : reactionOverride === "sparkle"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              : "bg-white/90 text-slate-700 dark:bg-slate-800/90 dark:text-slate-200 border-slate-200 dark:border-slate-700 backdrop-blur-md"
          )}
        >
          <span>{speechText}</span>
          {/* Subtle triangle beak pointing down */}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b bg-inherit border-inherit"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Mascot Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={boop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Interactive Panda Mascot, click to boop"
        className="group relative cursor-pointer outline-none transition-transform duration-200 focus-visible:scale-105"
        style={{
          width: size,
          height: size,
          padding: 0,
          border: 0,
          background: "transparent",
          appearance: "none",
        }}
      >
        <span
          ref={squashRef}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            transformOrigin: "50% 78%",
          }}
        >
          {/* Directions layer */}
          <span
            style={{
              ...layerStyle,
              backgroundImage: `url(${directionsSrc})`,
              ...cell(DIRECTIONS.indexOf(direction)),
              opacity: activeReaction ? 0 : 1,
              transition: "opacity 100ms ease",
            }}
          />

          {/* Reactions layer */}
          <span
            style={{
              ...layerStyle,
              backgroundImage: `url(${reactionsSrc})`,
              ...cell(REACTIONS.indexOf(activeReaction ?? "blink")),
              opacity: activeReaction ? 1 : 0,
              transition: "opacity 100ms ease",
            }}
          />
        </span>
      </button>

      {/* Soft ground pedestal glow */}
      <div
        className="pointer-events-none -mt-3.5 h-3 rounded-[100%] bg-slate-900/10 dark:bg-black/40 blur-[3px] transition-all duration-300 group-hover:scale-110"
        style={{ width: size * 0.7 }}
        aria-hidden="true"
      />
    </div>
  );
}
