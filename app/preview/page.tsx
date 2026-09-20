"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Smartphone, Monitor, ArrowLeft, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEMPLATES_LIST = [
  { slug: "sweet-celebration", name: "Sweet Celebration 💌" },
  { slug: "love-animation", name: "Love Animation 💖" },
];

function PreviewContent() {
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") || "sweet-celebration";

  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [iframeKey, setIframeKey] = useState(0);

  // Synchronize active template when URL changes
  React.useEffect(() => {
    const t = searchParams.get("template");
    if (t && t !== activeTemplate) {
      setActiveTemplate(t);
      setIframeKey((k) => k + 1);
    }
  }, [searchParams, activeTemplate]);

  const previewUrl =
    activeTemplate === "love-animation"
      ? "/api/admin/templates/preview?slug=love-animation"
      : `/s/sample-birthday-123?template=${activeTemplate}`;

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/templates">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                All Templates
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Surprise Live Preview <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              </h1>
              <p className="text-[11px] text-slate-400">
                Interactive recipient view test across all 8 birthday templates
              </p>
            </div>
          </div>

          {/* Device Switcher & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  deviceMode === "mobile"
                    ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile (390×844)
              </button>
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  deviceMode === "desktop"
                    ? "bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop Full
              </button>
            </div>

            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              aria-label="Reload preview"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <Link href={previewUrl} target="_blank">
              <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Open in New Tab
              </Button>
            </Link>

            <Link href={`/create?template=${activeTemplate}`}>
              <Button variant="primary" size="sm">
                Use Template
              </Button>
            </Link>
          </div>
        </div>

        {/* 8-Template Quick Switcher Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-850 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            Templates:
          </span>
          {TEMPLATES_LIST.map((tpl) => {
            const isActive = activeTemplate === tpl.slug;
            return (
              <button
                key={tpl.slug}
                onClick={() => {
                  setActiveTemplate(tpl.slug);
                  setIframeKey((k) => k + 1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-pink-500 text-white shadow-xs font-semibold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tpl.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Device Viewport Simulation */}
      <div className="flex items-center justify-center min-h-[720px] bg-slate-100 dark:bg-slate-950/80 rounded-3xl p-4 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        {deviceMode === "mobile" ? (
          /* Phone Frame Container ~390x844 */
          <div className="relative w-[390px] h-[780px] rounded-[48px] border-[10px] border-slate-900 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Phone Notch/Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30" />
            <iframe
              key={`${iframeKey}-${activeTemplate}`}
              src={previewUrl}
              className="w-full h-full border-none rounded-[38px]"
              title="Mobile Surprise Preview"
            />
          </div>
        ) : (
          /* Desktop Frame Container */
          <div className="w-full h-[720px] rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
            <iframe
              key={`${iframeKey}-${activeTemplate}`}
              src={previewUrl}
              className="w-full h-full border-none"
              title="Desktop Surprise Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
