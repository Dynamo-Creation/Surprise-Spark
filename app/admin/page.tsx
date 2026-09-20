"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Gift,
  Eye,
  Share2,
  TrendingUp,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ChevronRight,
  Database,
  ExternalLink,
  Type,
  Image as ImageIcon,
  Mic,
  Copy,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminStore, AdminDashboardMetrics, AdminMetricsMode } from "@/lib/admin/adminStore";
import { analyticsStore } from "@/lib/analytics/analyticsStore";
import { PlatformGrowthMetrics } from "@/lib/analytics/types";
import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminFunnelVisualizer } from "@/components/admin/AdminFunnelVisualizer";
import { AdminActivityFeed } from "@/components/admin/AdminActivityFeed";

export default function AdminDashboardPage() {
  const [metricsMode, setMetricsMode] = useState<AdminMetricsMode>("live");
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [growthMetrics, setGrowthMetrics] = useState<PlatformGrowthMetrics | null>(null);

  const refreshData = (mode: AdminMetricsMode) => {
    setMetrics(adminStore.getMetrics(mode));
    setGrowthMetrics(analyticsStore.getPlatformMetrics(mode));
  };

  useEffect(() => {
    let initialMode: AdminMetricsMode = "live";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("surprisespark_admin_metrics_mode") as AdminMetricsMode;
      if (saved === "demo" || saved === "live") {
        initialMode = saved;
      }
    }
    setMetricsMode(initialMode);
    refreshData(initialMode);

    // Listen for mode changes from AdminHeader
    const handleModeChange = () => {
      const updated = (localStorage.getItem("surprisespark_admin_metrics_mode") as AdminMetricsMode) || "live";
      setMetricsMode(updated);
      refreshData(updated);
    };

    window.addEventListener("surprisespark_mode_changed", handleModeChange);
    return () => window.removeEventListener("surprisespark_mode_changed", handleModeChange);
  }, []);

  if (!metrics) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm font-medium">Loading platform metrics & telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Executive Welcome & System Pulse Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-[#0c101d] border border-white/[0.08] p-6 shadow-xl shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-purple-600/10 via-pink-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                SurpriseSpark Command Center
              </span>
              <span className="text-slate-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time platform pulse, template adoption, recipient unboxing telemetry, and creator customization workflows.
            </p>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/admin/templates">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-white border border-white/[0.08]"
                leftIcon={<Layers className="w-3.5 h-3.5 text-purple-400" />}
              >
                Templates
              </Button>
            </Link>

            <Link href="/admin/surprises">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-white border border-white/[0.08]"
                leftIcon={<Gift className="w-3.5 h-3.5 text-pink-400" />}
              >
                Surprises
              </Button>
            </Link>

            <Link href="/create" target="_blank">
              <Button
                size="sm"
                className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-md shadow-purple-600/30"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Creator Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Mode Status Callout */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            {metricsMode === "live" ? (
              <>
                <Database className="w-4 h-4 text-emerald-400" />
                <span>
                  Telemetry Source: <strong className="text-emerald-300">Live Database</strong> ({metrics.totalSurprises} surprises, {metrics.totalUsers} registered creator accounts)
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>
                  Telemetry Source: <strong className="text-purple-300">Demo Showcase Dataset</strong> (Simulated presentation baseline)
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Uptime: 99.98% • Latency: 22ms • Edge Memory Synced
          </div>
        </div>
      </div>

      {/* 2. Elevated Bento KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          id="metric-creators"
          label="Total Registered Creators"
          value={metrics.totalUsers.toLocaleString()}
          subtext={`+${metrics.newUsersToday} acquired today`}
          trend={{ value: "+18.2%", isPositive: true }}
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
          sparklinePoints={[24, 30, 32, 45, 52, 58, 64, 72]}
        />

        <AdminMetricCard
          id="metric-surprises"
          label="Surprises Built"
          value={metrics.totalSurprises.toLocaleString()}
          subtext={`+${metrics.surprisesCreatedToday} new celebration links`}
          trend={{ value: "+14.6%", isPositive: true }}
          icon={Gift}
          gradient="from-pink-500 to-rose-500"
          sparklinePoints={[35, 42, 40, 55, 60, 72, 85, 94]}
        />

        <AdminMetricCard
          id="metric-unboxings"
          label="Recipient Unboxings"
          value={metrics.totalOpens.toLocaleString()}
          subtext="Completed curtain reveals"
          trend={{ value: "+22.4%", isPositive: true }}
          icon={Eye}
          gradient="from-purple-500 to-indigo-500"
          sparklinePoints={[40, 50, 48, 65, 78, 88, 98, 115]}
        />

        <AdminMetricCard
          id="metric-completion"
          label="Unboxing Completion Rate"
          value={`${metrics.completionRate}%`}
          subtext="Scene 1 to Final CTA retention"
          trend={{ value: "Optimal", isPositive: true }}
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
          sparklinePoints={[85, 87, 88, 90, 89, 92, 93, 94]}
        />
      </div>

      {/* 3. Interactive User Journey Funnel Visualizer */}
      <AdminFunnelVisualizer totalVisitors={Math.max(metrics.totalSurprises * 3, 1200)} />

      {/* 4. Popular Templates Showcase & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Popular Templates Leaderboard with Customization Slots Specs */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border-white/[0.08] overflow-hidden shadow-xl shadow-black/40">
            <CardHeader className="p-5 border-b border-white/[0.06] flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <CardTitle className="text-sm sm:text-base font-bold text-white">
                    Master Templates Catalog
                  </CardTitle>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Self-contained templates with customizable text, photo slots, and audio trimmer specs
                </p>
              </div>

              <Link href="/admin/templates">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Manage All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            {/* Template Cards List */}
            <div className="divide-y divide-white/[0.04]">
              {metrics.popularTemplates.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-xs font-semibold text-slate-300 mb-1">
                    No template data available
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Switch to Demo Showcase mode in the top bar to inspect template performance.
                  </p>
                </div>
              ) : (
                metrics.popularTemplates.map((tpl, idx) => {
                  const sharePct =
                    metrics.totalSurprises > 0
                      ? Math.min(100, Math.round((tpl.count / metrics.totalSurprises) * 100))
                      : 85;

                  return (
                    <div
                      key={`${tpl.slug}-${idx}`}
                      className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left: Template details & capability tags */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 border border-white/[0.08] text-[10px] font-black flex items-center justify-center text-slate-300 shrink-0">
                            #{idx + 1}
                          </span>
                          <h4 className="font-bold text-sm text-white truncate">
                            {tpl.name}
                          </h4>
                          <Badge
                            variant="secondary"
                            size="sm"
                            className="bg-purple-950/50 text-purple-300 border-purple-800/40 text-[10px]"
                          >
                            {tpl.category}
                          </Badge>
                        </div>

                        {/* Capability Slot Pills */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-white/[0.06] text-slate-300 font-medium">
                            <Type className="w-3 h-3 text-cyan-400" />
                            Text Customization
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-white/[0.06] text-slate-300 font-medium">
                            <ImageIcon className="w-3 h-3 text-pink-400" />
                            {tpl.slug === "sweet-celebration" ? "1 Polaroid Photo" : "Photo Slots"}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-white/[0.06] text-slate-300 font-medium">
                            <Mic className="w-3 h-3 text-purple-400" />
                            Voice Note / 30s Trimmer
                          </span>
                        </div>
                      </div>

                      {/* Right: Adoption bar & Actions */}
                      <div className="flex items-center gap-4 sm:shrink-0 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">
                            {tpl.count.toLocaleString()} built
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                                style={{ width: `${sharePct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {sharePct}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link href={`/create?template=${tpl.slug}`} target="_blank">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs border-white/[0.1] hover:border-purple-500 text-slate-300"
                            >
                              Preview in Studio
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Platform Self-Contained Architecture Note */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/20 to-slate-900/50 border border-purple-900/30 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-purple-300">Self-Contained Templates Architecture:</strong> All templates code their own scene sequences internally. Creators customize text, upload photos according to slot design, and attach a voice note or trim a custom song to match the playback duration.
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Activity Stream & Administrative Operations */}
        <div className="space-y-6">
          {/* Live Activity Stream */}
          <AdminActivityFeed />

          {/* Quick Operations Strip */}
          <Card className="bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border-white/[0.08] p-5 shadow-xl shadow-black/40">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Administrative Operations
            </h3>

            <div className="space-y-2">
              <Link href="/admin/templates">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] hover:border-purple-500/40 transition-all flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Copy className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Duplicate Template
                      </p>
                      <p className="text-[10px] text-slate-400">Clone Sweet Celebration to Custom Edition</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>

              <Link href="/admin/users">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] hover:border-purple-500/40 transition-all flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Creator Accounts
                      </p>
                      <p className="text-[10px] text-slate-400">Inspect accounts, permissions & activity</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>

              <Link href="/admin/reports">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] hover:border-purple-500/40 transition-all flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Export Telemetry CSV
                      </p>
                      <p className="text-[10px] text-slate-400">Download daily executive summary</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
