import React from "react";
import { Sparkles, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function WhyDifferentSection() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <Badge variant="secondary" size="md">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-pink-500" />
          The Difference
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Why A Surprise Beats A Normal Wish
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          A text takes 3 seconds to read. An interactive surprise transforms your heartfelt affection into an unforgettable moment.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Standard Greeting Box */}
        <div className="rounded-3xl p-8 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 opacity-80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <X className="w-3.5 h-3.5 text-slate-400" />
              Standard Text or E-Card
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
              Routine & Forgettable
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dozens of friends send generic copy-pasted messages in messaging apps.
            </p>

            <ul className="space-y-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">✕</span>
                Read once in 5 seconds and buried in notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">✕</span>
                No sensory interaction or musical emotion
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">✕</span>
                Flat 2D text with static stock clip-art
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">✕</span>
                Feels rushed and generic
              </li>
            </ul>
          </div>
        </div>

        {/* Surprise Platform Box */}
        <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border-2 border-pink-400/40 shadow-xl shadow-pink-500/5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-purple-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-2xl">
            A Memory For Life
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-xs font-semibold text-pink-600 dark:text-pink-400">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              SurpriseSpark Experience
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Immersive & Emotional
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A tailor-made interactive universe crafted especially for your favorite human.
            </p>

            <ul className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                Interactive 3D unwrap, blowable candles, and confetti reveals
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                Soundtrack syncing with their favorite music and nostalgic tracks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                Curated photo memories floating in celestial 3D space
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                A timeless personal web link they can revisit again and again
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
