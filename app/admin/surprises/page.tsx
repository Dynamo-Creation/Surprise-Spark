"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Search, ExternalLink, RotateCw, Loader2, Image as ImageIcon, Music, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listDrafts } from "@/lib/creator/draftStorage";

interface RealSurprise {
  id: string;
  publicId: string;
  userId?: string;
  templateSlug: string;
  recipientName: string;
  senderName: string;
  photosCount?: number;
  hasAudio?: boolean;
  viewCount: number;
  shareCount: number;
  status: "published" | "draft";
  createdAt: string;
}

export default function AdminSurprisesPage() {
  const [surprises, setSurprises] = useState<RealSurprise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  const loadSurprises = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/surprises");
      const json = await res.json();
      if (json.success && Array.isArray(json.surprises) && json.surprises.length > 0) {
        setSurprises(json.surprises);
      } else {
        // Fallback to local drafts if API returned empty
        const drafts = listDrafts();
        setSurprises(
          drafts.map((d) => ({
            id: d.id,
            publicId: d.publicId,
            userId: d.userId,
            templateSlug: d.templateSlug,
            recipientName: d.recipientName,
            senderName: d.senderName,
            photosCount: d.photos?.length || 0,
            hasAudio: Boolean(d.audioUrl),
            viewCount: d.viewCount || 0,
            shareCount: d.shareCount || 0,
            status: d.status,
            createdAt: d.createdAt,
          }))
        );
      }
    } catch (err) {
      console.warn("[Admin Surprises] Fetch fallback:", err);
      const drafts = listDrafts();
      setSurprises(
        drafts.map((d) => ({
          id: d.id,
          publicId: d.publicId,
          userId: d.userId,
          templateSlug: d.templateSlug,
          recipientName: d.recipientName,
          senderName: d.senderName,
          photosCount: d.photos?.length || 0,
          hasAudio: Boolean(d.audioUrl),
          viewCount: d.viewCount || 0,
          shareCount: d.shareCount || 0,
          status: d.status,
          createdAt: d.createdAt,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSurprises();
  }, []);

  const filtered = surprises.filter(
    (s) =>
      s.recipientName.toLowerCase().includes(query.toLowerCase()) ||
      s.publicId.toLowerCase().includes(query.toLowerCase()) ||
      s.templateSlug.toLowerCase().includes(query.toLowerCase()) ||
      s.senderName.toLowerCase().includes(query.toLowerCase())
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
            Real published user celebrations persisted in Supabase database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-purple-300 font-bold px-3 py-1">
            {surprises.length} Total Surprises in Database
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadSurprises}
            disabled={isLoading}
            className="text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold"
            leftIcon={<RotateCw className={`w-3.5 h-3.5 text-pink-400 ${isLoading ? "animate-spin" : ""}`} />}
          >
            {isLoading ? "Syncing..." : "Sync Live Surprises"}
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-slate-900/70 border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by recipient name, sender, public ID, or template..."
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
                <th className="p-4">Media</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Loading real surprise celebrations from Supabase...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No surprise experiences found matching criteria.
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
                      <Badge variant="secondary" size="sm" className="bg-slate-800 text-purple-300 border-slate-700">
                        {s.templateSlug}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-300">{s.senderName || "Anonymous"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {s.photosCount ? (
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <ImageIcon className="w-3 h-3 text-blue-400" /> {s.photosCount}
                          </span>
                        ) : null}
                        {s.hasAudio ? (
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <Music className="w-3 h-3 text-pink-400" /> Audio
                          </span>
                        ) : null}
                        {!s.photosCount && !s.hasAudio && <span className="text-slate-500">—</span>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="success" size="sm" className="bg-emerald-950/60 text-emerald-300 border-emerald-800/50">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/s/${s.publicId}`} target="_blank">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-800">
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
