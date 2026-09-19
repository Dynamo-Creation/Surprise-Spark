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
  Bell,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/hooks/useAuth";
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"all" | "drafts" | "published" | "profile" | "settings">("all");
  const [surprises, setSurprises] = useState<DraftSurprise[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Share modal target
  const [shareTarget, setShareTarget] = useState<DraftSurprise | null>(null);

  // Delete confirmation modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Profile edit states
  const [nameInput, setNameInput] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Settings states
  const [allowSoundDefault, setAllowSoundDefault] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Load drafts on mount
  useEffect(() => {
    const loaded = listDrafts();
    if (loaded.length === 0) {
      // Seed rich default surprises if storage is completely empty
      const defaultSurprises: DraftSurprise[] = [
        {
          id: "draft-demo-1",
          publicId: "maya-24-magic",
          userId: user?.id,
          templateSlug: "sweet-celebration",
          recipientName: "Maya",
          senderName: profile?.fullName || "Alex",
          message: "Happy Birthday Maya! Wishing you another year of crazy adventures and endless laughter!",
          photos: ["https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop"],
          themeId: "candy",
          musicTrackId: "track-happy-sunshine",
          status: "published",
          viewCount: 14,
          shareCount: 5,
          currentStep: 7,
          createdAt: "2026-09-10T14:30:00Z",
          updatedAt: "2026-09-10T14:30:00Z",
          publishedAt: "2026-09-10T14:30:00Z",
        },
        {
          id: "draft-demo-2",
          publicId: "sam-cake-reveal",
          userId: user?.id,
          templateSlug: "birthday-cake-reveal",
          recipientName: "Sam",
          senderName: profile?.fullName || "Alex",
          message: "Blow out the candles and make the biggest wish! So proud of you!",
          photos: [],
          themeId: "party",
          musicTrackId: "track-party-confetti",
          status: "published",
          viewCount: 38,
          shareCount: 11,
          currentStep: 7,
          createdAt: "2026-09-12T09:15:00Z",
          updatedAt: "2026-09-12T09:15:00Z",
          publishedAt: "2026-09-12T09:15:00Z",
        },
        {
          id: "draft-demo-3",
          publicId: "mom-memory-draft",
          userId: user?.id,
          templateSlug: "memory-journey",
          recipientName: "Mom",
          senderName: profile?.fullName || "Alex",
          message: "Looking through all these memories made me smile so much. Happy Birthday Mom!",
          photos: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop"],
          themeId: "magical",
          musicTrackId: "track-magical-starlight",
          status: "draft",
          viewCount: 0,
          shareCount: 0,
          currentStep: 3,
          createdAt: "2026-09-13T16:45:00Z",
          updatedAt: "2026-09-13T16:45:00Z",
        },
      ];
      defaultSurprises.forEach((s) => saveDraft(s));
      setSurprises(defaultSurprises);
    } else {
      setSurprises(loaded);
    }
  }, [user, profile]);

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
    setSurprises(listDrafts());
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

  const totalViews = surprises.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const totalShares = surprises.reduce((acc, curr) => acc + (curr.shareCount || 0), 0);
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
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="text-xs border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Surprises</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {surprises.length}
          </p>
          <p className="text-[11px] text-pink-600 dark:text-pink-400 font-medium mt-1">
            {publishedCount} live, {draftCount} drafts
          </p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Recipient Views</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalViews}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Tracked on unwrapping
          </p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Shares</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalShares}
          </p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">
            WhatsApp & direct links
          </p>
        </Card>

        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Security & Isolation</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Owner-only isolated storage</p>
        </Card>
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

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Email Notification on Open
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Receive an alert when your recipient opens the surprise link
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
              </div>
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
    </div>
  );
}
