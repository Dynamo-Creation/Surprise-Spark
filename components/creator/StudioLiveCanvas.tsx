"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Monitor,
  RotateCcw,
  ExternalLink,
  Sparkles,
  ScreenShare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TemplateModel } from "@/lib/engine/types";
import { GoldenProposalConfig, GenericCelebrationConfig } from "./TemplatePersonalizeSection";

interface StudioLiveCanvasProps {
  template: TemplateModel;
  goldenConfig: GoldenProposalConfig;
  genericConfig: GenericCelebrationConfig;
  customAudioUrl?: string | null;
}

export function StudioLiveCanvas({
  template,
  goldenConfig,
  genericConfig,
  customAudioUrl,
}: StudioLiveCanvasProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [debouncedUrl, setDebouncedUrl] = useState<string>("");

  const isGoldenProposal = template.slug === "the-golden-proposal";
  const isLoveAnimation = template.slug === "love-animation";
  const supportsLandscape = isGoldenProposal || isLoveAnimation;

  // Auto-default Love Animation to landscape mode for best particle clarity
  useEffect(() => {
    if (isLoveAnimation) {
      setIsLandscape(true);
    }
  }, [isLoveAnimation]);

  // Build live preview URL with all synchronized parameters
  useEffect(() => {
    const handler = setTimeout(() => {
      let url = "";
      if (isGoldenProposal) {
        const params = new URLSearchParams({
          slug: "the-golden-proposal",
          recipientName: goldenConfig.recipientName || "Maya",
          endearment: goldenConfig.recipientEndearment || "My Everything",
          senderName: goldenConfig.senderName || "Alex",
          message: goldenConfig.loveQuote || "Of all the love stories in the world, ours will forever be my favorite.",
          question: goldenConfig.proposalQuestion || "Will You Be Mine?",
          dodgeText: goldenConfig.dodgeTooltipText || "Aise kaise mana kar sakti ho! 😉💖",
        });
        if (customAudioUrl) {
          params.set("audioUrl", customAudioUrl);
        }
        url = `/api/admin/templates/preview?${params.toString()}`;
      } else if (template.slug === "love-animation") {
        const params = new URLSearchParams({
          slug: "love-animation",
          recipientName: genericConfig.recipientName || "Maya",
          senderName: genericConfig.senderName || "Alex",
          message: genericConfig.message || "Wishing you the happiest celebration filled with love!",
        });
        if (customAudioUrl) {
          params.set("audioUrl", customAudioUrl);
        }
        url = `/api/admin/templates/preview?${params.toString()}`;
      } else {
        // Sweet Celebration or other engine template
        const params = new URLSearchParams({
          slug: template.slug,
          recipientName: genericConfig.recipientName || "Maya",
          senderName: genericConfig.senderName || "Alex",
          message: genericConfig.message || "Happy Birthday! Let's make this year unforgettable!",
        });
        url = `/api/admin/templates/preview?${params.toString()}`;
      }
      setDebouncedUrl(url);
    }, 280);

    return () => clearTimeout(handler);
  }, [
    isGoldenProposal,
    template.slug,
    goldenConfig,
    genericConfig,
    customAudioUrl,
  ]);

  return (
    <div className="flex flex-col h-full space-y-4 select-none">
      {/* Viewport Control Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <span>Live Interactive Canvas</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </span>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => {
                setDeviceMode("mobile");
                setIsLandscape(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                deviceMode === "mobile" && !isLandscape
                  ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>

            {/* Landscape Toggle for Golden Proposal & Love Animation */}
            {supportsLandscape && (
              <button
                type="button"
                onClick={() => {
                  setDeviceMode("mobile");
                  setIsLandscape(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === "mobile" && isLandscape
                    ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Cinematic Mobile Landscape View"
              >
                <ScreenShare className="w-3.5 h-3.5" />
                <span>Landscape</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                deviceMode === "desktop"
                  ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Reload Canvas */}
          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            aria-label="Replay preview"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors"
            title="Re-trigger preview animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Open In New Tab */}
          {debouncedUrl && (
            <Link href={debouncedUrl} target="_blank">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Simulation Stage */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 rounded-3xl bg-slate-950/90 dark:bg-black/80 border border-slate-800/80 shadow-2xl relative overflow-hidden min-h-[580px]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {deviceMode === "mobile" ? (
          /* Phone Frame Container */
          <div
            className={`relative transition-all duration-300 rounded-[44px] border-[10px] border-slate-900 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col ${
              isLandscape
                ? "w-[680px] max-w-full h-[380px]"
                : "w-[360px] sm:w-[380px] h-[720px] max-h-[85vh]"
            }`}
          >
            <BorderBeam
              size={isLandscape ? 300 : 250}
              duration={10}
              colorFrom={isGoldenProposal ? "#f59e0b" : "#ec4899"}
              colorTo={isGoldenProposal ? "#ec4899" : "#a855f7"}
            />

            {/* Dynamic Island Notch */}
            {!isLandscape ? (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 pointer-events-none" />
            ) : (
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-20 w-3.5 bg-slate-900 rounded-full z-30 pointer-events-none" />
            )}

            {/* Iframe Viewport */}
            {debouncedUrl ? (
              <iframe
                key={`${iframeKey}-${template.slug}`}
                src={debouncedUrl}
                className="w-full h-full border-none rounded-[32px] bg-slate-950"
                title={`${template.name} Live Preview`}
                allow="autoplay"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Generating live preview...
              </div>
            )}
          </div>
        ) : (
          /* Desktop Frame Container */
          <div className="relative w-full h-[620px] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            <BorderBeam
              size={360}
              duration={12}
              colorFrom={isGoldenProposal ? "#f59e0b" : "#ec4899"}
              colorTo="#38bdf8"
            />

            {/* Browser top pill */}
            <div className="h-8 bg-slate-900/90 border-b border-slate-800 flex items-center px-4 gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-400 font-mono ml-2">
                preview.surprisespark.app/{template.slug}
              </span>
            </div>

            {debouncedUrl ? (
              <iframe
                key={`${iframeKey}-${template.slug}`}
                src={debouncedUrl}
                className="w-full h-full border-none bg-slate-950"
                title={`${template.name} Live Desktop Preview`}
                allow="autoplay"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Generating live preview...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
