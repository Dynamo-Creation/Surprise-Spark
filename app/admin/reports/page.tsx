"use client";

import React, { useState } from "react";
import { FileText, Download, Calendar, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminReportsPage() {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const reports = [
    { id: "rep-daily-summary", title: "Daily Executive Summary", period: "Last 24 Hours", format: "JSON / CSV", size: "48 KB" },
    { id: "rep-template-perf", title: "Template Performance & Completion", period: "Last 30 Days", format: "CSV", size: "142 KB" },
    { id: "rep-user-acquisition", title: "User Acquisition & Retention Cohorts", period: "Q3 2026", format: "CSV", size: "290 KB" },
    { id: "rep-audit-compliance", title: "Audit Trail & Administrative Actions", period: "All Time", format: "JSON", size: "94 KB" },
  ];

  const handleDownload = (id: string) => {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Data Exports
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Operational Reports & Exports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Export anonymized metrics, telemetry summaries, and system logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <Card key={rep.id} className="p-5 bg-slate-900/70 border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" size="sm" className="font-mono text-[10px] text-purple-300 border-purple-800">
                  {rep.format}
                </Badge>
                <span className="text-[10px] text-slate-500">{rep.size}</span>
              </div>
              <h3 className="font-bold text-sm text-white">{rep.title}</h3>
              <p className="text-xs text-slate-400">{rep.period}</p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDownload(rep.id)}
              className="h-8 text-xs font-bold"
              leftIcon={downloaded === rep.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            >
              {downloaded === rep.id ? "Exported" : "Export"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
