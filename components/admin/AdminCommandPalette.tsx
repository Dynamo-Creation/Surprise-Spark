"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Layers,
  Gift,
  Users,
  BarChart3,
  Music,
  FileText,
  ShieldCheck,
  Settings,
  Sparkles,
  ArrowRight,
  Plus,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Templates" | "Actions";
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  action?: () => void;
  keywords?: string[];
}

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMode?: () => void;
}

export function AdminCommandPalette({
  isOpen,
  onClose,
  onToggleMode,
}: AdminCommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dash",
      title: "Executive Dashboard",
      category: "Navigation",
      icon: LayoutDashboard,
      href: "/admin",
      keywords: ["home", "overview", "kpis", "telemetry"],
    },
    {
      id: "nav-templates",
      title: "Templates Management",
      category: "Navigation",
      icon: Layers,
      href: "/admin/templates",
      keywords: ["catalog", "customize", "photo slots", "audio duration"],
    },
    {
      id: "nav-surprises",
      title: "Surprise Instances",
      category: "Navigation",
      icon: Gift,
      href: "/admin/surprises",
      keywords: ["celebrations", "links", "unboxings"],
    },
    {
      id: "nav-users",
      title: "Users & Creator Accounts",
      category: "Navigation",
      icon: Users,
      href: "/admin/users",
      keywords: ["accounts", "creators", "suspended"],
    },
    {
      id: "nav-analytics",
      title: "Product Analytics & Funnel",
      category: "Navigation",
      icon: BarChart3,
      href: "/admin/analytics",
      keywords: ["retention", "conversion", "dau", "mau"],
    },
    {
      id: "nav-music",
      title: "Music & Audio Catalog",
      category: "Navigation",
      icon: Music,
      href: "/admin/music",
      keywords: ["soundtracks", "sfx", "audio presets"],
    },
    {
      id: "nav-reports",
      title: "Data Reports & CSV Exports",
      category: "Navigation",
      icon: FileText,
      href: "/admin/reports",
      keywords: ["export", "download", "csv", "json"],
    },
    {
      id: "nav-audit",
      title: "Audit Trail & Compliance",
      category: "Navigation",
      icon: ShieldCheck,
      href: "/admin/audit-logs",
      keywords: ["history", "logs", "mutations"],
    },
    {
      id: "nav-settings",
      title: "System Settings & Thresholds",
      category: "Navigation",
      icon: Settings,
      href: "/admin/settings",
      keywords: ["limits", "upload size", "audio duration"],
    },

    // Actions
    {
      id: "act-create",
      title: "Launch Creator Studio (/create)",
      category: "Actions",
      icon: Plus,
      href: "/create",
      keywords: ["new surprise", "make", "studio"],
    },
    {
      id: "act-toggle-mode",
      title: "Toggle Telemetry Dataset (Live / Demo)",
      category: "Actions",
      icon: Sparkles,
      action: () => {
        if (onToggleMode) onToggleMode();
        onClose();
      },
      keywords: ["switch mode", "demo showcase", "live data"],
    },
    {
      id: "tpl-sweet",
      title: "Template: Sweet Celebration 💌 (1 Photo, 30s Audio)",
      category: "Templates",
      icon: Layers,
      href: "/admin/templates?search=sweet",
      keywords: ["sweet celebration", "birthday", "polaroid"],
    },
  ];

  const filtered = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const matchesTitle = item.title.toLowerCase().includes(q);
    const matchesCategory = item.category.toLowerCase().includes(q);
    const matchesKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return matchesTitle || matchesCategory || matchesKeywords;
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          if (selected.href) {
            router.push(selected.href);
            onClose();
          } else if (selected.action) {
            selected.action();
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/[0.12] rounded-2xl shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page, template, or keyword..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href);
                      onClose();
                    } else if (item.action) {
                      item.action();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-purple-400"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-600"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Footer hint */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span>Use ↑ ↓ arrows to navigate</span>
          <span>Press ↵ to select</span>
        </div>
      </div>
    </div>
  );
}
