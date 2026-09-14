import React from "react";
import Link from "next/link";
import { Sparkles, PartyPopper, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_HEADLINE } from "@/lib/constants";

export function FinalCtaSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-[36px] bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-purple-500/20 relative overflow-hidden">
          
          {/* Decorative floating blur circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-pink-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Free To Get Started</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {BRAND_HEADLINE}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Give your friend, partner, or family member an interactive celebration they will keep in their heart forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-pink-500/30 text-base"
                  leftIcon={<PartyPopper className="w-5 h-5 text-amber-200" />}
                >
                  Create a Birthday Surprise
                </Button>
              </Link>
              <Link href="/templates" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore All Experiences
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-2">
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              No mobile app required for your recipient. Opens instantly in any web browser.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
