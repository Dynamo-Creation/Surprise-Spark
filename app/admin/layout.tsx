"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Layers,
  Film,
  Folder,
  Box,
  Smile,
  Palette,
  Music,
  Gift,
  BarChart3,
  FileText,
  Settings,
  ShieldCheck,
  Menu,
  X,
  Shield,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/templates", label: "Templates", icon: Layers },
  { href: "/admin/scenes", label: "Scenes", icon: Film },
  { href: "/admin/assets", label: "Assets", icon: Folder },
  { href: "/admin/objects", label: "3D Objects", icon: Box },
  { href: "/admin/characters", label: "Characters", icon: Smile },
  { href: "/admin/themes", label: "Themes", icon: Palette },
  { href: "/admin/music", label: "Music", icon: Music },
  { href: "/admin/surprises", label: "Surprises", icon: Gift },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Topbar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-sm text-white tracking-tight">SurpriseSpark</span>
            <span className="text-[10px] text-purple-400 font-bold ml-1.5 uppercase">CMS</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Banner */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-white tracking-tight">SurpriseSpark</span>
              </div>
              <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Production CMS
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex text-[10px] uppercase font-bold">
            Live
          </Badge>
        </div>

        {/* Security Role Badge */}
        <div className="mx-4 my-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-white leading-none">Super Administrator</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Full System Access</p>
            </div>
          </div>
          <Badge variant="outline" size="sm" className="text-[10px] border-purple-500/30 text-purple-300">
            RBAC
          </Badge>
        </div>

        {/* 14 Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/25"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick External Links */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            href="/create"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Creator Studio
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-purple-400" />
              Public Platform
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        </div>
      </aside>

      {/* Main CMS Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Environment:
            </span>
            <Badge variant="outline" size="sm" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/20">
              Production • v1.0.9
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                Audit Trail
              </Button>
            </Link>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs text-slate-400 font-medium">
              Logged in as <strong className="text-white">admin@surprisespark.app</strong>
            </span>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
