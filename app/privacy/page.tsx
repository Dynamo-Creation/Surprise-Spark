"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Cookie,
  MicOff,
  Image as ImageIcon,
  Globe2,
  FileText,
  Mail,
  HelpCircle,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
  purgeAnalyticsData,
} from "@/lib/analytics/privacy";
import { BRAND_NAME } from "@/lib/constants";

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
    if (
      confirm(
        "Are you sure you want to delete all local analytics data, reset your session identifier, and opt out of telemetry?"
      )
    ) {
      purgeAnalyticsData();
      setConsentState("opt_out");
      setIsPurged(true);
      setTimeout(() => setIsPurged(false), 4000);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/40 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to {BRAND_NAME}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              size="sm"
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Privacy-First Experience Platform</span>
            </Badge>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Zero Ad Trackers • Zero Data Selling
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Center & Experience Safety
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed max-w-2xl">
            At <strong>{BRAND_NAME}</strong>, celebration memories belong exclusively to you and your recipient. Here is how your personal letters, uploaded photos, and interactive surprises are protected from end to end.
          </p>
        </div>

        {/* 4 Core Platform Privacy Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200/70 dark:border-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Private &amp; Unlisted Surprise Links
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every published surprise is assigned a cryptographically unique link (<code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">/s/[id]</code>) configured with strict <code className="text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">noindex, nofollow</code> headers. Search engines (Google, Bing) never crawl or list your surprises publicly.
            </p>
          </Card>

          <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MicOff className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Local Audio Physics (Zero Recording)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In experiences with blowable birthday candles, microphone input is analyzed <strong>100% locally in real-time</strong> using your device&apos;s Web Audio API to detect air breath peaks. Your voice and audio are <strong>never recorded, stored, or sent to any server</strong>.
            </p>
          </Card>

          <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Photos &amp; Letters Protected
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Uploaded photo memories, typewriter notes, and wax-sealed confessions are encrypted in transit (TLS 1.3) and stored securely in dedicated cloud storage. We never scan, analyze, or train AI models on your private photos or messages.
            </p>
          </Card>

          <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Permanent Deletion Anytime
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              You maintain complete ownership of every surprise you create. You can edit, unpublish, or permanently delete any experience directly from your <strong>Creator Dashboard</strong> at any moment. When deleted, all media and text are purged immediately.
            </p>
          </Card>
        </div>

        {/* Detailed Privacy Policy Accordion / Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-500" />
            <span>Privacy Policy Breakdown</span>
          </h2>

          <div className="space-y-3">
            <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                1. What Information We Collect
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc pl-5 leading-relaxed">
                <li>
                  <strong>Account Details (Optional):</strong> If you sign up or log in, we securely store your email address and profile name via encrypted Supabase Authentication.
                </li>
                <li>
                  <strong>Surprise Content:</strong> Names, heartfelt custom letters, selected template choice, uploaded polaroid images, and custom background soundtrack choices.
                </li>
                <li>
                  <strong>Device Diagnostics:</strong> Browser screen resolution and WebGL 3D capability purely to render responsive physics and graphics correctly on smartphones and laptops.
                </li>
                <li>
                  <strong>We do NOT collect:</strong> Government IDs, financial tracking data, contacts list, or background GPS location.
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                2. How We Share Information
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>We never sell, rent, or trade your personal data with third-party data brokers or advertising networks.</strong> Your surprises are only shared with the individuals you send your unique link to. Infrastructure providers (such as Supabase for database storage and Vercel for hosting) process data strictly under GDPR-compliant Data Processing Agreements (DPAs).
              </p>
            </Card>

            <Card className="p-5 bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                3. Cookies &amp; Local Storage
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We only use essential functional cookies (to maintain your secure login session) and local browser storage (for dark/light theme preference and your analytics consent state). We do <strong>not</strong> load third-party ad pixels (e.g., Facebook Pixel, TikTok Pixel, Google AdSense).
              </p>
            </Card>
          </div>
        </div>

        {/* User Telemetry & Consent Controls */}
        <Card id="card-telemetry-consent" className="bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-500" />
                Manage Browser Telemetry Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Control whether anonymous 3D WebGL rendering metrics and creation funnel stability can be recorded.
              </p>
            </div>
            {isSaved && (
              <Badge className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Preferences Saved
              </Badge>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {/* Opt-In Option */}
            <div
              id="consent-opt-in"
              onClick={() => handleConsentChange("opt_in")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                consent === "opt_in"
                  ? "bg-pink-50/60 dark:bg-pink-950/40 border-pink-400 dark:border-pink-500 shadow-xs"
                  : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Full Anonymous Telemetry
                    </span>
                    <Badge variant="outline" size="sm" className="text-[10px] border-pink-400/40 text-pink-700 dark:text-pink-300">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                    Transmits anonymous 3D load times, device category (desktop/mobile), and template error codes so our engineers can fix WebGL glitches and optimize mobile frame rates.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    consent === "opt_in"
                      ? "border-pink-500 bg-pink-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                consent === "essential_only"
                  ? "bg-pink-50/60 dark:bg-pink-950/40 border-pink-400 dark:border-pink-500 shadow-xs"
                  : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Essential Telemetry Only
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                    Only records critical technical error alerts and fatal crash logs. Disables general performance and creation funnel tracking.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    consent === "essential_only"
                      ? "border-pink-500 bg-pink-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                consent === "opt_out"
                  ? "bg-pink-50/60 dark:bg-pink-950/40 border-pink-400 dark:border-pink-500 shadow-xs"
                  : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Strict Opt-Out (No Telemetry)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                    Completely silences and drops all analytics, performance, and funnel events before dispatch. No data leaves your browser.
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    consent === "opt_out"
                      ? "border-pink-500 bg-pink-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {consent === "opt_out" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Purge / Forget Me Action */}
        <Card id="card-forget-me" className="bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Browser Data Purge &amp; Session Reset (&quot;Forget Me&quot;)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                Immediately deletes all locally stored analytics cache, session tokens, and deduplication records from your browser and switches your preference to Strict Opt-Out.
              </p>
            </div>
            <Button
              id="btn-purge-analytics"
              onClick={handlePurge}
              variant="outline"
              size="sm"
              className="border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold whitespace-nowrap"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Purge Local Cache &amp; Reset
            </Button>
          </div>
          {isPurged && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>All local analytics identifiers and deduplication caches have been completely wiped.</span>
            </div>
          )}
        </Card>

        {/* Footer Note & Contact Support */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{BRAND_NAME} Privacy Framework • GDPR &amp; CCPA Compliant</span>
          </span>
          <Link
            href="/create"
            className="text-pink-600 dark:text-pink-400 hover:underline font-semibold"
          >
            Create a Safe Surprise →
          </Link>
        </div>

      </div>
    </div>
  );
}

