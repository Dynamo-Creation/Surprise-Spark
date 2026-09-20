"use client";

import React from "react";
import {
  Sparkles,
  Type,
  Mic,
  Gift,
  Eye,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface FunnelStep {
  id: string;
  name: string;
  count: number;
  percentage: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface AdminFunnelVisualizerProps {
  totalVisitors?: number;
}

export function AdminFunnelVisualizer({
  totalVisitors = 4250,
}: AdminFunnelVisualizerProps) {
  const steps: FunnelStep[] = [
    {
      id: "step-start",
      name: "Creator Studio Start",
      count: totalVisitors,
      percentage: 100,
      description: "Templates explored & chosen",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "step-customize",
      name: "Text & Photo Personalization",
      count: Math.round(totalVisitors * 0.896),
      percentage: 89.6,
      description: "Names, wishes & photos uploaded",
      icon: Type,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "step-audio",
      name: "Voice Note & Audio Trimmer",
      count: Math.round(totalVisitors * 0.742),
      percentage: 74.2,
      description: "Custom audio trimmed to duration",
      icon: Mic,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "step-published",
      name: "Surprise Link Generated",
      count: Math.round(totalVisitors * 0.685),
      percentage: 68.5,
      description: "Encrypted celebration link ready",
      icon: Gift,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "step-unboxed",
      name: "Recipient Curtain Unboxed",
      count: Math.round(totalVisitors * 0.645),
      percentage: 94.2, // completion of delivered
      description: "Revealed & celebrated by recipient",
      icon: Eye,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border border-white/[0.08] p-5 sm:p-6 shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Creator Customization & Unboxing Journey
            </h3>
            <p className="text-[11px] text-slate-400">
              End-to-end conversion: Template Selection → Personalization → Voice/Song Trimming → Recipient Unboxing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            94.2% Unboxing Completion
          </span>
        </div>
      </div>

      {/* Horizontal Step Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative group">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] group-hover:border-purple-500/40 transition-all flex flex-col justify-between h-full">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phase 0{idx + 1}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-sm`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-white leading-tight mb-1 group-hover:text-purple-300 transition-colors">
                    {step.name}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-2">
                    {step.description}
                  </p>
                </div>

                {/* Progress Bar and Metric */}
                <div className="mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-base font-black text-white">
                      {step.count.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-purple-400">
                      {step.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${step.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, step.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Arrow separator on desktop */}
              {!isLast && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-900 border border-white/[0.1] items-center justify-center text-slate-400">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
