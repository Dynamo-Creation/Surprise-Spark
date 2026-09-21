"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { incrementShareCount } from "@/lib/creator/draftStorage";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicId: string;
  recipientName: string;
  senderName?: string;
  templateSlug?: string;
  templateName?: string;
  customMessage?: string;
  endearment?: string;
  question?: string;
  dodgeText?: string;
  audioUrl?: string;
  photos?: string[];
  onShareSuccess?: () => void;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ShareModal({
  isOpen,
  onClose,
  publicId,
  recipientName,
  senderName,
  templateSlug,
  templateName,
  customMessage,
  endearment,
  question,
  dodgeText,
  audioUrl,
  photos,
  onShareSuccess,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [instagramToast, setInstagramToast] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://surprisespark.app";

  // Construct comprehensive URL parameters so any recipient opening on any device sees the exact template & personalization
  const qp = new URLSearchParams();
  if (templateSlug) qp.set("template", templateSlug);
  if (recipientName) qp.set("name", recipientName);
  if (senderName) qp.set("sender", senderName);
  if (customMessage) qp.set("message", customMessage);
  if (endearment) qp.set("endearment", endearment);
  if (question) qp.set("question", question);
  if (dodgeText) qp.set("dodgeText", dodgeText);
  if (audioUrl) qp.set("audioUrl", audioUrl);
  if (photos && photos.length > 0) qp.set("photos", photos.join(","));

  const queryString = qp.toString();
  const publicUrl = queryString ? `${origin}/s/${publicId}?${queryString}` : `${origin}/s/${publicId}`;

  const isProposal = templateSlug === "the-golden-proposal";

  // WhatsApp text per specification:
  const whatsappMessageText = isProposal
    ? `I made something special from my heart for you 🌹 Open it when you're ready 💕\n\n${publicUrl}`
    : `I made something special for you 🎁 Open it when you're ready 😉\n\n${publicUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessageText)}`;

  // Facebook Share URL
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;

  const logShare = () => {
    incrementShareCount(publicId);
    onShareSuccess?.();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    logShare();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isProposal
            ? `A Heartfelt Proposal Surprise for ${recipientName}! 💍`
            : `A Special Surprise for ${recipientName}! 🎁`,
          text: isProposal
            ? `I made something special from my heart for you 🌹 Open it when you're ready 💕`
            : `I made something special for you 🎁 Open it when you're ready 😉`,
          url: publicUrl,
        });
        logShare();
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(publicUrl);
    setInstagramToast(true);
    logShare();
    setTimeout(() => setInstagramToast(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/25 text-2xl">
            {isProposal ? "💍" : <Sparkles className="w-7 h-7" />}
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {isProposal ? "Your Golden Proposal is ready! 🌹" : "Your surprise is ready! 🎉"}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Personalized for <strong className="text-pink-400">{recipientName}</strong>. Send the link below for an unforgettable moment!
          </p>
        </div>

        {/* Link Field with 1-click Copy */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-pink-400 truncate select-all">
            {publicUrl}
          </span>
          <Button
            size="sm"
            variant={copied ? "primary" : "outline"}
            onClick={handleCopyLink}
            className="shrink-0 text-xs gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>
        </div>

        {/* Sharing Channels Grid */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Share Directly Via
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={logShare}
              className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={logShare}
              className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 text-blue-400 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FacebookIcon className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold">Facebook</span>
            </a>

            {/* Instagram */}
            <button
              onClick={handleInstagramShare}
              className="p-3 rounded-2xl bg-gradient-to-br from-pink-950/40 to-purple-950/40 hover:from-pink-900/50 hover:to-purple-900/50 border border-pink-800/40 text-pink-400 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <InstagramIcon className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-bold">Instagram</span>
            </button>

            {/* Native Share */}
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold">More</span>
            </button>
          </div>
        </div>

        {/* Instagram Guidance Toast */}
        {instagramToast && (
          <div className="p-3 rounded-2xl bg-pink-950/80 border border-pink-700/60 text-pink-200 text-xs text-center space-y-1 animate-in fade-in duration-150">
            <p className="font-bold">✨ Link copied to clipboard!</p>
            <p className="text-[11px] text-pink-300">
              Open Instagram and paste this link into your Story (using the Link sticker) or send via Direct Message.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <Link
            href={publicUrl}
            target="_blank"
            className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Experience In New Tab</span>
          </Link>

          <Link href="/dashboard">
            <Button size="sm" variant="secondary" onClick={onClose} className="text-xs cursor-pointer">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
