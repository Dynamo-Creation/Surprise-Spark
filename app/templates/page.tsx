"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Filter, Layers, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CATEGORIES, MOCK_TEMPLATES, getVisibleTemplates } from "@/lib/constants";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleTemplates = getVisibleTemplates(MOCK_TEMPLATES);

  const filteredTemplates = visibleTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex">
          <Badge variant="primary" size="md">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Template Directory</span>
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Interactive Surprises
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Discover crafted 3D scenes for every occasion, emotion, and celebration milestone.
        </p>
      </div>

      {/* Search Bar & Category Navigation */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by theme, keywords, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All Categories ({visibleTemplates.length})
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Results */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            No templates found matching your filter
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Try searching for &quot;birthday&quot;, &quot;cake&quot;, &quot;origami&quot;, or reset filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
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
                      {template.category}
                    </span>
                    {template.isPremium && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                        Premium
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
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-pink-500" />
                      {template.sceneCount} Scenes
                    </span>
                    <span>•</span>
                    <span>{template.estimatedDuration}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
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
      )}

    </div>
  );
}
