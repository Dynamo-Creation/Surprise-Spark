"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Cookie,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
  purgeAnalyticsData,
} from "@/lib/analytics/privacy";

export default function PrivacyCenterPage() {
  const [consent, setConsentState] = useState<AnalyticsConsent>("opt_in");
  const [isSaved, setIsSaved] = useState(false);
  const [isPurged, setIsPurged] = useState(false);

  useEffect(() => {
    setConsentState(getAnalyticsConsent());
  }, []);

  const handleConsentChange = (newConsent: AnalyticsConsent) => {
    setAnalyticsConsent(newConsent);
    setConsentState(newConsent);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePurge = () => {
    if (confirm("Are you sure you want to delete all local analytics data and reset your session identifier?")) {
      purgeAnalyticsData();
      setIsPurged(true);
      setTimeout(() => setIsPurged(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to SurpriseSpark
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Privacy-First Architecture
            </Badge>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Zero Invasive Tracking Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Center & Consent Controls
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
            At SurpriseSpark, personal memories belong exclusively to you and your loved ones. We never collect names, personal messages, uploaded photos, or IP addresses for product analytics.
          </p>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-slate-900/70 border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center mb-3">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Zero PII Captured</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recipient names, custom notes, gift secrets, and uploaded media are excluded from all telemetry streams before leaving your browser.
            </p>
          </Card>

          <Card className="p-5 bg-slate-900/70 border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Ephemeral Sessions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Session IDs are strictly temporary and regenerate automatically when your browser tab closes. We never track users across third-party sites.
            </p>
          </Card>

          <Card className="p-5 bg-slate-900/70 border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mb-3">
              <Cookie className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Total Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose your telemetry tier at any time. When you select opt-out, all performance and funnel tracking stops immediately.
            </p>
          </Card>
        </div>

        {/* User Consent Controls */}
        <Card id="card-telemetry-consent" className="bg-slate-900/80 border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                Manage Analytics Preferences
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure whether anonymous 3D performance and creation funnel telemetry can be recorded.
              </p>
            </div>
            {isSaved && (
              <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Preferences Saved
              </Badge>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {/* Opt-In Option */}
            <div
              id="consent-opt-in"
              onClick={() => handleConsentChange("opt_in")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                consent === "opt_in"
                  ? "bg-purple-950/40 border-purple-500 shadow-sm shadow-purple-500/10"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Full Anonymous Telemetry</span>
                    <Badge variant="outline" size="sm" className="text-[10px] border-purple-500/30 text-purple-300">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    Allows anonymous 3D load times, device category (desktop/mobile), and creator funnel steps so our engineering team can optimize WebGL performance and fix template bugs.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    consent === "opt_in" ? "border-purple-500 bg-purple-600 text-white" : "border-slate-700"
                  }`}
                >
                  {consent === "opt_in" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Essential Only Option */}
            <div
              id="consent-essential-only"
              onClick={() => handleConsentChange("essential_only")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                consent === "essential_only"
                  ? "bg-purple-950/40 border-purple-500 shadow-sm shadow-purple-500/10"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white">Essential Telemetry Only</span>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    Only records technical error alerts and basic page stability events. Disables creator funnel conversion tracking.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    consent === "essential_only" ? "border-purple-500 bg-purple-600 text-white" : "border-slate-700"
                  }`}
                >
                  {consent === "essential_only" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Opt-Out Option */}
            <div
              id="consent-opt-out"
              onClick={() => handleConsentChange("opt_out")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                consent === "opt_out"
                  ? "bg-purple-950/40 border-purple-500 shadow-sm shadow-purple-500/10"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white">Strict Opt-Out (No Telemetry)</span>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    Drops all analytics, performance, and funnel events before dispatch. No data is recorded or stored.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    consent === "opt_out" ? "border-purple-500 bg-purple-600 text-white" : "border-slate-700"
                  }`}
                >
                  {consent === "opt_out" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Purge / Forget Me Action */}
        <Card id="card-forget-me" className="bg-slate-900/60 border-slate-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Data Purge & Session Reset ("Forget Me")
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                Instantly purges all locally stored analytics cache, deduplication records, and generates a new random anonymous session identifier.
              </p>
            </div>
            <Button
              id="btn-purge-analytics"
              onClick={handlePurge}
              variant="outline"
              size="sm"
              className="border-rose-900/60 text-rose-400 hover:bg-rose-950/50 text-xs font-bold"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Purge Local Analytics Data
            </Button>
          </div>
          {isPurged && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All local analytics identifiers and deduplication caches have been completely wiped.
            </div>
          )}
        </Card>

        {/* Footer Note */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>SurpriseSpark Privacy Framework • Compliance Ready (GDPR & CCPA Aligned)</span>
          <Link href="/admin/analytics" className="text-slate-400 hover:text-purple-400 transition-colors">
            Admin Analytics Telemetry →
          </Link>
        </div>
      </div>
    </div>
  );
}
