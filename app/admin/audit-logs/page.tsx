"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  ArrowRight,
  User,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { adminStore, AdminAuditRecord } from "@/lib/admin/adminStore";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditRecord[]>(adminStore.listAuditLogs());
  const [query, setQuery] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.actor.name.toLowerCase().includes(query.toLowerCase()) ||
      l.targetTable.toLowerCase().includes(query.toLowerCase()) ||
      l.targetId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Governance & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Immutable log of all administrative actions, template modifications, user policy enforcements, and previous/new values.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            id="input-audit-search"
            placeholder="Search audit trail by actor, action type, or target..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-xs text-white placeholder:text-slate-600"
          />
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-slate-900/70 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Previous Value</th>
                <th className="p-4 pr-6">New Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-6 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-[10px] text-purple-300 font-bold">
                        {log.actor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{log.actor.name}</p>
                        <span className="text-[10px] text-slate-500 capitalize">{log.actor.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" size="sm" className="font-mono text-[10px] border-purple-800 text-purple-300 bg-purple-950/30">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 font-mono text-[11px]">{log.targetTable} / </span>
                    <strong className="text-white font-mono text-xs">{log.targetId}</strong>
                  </td>
                  <td className="p-4 text-rose-400/80 font-mono text-[11px] max-w-xs truncate">
                    {log.previousValue || "—"}
                  </td>
                  <td className="p-4 pr-6 text-emerald-400 font-mono text-[11px] max-w-xs truncate">
                    {log.newValue || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
