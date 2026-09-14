"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Globe,
  Share2,
  Users,
  Eye,
  Gift,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Activity,
  Layers,
  Award,
  Zap,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyticsStore } from "@/lib/analytics/analyticsStore";
import { FUNNEL_STAGES, PlatformGrowthMetrics, TemplateAnalytics } from "@/lib/analytics/types";
import { purgeAnalyticsData } from "@/lib/analytics/privacy";

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<PlatformGrowthMetrics | null>(null);
  const [purgeNotice, setPurgeNotice] = useState<string | null>(null);

  const refresh = () => {
    setMetrics(analyticsStore.getMetrics());
  };

  useEffect(() => {
    refresh();
  }, []);

  if (!metrics) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin text-purple-500 mb-3" />
        <p className="text-sm font-medium">Loading platform telemetry...</p>
      </div>
    );
  }

  // Calculate Funnel Stages with conversion drop-offs
  const funnelData = FUNNEL_STAGES.map((stage, idx) => {
    const count = metrics.funnelCounts[stage.step] || 0;
    const topCount = metrics.funnelCounts.signup || 1;
    const prevCount = idx > 0 ? metrics.funnelCounts[FUNNEL_STAGES[idx - 1].step] || count : count;

    const overallPct = Math.round((count / topCount) * 100);
    const stepConversionPct = prevCount > 0 ? Math.round((count / prevCount) * 100) : 100;
    const dropOffPct = 100 - stepConversionPct;

    return {
      ...stage,
      count,
      overallPct,
      stepConversionPct,
      dropOffPct: dropOffPct > 0 ? dropOffPct : 0,
    };
  });

  const handlePurge = () => {
    if (confirm("Are you sure you want to test data purging? All local session events will be deleted.")) {
      purgeAnalyticsData();
      setPurgeNotice("Session analytics successfully purged. Zero-PII erasure confirmed.");
      setTimeout(() => setPurgeNotice(null), 3000);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {purgeNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{purgeNotice}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Product Analytics & Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Growth & Conversion Funnel
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Privacy-conscious telemetry measuring acquisition, 9-stage funnels, completion rates, and device health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            size="sm"
            className="text-emerald-300 border-emerald-800 bg-emerald-950/40 text-xs flex items-center gap-1.5 py-1 px-3"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero-PII Guaranteed
          </Badge>
          <Link href="/privacy">
            <Button variant="outline" size="sm" className="text-xs border-slate-700 bg-slate-900">
              Privacy Center
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (DAU, WAU, MAU & Vital Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-dau">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
            DAU (Daily)
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.dau.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">Active creators today</span>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-wau">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            WAU (Weekly)
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.wau.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">Active in last 7 days</span>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-mau">
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
            MAU (Monthly)
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.mau.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">Active in last 30 days</span>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-replays">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Replays
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.replays.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500">Curtain rewind plays</span>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-completion">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            Completion Rate
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.completionRate}%</p>
          <span className="text-[10px] text-slate-500">Watched through final scene</span>
        </Card>

        <Card className="p-4 bg-slate-900/70 border-slate-800" id="kpi-abandonment">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
            Editor Abandonment
          </span>
          <p className="text-xl font-black text-white mt-1">{metrics.editorAbandonmentRate}%</p>
          <span className="text-[10px] text-slate-500">Started but unpublished</span>
        </Card>
      </div>

      {/* 9-Stage Product Funnel Visualization */}
      <Card className="p-6 bg-slate-900/70 border-slate-800 space-y-4" id="section-funnel">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              <h3 className="font-bold text-sm text-white">Full Product Lifecycle Funnel (9 Stages)</h3>
            </div>
            <p className="text-xs text-slate-400">
              End-to-end user journey from Creator Signup through Recipient Opening, Completion, and Viral Sharing.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Telemetry Pipeline</span>
        </div>

        <div className="space-y-3 pt-2">
          {funnelData.map((step, idx) => (
            <div key={step.step} className="space-y-1.5" id={`funnel-step-${step.step}`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{step.label}</span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">— {step.description}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400 text-[11px]">{step.count.toLocaleString()} users</span>
                  <span className="font-bold text-white text-xs">{step.overallPct}%</span>
                  {idx > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        step.dropOffPct > 25
                          ? "bg-rose-950/60 text-rose-300 border border-rose-900"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {step.stepConversionPct}% conv ({step.dropOffPct}% drop)
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800/80">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(4, step.overallPct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Template Analytics & Performance Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Performance Table */}
        <Card className="lg:col-span-2 p-6 bg-slate-900/70 border-slate-800 space-y-4" id="section-templates">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Template Popularity & Engagement</h3>
              </div>
              <p className="text-xs text-slate-400">Granular template views, creations, completion, and shares.</p>
            </div>
            <Badge variant="outline" size="sm" className="text-[10px] text-purple-300 border-purple-800">
              8 Templates Active
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold">
                  <th className="pb-2.5">Template</th>
                  <th className="pb-2.5">Views</th>
                  <th className="pb-2.5">Selections</th>
                  <th className="pb-2.5">Creations</th>
                  <th className="pb-2.5">Completion</th>
                  <th className="pb-2.5">Shares</th>
                  <th className="pb-2.5 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {metrics.templateAnalytics.map((tpl) => (
                  <tr key={tpl.templateId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 font-sans font-semibold text-white">{tpl.name}</td>
                    <td className="py-2.5 text-slate-400">{tpl.views.toLocaleString()}</td>
                    <td className="py-2.5 text-slate-400">{tpl.selections.toLocaleString()}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">{tpl.creations.toLocaleString()}</td>
                    <td className="py-2.5 text-slate-300">{tpl.completionRate}%</td>
                    <td className="py-2.5 text-pink-400">{tpl.shares.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300 font-bold text-[10px]">
                        {tpl.popularityScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Technical Performance & Device Distribution */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900/70 border-slate-800 space-y-4" id="section-performance">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Technical Performance</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Average 3D Load Latency</span>
                  <span className="font-mono text-emerald-400 font-bold">{metrics.averageLoadTimeMs} ms</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[24%]" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">WebGL shaders & geometries compiled</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">WebGL Acceleration Rate</span>
                  <span className="font-mono text-purple-400 font-bold">99.8%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full w-[99.8%]" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">0.2% rendered via CSS 3D fallback</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block mb-2">Device Distribution</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Mobile
                  </span>
                  <span className="font-mono text-white font-bold">{metrics.deviceBreakdown.mobile}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-400" /> Desktop
                  </span>
                  <span className="font-mono text-white font-bold">{metrics.deviceBreakdown.desktop}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-pink-400" /> Tablet
                  </span>
                  <span className="font-mono text-white font-bold">{metrics.deviceBreakdown.tablet}%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Compliance Card */}
          <Card className="p-5 bg-slate-900/70 border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs text-white">Privacy & GDPR Controls</h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Events are anonymized and bound to ephemeral session IDs. Users can opt out or erase all session data at any time.
            </p>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Status: Opt-In Compliant</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePurge}
                className="text-[11px] h-7 border-rose-900/60 text-rose-300 hover:bg-rose-950/40"
                id="btn-purge-analytics"
              >
                Purge Session Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
