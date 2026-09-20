"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Bell,
  CheckCircle2,
  Gift,
  Music,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: "unboxing" | "audio" | "creator" | "system";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Surprise Unboxed by Recipient",
    desc: "Birthday wish unboxed in London, UK with 100% completion rate",
    time: "5m ago",
    read: false,
    type: "unboxing",
  },
  {
    id: "notif-2",
    title: "Custom Song Trimmed",
    desc: "A creator trimmed a 30-second audio track for 'Sweet Celebration'",
    time: "25m ago",
    read: false,
    type: "audio",
  },
  {
    id: "notif-3",
    title: "New Creator Account",
    desc: "Amina Al-Sayed verified her email and created 2 surprises",
    time: "1h ago",
    read: true,
    type: "creator",
  },
  {
    id: "notif-4",
    title: "Telemetry Sync Complete",
    desc: "Platform metrics synced to edge memory successfully",
    time: "3h ago",
    read: true,
    type: "system",
  },
];

interface AdminNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationsDrawer({
  isOpen,
  onClose,
}: AdminNotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-sm bg-slate-900 border-l border-white/[0.08] text-white shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-sm">Notifications & Events</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" size="sm" className="bg-purple-900/60 text-purple-300 text-[10px]">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-white/[0.04] bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={markAllAsRead}
            className="hover:text-purple-400 transition-colors cursor-pointer"
          >
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="hover:text-rose-400 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No recent notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-all ${
                  notif.read
                    ? "bg-slate-950/30 border-white/[0.04] opacity-70"
                    : "bg-slate-950/80 border-purple-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-tight">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{notif.desc}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950/40">
          <Link href="/admin/audit-logs" onClick={onClose}>
            <Button variant="outline" size="sm" className="w-full text-xs border-white/[0.1] text-slate-300">
              View Audit Trail Logs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
