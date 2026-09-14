"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Smile, Sparkles, Layers, ArrowRight, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assetStore } from "@/lib/assets/assetStore";
import { Asset3DModel, AssetSlot } from "@/lib/assets/types";

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<Asset3DModel[]>([]);
  const [characterSlot, setCharacterSlot] = useState<AssetSlot | null>(null);

  useEffect(() => {
    setCharacters(assetStore.getAssets("characters"));
    setCharacterSlot(assetStore.getSlotById("birthday_character"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Smile className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Character Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Celebration Characters & Mascots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Animated 3D characters bound to the standard animation contract (Idle, Walk, Wave, Celebrate, Gift, Jump, Dance).
          </p>
        </div>

        <Link href="/admin/assets">
          <Button variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-900" leftIcon={<Box className="w-3.5 h-3.5" />}>
            Manage 3D Library
          </Button>
        </Link>
      </div>

      {/* Active Slot Status */}
      {characterSlot && (
        <Card className="p-4 bg-slate-900/80 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/50 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Active Birthday Mascot Slot:</span>
                <Badge variant="outline" size="sm" className="font-mono text-purple-300 border-purple-800 text-[10px]">
                  {characterSlot.id}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Templates call this slot. Currently assigned to:{" "}
                <strong className="text-amber-300">
                  {characters.find((c) => c.id === characterSlot.assignedAssetId)?.name || characterSlot.assignedAssetId}
                </strong>
              </p>
            </div>
          </div>

          <Link href="/admin/assets">
            <Button variant="secondary" size="sm" className="text-xs">
              Reassign Slot
            </Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((char) => {
          const isAssigned = characterSlot?.assignedAssetId === char.id;

          return (
            <Card key={char.id} className="p-5 bg-slate-900/70 border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded-full">
                    {char.format.toUpperCase()} • v{char.currentVersion}
                  </span>
                  {isAssigned && (
                    <Badge variant="success" size="sm" className="text-[10px]">
                      Active Slot Mascot
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{char.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{char.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Animation Mappings:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {char.availableAnimations.map((clip) => {
                      const standard = char.animationMappings[clip];
                      return (
                        <span
                          key={clip}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono flex items-center gap-1"
                        >
                          <span>{clip}</span>
                          {standard && (
                            <>
                              <ArrowRight className="w-2.5 h-2.5 text-purple-400" />
                              <span className="text-purple-300 font-bold">{standard}</span>
                            </>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">{char.id}</span>
                <Link href="/admin/assets">
                  <Button variant="outline" size="sm" className="text-xs h-7 border-slate-800 hover:bg-slate-800">
                    Preview in 3D
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
