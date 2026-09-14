import React from "react";
import { cn } from "@/lib/utils";

export function PageTitle({
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({
  children,
  className,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Subtitle({
  children,
  className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed",
        className
      )}
    >
      {children}
    </p>
  );
}

export function GradientText({
  children,
  className,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
