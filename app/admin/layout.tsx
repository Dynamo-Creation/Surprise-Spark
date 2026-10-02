"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { AdminMetricsMode, adminStore } from "@/lib/admin/adminStore";
import { useAuth } from "@/hooks/useAuth";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [metricsMode, setMetricsMode] = useState<AdminMetricsMode>("live");

  const [hasValidLocalSession, setHasValidLocalSession] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("admin_user_session");
        if (raw) {
          const p = JSON.parse(raw);
          if (p?.email && isAuthorizedAdmin(p.email)) {
            setHasValidLocalSession(true);
          }
        }
      } catch {}
    }
  }, []);

  const authorized = Boolean(
    (user && (isAuthorizedAdmin(user) || (profile && isAuthorizedAdmin(profile)))) ||
    hasValidLocalSession
  );

  // Strict Client-Side Admin Guard: If not an authorized administrator, redirect immediately
  useEffect(() => {
    if (!isLoading && !authorized) {
      router.replace("/login?error=forbidden_not_admin");
    }
  }, [authorized, isLoading, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070911] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-3" />
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Verifying Admin Authorization...
        </p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

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


    </div>
  );
}
