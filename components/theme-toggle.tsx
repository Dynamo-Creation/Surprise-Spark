"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  AnimatedThemeToggler,
  TransitionVariant,
} from "@/components/magicui/animated-theme-toggler";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

interface ThemeToggleProps {
  className?: string;
  variant?: TransitionVariant;
  duration?: number;
  fromCenter?: boolean;
}

export function ThemeToggle({
  className,
  variant = "circle",
  duration = 450,
  fromCenter = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center opacity-60",
          className
        )}
        aria-hidden="true"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={(newTheme) => setTheme(newTheme)}
      variant={variant}
      duration={duration}
      fromCenter={fromCenter}
      className={cn(
        "w-8 h-8 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-pink-300 dark:hover:border-pink-900/50 transition-all cursor-pointer shadow-xs",
        className
      )}
    />
  );
}
