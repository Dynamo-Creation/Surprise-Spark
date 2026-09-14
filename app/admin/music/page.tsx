"use client";

import React from "react";
import { Music, Play, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MUSIC_TRACKS } from "@/lib/engine/musicCatalog";
import { soundManager } from "@/lib/audio/soundManager";

export default function AdminMusicPage() {
  const handleAudition = (preset: string) => {
    try {
      soundManager.playSoundEffect("pop");
      soundManager.startBgm(preset as any);
    } catch {
      // audio handle
    }
  };

  const handleStop = () => {
    soundManager.stopBgm();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Audio Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Royalty-Cleared Music & SFX
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Procedural and synthesized audio tracks tagged by emotional mood for celebration reveals.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleStop} className="text-xs border-slate-700">
          Stop Audio Playback
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MUSIC_TRACKS.map((track) => (
          <Card key={track.id} className="p-5 bg-slate-900/70 border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" size="sm" className="capitalize text-[10px] text-purple-300 border-purple-800">
                  {track.category}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">
                  {track.duration}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white mb-0.5">{track.name}</h3>
              <p className="text-xs text-slate-400 mb-1">{track.artist}</p>
              <p className="text-[11px] text-slate-500 mb-3">{track.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">{track.id}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAudition(track.soundPreset)}
                className="h-7 text-xs bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"
                leftIcon={<Play className="w-3 h-3" />}
              >
                Audition
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
