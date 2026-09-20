"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gift,
  Eye,
  Mic,
  Music,
  Clock,
  Sparkles,
  UserPlus,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { listDrafts } from "@/lib/creator/draftStorage";

interface ActivityItem {
  id: string;
  type: "unboxing" | "created" | "audio" | "user" | "audit";
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeText: string;
  link?: string;
}

export function AdminActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Generate real activity from drafts + recent simulated events
    const drafts = listDrafts();
    const realItems: ActivityItem[] = drafts.slice(0, 3).map((d) => ({
      id: `act-draft-${d.publicId}`,
      type: "created",
      title: `Surprise for "${d.recipientName}" ready`,
      subtitle: `Template: ${d.templateSlug} • ${d.photos?.length || 0} photo(s) attached`,
      timeAgo: "Recently",
      icon: Gift,
      color: "from-pink-500 to-rose-500",
      badgeText: d.status.toUpperCase(),
      link: `/s/${d.publicId}`,
    }));

    const defaultItems: ActivityItem[] = [
      {
        id: "act-1",
        type: "unboxing",
        title: "Celebration Curtain Unboxed",
        subtitle: 'Recipient "Elena Rostova" unlocked a Sweet Celebration surprise with audio wish',
        timeAgo: "2m ago",
        icon: Eye,
        color: "from-emerald-500 to-teal-500",
        badgeText: "UNBOXED",
      },
      {
        id: "act-2",
        type: "audio",
        title: "Custom Song Trimmed & Attached",
        subtitle: 'Creator trimmed 30s custom audio for "Marcus\'s Birthday Bash"',
        timeAgo: "14m ago",
        icon: Music,
        color: "from-purple-500 to-indigo-500",
        badgeText: "AUDIO TRIM",
      },
      {
        id: "act-3",
        type: "user",
        title: "New Creator Account Registered",
        subtitle: "Amina Al-Sayed joined from Instagram viral referral link",
        timeAgo: "32m ago",
        icon: UserPlus,
        color: "from-blue-500 to-cyan-500",
        badgeText: "NEW USER",
      },
      {
        id: "act-4",
        type: "audit",
        title: "Template Cloned by Admin",
        subtitle: "Sweet Celebration duplicated to custom corporate edition",
        timeAgo: "1h ago",
        icon: ShieldCheck,
        color: "from-amber-500 to-orange-500",
        badgeText: "AUDIT",
      },
    ];

    setActivities([...realItems, ...defaultItems]);
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border border-white/[0.08] p-5 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Live Platform Event Stream
          </h3>
        </div>
        <Link
          href="/admin/audit-logs"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          View Full Audit Trail →
        </Link>
      </div>

      <div className="space-y-2.5">
        {activities.slice(0, 5).map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-3 rounded-xl bg-slate-950/50 border border-white/[0.04] hover:border-purple-500/30 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shrink-0 shadow-sm`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {act.title}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {act.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  size="sm"
                  className="text-[9px] font-mono border-white/[0.1] text-slate-300 bg-white/[0.02]"
                >
                  {act.badgeText}
                </Badge>
                {act.link && (
                  <Link
                    href={act.link}
                    target="_blank"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
