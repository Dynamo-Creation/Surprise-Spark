"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Recipient public experience is full-screen and distraction-free
  const isRecipientExperience = pathname?.startsWith("/s/");

  if (isRecipientExperience) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
