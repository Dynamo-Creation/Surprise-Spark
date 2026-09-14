import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Gift, PartyPopper, Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BRAND_HEADLINE,
  BRAND_SUBTITLE,
  BRAND_SUPPORTING_LINE,
} from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-300/15 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center">
              <Badge variant="gradient" size="md" className="gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Next-Gen Celebration Experiences</span>
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              DON’T JUST SEND A WISH.{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                SEND A SURPRISE.
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              {BRAND_SUBTITLE}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-base shadow-lg shadow-pink-500/25"
                  leftIcon={<PartyPopper className="w-5 h-5 text-amber-200" />}
                >
                  Create a Birthday Surprise
                </Button>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Experiences
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic pt-1">
              ✨ &ldquo;{BRAND_SUPPORTING_LINE}&rdquo;
            </p>
          </div>

          {/* Right Column: 3D-Inspired Visual Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* Floating ambient badge 1 */}
              <div className="absolute -top-4 -left-4 z-20 animate-float">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-pink-100 dark:border-pink-900/50 text-xs font-bold text-pink-600 dark:text-pink-400">
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span>3D Gift Box Unwrapped</span>
                </div>
              </div>

              {/* Floating ambient badge 2 */}
              <div className="absolute -bottom-4 -right-4 z-20 animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-purple-100 dark:border-purple-900/50 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <Music className="w-4 h-4 text-purple-500" />
                  <span>Playing Favorite Melody</span>
                </div>
              </div>

              {/* Phone / Experience Preview Card Mockup */}
              <div className="relative rounded-[32px] p-2 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-300 shadow-2xl shadow-purple-500/20">
                <div className="rounded-[26px] bg-slate-950 p-5 text-white flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
                  
                  {/* Top Phone Status Indicator */}
                  <div className="w-full flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Surprise
                    </span>
                    <span>For Maya 🎂</span>
                  </div>

                  {/* Center Interactive 3D Mock Scene */}
                  <div className="my-auto flex flex-col items-center text-center space-y-4 py-4">
                    <div className="relative group cursor-pointer">
                      <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse-glow" />
                      <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110">
                        <Gift className="w-14 h-14 animate-bounce duration-1000" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl font-black tracking-tight">Tap To Unwrap</h2>
                      <p className="text-xs text-slate-400 max-w-[220px]">
                        Interactive 3D scenes • Candles to blow • Floating memory gallery
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-pink-400 font-semibold bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      From Alex with love
                    </div>
                  </div>

                  {/* Bottom Recipient Action Bar */}
                  <Link href="/s/sample-birthday-123" className="w-full">
                    <Button variant="primary" size="md" className="w-full text-xs font-semibold py-2">
                      Test Live Recipient Link
                    </Button>
                  </Link>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
