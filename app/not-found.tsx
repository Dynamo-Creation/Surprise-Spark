import React from "react";
import Link from "next/link";
import { Gift, Compass, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Playful Floating Balloon Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/10 animate-bounce">
            🎈
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-xs">
            ✨
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-[11px] font-bold text-purple-300 mb-1">
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>404 • Page Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            This surprise floated away...
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The link you followed may have expired, changed, or belongs to a surprise that hasn&apos;t been published yet.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/templates" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs"
              leftIcon={<Compass className="w-3.5 h-3.5" />}
            >
              Explore Templates
            </Button>
          </Link>
          <Link href="/create" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
              leftIcon={<Gift className="w-3.5 h-3.5" />}
            >
              Create a Surprise
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
