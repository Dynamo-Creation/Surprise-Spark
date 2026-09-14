"use client";

import React from "react";
import Link from "next/link";
import { Gift, RotateCcw, AlertTriangle, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ExperienceErrorType = "not_found" | "unpublished" | "load_failure";

interface ExperienceErrorStateProps {
  type: ExperienceErrorType;
  onRetry?: () => void;
}

export function ExperienceErrorState({ type, onRetry }: ExperienceErrorStateProps) {
  let title = "Something went wrong while preparing your surprise.";
  let description = "Please check your internet connection and try refreshing.";
  let icon = <AlertTriangle className="w-8 h-8 text-pink-400" />;
  let showRetry = true;

  if (type === "not_found") {
    title = "This surprise couldn't be found.";
    description = "The link might have expired, or the URL might have been mistyped.";
    icon = <Search className="w-8 h-8 text-amber-400" />;
    showRetry = false;
  } else if (type === "unpublished") {
    title = "This surprise isn't available right now.";
    description = "The creator is still adding the finishing touches to this celebration.";
    icon = <Lock className="w-8 h-8 text-purple-400" />;
    showRetry = true;
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
          {icon}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {showRetry && onRetry && (
            <Button
              variant="outline"
              size="md"
              onClick={onRetry}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs border-white/20 text-white hover:bg-white/10 cursor-pointer"
            >
              Try Again
            </Button>
          )}

          <Link href="/create" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Gift className="w-4 h-4" />}
              className="w-full text-xs font-bold cursor-pointer"
            >
              Create Your Own Surprise
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-white/10 text-[11px] text-slate-500">
          <Link href="/" className="hover:text-pink-400 transition-colors">
            SurpriseSpark — Don’t Just Send A Wish. Send A Surprise.
          </Link>
        </div>
      </div>
    </div>
  );
}
