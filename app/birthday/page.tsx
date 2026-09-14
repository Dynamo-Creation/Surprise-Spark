import React from "react";
import Link from "next/link";
import { Cake, Sparkles, PartyPopper, Heart, Music, ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MOCK_TEMPLATES } from "@/lib/constants";

export const metadata = {
  title: "Birthday Surprises — Interactive 3D Birthday Experiences",
  description: "Create a memorable interactive 3D birthday celebration with blowable candles, personal photo reels, and custom music.",
};

export default function BirthdayPage() {
  const birthdayTemplates = MOCK_TEMPLATES.filter((t) => t.category === "birthday");

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Category Hero Banner */}
      <div className="rounded-[32px] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Cake className="w-4 h-4 text-amber-200" />
            <span>Launch Category: Birthday & Celebrations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Make Their Birthday Truly Magical.
          </h1>

          <p className="text-sm sm:text-base text-pink-100 max-w-lg leading-relaxed">
            Skip the boring group chat text. Send an immersive 3D party with candles to blow, memories to unwrap, and music that touches their soul.
          </p>

          <div className="pt-2">
            <Link href="/create?category=birthday">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-pink-600 hover:bg-pink-50 border-none font-bold"
                leftIcon={<PartyPopper className="w-4 h-4 text-pink-500" />}
              >
                Create a Birthday Surprise Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Birthday Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
            🕯️
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Candle Blow</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Blow into your microphone or tap the screen to extinguish 3D candles and trigger cheers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            📸
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Floating Photo Memories</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload favorite shared moments that drift gracefully in a 3D nostalgic gallery space.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            🎵
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Personal Soundtrack</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sync their favorite acoustic melody or celebratory pop track to play in background.
          </p>
        </div>
      </div>

      {/* Birthday Templates */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Birthday Surprise Templates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select a design style to jump straight into the builder.
            </p>
          </div>
          <Link href="/templates">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {birthdayTemplates.map((template) => (
            <Card
              key={template.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div>
                <div
                  className={`h-40 w-full bg-gradient-to-tr ${template.coverGradient} p-4 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold text-white bg-black/40 px-2.5 py-0.5 rounded-full">
                      Birthday Theme
                    </span>
                    {template.isNew && (
                      <span className="text-[10px] font-bold text-white bg-pink-500 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white z-10">{template.tagline}</p>
                </div>

                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base font-bold">{template.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex gap-2">
                <Link href={`/preview?template=${template.slug}`} className="w-1/2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Preview
                  </Button>
                </Link>
                <Link href={`/create?template=${template.slug}`} className="w-1/2">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Start
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
