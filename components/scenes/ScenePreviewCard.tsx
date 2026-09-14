import React from "react";
import { SceneInstance } from "@/types/experience";
import { Play, Sparkles } from "lucide-react";

export interface ScenePreviewCardProps {
  scene: SceneInstance;
  onPreview?: (scene: SceneInstance) => void;
}

export function ScenePreviewCard({ scene, onPreview }: ScenePreviewCardProps) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-xs">
          #{scene.order}
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{scene.title}</h5>
          <p className="text-[11px] text-slate-400 capitalize">{scene.sceneType.replace(/-/g, " ")}</p>
        </div>
      </div>

      {onPreview && (
        <button
          onClick={() => onPreview(scene)}
          className="p-2 rounded-xl text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          aria-label="Preview scene"
        >
          <Play className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
