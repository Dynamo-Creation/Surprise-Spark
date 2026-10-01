"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gift,
  Eye,
  Music,
  Clock,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  type: "created" | "published";
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeText: string;
  link?: string;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export function AdminActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRealActivity() {
      try {
        const res = await fetch("/api/admin/surprises");
        const json = await res.json();
        if (json.success && Array.isArray(json.surprises)) {
          const items: ActivityItem[] = json.surprises.slice(0, 6).map((s: any) => {
            const publicId = s.public_id || s.publicId || "celebration";
            const recipientName = s.recipient_name || s.recipientName || "Friend";
            const senderName = s.sender_name || s.senderName || "Creator";
            const templateSlug = s.template_slug || s.templateSlug || "sweet-celebration";
            const createdAt = s.created_at || s.createdAt || new Date().toISOString();

            return {
              id: `act-${publicId}`,
              type: "published",
              title: `Celebration for "${recipientName}"`,
              subtitle: `Template: ${templateSlug} • By ${senderName}`,
              timeAgo: formatRelativeTime(createdAt),
              icon: Gift,
              color: "from-purple-500 to-pink-500",
              badgeText: "PUBLISHED",
              link: `/s/${publicId}`,
            };
          });
          setActivities(items);
        }
      } catch (err) {
        console.warn("[Admin Activity Feed] Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRealActivity();
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border border-white/[0.08] p-5 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Live Stream Activity
          </h3>
        </div>
        <Badge variant="secondary" size="sm" className="bg-slate-800 text-[10px] text-slate-300 font-mono">
          Real Database Feed
        </Badge>
      </div>

      <div className="space-y-3.5">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
            Syncing live activity stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No real surprises published yet.
          </div>
        ) : (
          activities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.04]"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md text-white`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.timeAgo}
                      </span>
                      {item.link && (
                        <Link
                          href={item.link}
                          target="_blank"
                          className="text-[10px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                        >
                          View link <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  size="sm"
                  className="text-[9px] bg-slate-800/80 text-purple-300 border-white/[0.06] shrink-0"
                >
                  {item.badgeText}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
