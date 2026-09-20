"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Sparkles,
  Play,
  Volume2,
  Sliders,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface AdminTemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateSlug: string;
  templateName: string;
  category?: string;
  customPreviewHtml?: string; // For instant client-side preview before upload
  isNewlyUploaded?: boolean;
}

export function AdminTemplatePreviewModal({
  isOpen,
  onClose,
  templateSlug,
  templateName,
  category = "Birthday",
  customPreviewHtml,
  isNewlyUploaded = false,
}: AdminTemplatePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop" | "tablet">("mobile");
  const [keyCounter, setKeyCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Live personalization testing
  const [recipientName, setRecipientName] = useState("Sarah");
  const [senderName, setSenderName] = useState("Alex");
  const [message, setMessage] = useState("Wishing you the happiest celebration filled with love and magic!");
  const [showConfig, setShowConfig] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (customPreviewHtml) {
      const blob = new Blob([customPreviewHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setBlobUrl(null);
    }
  }, [customPreviewHtml]);

  if (!isOpen) return null;

  // Build target preview URL
  const previewQuery = new URLSearchParams({
    slug: templateSlug,
    recipientName,
    senderName,
    message,
    v: String(keyCounter),
  }).toString();

  const previewUrl = blobUrl ? `${blobUrl}#${keyCounter}` : `/api/admin/templates/preview?${previewQuery}`;

  const handleDeviceSwitch = (mode: "mobile" | "desktop" | "tablet") => {
    setDeviceMode(mode);
    setIsLoading(true);
    setKeyCounter((prev) => prev + 1);
  };

  const handleRestart = () => {
    setIsLoading(true);
    setKeyCounter((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full ${deviceMode === "desktop" ? "max-w-6xl" : "max-w-5xl"} h-[92vh] bg-slate-950 border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          {/* Title & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">{templateName}</h3>
                <Badge variant="secondary" size="sm" className="bg-purple-950/60 text-purple-300 border-purple-800/40 text-[10px] uppercase">
                  {category}
                </Badge>
                {isNewlyUploaded && (
                  <Badge variant="success" size="sm" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    ✨ Just Uploaded
                  </Badge>
                )}
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Preview
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{templateSlug}</p>
            </div>
          </div>

          {/* Device Frame Switcher */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={() => handleDeviceSwitch("mobile")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === "mobile"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Mobile Portrait View (380 x 740)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceSwitch("tablet")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === "tablet"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tablet View (680 x 780)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeviceSwitch("desktop")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === "desktop"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Desktop Browser View (16:9 HD)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
              className={`h-8 px-2.5 text-xs border-white/[0.1] text-slate-300 hover:text-white cursor-pointer ${
                showConfig ? "bg-purple-900/40 text-purple-300 border-purple-500/40" : ""
              }`}
              title="Test Personalization Variables"
            >
              <Sliders className="w-3.5 h-3.5 mr-1 text-purple-400" />
              <span className="hidden sm:inline">Personalize</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="h-8 px-2.5 text-xs border-white/[0.1] text-slate-300 hover:text-white cursor-pointer"
              title="Restart Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Restart</span>
            </Button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Open Standalone in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Personalization Testing Drawer */}
        {showConfig && (
          <div className="p-3 bg-slate-900 border-b border-white/[0.08] flex flex-wrap items-center gap-3 animate-in slide-in-from-top duration-150 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Recipient:</span>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="h-7 w-28 bg-slate-950 text-xs text-white border-white/[0.08]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Sender:</span>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="h-7 w-28 bg-slate-950 text-xs text-white border-white/[0.08]"
              />
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Message:</span>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-7 flex-1 bg-slate-950 text-xs text-white border-white/[0.08]"
              />
            </div>

            <Button
              size="sm"
              onClick={handleRestart}
              className="h-7 px-3 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
            >
              Apply Changes
            </Button>
          </div>
        )}

        {/* Iframe Viewport Area */}
        <div className="flex-1 bg-[#050206] flex items-center justify-center p-3 relative overflow-hidden">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs text-slate-300 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold">Running Live Animation Engine...</p>
            </div>
          )}

          {/* Screen Shell */}
          <div
            className={`transition-all duration-300 relative shadow-2xl overflow-hidden flex flex-col ${
              deviceMode === "mobile"
                ? "w-[380px] h-[740px] max-h-[80vh] rounded-[40px] border-4 border-slate-700 bg-black shrink-0"
                : deviceMode === "tablet"
                ? "w-[560px] h-[746px] max-h-[80vh] aspect-[3/4] rounded-[28px] border-4 border-slate-700 bg-black shrink-0"
                : "w-full max-w-[1020px] h-[640px] max-h-[78vh] rounded-2xl border border-slate-700 bg-black shadow-2xl shrink-0"
            }`}
          >
            {/* Desktop Mockup Browser Titlebar */}
            {deviceMode === "desktop" && (
              <div className="h-9 px-3.5 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="px-3 py-1 rounded-md bg-slate-950 border border-white/[0.06] text-[10px] text-slate-400 font-mono flex items-center gap-1.5 max-w-sm truncate">
                  <span className="text-purple-400">https://</span>
                  <span>surprise.gift/preview/{templateSlug}</span>
                </div>
                <div className="w-16 text-right">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Desktop</span>
                </div>
              </div>
            )}

            {/* Tablet Camera indicator */}
            {deviceMode === "tablet" && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rounded-full z-20 pointer-events-none border border-slate-700/60" />
            )}

            {/* Mobile Notch for Mobile Frame */}
            {deviceMode === "mobile" && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20 pointer-events-none" />
            )}

            {/* Live Animation Iframe */}
            <iframe
              ref={iframeRef}
              key={previewUrl}
              src={previewUrl}
              onLoad={() => setIsLoading(false)}
              className="flex-1 w-full h-full border-0 bg-black"
              allow="autoplay; camera; microphone"
              title="Live Template Animation Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
