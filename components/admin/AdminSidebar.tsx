"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Layers,
  Gift,
  Music,
  Users,
  ShieldCheck,
  Settings,
  Shield,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavGroup {
  category: string;
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badge?: string;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: "Pulse & Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    category: "Experiences",
    items: [
      { href: "/admin/templates", label: "Templates", icon: Layers },
      { href: "/admin/surprises", label: "Surprises", icon: Gift },
      { href: "/admin/music", label: "Music & Audio", icon: Music },
    ],
  },
  {
    category: "Audience",
    items: [
      { href: "/admin/users", label: "Users & Creators", icon: Users },
    ],
  },
  {
    category: "System",
    items: [
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export function AdminSidebar({
  mobileMenuOpen,
  onCloseMobileMenu,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#080b13]/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Brand Banner */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-black text-sm text-white tracking-tight block truncate">
                  SurpriseSpark
                </span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                  Executive CMS
                </span>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map((group) => (
            <div key={group.category}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  {group.category}
                </p>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobileMenu}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative group ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      } ${collapsed ? "justify-center px-2" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-purple-400"
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {/* Active indicator dot */}
                      {isActive && !collapsed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                      )}

                      {/* Tooltip for collapsed mode */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-[11px] font-bold rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Launch & External Links */}
        <div className="p-3 border-t border-white/[0.08] space-y-1">
          <Link
            href="/create"
            target="_blank"
            className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title={collapsed ? "Creator Studio" : undefined}
          >
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              {!collapsed && <span>Creator Studio</span>}
            </span>
            {!collapsed && <ExternalLink className="w-3 h-3 text-slate-500" />}
          </Link>

          <Link
            href="/"
            target="_blank"
            className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 transition-colors ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title={collapsed ? "Platform Home" : undefined}
          >
            <span className="flex items-center gap-2 truncate">
              <Gift className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {!collapsed && <span>Platform Home</span>}
            </span>
            {!collapsed && <ExternalLink className="w-3 h-3 text-slate-500" />}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center p-1.5 mt-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/40 transition-colors text-xs"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[10px]">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
