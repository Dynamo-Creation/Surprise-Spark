import React from "react";
import { cn } from "@/lib/utils";
import { Gift, Sparkles } from "lucide-react";

export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin",
          sizeMap[size]
        )}
      />
    </div>
  );
}

export function LoadingSurprise({
  message = "Baking your interactive surprise...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="relative mb-4">
        {/* Glowing pulse ring */}
        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 opacity-30 blur-lg animate-pulse" />
        
        {/* Bouncing cute gift container */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg animate-bounce duration-700">
          <Gift className="w-8 h-8" />
        </div>
        
        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-amber-400 animate-spin duration-3000" />
      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
        {message}
      </p>
      <p className="text-xs text-slate-400 mt-1">Preparing 3D scenes & confetti</p>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/60",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
