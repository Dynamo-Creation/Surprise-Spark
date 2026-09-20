"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { AdminNotificationsDrawer } from "@/components/admin/AdminNotificationsDrawer";
import { AdminMetricsMode, adminStore } from "@/lib/admin/adminStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [metricsMode, setMetricsMode] = useState<AdminMetricsMode>("live");

  // Load metrics mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(
        "surprisespark_admin_metrics_mode"
      ) as AdminMetricsMode;
      if (saved === "demo" || saved === "live") {
        setMetricsMode(saved);
      }
    }
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleMode = (newMode: AdminMetricsMode) => {
    setMetricsMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("surprisespark_admin_metrics_mode", newMode);
      // Dispatch custom storage event for other components to react if needed
      window.dispatchEvent(new Event("surprisespark_mode_changed"));
    }
  };

  return (
    <div className="min-h-screen bg-[#070911] text-slate-100 flex flex-col lg:flex-row relative selection:bg-purple-600 selection:text-white">
      {/* Subtle Aurora Ambient Lighting Accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Streamlined Admin Sidebar */}
      <AdminSidebar
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sleek Top Control Bar */}
        <AdminHeader
          metricsMode={metricsMode}
          onToggleMode={handleToggleMode}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <AdminCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleMode={() =>
          handleToggleMode(metricsMode === "live" ? "demo" : "live")
        }
      />

      {/* Notifications Slide-over Drawer */}
      <AdminNotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
