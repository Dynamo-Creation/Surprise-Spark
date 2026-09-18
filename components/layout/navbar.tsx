"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles, ArrowRight, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { NAV_LINKS } from "@/lib/constants";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggle, close } = useMobileNav();
  const { user, profile, signOut } = useAuth();

  const isAdmin = Boolean(
    profile?.isAdmin ||
    profile?.role === "superadmin" ||
    profile?.role === "admin" ||
    user?.email?.toLowerCase().includes("admin")
  );

  const handleLogout = async () => {
    await signOut();
    close();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg py-1"
          onClick={close}
          aria-label="Partner in Crime Home"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold px-2.5 py-1.5 h-8 whitespace-nowrap"
                leftIcon={<Shield className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
              >
                Admin CMS
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-pink-300 transition-colors cursor-pointer text-xs font-semibold whitespace-nowrap">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {profile?.fullName || "Dashboard"}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                Login
              </Button>
            </Link>
          )}

          <Link href="/create">
            <Button
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-200 shrink-0" />}
            >
              Create Surprise
            </Button>
          </Link>
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2.5 py-1.5 h-8 border-purple-500/40 text-purple-600 dark:text-purple-300 whitespace-nowrap"
                leftIcon={<Shield className="w-3.5 h-3.5 text-purple-500 shrink-0" />}
              >
                CMS
              </Button>
            </Link>
          )}
          <Link href="/create">
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1.5 h-8 whitespace-nowrap"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-200 shrink-0" />}
            >
              Create
            </Button>
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto md:hidden animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</p>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                onClick={close}
                className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Home
              </Link>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={close}
                className="px-4 py-3 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-base font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 transition-colors whitespace-nowrap"
                >
                  <Shield className="w-5 h-5 text-purple-500 shrink-0" />
                  <span>Admin CMS</span>
                </Link>
              )}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 mt-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme mode</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <Link href="/create" onClick={close} className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create a Surprise
              </Button>
            </Link>
            {user ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleLogout}
                className="w-full text-xs"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Log Out ({profile?.fullName || user.email})
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={close} className="block">
                  <Button variant="outline" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={close} className="block">
                  <Button variant="secondary" size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
