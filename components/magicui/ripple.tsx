"use client";

import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  borderColor?: string;
  className?: string;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 240,
  mainCircleOpacity = 0.45,
  numCircles = 8,
  borderColor = "rgba(236, 72, 153, 0.35)",
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-hidden",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 85;
        const opacity = Math.max(0.15, mainCircleOpacity - i * 0.05);
        const animationDelay = `${i * 0.1}s`;

        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full shadow-xl pointer-events-none"
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: borderColor,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
                boxShadow: `0 0 35px ${borderColor}`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
