"use client";

import React from "react";
import { Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { THEMES } from "@/lib/engine/themes";

export default function AdminThemesPage() {
  const themeList = Object.values(THEMES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Style System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Theme Presets & Palettes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aesthetic color tokens, lighting tints, and background gradients applied dynamically to scenes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themeList.map((thm) => (
          <Card key={thm.id} className="p-5 bg-slate-900/70 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">{thm.name}</span>
              <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                {thm.id}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {thm.colorSwatch.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-md shadow" style={{ backgroundColor: c }} title={`Swatch ${i + 1}`} />
              ))}
              <div className="w-6 h-6 rounded-md shadow" style={{ backgroundColor: thm.accentColor }} title="Accent" />
              <span className="text-[11px] text-slate-400 ml-1 font-mono">
                {thm.accentColor}
              </span>
            </div>
            <div
              className={`h-6 rounded-lg bg-gradient-to-r ${thm.backgroundGradient} border border-white/10`}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
