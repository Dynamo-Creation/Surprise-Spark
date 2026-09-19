"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Layers, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MOCK_TEMPLATES, getVisibleTemplates } from "@/lib/constants";
import { ExperienceCategory } from "@/types/experience";

export function PopularTemplatesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "birthday", name: "Birthday 🎂" },
    { id: "love", name: "Love & Romance 💖" },
    { id: "anniversary", name: "Anniversary 🥂" },
    { id: "friendship", name: "Best Friend 🤝" },
  ];

  const visible = getVisibleTemplates(MOCK_TEMPLATES);
  const filteredTemplates =
    selectedCategory === "all"
      ? visible
      : visible.filter((t) => t.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="primary" size="md">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Template Gallery</span>
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Popular Surprise Themes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered with reusable 3D scene modules, lighting, and audio sequencing.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div>
                <div
                  className={`h-36 w-full bg-gradient-to-tr ${template.coverGradient} p-4 flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      {template.category}
                    </span>
                    {template.isPremium ? (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                        Free
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

                <CardContent className="p-5 pt-1">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-pink-500" />
                      {template.sceneCount} Scenes
                    </span>
                    <span>•</span>
                    <span>{template.estimatedDuration}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center gap-2">
                <Link href={`/preview?template=${template.slug}`} className="w-1/2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs whitespace-nowrap font-bold"
                    leftIcon={<Eye className="w-3.5 h-3.5 shrink-0" />}
                  >
                    Live Demo
                  </Button>
                </Link>
                <Link href={`/create?template=${template.slug}`} className="w-1/2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs whitespace-nowrap font-bold"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
                  >
                    Customize
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
