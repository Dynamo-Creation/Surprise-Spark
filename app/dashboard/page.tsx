"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Eye,
  Copy,
  Check,
  User,
  Settings as SettingsIcon,
  Layers,
  FileText,
  Share2,
  LogOut,
  Save,
  Trash2,
  Volume2,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Gift,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/hooks/useAuth";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/client";
import {
  listDrafts,
  saveDraft,
  duplicateDraft,
  deleteDraft,
  incrementShareCount,
  DraftSurprise,
} from "@/lib/creator/draftStorage";
import { MOCK_TEMPLATES } from "@/lib/constants";
import { ShareModal } from "@/components/creator/ShareModal";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"all" | "drafts" | "published" | "profile" | "settings">("all");
  const [surprises, setSurprises] = useState<DraftSurprise[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Share modal target
  const [shareTarget, setShareTarget] = useState<DraftSurprise | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Delete confirmation modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Profile edit states
  const [nameInput, setNameInput] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Settings states
  const [allowSoundDefault, setAllowSoundDefault] = useState(true);

  // Strictly user-isolated surprises loader
  const loadUserSurprises = React.useCallback(async () => {
    if (!user) {
      setSurprises([]);
      return;
    }

    // 1. Purge legacy fake seed drafts from client storage immediately
    try {
      const raw = localStorage.getItem("surprisespark_drafts_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (d) =>
              d.id !== "draft-demo-1" &&
              d.id !== "draft-demo-2" &&
              d.id !== "draft-demo-3" &&
              d.userId === user.id
          );
          localStorage.setItem("surprisespark_drafts_v1", JSON.stringify(cleaned));
        }
      }
    } catch {}

    // 2. Load user's local drafts strictly matching current user ID
    const localDrafts = listDrafts().filter(
      (d) =>
        d.id !== "draft-demo-1" &&
        d.id !== "draft-demo-2" &&
        d.id !== "draft-demo-3" &&
        d.userId === user.id
    );

    // 3. Fetch user's published surprises from Supabase cloud database
    let cloudSurprises: DraftSurprise[] = [];
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("published_surprises")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        cloudSurprises = data.map((item: any) => ({
          id: `cloud-${item.public_id}`,
          publicId: item.public_id,
          userId: item.user_id,
          templateSlug: item.template_slug || "sweet-celebration",
          recipientName: item.recipient_name || "Someone Special",
          senderName: item.sender_name || "",
          message: item.custom_message || "",
          photos: Array.isArray(item.photos) ? item.photos : [],
          themeId: item.metadata?.themeId || "candy",
          musicTrackId: item.metadata?.musicTrackId || "",
          status: "published" as const,
          viewCount: item.metadata?.viewCount || 0,
          shareCount: item.metadata?.shareCount || 0,
          currentStep: 7,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
          publishedAt: item.created_at || new Date().toISOString(),
        }));
      }
    } catch (cloudErr) {
      console.warn("[Dashboard] Cloud surprises fetch fallback:", cloudErr);
    }

    // Merge cloud surprises and local drafts, avoiding duplicates by publicId
    const seenPublicIds = new Set<string>();
    const merged: DraftSurprise[] = [];

    for (const cs of cloudSurprises) {
      if (!seenPublicIds.has(cs.publicId)) {
        seenPublicIds.add(cs.publicId);
        merged.push(cs);
      }
    }

    for (const ld of localDrafts) {
      if (!seenPublicIds.has(ld.publicId)) {
        seenPublicIds.add(ld.publicId);
        merged.push(ld);
      }
    }

    setSurprises(merged);
  }, [user]);

  // Load user surprises on mount and when user session changes
  useEffect(() => {
    loadUserSurprises();
  }, [loadUserSurprises]);

  useEffect(() => {
    if (profile?.fullName) {
      setNameInput(profile.fullName);
    }
  }, [profile]);

  // Protected route guard: push to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, isLoading, router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshSurprises = () => {
    loadUserSurprises();
  };

  // Helper to get friendly template name and gradient
  const getTemplateInfo = (slug: string) => {
    const found = MOCK_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
    if (found) {
      return {
        name: found.name,
        coverGradient: found.coverGradient || "from-pink-500 to-purple-600",
      };
    }
    const formatted = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      name: `${formatted} 🎁`,
      coverGradient: "from-pink-500 to-purple-600",
    };
  };

  // 1. Edit Action
  const handleEdit = (id: string) => {
    router.push(`/create?edit=${id}`);
  };

  // 2. Preview Action
  const handlePreview = (publicId: string) => {
    window.open(`/s/${publicId}`, "_blank");
  };

  // 3. Share Action
  const handleOpenShare = (surprise: DraftSurprise) => {
    setShareTarget(surprise);
  };

  // 4. Duplicate Action
  const handleDuplicate = (id: string) => {
    try {
      const copy = duplicateDraft(id);
      refreshSurprises();
      showToast(`Duplicated "${copy.recipientName}"! You can now edit this new copy.`);
    } catch {
      showToast("Could not duplicate surprise.");
    }
  };

  // 5. Delete Action
  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteDraft(deleteTargetId);
    setDeleteTargetId(null);
    refreshSurprises();
    showToast("Surprise removed from your dashboard.");
  };

  const copyShareLink = (publicId: string) => {
    const url = `${window.location.origin}/s/${publicId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(publicId);
    showToast("Shareable link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      await updateProfile({ fullName: nameInput.trim() });
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch {
      // error handled
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Verifying session...</p>
      </div>
    );
  }

  const filteredSurprises = surprises.filter((item) => {
    if (activeTab === "drafts") return item.status === "draft";
    if (activeTab === "published") return item.status === "published";
    return true;
  });

  const publishedCount = surprises.filter((s) => s.status === "published").length;
  const draftCount = surprises.filter((s) => s.status === "draft").length;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Administrator Quick Launch Banner */}
      {Boolean(profile?.isAdmin || isAuthorizedAdmin(user)) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-purple-950/30 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Executive Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white">Administrator Access Active</p>
              <p className="text-xs text-slate-400">View real users, live telemetry, and manage platform templates.</p>
            </div>
          </div>
          <Link href="/admin">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 whitespace-nowrap cursor-pointer"
            >
              Open Admin Console →
            </Button>
          </Link>
        </div>
      )}

      {/* Top Profile Banner Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {profile?.fullName || "Welcome Creator"}
              </h1>
              <Badge variant="primary" size="sm" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                Verified Creator
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/create">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4 text-amber-200" />}
              className="text-xs sm:text-sm font-semibold shadow-md cursor-pointer"
            >
              Create New Surprise
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsFeedbackOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4 text-pink-400" />}
            className="text-xs border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            Send Feedback
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="text-xs border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            Log Out
          </Button>
        </div>
      </div>



      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>My Surprises ({surprises.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("drafts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "drafts"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Drafts ({draftCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("published")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "published"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Published ({publishedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab 1, 2, 3: Surprises List / Drafts / Published */}
      {(activeTab === "all" || activeTab === "drafts" || activeTab === "published") && (
        <>
          {filteredSurprises.length === 0 ? (
            <EmptyState
              title={
                activeTab === "drafts"
                  ? "No drafts in progress"
                  : activeTab === "published"
                  ? "No published surprises yet"
                  : "You haven't created any surprises yet"
              }
              description="Craft an interactive celebration experience with 3D scenes, blowable candles, and personal photos in less than 2 minutes."
              actionLabel="Create Your First Surprise"
              onAction={() => router.push("/create")}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span>My Surprises</span>
                </h2>
                <Link href="/create">
                  <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    New Surprise
                  </Button>
                </Link>
              </div>

              <Card className="border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSurprises.map((item) => {
                  const tpl = getTemplateInfo(item.templateSlug);
                  const isPublished = item.status === "published";

                  return (
                    <div
                      key={item.id}
                      className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Left: Metadata Details */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            For {item.recipientName}
                          </h3>

                          {/* Status Badge */}
                          <Badge
                            variant={isPublished ? "success" : "secondary"}
                            size="sm"
                          >
                            {isPublished ? "Live" : "Draft"}
                          </Badge>

                          {/* Template Badge */}
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40">
                            <span>{tpl.name}</span>
                          </span>

                          {/* Theme Badge */}
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full capitalize">
                            Theme: {item.themeId || "Candy"}
                          </span>
                        </div>

                        {/* Recipient, Message Snippet & Creation Date */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Created {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {item.senderName && (
                            <span>• From <strong>{item.senderName}</strong></span>
                          )}
                          {item.message && (
                            <span className="hidden sm:inline italic text-slate-400 dark:text-slate-500 truncate max-w-xs">
                              &ldquo;{item.message.slice(0, 45)}...&rdquo;
                            </span>
                          )}
                        </div>

                        {/* Views & Shares Count */}
                        <div className="flex items-center gap-4 text-xs font-semibold pt-0.5">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <strong>{item.viewCount || 0}</strong> {item.viewCount === 1 ? "view" : "views"}
                          </span>
                          <span className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400">
                            <Share2 className="w-3.5 h-3.5 text-pink-500" />
                            <strong>{item.shareCount || 0}</strong> {item.shareCount === 1 ? "share" : "shares"}
                          </span>
                          {item.photos && item.photos.length > 0 && (
                            <span className="text-slate-400">
                              📷 {item.photos.length} {item.photos.length === 1 ? "photo" : "photos"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: The 5 Actions (Edit, Preview, Share, Duplicate, Delete) */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                        {/* 1. Edit */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
                          onClick={() => handleEdit(item.id)}
                          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        >
                          Edit
                        </Button>

                        {/* 2. Preview */}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-xs cursor-pointer"
                          onClick={() => handlePreview(item.publicId)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Preview
                        </Button>

                        {/* 3. Share */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 cursor-pointer"
                          onClick={() => handleOpenShare(item)}
                          leftIcon={<Share2 className="w-3.5 h-3.5 text-pink-500" />}
                        >
                          Share
                        </Button>

                        {/* 4. Duplicate */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          onClick={() => handleDuplicate(item.id)}
                          leftIcon={<Copy className="w-3.5 h-3.5" />}
                          title="Create duplicate copy"
                        >
                          Duplicate
                        </Button>

                        {/* 5. Delete */}
                        <button
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Delete surprise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete this surprise?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this surprise experience? Any recipient links pointing to it will no longer display it.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTargetId(null)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="text-xs cursor-pointer"
              >
                Delete Surprise
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Reusable Share Modal */}
      {shareTarget && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareTarget(null)}
          publicId={shareTarget.publicId}
          recipientName={shareTarget.recipientName}
          senderName={shareTarget.senderName}
          templateName={getTemplateInfo(shareTarget.templateSlug).name}
          customMessage={shareTarget.message}
          onShareSuccess={() => {
            incrementShareCount(shareTarget.publicId);
            refreshSurprises();
            showToast("Share logged! Surprise shared successfully.");
          }}
        />
      )}

      {/* Tab 4: Profile */}
      {activeTab === "profile" && (
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Creator Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your display name and public avatar. Managed safely in Supabase `profiles`.
            </p>
          </div>

          {profileSaveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Display Name"
              type="text"
              id="profile-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Alex Parker"
              required
            />

            <Input
              label="Email Address (Managed by Supabase Auth)"
              type="email"
              id="profile-email"
              value={user.email || ""}
              disabled
              helperText="Email changes require verification."
            />

            <Input
              label="User ID (UUID)"
              type="text"
              id="profile-uid"
              value={user.id}
              disabled
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingProfile}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 5: Settings */}
      {activeTab === "settings" && (
        <div className="space-y-6 max-w-2xl">
          <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Experience Preferences
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Default behavior for surprise creation and recipient interactions.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-pink-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Enable Background Audio by Default
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Play ambient track when recipient unwraps the gift
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={allowSoundDefault}
                  onChange={(e) => setAllowSoundDefault(e.target.checked)}
                  className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
              </div>

            </div>
          </Card>

          {/* Help & Feedback Card */}
          <Card className="p-6 sm:p-8 space-y-4 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-500" />
                  Help & Feedback
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                  Found an issue or have an idea to improve SurpriseSpark? Write directly to our team.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsFeedbackOpen(true)}
                className="text-xs whitespace-nowrap cursor-pointer shrink-0"
              >
                Write Feedback
              </Button>
            </div>
          </Card>

          {/* Danger / Logout Zone */}
          <Card className="p-6 border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 space-y-3">
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
              Account Session
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign out from all devices or clear current session cookies.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Log Out of Account
            </Button>
          </Card>
        </div>
      )}
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
