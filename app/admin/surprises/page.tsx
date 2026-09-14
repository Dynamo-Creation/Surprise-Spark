"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Search, ExternalLink, Eye, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listDrafts, DraftSurprise } from "@/lib/creator/draftStorage";

export default function AdminSurprisesPage() {
  const [surprises, setSurprises] = useState<DraftSurprise[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSurprises(listDrafts());
  }, []);

  const filtered = surprises.filter(
    (s) =>
      s.recipientName.toLowerCase().includes(query.toLowerCase()) ||
      s.publicId.toLowerCase().includes(query.toLowerCase()) ||
      s.templateSlug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Experience Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Surprise Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit created surprise instances, monitor view counts, and verify recipient link delivery.
          </p>
        </div>
      </div>

      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by recipient name, public ID, or template..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-xs text-white"
          />
        </div>
      </Card>

      <Card className="bg-slate-900/70 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-4 pl-6">Recipient & Public Link</th>
                <th className="p-4">Template</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Views</th>
                <th className="p-4">Shares</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No surprise instances found. Create one in Creator Studio to test.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-white text-xs">{s.recipientName}</p>
                      <span className="text-[10px] text-purple-400 font-mono">/s/{s.publicId}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" size="sm">
                        {s.templateSlug}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-300">{s.senderName || "Anonymous"}</td>
                    <td className="p-4 font-bold text-white">{s.viewCount}</td>
                    <td className="p-4 font-bold text-purple-400">{s.shareCount}</td>
                    <td className="p-4">
                      <Badge variant={s.status === "published" ? "success" : "warning"} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/s/${s.publicId}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-300 hover:text-white">
                          <ExternalLink className="w-3 h-3 mr-1" /> Open
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
