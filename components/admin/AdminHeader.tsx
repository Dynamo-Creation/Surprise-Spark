"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Database,
  Menu,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AdminMetricsMode } from "@/lib/admin/adminStore";

interface AdminHeaderProps {
  metricsMode: AdminMetricsMode;
  onToggleMode: (mode: AdminMetricsMode) => void;
  onOpenCommandPalette: () => void;
  onToggleMobileMenu: () => void;
}

export function AdminHeader({
  metricsMode,
  onToggleMode,
  onOpenCommandPalette,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Generate breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbName =
    segments.length > 1
      ? segments[1]
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ")
      : "Dashboard";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08]">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin"
            className="text-slate-400 hover:text-white transition-colors font-medium flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="font-bold text-white tracking-wide">{breadcrumbName}</span>
        </div>
      </div>

      {/* Center/Right: Quick Search, Mode Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Button (Ctrl+K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] hover:border-purple-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs cursor-pointer shadow-xs"
        >
          <Search className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/[0.06]">
            ⌘K
          </kbd>
        </button>

        {/* Live Database Connected Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Live Supabase Connected</span>
          <span className="sm:hidden">Live</span>
        </div>



        <div className="hidden sm:block h-5 w-px bg-white/[0.08]" />

        {/* User profile & exit */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-white leading-tight">
              {user?.email?.split("@")[0] || "Super Admin"}
            </span>
            <span className="text-[10px] text-purple-400 font-medium">Administrator</span>
          </div>

          <Link href="/" title="Exit CMS to Platform">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
