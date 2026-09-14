import React from "react";
import Link from "next/link";
import { Sparkles, Layers, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_TEMPLATES } from "@/lib/constants";

export function FeaturedSection() {
  const featuredTemplates = MOCK_TEMPLATES.filter((t) => t.isFeatured);

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex">
            <Badge variant="primary" size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Signature Experiences
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Birthday Wonders
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Handcrafted interactive journeys ready to be customized in under 2 minutes.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <Card
              key={template.id}
              hoverEffect
              glass
              className="flex flex-col justify-between overflow-hidden group border-slate-200/80 dark:border-slate-800"
            >
              <div>
                {/* Visual Header / Cover Gradient */}
                <div
                  className={`h-44 w-full bg-gradient-to-tr ${template.coverGradient} p-4 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {template.category}
                    </span>
                    {template.isNew && (
                      <span className="text-[11px] font-bold text-white bg-pink-500/90 px-2 py-0.5 rounded-full shadow-sm">
                        New
                      </span>
                    )}
                  </div>

                  <div className="z-10 text-white">
                    <p className="text-xs font-semibold text-white/80">{template.tagline}</p>
                  </div>

                  {/* Subtle decorative circle */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500" />
                </div>

                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-lg group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-2">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-pink-500" />
                      {template.sceneCount} Scenes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      {template.estimatedDuration}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                <Link href={`/preview?template=${template.slug}`} className="w-1/2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Live Demo
                  </Button>
                </Link>
                <Link href={`/create?template=${template.slug}`} className="w-1/2">
                  <Button variant="primary" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                    Customize
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Explorer CTA */}
        <div className="text-center mt-12">
          <Link href="/templates">
            <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore All Categories & Templates
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
