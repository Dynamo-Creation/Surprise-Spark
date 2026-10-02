"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = "bug" | "suggestion" | "general";
type FeedbackRating = "broken" | "confused" | "neutral" | "good" | "loved";

const CATEGORIES: { id: FeedbackCategory; label: string; icon: string; desc: string }[] = [
  { id: "bug", label: "Bug / Glitch", icon: "🐛", desc: "Something isn't working as expected" },
  { id: "suggestion", label: "Idea / Suggestion", icon: "💡", desc: "A feature or design improvement" },
  { id: "general", label: "General Feedback", icon: "💬", desc: "Thoughts, praise, or questions" },
];

const RATINGS: { id: FeedbackRating; label: string; emoji: string }[] = [
  { id: "broken", label: "Broken", emoji: "😡" },
  { id: "confused", label: "Confused", emoji: "😕" },
  { id: "neutral", label: "Okay", emoji: "😐" },
  { id: "good", label: "Good", emoji: "😊" },
  { id: "loved", label: "Loved It", emoji: "😍" },
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user, profile } = useAuth();

  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [rating, setRating] = useState<FeedbackRating | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (profile?.fullName) {
        setName(profile.fullName);
      } else if (user?.email) {
        setName(user.email.split("@")[0]);
      }
      if (user?.email) {
        setEmail(user.email);
      }
      setIsSuccess(false);
      setErrorMsg(null);
    }
  }, [isOpen, user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg("Please describe your feedback (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: name.trim(),
          userEmail: email.trim(),
          category,
          rating,
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMsg(data?.error || "Failed to submit feedback. Please try again.");
        return;
      }

      setIsSuccess(true);
      setMessage("");
      setRating(undefined);

      // Auto close after 2.5s on success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2500);
    } catch {
      setErrorMsg("Network error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="lg"
      className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl"
    >
      {/* Header Accent */}
      <div className="p-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Send Feedback to Admin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Found a bug, glitch, or have an idea? We read every message.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {isSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Feedback Received!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Thank you for helping us make SurpriseSpark better. Our team has received your report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                What type of feedback is this?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      category === c.id
                        ? "bg-pink-50/80 dark:bg-pink-950/50 border-pink-500 text-pink-700 dark:text-pink-300 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-xs font-bold text-center leading-tight">
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                How is your experience overall? <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center justify-between gap-1 p-2 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
                {RATINGS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRating(r.id)}
                    className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      rating === r.id
                        ? "bg-white dark:bg-slate-800 shadow-sm border border-pink-500/40 scale-105"
                        : "hover:bg-white/60 dark:hover:bg-slate-800/60 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Message Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message / Details
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.length} / 2000
                </span>
              </div>
              <textarea
                rows={4}
                required
                maxLength={2000}
                placeholder={
                  category === "bug"
                    ? "Explain what went wrong or what glitched..."
                    : category === "suggestion"
                    ? "Tell us what feature or change you'd like to see..."
                    : "Share your thoughts or questions..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || message.trim().length < 5}
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  )
                }
                className="text-xs font-bold px-4 cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Submit to Admin"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
