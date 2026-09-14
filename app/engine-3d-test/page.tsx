"use client";

import React, { useState } from "react";
import { ExperiencePlayer } from "@/components/engine/ExperiencePlayer";
import {
  DEMO_TEMPLATE_MODEL,
  DEMO_VERSION_1_0_0,
  DEMO_SCENES_V1,
} from "@/lib/engine/demoTemplate";
import { getDeviceCapabilities } from "@/lib/3d/webglDetection";
import { Sparkles, Cpu, RefreshCw, CheckCircle2 } from "lucide-react";

export default function Engine3DTestPage() {
  const [key, setKey] = useState(0);
  const [caps, setCaps] = useState<ReturnType<typeof getDeviceCapabilities> | null>(null);

  React.useEffect(() => {
    setCaps(getDeviceCapabilities());
  }, []);

  const personalizationData = {
    recipient_name: "Alex",
    sender_name: "Jordan",
    message:
      "Wishing you a magnificent birthday filled with endless laughter, boundless adventures, and dreams turned into reality!",
    special_date: "September 14, 2026",
    photo_1: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col">
      {/* 3D Engine Diagnostics HUD Bar */}
      <div className="bg-slate-900/90 border-b border-white/10 px-4 py-2.5 z-40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-wide text-pink-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Phase 4: 3D Experience Engine Validation
          </span>
        </div>

        {/* Diagnostics & Device Caps */}
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>WebGL: {caps?.isWebGLAvailable ? "Active ✅" : "Fallback ⚠️"}</span>
          </div>
          <div className="hidden sm:inline text-slate-500">|</div>
          <div className="hidden sm:flex items-center gap-1">
            <span>Particles: {caps?.recommendedParticleCount ?? "..."}</span>
          </div>
          <div className="hidden sm:inline text-slate-500">|</div>
          <div className="hidden sm:flex items-center gap-1">
            <span>Mobile: {caps?.isMobile ? "Yes" : "No"}</span>
          </div>

          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs font-semibold ml-2"
          >
            <RefreshCw className="w-3 h-3" />
            Restart Test
          </button>
        </div>
      </div>

      {/* Main Experience Player running the 3D Engine */}
      <div key={key} className="flex-1 flex flex-col">
        <ExperiencePlayer
          template={DEMO_TEMPLATE_MODEL}
          version={DEMO_VERSION_1_0_0}
          scenes={DEMO_SCENES_V1}
          personalization={personalizationData}
        />
      </div>
    </div>
  );
}
