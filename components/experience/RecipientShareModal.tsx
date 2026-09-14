"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipientShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicId: string;
  recipientName?: string;
  senderName?: string;
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

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.745 6.628 4.471 8.618V24l4.088-2.245c1.077.299 2.222.464 3.441.464 6.627 0 12-4.974 12-11.108C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.964 3.26 6.559-6.963 3.131 3.26 5.888-3.26-6.559 6.963z" />
    </svg>
  );
}

export function RecipientShareModal({
  isOpen,
  onClose,
  publicId,
  recipientName = "Someone Special",
  senderName,
}: RecipientShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://surprisespark.app";
  const publicUrl = `${origin}/s/${publicId}`;

  const shareTitle = `A special celebration surprise for ${recipientName}! 🎁`;
  const shareText = `Look at this incredible interactive celebration surprise! Open it when you're ready 😉`;

  // WhatsApp
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} ${publicUrl}`
  )}`;

  // Facebook Web Share
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;

  // Messenger Web / Mobile Intent
  const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(publicUrl)}&app_id=123456789`;

  // Email Intent
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(
    `${shareText}\n\n${publicUrl}`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: publicUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleMessengerShare = () => {
    // Attempt messenger intent, fallback to clipboard copy if desktop or unsupported
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = messengerUrl;
    } else {
      // On desktop, fallback to copying link with clear feedback
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Share this Surprise 🎁
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Share this heartfelt memory with friends, family, and loved ones.
          </p>
        </div>

        {/* 1-Click Copy Link Box */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-pink-400 truncate select-all pl-1">
            {publicUrl}
          </span>
          <Button
            size="sm"
            variant={copied ? "primary" : "outline"}
            onClick={handleCopy}
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
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 text-emerald-400 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-[11px] font-bold">WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/40 text-blue-400 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <FacebookIcon className="w-5 h-5 text-blue-400" />
            <span className="text-[11px] font-bold">Facebook</span>
          </a>

          {/* Messenger */}
          <button
            onClick={handleMessengerShare}
            className="p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 text-indigo-400 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessengerIcon className="w-5 h-5 text-indigo-400" />
            <span className="text-[11px] font-bold">Messenger</span>
          </button>

          {/* Email */}
          <a
            href={emailUrl}
            className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Mail className="w-5 h-5 text-purple-300" />
            <span className="text-[11px] font-bold">Email</span>
          </a>
        </div>

        {/* Web Share API on mobile */}
        <div>
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>More Sharing Options</span>
          </button>
        </div>
      </div>
    </div>
  );
}
