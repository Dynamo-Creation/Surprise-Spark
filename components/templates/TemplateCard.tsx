import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, Eye } from "lucide-react";
import { Template } from "@/types/template";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TemplateCardProps {
  template: Template;
  onSelect?: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card
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
        <Link href="/preview" className="w-1/2">
          <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Eye className="w-3 h-3" />}>
            Preview
          </Button>
        </Link>
        <Link href={`/create?template=${template.slug}`} className="w-1/2">
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs"
            onClick={() => onSelect?.(template)}
            rightIcon={<ArrowRight className="w-3 h-3" />}
          >
            Customize
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
