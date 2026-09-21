/**
 * Draft & Surprise Persistence Storage
 * Handles offline/client-side localStorage auto-saving and Supabase cloud synchronization.
 * Supports: save draft, continue editing, duplicate, delete, and publish.
 */

import { ThemeId } from "@/lib/engine/themes";

export interface DraftSurprise {
  id: string;
  publicId: string;
  userId?: string;
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  specialDate?: string;
  photos: string[];
  themeId: ThemeId;
  musicTrackId: string;
  status: "draft" | "published";
  viewCount: number;
  shareCount: number;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  endearment?: string;
  question?: string;
  dodgeText?: string;
  audioUrl?: string;
  audioStartTime?: number;
  audioDuration?: number;
  goldenConfig?: Record<string, any>;
}

const LOCAL_STORAGE_KEY = "surprisespark_drafts_v1";

export function generatePublicId(templateSlug?: string): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let prefix = "spark-";
  if (templateSlug === "the-golden-proposal" || templateSlug === "love-animation") {
    prefix = "love-";
  } else if (templateSlug === "sweet-celebration" || templateSlug?.includes("bday") || templateSlug?.includes("birthday")) {
    prefix = "bday-";
  }
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function listDrafts(): DraftSurprise[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getDraft(id: string): DraftSurprise | null {
  const drafts = listDrafts();
  return drafts.find((d) => d.id === id || d.publicId === id) || null;
}

export function saveDraft(data: Partial<DraftSurprise>): DraftSurprise {
  const drafts = listDrafts();
  const now = new Date().toISOString();

  let existingIndex = -1;
  if (data.id) {
    existingIndex = drafts.findIndex((d) => d.id === data.id);
  }

  let record: DraftSurprise;

  if (existingIndex >= 0) {
    record = {
      ...drafts[existingIndex],
      ...data,
      updatedAt: now,
    };
    drafts[existingIndex] = record;
  } else {
    record = {
      id: data.id || "draft_" + Math.random().toString(36).substring(2, 10),
      publicId: data.publicId || generatePublicId(data.templateSlug),
      userId: data.userId,
      templateSlug: data.templateSlug || "sweet-celebration",
      recipientName: data.recipientName || "Someone Special",
      senderName: data.senderName || "",
      message: data.message || "",
      specialDate: data.specialDate || "",
      photos: data.photos || [],
      themeId: data.themeId || "candy",
      musicTrackId: data.musicTrackId || "track-happy-sunshine",
      status: data.status || "draft",
      viewCount: data.viewCount || 0,
      shareCount: data.shareCount || 0,
      currentStep: data.currentStep || 1,
      createdAt: data.createdAt || now,
      updatedAt: now,
      publishedAt: data.publishedAt,
      endearment: data.endearment,
      question: data.question,
      dodgeText: data.dodgeText,
      audioUrl: data.audioUrl,
      goldenConfig: data.goldenConfig,
    };
    drafts.unshift(record);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      // If quota exceeded, clean up old drafts
      if (drafts.length > 5) {
        const trimmed = drafts.slice(0, 5);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
      }
    }
  }

  return record;
}

export function duplicateDraft(id: string): DraftSurprise {
  const original = getDraft(id);
  if (!original) {
    throw new Error("Surprise to duplicate not found.");
  }

  const copy: Partial<DraftSurprise> = {
    ...original,
    id: "draft_" + Math.random().toString(36).substring(2, 10),
    publicId: generatePublicId(),
    recipientName: `${original.recipientName} (Copy)`,
    status: "draft",
    viewCount: 0,
    shareCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: undefined,
  };

  return saveDraft(copy);
}

export function deleteDraft(id: string): void {
  const drafts = listDrafts().filter((d) => d.id !== id && d.publicId !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
  }
}

export function incrementShareCount(publicId: string): void {
  const draft = getDraft(publicId);
  if (draft) {
    saveDraft({
      id: draft.id,
      shareCount: (draft.shareCount || 0) + 1,
    });
  }
}

export function incrementViewCount(publicId: string): void {
  const draft = getDraft(publicId);
  if (draft) {
    saveDraft({
      id: draft.id,
      viewCount: (draft.viewCount || 0) + 1,
    });
  }
}
