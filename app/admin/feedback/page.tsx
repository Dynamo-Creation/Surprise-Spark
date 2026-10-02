"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  RotateCw,
  Loader2,
  Mail,
  CheckCircle2,
  Clock,
  Archive,
  Filter,
  User,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFeedback {
  id: string;
  user_id?: string;
  user_name: string;
  user_email: string;
  category: "bug" | "suggestion" | "general";
  rating?: "broken" | "confused" | "neutral" | "good" | "loved";
  message: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  admin_notes?: string;
  created_at: string;
}

const RATING_EMOJIS: Record<string, { emoji: string; label: string }> = {
  broken: { emoji: "😡", label: "Broken" },
  confused: { emoji: "😕", label: "Confused" },
  neutral: { emoji: "😐", label: "Okay" },
  good: { emoji: "😊", label: "Good" },
  loved: { emoji: "😍", label: "Loved It" },
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/feedback");
      const json = await res.json();
      if (json.success && Array.isArray(json.feedbacks)) {
        setFeedbacks(json.feedbacks);
      }
    } catch (err) {
      console.error("[Admin Feedback] Failed to load feedbacks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: UserFeedback["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("[Admin Feedback] Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredFeedbacks = feedbacks.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.user_name?.toLowerCase().includes(q);
      const matchEmail = item.user_email?.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      return matchName || matchEmail || matchMsg;
    }
    return true;
  });

  const newCount = feedbacks.filter((f) => f.status === "new").length;
  const inProgressCount = feedbacks.filter((f) => f.status === "in_progress").length;
  const resolvedCount = feedbacks.filter((f) => f.status === "resolved").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              User Feedback & Bug Reports
            </h1>
            {newCount > 0 && (
              <Badge variant="primary" size="sm" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                {newCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review bug reports, suggestions, and messages submitted directly by platform creators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFeedbacks}
            disabled={isLoading}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            className="text-xs border-white/10 text-slate-300 hover:text-white"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-slate-900/60 border-white/[0.08]">
          <p className="text-[11px] font-semibold text-slate-400">Total Submissions</p>
          <p className="text-2xl font-black text-white mt-0.5">{feedbacks.length}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-white/[0.08]">
          <p className="text-[11px] font-semibold text-pink-400">New / Unread</p>
          <p className="text-2xl font-black text-pink-400 mt-0.5">{newCount}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-white/[0.08]">
          <p className="text-[11px] font-semibold text-amber-400">In Progress</p>
          <p className="text-2xl font-black text-amber-400 mt-0.5">{inProgressCount}</p>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-white/[0.08]">
          <p className="text-[11px] font-semibold text-emerald-400">Resolved</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">{resolvedCount}</p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/40 border border-white/[0.08]">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by user, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-950/60 border-white/10 text-xs h-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            {["all", "new", "in_progress", "resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all capitalize ${
                  statusFilter === st
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "in_progress" ? "In Progress" : st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            {[
              { id: "all", label: "All Types" },
              { id: "bug", label: "🐛 Bugs" },
              { id: "suggestion", label: "💡 Ideas" },
              { id: "general", label: "💬 General" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-pink-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-xs">Loading feedback entries...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-white/[0.06] bg-slate-900/30 p-8 space-y-2">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Feedback Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "No feedback entries match your current search or filters."
              : "No users have submitted feedback yet. New submissions will appear here live."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((item) => {
            const ratingInfo = item.rating ? RATING_EMOJIS[item.rating] : null;

            return (
              <Card
                key={item.id}
                className="p-5 bg-slate-900/70 border-white/[0.08] hover:border-white/[0.15] transition-all space-y-3.5"
              >
                {/* Header: User Info & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {item.user_name ? item.user_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {item.user_name || "Anonymous Creator"}
                        </span>
                        {/* Category Badge */}
                        <Badge
                          variant="secondary"
                          size="sm"
                          className={
                            item.category === "bug"
                              ? "bg-rose-950/70 text-rose-300 border-rose-500/30"
                              : item.category === "suggestion"
                              ? "bg-amber-950/70 text-amber-300 border-amber-500/30"
                              : "bg-indigo-950/70 text-indigo-300 border-indigo-500/30"
                          }
                        >
                          {item.category === "bug"
                            ? "🐛 Bug"
                            : item.category === "suggestion"
                            ? "💡 Idea"
                            : "💬 General"}
                        </Badge>

                        {/* Rating Tag */}
                        {ratingInfo && (
                          <span
                            title={`Experience rating: ${ratingInfo.label}`}
                            className="px-2 py-0.5 rounded-full text-xs bg-slate-800 border border-white/10"
                          >
                            {ratingInfo.emoji} {ratingInfo.label}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{item.user_email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        item.status === "new"
                          ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                          : item.status === "in_progress"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : item.status === "resolved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-white/10"
                      }`}
                    >
                      {item.status === "in_progress" ? "In Progress" : item.status}
                    </span>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.04]">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Change status:</span>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "new")}
                      disabled={item.status === "new" || updatingId === item.id}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold text-pink-300 hover:bg-pink-950/40 disabled:opacity-30 cursor-pointer"
                    >
                      New
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "in_progress")}
                      disabled={item.status === "in_progress" || updatingId === item.id}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold text-amber-300 hover:bg-amber-950/40 disabled:opacity-30 cursor-pointer"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item.id, "resolved")}
                      disabled={item.status === "resolved" || updatingId === item.id}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 hover:bg-emerald-950/40 disabled:opacity-30 cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  </div>

                  <a
                    href={`mailto:${encodeURIComponent(item.user_email)}?subject=${encodeURIComponent(
                      "SurpriseSpark: Regarding your feedback"
                    )}&body=${encodeURIComponent(
                      `Hi ${item.user_name || "there"},\n\nThank you for reaching out to SurpriseSpark about your recent feedback:\n"${item.message}"\n\n`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply to User</span>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
