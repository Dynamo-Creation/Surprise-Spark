import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND_HEADLINE, BRAND_SUPPORTING_LINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center" aria-label="Partner in Crime Home">
              <BrandLogo size="md" />
            </Link>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {BRAND_HEADLINE}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              {BRAND_SUPPORTING_LINE}
            </p>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Celebrations
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/birthday" className="hover:text-pink-600 transition-colors">
                  Birthday Surprises
                </Link>
              </li>
              <li>
                <Link href="/templates?category=anniversary" className="hover:text-pink-600 transition-colors">
                  Anniversary Milestones
                </Link>
              </li>
              <li>
                <Link href="/templates?category=love" className="hover:text-pink-600 transition-colors">
                  Love & Romance
                </Link>
              </li>
              <li>
                <Link href="/templates?category=friendship" className="hover:text-pink-600 transition-colors">
                  Best Friend Roasts & Toasts
                </Link>
              </li>
              <li>
                <Link href="/templates?category=festivals" className="hover:text-pink-600 transition-colors">
                  Festivals & Holidays
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/create" className="hover:text-pink-600 transition-colors">
                  Create a Surprise
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-pink-600 transition-colors">
                  Browse All Templates
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-pink-600 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-pink-600 transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-pink-600 transition-colors font-medium">
                  Privacy Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Partner in Crime. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for unforgettable moments.
          </p>
        </div>
      </div>
    </footer>
  );
}
