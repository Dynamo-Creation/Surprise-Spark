"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AdminMetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  gradient: string;
  sparklinePoints?: number[];
}

export function AdminMetricCard({
  id,
  label,
  value,
  subtext,
  trend,
  icon: Icon,
  gradient,
  sparklinePoints = [20, 28, 24, 38, 32, 45, 52, 60],
}: AdminMetricCardProps) {
  // Generate SVG path for sparkline
  const min = Math.min(...sparklinePoints);
  const max = Math.max(...sparklinePoints);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  const step = width / (sparklinePoints.length - 1);

  const points = sparklinePoints.map((val, idx) => {
    const x = idx * step;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border border-white/[0.08] hover:border-purple-500/40 p-5 transition-all duration-300 group shadow-lg shadow-black/40 hover:shadow-purple-500/10"
    >
      {/* Ambient background glow on hover */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-wide block">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {value}
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-md shadow-black/50 shrink-0 group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] mt-2 relative z-10">
        <div className="flex items-center gap-1.5 text-[11px]">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-400 truncate max-w-[140px]">{subtext}</span>}
        </div>

        {/* Sparkline curve */}
        <div className="w-[100px] h-[30px] shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${id || label}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path
              d={pathD}
              fill="none"
              stroke={`url(#grad-${id || label})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkline end dot */}
            {points.length > 0 && (
              <circle
                cx={points[points.length - 1].split(",")[0]}
                cy={points[points.length - 1].split(",")[1]}
                r="3"
                className="fill-purple-400 animate-pulse"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
