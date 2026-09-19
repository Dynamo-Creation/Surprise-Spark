"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserPlus,
  Gift,
  Calendar,
  Eye,
  Share2,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Plus,
  Copy,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminStore, AdminDashboardMetrics, AdminMetricsMode } from "@/lib/admin/adminStore";
import { analyticsStore } from "@/lib/analytics/analyticsStore";
import { PlatformGrowthMetrics } from "@/lib/analytics/types";
import { BarChart3, Activity, ArrowDownRight, RotateCcw, Database } from "lucide-react";

export default function AdminDashboardPage() {
  const [metricsMode, setMetricsMode] = useState<AdminMetricsMode>("live");
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [growthMetrics, setGrowthMetrics] = useState<PlatformGrowthMetrics | null>(null);

  useEffect(() => {
    let initialMode: AdminMetricsMode = "live";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("surprisespark_admin_metrics_mode") as AdminMetricsMode;
      if (saved === "demo" || saved === "live") {
        initialMode = saved;
      }
    }
    setMetricsMode(initialMode);
    setMetrics(adminStore.getMetrics(initialMode));
    setGrowthMetrics(analyticsStore.getPlatformMetrics(initialMode));
  }, []);

  const handleToggleMode = (newMode: AdminMetricsMode) => {
    setMetricsMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("surprisespark_admin_metrics_mode", newMode);
    }
    setMetrics(adminStore.getMetrics(newMode));
    setGrowthMetrics(analyticsStore.getPlatformMetrics(newMode));
  };

  if (!metrics) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm font-medium">Loading platform metrics...</p>
      </div>
    );
  }

  const kpis = [
    {
      id: "total-users",
      label: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      subtext: metricsMode === "live" ? "Real registered creator accounts" : "Registered creator accounts (Demo)",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "new-users",
      label: "New Users",
      value: `+${metrics.newUsersToday}`,
      subtext: "Acquired in last 24 hours",
      icon: UserPlus,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "active-users",
      label: "Active Users",
      value: metrics.activeUsers.toLocaleString(),
      subtext: "Monthly active creators",
      icon: UserCheck,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "total-surprises",
      label: "Total Surprises",
      value: metrics.totalSurprises.toLocaleString(),
      subtext: metricsMode === "live" ? "Real surprises in database" : "Created on platform (Demo)",
      icon: Gift,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "surprises-today",
      label: "Surprises Created Today",
      value: `+${metrics.surprisesCreatedToday}`,
      subtext: "New celebration links",
      icon: Calendar,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "total-opens",
      label: "Total Opens",
      value: metrics.totalOpens.toLocaleString(),
      subtext: "Recipient curtain unboxings",
      icon: Eye,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      id: "total-shares",
      label: "Total Shares",
      value: metrics.totalShares.toLocaleString(),
      subtext: "Multi-channel viral loop shares",
      icon: Share2,
      color: "from-teal-500 to-emerald-500",
    },
    {
      id: "completion-rate",
      label: "Completion Rate",
      value: `${metrics.completionRate}%`,
      subtext: "Scene 1 to Final CTA retention",
      icon: TrendingUp,
      color: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner with Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              SurpriseSpark Control Room
            </span>
            <Badge
              variant="outline"
              size="sm"
              className={`text-[10px] font-bold ${
                metricsMode === "live"
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
                  : "border-purple-500/40 text-purple-300 bg-purple-950/20"
              }`}
            >
              {metricsMode === "live" ? "Live Database Telemetry" : "Demo Presentation Dataset"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry, template performance, viral distribution, and user acquisition metrics.
          </p>
        </div>

        {/* Live vs Demo Switcher & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Interactive Mode Toggle Pill */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => handleToggleMode("live")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricsMode === "live"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Real Data
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode("demo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                metricsMode === "demo"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Demo Showcase
            </button>
          </div>

          <div className="hidden sm:block h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <Link href="/admin/templates">
              <Button variant="secondary" size="sm" className="text-xs font-bold" leftIcon={<Copy className="w-3.5 h-3.5" />}>
                Templates
              </Button>
            </Link>
            <Link href="/admin/scenes">
              <Button
                size="sm"
                className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Scene Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mode Notice Banner */}
      {metricsMode === "live" ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Live Mode Active:</strong> All metrics represent real database records and creator sessions.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400/90">
            <span>{metrics.totalSurprises} Surprises</span>
            <span>•</span>
            <span>{metrics.totalOpens} Opens</span>
            <span>•</span>
            <span>{metrics.totalUsers} Creator(s)</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/30 text-purple-300 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Demo Mode Active:</strong> Displaying simulated baseline data for pitch decks, QA testing, and UI evaluation.
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleToggleMode("live")}
            className="text-[11px] font-bold text-purple-300 hover:text-white underline cursor-pointer text-left sm:text-right"
          >
            Switch to Live Real Data →
          </button>
        </div>
      )}

      {/* 8 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.id}
              id={`kpi-${kpi.id}`}
              className="p-5 bg-slate-900/70 border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {kpi.value}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>{kpi.subtext}</span>
              </p>
            </Card>
          );
        })}
      </div>

      {/* Product Telemetry & Growth Funnel Summary */}
      {growthMetrics && (
        <Card id="section-product-telemetry-summary" className="bg-slate-900/80 border-purple-900/40 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Product Engagement & Funnel Telemetry
                </span>
                <Badge variant="outline" size="sm" className="text-[10px] border-purple-500/30 text-purple-300">
                  Privacy-Safe Aggregate
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-white">Active Users & Retention Health</h2>
            </div>
            <Link href="/admin/analytics">
              <Button size="sm" className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                View Detailed Funnel & Template Analytics
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
            <div id="metric-dau" className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>DAU (Daily)</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{growthMetrics.dau.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Unique active visitors today</p>
            </div>

            <div id="metric-wau" className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>WAU (Weekly)</span>
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{growthMetrics.wau.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Rolling 7-day creators</p>
            </div>

            <div id="metric-mau" className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>MAU (Monthly)</span>
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-white">{growthMetrics.mau.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Rolling 30-day creators</p>
            </div>

            <div id="metric-editor-abandonment" className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Editor Abandonment</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-rose-400">{growthMetrics.editorAbandonmentRate}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Started editor but unpublished</p>
            </div>

            <div id="metric-replay-rate" className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Total Replays</span>
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">{growthMetrics.replays.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Recipient rewind unboxings</p>
            </div>
          </div>
        </Card>
      )}

      {/* Popular Templates & Viral Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Templates Column */}
        <Card id="section-popular-templates" className="lg:col-span-2 bg-slate-900/70 border-slate-800 overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-800 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-400" />
                <CardTitle className="text-base font-bold text-white">Popular Templates</CardTitle>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by creator adoption and completed unboxings</p>
            </div>
            <Link href="/admin/templates">
              <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                Manage All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4 pl-6">Rank & Template</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Surprises Built</th>
                  <th className="p-4">Adoption Share</th>
                  <th className="p-4 pr-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.popularTemplates.length === 0 || (metricsMode === "live" && metrics.totalSurprises === 0) ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      <p className="text-xs font-semibold text-slate-300 mb-1">
                        No surprises created in live production yet
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Create a surprise at <Link href="/create" className="text-purple-400 underline">/create</Link> or switch to Demo Showcase mode above to view simulated data.
                      </p>
                    </td>
                  </tr>
                ) : (
                  metrics.popularTemplates.map((tpl, idx) => {
                    const sharePct = metrics.totalSurprises > 0
                      ? Math.min(100, Math.round((tpl.count / metrics.totalSurprises) * 100))
                      : 0;
                    return (
                      <tr key={tpl.slug} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-300">
                              #{idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-white text-xs">{tpl.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{tpl.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" size="sm" className="bg-purple-950/40 text-purple-300 border-purple-800/50">
                            {tpl.category}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-white">
                          {tpl.count.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, sharePct)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">{sharePct}%</span>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Link href={`/admin/scenes?template=${tpl.slug}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 hover:border-purple-500">
                              Configure
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Operations Column */}
        <div className="space-y-6">
          <Card className="bg-slate-900/70 border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Administrative Operations
            </h3>
            <div className="space-y-2">
              <Link href="/admin/templates">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-purple-400" />
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
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Inspect Creator Accounts
                      </p>
                      <p className="text-[10px] text-slate-400">Account status & privacy-safe metrics</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>

              <Link href="/admin/audit-logs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Review Audit Trail
                      </p>
                      <p className="text-[10px] text-slate-400">System mutations & timestamps</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-950/40 to-slate-900/60 border-purple-800/40 p-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              Immutability Policy
            </span>
            <h4 className="text-sm font-bold text-white mt-1 mb-1.5">
              Published Surprises Locked
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edits made to master templates automatically create new version increments or drafts. Existing recipient links maintain frozen version manifests.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
