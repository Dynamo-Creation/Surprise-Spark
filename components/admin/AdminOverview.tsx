import React from "react";
import { ShieldCheck } from "lucide-react";

/**
 * Admin Overview Component (Phase 1 Foundation)
 */
export function AdminOverview() {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Admin Security & Template Registry Active</span>
      </div>
    </div>
  );
}
