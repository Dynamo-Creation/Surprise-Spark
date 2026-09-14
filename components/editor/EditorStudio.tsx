import React from "react";
import { Sparkles, Sliders } from "lucide-react";

/**
 * Editor Studio Component (Phase 1 Foundation)
 * Encapsulates the visual editor and live parameter binding for surprise creators.
 */
export function EditorStudio() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-pink-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Editor Studio Engine
        </h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Provides real-time parameter tweaking for scene sequences, particle densities, and camera choreography.
      </p>
    </div>
  );
}
