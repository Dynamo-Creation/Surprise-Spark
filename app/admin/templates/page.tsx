"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Copy,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Search,
  Check,
  X,
  Trash2,
  ExternalLink,
  Type,
  Image as ImageIcon,
  Mic,
  Clock,
  Upload,
  FolderUp,
  FileCode,
  AlertCircle,
  Loader2,
  Play,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminStore } from "@/lib/admin/adminStore";
import { TemplateModel } from "@/lib/engine/types";
import { AdminTemplatePreviewModal } from "@/components/admin/AdminTemplatePreviewModal";

interface SelectedFileItem {
  file: File;
  path: string;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateModel[]>(adminStore.listTemplates());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [selectedTemplateForDup, setSelectedTemplateForDup] = useState<TemplateModel | null>(null);
  const [dupName, setDupName] = useState("");
  const [dupSlug, setDupSlug] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplateForDelete, setSelectedTemplateForDelete] = useState<TemplateModel | null>(null);

  // New Template Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"folder" | "manual">("folder");
  const [newTplName, setNewTplName] = useState("");
  const [newTplSlug, setNewTplSlug] = useState("");
  const [newTplDesc, setNewTplDesc] = useState("");
  const [newTplCat, setNewTplCat] = useState("birthday");
  const [newTplPhotos, setNewTplPhotos] = useState("1");
  const [newTplDuration, setNewTplDuration] = useState("30");

  // Folder Upload state
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([]);
  const [detectedFolder, setDetectedFolder] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Animation Preview Modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateModel | null>(null);
  const [instantHtmlPreview, setInstantHtmlPreview] = useState<string | undefined>(undefined);
  const [instantBlobUrl, setInstantBlobUrl] = useState<string | null>(null);
  const [instantPreviewDevice, setInstantPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [instantPreviewCounter, setInstantPreviewCounter] = useState(0);
  const [lastUploadedSlug, setLastUploadedSlug] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ensure templates are strictly deduplicated by slug
  const uniqueTemplates = Array.from(
    new Map(templates.filter(Boolean).map((t) => [t.slug, t])).values()
  );

  const filtered = uniqueTemplates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || t.categoryId.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openDuplicateModal = (tpl: TemplateModel) => {
    setSelectedTemplateForDup(tpl);
    setDupName(`${tpl.name} — Custom Edition`);
    setDupSlug(`${tpl.slug}-custom`);
    setDuplicateModalOpen(true);
  };

  const openLivePreview = (tpl: TemplateModel) => {
    setPreviewTemplate(tpl);
    setInstantHtmlPreview(undefined);
    setPreviewModalOpen(true);
  };

  const openInstantFolderPreview = () => {
    setPreviewTemplate({
      id: `tpl-${newTplSlug || "preview"}`,
      name: newTplName || "Uploaded Animation",
      slug: newTplSlug || "love-animation",
      categoryId: newTplCat,
    } as TemplateModel);
    setPreviewModalOpen(true);
  };

  // Process selected files from folder or file picker
  const processFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const items: SelectedFileItem[] = [];
    let folderName = "";

    for (const file of filesArray) {
      // webkitRelativePath exists when selecting folders
      const relativePath = (file as any).webkitRelativePath || file.name;
      items.push({ file, path: relativePath });

      if (!folderName && (file as any).webkitRelativePath) {
        folderName = (file as any).webkitRelativePath.split("/")[0];
      }
    }

    setSelectedFiles(items);

    // Auto-detect template name and slug from folder
    const baseSlug = (folderName || filesArray[0].name.replace(/\.[^/.]+$/, ""))
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const formattedTitle = baseSlug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    setDetectedFolder(folderName || "Uploaded Bundle");
    if (!newTplName) setNewTplName(formattedTitle);
    if (!newTplSlug) setNewTplSlug(baseSlug);

    // Look for thumbnail file
    const thumbnailFile = items.find((item) => {
      const lower = item.file.name.toLowerCase();
      return (
        lower === "thumbnail.jpg" ||
        lower === "thumbnail.png" ||
        lower === "thumbnail.webp" ||
        lower === "cover.jpg" ||
        lower === "preview.jpg" ||
        lower === "preview.png"
      );
    });

    if (thumbnailFile) {
      try {
        const url = URL.createObjectURL(thumbnailFile.file);
        setThumbnailPreviewUrl(url);
      } catch {
        // Fallback
      }
    }

    // Look for config.json or template.json
    const configFile = items.find((item) => {
      const lower = item.file.name.toLowerCase();
      return lower === "config.json" || lower === "template.json";
    });

    if (configFile) {
      try {
        const text = await configFile.file.text();
        const parsed = JSON.parse(text);
        if (parsed.name) setNewTplName(parsed.name);
        if (parsed.slug) setNewTplSlug(parsed.slug);
        if (parsed.category || parsed.categoryId) setNewTplCat(parsed.category || parsed.categoryId);
        if (parsed.description) setNewTplDesc(parsed.description);
        if (parsed.maxPhotos !== undefined) setNewTplPhotos(String(parsed.maxPhotos));
        if (parsed.audioDuration !== undefined) setNewTplDuration(String(parsed.audioDuration));
      } catch {
        // Ignore json parse errors
      }
    } else {
      // Check if code files reference multiple photos
      const hasPhotoRefs = items.some((item) => {
        const lower = item.file.name.toLowerCase();
        return lower.endsWith(".tsx") || lower.endsWith(".ts");
      });
      if (hasPhotoRefs && newTplPhotos === "1") {
        setNewTplPhotos("3");
      }
    }

    // Look for index.html or html animation file for instant live preview
    const htmlFile = items.find((item) => item.file.name.toLowerCase().endsWith(".html"));
    if (htmlFile) {
      try {
        let text = await htmlFile.file.text();
        // Patch checks so standalone animation runs natively in preview
        text = text
          .replace(/window\.location\.port === ["']3000["']/g, "false")
          .replace(/window\.location\.hostname\.includes\(["']run\.app["']\)/g, "false");

        const autoTrigger = `
        <script>
          (function() {
            setTimeout(function() {
              if (!window._previewStarted && typeof initStandaloneApp === 'function') {
                window._previewStarted = true;
                try { initStandaloneApp(); } catch(e) {}
              }
              setTimeout(function() {
                var ov = document.getElementById("fallbackOverlay");
                if (ov) ov.click();
                var playBtn = document.querySelector(".play-button, .btn-play, #playBtn");
                if (playBtn) playBtn.click();
              }, 150);
            }, 300);
          })();
        </script>
        `;

        if (text.includes("</body>")) {
          text = text.replace("</body>", `${autoTrigger}</body>`);
        } else {
          text += autoTrigger;
        }

        const blob = new Blob([text], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        setInstantBlobUrl(url);
        setInstantHtmlPreview(text);
      } catch {
        // Fallback
      }
    } else {
      // Fallback live canvas preview so panel always shows interactive preview
      const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #050206; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; }
    .heart { font-size: 52px; animation: pulse 1.4s infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  </style>
</head>
<body>
  <div class="heart">✨ 🎁 ✨</div>
  <h3 style="margin: 10px 0 4px; background: linear-gradient(135deg, #f43f5e, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${formattedTitle}</h3>
  <p style="color: #94a3b8; font-size: 12px;">${items.length} template files ready to ingest</p>
</body>
</html>`;
      const blob = new Blob([fallbackHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setInstantBlobUrl(url);
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleExecuteDuplicate = () => {
    if (!selectedTemplateForDup || !dupName || !dupSlug) return;
    try {
      const cloned = adminStore.duplicateTemplate(
        selectedTemplateForDup.slug,
        dupName,
        dupSlug
      );
      setTemplates([...adminStore.listTemplates()]);
      setDuplicateModalOpen(false);
      setToastMessage(`Duplicated "${selectedTemplateForDup.name}" into "${cloned.name}" with full customization slots!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  // Upload folder and register template
  const handleUploadAndRegister = async () => {
    if (!newTplName || !newTplSlug) {
      alert("Please provide a Template Name and Unique Slug.");
      return;
    }

    if (uploadMode === "folder" && selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("name", newTplName);
        formData.append("slug", newTplSlug);
        formData.append("category", newTplCat);
        formData.append("description", newTplDesc);
        formData.append("supportsPhotos", parseInt(newTplPhotos, 10) > 0 ? "true" : "false");
        formData.append("maxPhotos", newTplPhotos);
        formData.append("audioDuration", newTplDuration);

        // Append files and relative paths
        const paths: string[] = [];
        selectedFiles.forEach((item) => {
          formData.append("files", item.file);
          paths.push(item.path);
        });
        formData.append("paths", JSON.stringify(paths));

        const res = await fetch("/api/admin/templates/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Upload failed");
        }

        // Register in local adminStore
        const registered = adminStore.createTemplate({
          name: newTplName,
          slug: newTplSlug,
          description: newTplDesc,
          categoryId: newTplCat,
          tags: ["Custom", newTplCat],
          thumbnailUrl: data.template?.thumbnailUrl || "/templates/sweet-celebration/thumbnail.jpg",
          supportsPhotos: parseInt(newTplPhotos, 10) > 0,
          maxPhotos: parseInt(newTplPhotos, 10) || 1,
          supportsMusic: true,
        });

        setTemplates([...adminStore.listTemplates()]);
        setLastUploadedSlug(registered.slug);

        // Close upload modal and clear temp form
        setCreateModalOpen(false);
        resetCreateForm();

        // AUTOMATICALLY OPEN LIVE PREVIEW PANEL FOR THE UPLOADED TEMPLATE!
        setPreviewTemplate(registered);
        setInstantHtmlPreview(undefined); // ensure it loads directly from server preview endpoint
        setPreviewModalOpen(true);

        setToastMessage(`🎉 Template "${registered.name}" uploaded (${data.savedFilesCount} files) and registered! Now previewing live animation.`);
        setTimeout(() => setToastMessage(null), 6000);
      } catch (err: unknown) {
        alert((err as Error).message);
      } finally {
        setIsUploading(false);
      }
    } else {
      // Manual template registration
      try {
        const created = adminStore.createTemplate({
          name: newTplName,
          slug: newTplSlug,
          description: newTplDesc,
          categoryId: newTplCat,
          tags: ["Custom", newTplCat],
          supportsPhotos: parseInt(newTplPhotos, 10) > 0,
          maxPhotos: parseInt(newTplPhotos, 10) || 1,
          supportsMusic: true,
        });
        setTemplates([...adminStore.listTemplates()]);
        setLastUploadedSlug(created.slug);

        setCreateModalOpen(false);
        resetCreateForm();

        // Open live preview panel for created template
        setPreviewTemplate(created);
        setInstantHtmlPreview(undefined);
        setPreviewModalOpen(true);

        setToastMessage(`Created template "${created.name}" successfully! Now playing live preview.`);
        setTimeout(() => setToastMessage(null), 5000);
      } catch (err: unknown) {
        alert((err as Error).message);
      }
    }
  };

  const resetCreateForm = () => {
    setNewTplName("");
    setNewTplSlug("");
    setNewTplDesc("");
    setSelectedFiles([]);
    setDetectedFolder(null);
    setThumbnailPreviewUrl(null);
    setInstantHtmlPreview(undefined);
    if (instantBlobUrl) {
      try {
        URL.revokeObjectURL(instantBlobUrl);
      } catch {
        // Fallback
      }
      setInstantBlobUrl(null);
    }
  };

  const handleTogglePublish = (tpl: TemplateModel) => {
    const nextStatus = tpl.status === "active" ? "draft" : "active";
    const updated = adminStore.updateTemplate(tpl.slug, { status: nextStatus });
    if (updated) {
      setTemplates([...adminStore.listTemplates()]);
      setToastMessage(`Template "${tpl.name}" status updated to ${nextStatus.toUpperCase()}`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const openDeleteModal = (tpl: TemplateModel) => {
    setSelectedTemplateForDelete(tpl);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTemplateForDelete) return;
    adminStore.deleteTemplate(selectedTemplateForDelete.slug);
    setTemplates([...adminStore.listTemplates()]);
    setDeleteModalOpen(false);
    setToastMessage(`Template "${selectedTemplateForDelete.name}" deleted successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Template Catalog & Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Master Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage self-contained templates. Creators customize editable text fields, upload photos (per slot design), and attach a voice note or trimmed audio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-md shadow-purple-600/30 cursor-pointer"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Template
          </Button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Templates</span>
          <p className="text-xl font-black text-white mt-0.5">{templates.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Live in Studio</span>
          <p className="text-xl font-black text-emerald-400 mt-0.5">
            {templates.filter((t) => t.status === "active").length}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-pink-400 uppercase">Photo-Enabled</span>
          <p className="text-xl font-black text-pink-400 mt-0.5">
            {templates.filter((t) => t.supportsPhotos).length}
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
          <span className="text-[10px] font-bold text-cyan-400 uppercase">Audio Trimmer Ready</span>
          <p className="text-xl font-black text-cyan-400 mt-0.5">
            {templates.filter((t) => t.supportsMusic).length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by template name, slug, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-950 border-white/[0.08] text-xs text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {["all", "birthday", "love", "anniversary"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Template Registry Table */}
      <Card className="bg-gradient-to-b from-slate-900/90 to-[#0c101d]/90 border-white/[0.08] overflow-hidden shadow-xl shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-white/[0.08] text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="p-4 pl-6">Template & Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Customization Capabilities</th>
                <th className="p-4">Scene Sequence</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No templates matching current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((tpl, idx) => {
                  const sceneCount = tpl.versions?.[0]?.scenes?.length || 4;

                  return (
                    <tr
                      key={`${tpl.slug}-${tpl.id || idx}`}
                      id={`template-row-${tpl.slug}`}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Name & Slug */}
                      <td className="p-4 pl-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white text-xs">{tpl.name}</p>
                            {tpl.slug === lastUploadedSlug && (
                              <Badge variant="success" size="sm" className="text-[9px] bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse">
                                ✨ Just Uploaded
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tpl.slug}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                            {tpl.description}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 capitalize">
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="bg-purple-950/50 text-purple-300 border-purple-800/40 text-[10px]"
                        >
                          {tpl.categoryId}
                        </Badge>
                      </td>

                      {/* Customization Capabilities: Text, Photo Slots, Audio Trimmer */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-slate-300">
                            <Type className="w-3 h-3 text-cyan-400" />
                            Text
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-slate-300">
                            <ImageIcon className="w-3 h-3 text-pink-400" />
                            {tpl.supportsPhotos
                              ? `${tpl.maxPhotos || 1} Photo(s)`
                              : "Text Only"}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-950 border border-white/[0.06] text-slate-300">
                            <Mic className="w-3 h-3 text-purple-400" />
                            Voice / 30s Trimmer
                          </span>
                        </div>
                      </td>

                      {/* Self-contained sequence */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {sceneCount} Steps
                        </span>
                        <p className="text-[9px] text-slate-500">Internal sequence</p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {tpl.status === "active" ? (
                          <Badge variant="success" size="sm" className="text-[10px]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => openLivePreview(tpl)}
                            className="h-7 px-2.5 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold cursor-pointer shadow-xs"
                            leftIcon={<Play className="w-3 h-3 fill-white" />}
                            title="Watch Live Animation"
                          >
                            Live Preview
                          </Button>

                          <Link href={`/create?template=${tpl.slug}`} target="_blank">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs border-white/[0.1] hover:border-purple-500 text-slate-300 cursor-pointer"
                              title="Open in Creator Studio"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Button>
                          </Link>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openDuplicateModal(tpl)}
                            className="h-7 px-2.5 text-xs bg-purple-950/60 text-purple-200 hover:bg-purple-900 border border-purple-800/40 cursor-pointer"
                            title="Duplicate Template"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Clone
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(tpl)}
                            className="h-7 px-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            {tpl.status === "active" ? "Unpublish" : "Publish"}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(tpl)}
                            className="h-7 px-2 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DUPLICATE TEMPLATE MODAL */}
      {duplicateModalOpen && selectedTemplateForDup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <Card className="w-full max-w-md bg-slate-900 border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Duplicate Master Template</h3>
              </div>
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Clones <strong className="text-white">{selectedTemplateForDup.name}</strong> along with its text fields, photo slots, and audio duration parameters.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  New Template Name
                </label>
                <Input
                  value={dupName}
                  onChange={(e) => setDupName(e.target.value)}
                  placeholder="e.g. Sweet Celebration — Valentine Edition"
                  className="bg-slate-950 border-white/[0.08] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  New Unique Slug
                </label>
                <Input
                  value={dupSlug}
                  onChange={(e) => setDupSlug(e.target.value)}
                  placeholder="e.g. sweet-celebration-valentine"
                  className="bg-slate-950 border-white/[0.08] text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDuplicateModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteDuplicate}
                className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 cursor-pointer"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Create Cloned Edition
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ADD NEW TEMPLATE MODAL (WITH DIRECT FOLDER / FILE UPLOAD & INSTANT PREVIEW PANEL) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
          <Card
            className={`w-full ${
              selectedFiles.length > 0 ? "max-w-5xl" : "max-w-xl"
            } bg-slate-900 border-white/[0.12] shadow-2xl p-5 sm:p-6 space-y-4 my-6 max-h-[92vh] flex flex-col transition-all duration-300`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-sm">
                  <FolderUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {selectedFiles.length > 0 ? "Template Ingestion & Live Preview Studio" : "Add New Master Template"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedFiles.length > 0
                      ? "Test your coded animation live before publishing to creator studio"
                      : "Directly upload code & assets folder or register metadata"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  resetCreateForm();
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            {selectedFiles.length === 0 && (
              <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={() => setUploadMode("folder")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    uploadMode === "folder"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FolderUp className="w-3.5 h-3.5" />
                  Select / Drop Template Folder
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("manual")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    uploadMode === "manual"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Quick Manual Entry
                </button>
              </div>
            )}

            {/* Hidden Inputs for Folder and Files */}
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderSelect}
              multiple
              style={{ display: "none" }}
              {...({ webkitdirectory: "", directory: "" } as any)}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesSelect}
              multiple
              style={{ display: "none" }}
            />

            {/* Modal Body: If no files selected yet, show normal dropzone & form */}
            {selectedFiles.length === 0 ? (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {uploadMode === "folder" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      isDragging
                        ? "border-purple-500 bg-purple-950/20"
                        : "border-white/[0.12] bg-slate-950/60 hover:border-purple-500/40"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-800/60 text-purple-400 flex items-center justify-center mx-auto mb-3">
                      <FolderUp className="w-6 h-6" />
                    </div>

                    <p className="text-xs font-bold text-white mb-1">
                      Drag & drop your template folder here
                    </p>
                    <p className="text-[11px] text-slate-400 mb-4 max-w-sm mx-auto">
                      Select a folder containing your template code (<code className="text-purple-300">index.html</code> or <code className="text-purple-300">index.tsx</code>), thumbnail image, and optional <code className="text-purple-300">config.json</code>
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => folderInputRef.current?.click()}
                        className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                        leftIcon={<FolderUp className="w-3.5 h-3.5 text-purple-400" />}
                      >
                        Browse Folder
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs border-white/[0.1] text-slate-300 hover:text-white cursor-pointer"
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                      >
                        Select Files
                      </Button>
                    </div>
                  </div>
                )}

                {/* Standard Inputs when no files are selected yet */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Template Name
                    </label>
                    <Input
                      value={newTplName}
                      onChange={(e) => {
                        setNewTplName(e.target.value);
                        if (!newTplSlug) {
                          setNewTplSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, "-"));
                        }
                      }}
                      placeholder="e.g. Starry Polaroid Reveal"
                      className="bg-slate-950 border-white/[0.08] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Unique Slug
                    </label>
                    <Input
                      value={newTplSlug}
                      onChange={(e) => setNewTplSlug(e.target.value)}
                      placeholder="e.g. starry-polaroid-reveal"
                      className="bg-slate-950 border-white/[0.08] text-xs text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Category
                      </label>
                      <select
                        value={newTplCat}
                        onChange={(e) => setNewTplCat(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                      >
                        <option value="birthday">Birthday</option>
                        <option value="love">Love</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="friendship">Friendship</option>
                        <option value="proposal">Proposal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Photo Slots
                      </label>
                      <select
                        value={newTplPhotos}
                        onChange={(e) => setNewTplPhotos(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                      >
                        <option value="0">0 (Text Only)</option>
                        <option value="1">1 Polaroid Slot</option>
                        <option value="3">3 Photos Slideshow</option>
                        <option value="5">5 Photos Gallery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Audio Duration
                      </label>
                      <select
                        value={newTplDuration}
                        onChange={(e) => setNewTplDuration(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                      >
                        <option value="15">15s Trimmer Window</option>
                        <option value="20">20s Trimmer Window</option>
                        <option value="30">30s Trimmer Window</option>
                        <option value="45">45s Trimmer Window</option>
                        <option value="60">60s Trimmer Window</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                      Description & Celebration Mood
                    </label>
                    <Input
                      value={newTplDesc}
                      onChange={(e) => setNewTplDesc(e.target.value)}
                      placeholder="Describe the celebration theme & reveal experience..."
                      className="bg-slate-950 border-white/[0.08] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* DUAL-PANE STUDIO LAYOUT: CONFIG (LEFT) + INSTANT LIVE PREVIEW PANEL (RIGHT) */
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* LEFT COLUMN: Metadata & Checklist */}
                  <div className="lg:col-span-6 space-y-3">
                    {/* Detected Folder Summary */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.08] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">
                            Detected: {detectedFolder} ({selectedFiles.length} files)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={resetCreateForm}
                          className="text-[11px] text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          Clear & Re-select
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {thumbnailPreviewUrl ? (
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/[0.1] shrink-0">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-900 border border-white/[0.06] flex items-center justify-center text-slate-500 shrink-0 text-[10px]">
                            No Image
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-slate-300">
                            Files ready to ingest:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1 max-h-14 overflow-y-auto custom-scrollbar">
                            {selectedFiles.slice(0, 6).map((item, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 border border-white/[0.06]"
                              >
                                {item.file.name}
                              </span>
                            ))}
                            {selectedFiles.length > 6 && (
                              <span className="text-[9px] text-slate-500 self-center">
                                +{selectedFiles.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Template Name
                      </label>
                      <Input
                        value={newTplName}
                        onChange={(e) => {
                          setNewTplName(e.target.value);
                          if (!newTplSlug) {
                            setNewTplSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, "-"));
                          }
                        }}
                        placeholder="e.g. Romantic Falling Hearts"
                        className="bg-slate-950 border-white/[0.08] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Unique Slug
                      </label>
                      <Input
                        value={newTplSlug}
                        onChange={(e) => setNewTplSlug(e.target.value)}
                        placeholder="e.g. romantic-falling-hearts"
                        className="bg-slate-950 border-white/[0.08] text-xs text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Category
                        </label>
                        <select
                          value={newTplCat}
                          onChange={(e) => setNewTplCat(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                        >
                          <option value="birthday">Birthday</option>
                          <option value="love">Love</option>
                          <option value="anniversary">Anniversary</option>
                          <option value="friendship">Friendship</option>
                          <option value="proposal">Proposal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Photos
                        </label>
                        <select
                          value={newTplPhotos}
                          onChange={(e) => setNewTplPhotos(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                        >
                          <option value="0">0 (Text Only)</option>
                          <option value="1">1 Photo Slot</option>
                          <option value="3">3 Slideshow</option>
                          <option value="5">5 Gallery</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Duration
                        </label>
                        <select
                          value={newTplDuration}
                          onChange={(e) => setNewTplDuration(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/[0.08] text-xs text-white"
                        >
                          <option value="15">15s Trimmer</option>
                          <option value="20">20s Trimmer</option>
                          <option value="30">30s Trimmer</option>
                          <option value="45">45s Trimmer</option>
                          <option value="60">60s Trimmer</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                        Celebration Mood & Description
                      </label>
                      <Input
                        value={newTplDesc}
                        onChange={(e) => setNewTplDesc(e.target.value)}
                        placeholder="Describe the celebration theme..."
                        className="bg-slate-950 border-white/[0.08] text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN: INSTANT LIVE ANIMATION PREVIEW PANEL */}
                  <div className="lg:col-span-6 flex flex-col rounded-2xl bg-slate-950 border border-purple-500/40 p-3.5 space-y-2.5 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Instant Live Preview Panel
                        </span>
                        <Badge variant="success" size="sm" className="text-[9px] bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                          Live Active
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Device Frame Switcher */}
                        <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => setInstantPreviewDevice("mobile")}
                            className={`p-1.5 rounded text-xs cursor-pointer ${
                              instantPreviewDevice === "mobile"
                                ? "bg-purple-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Mobile Portrait (375x667)"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInstantPreviewDevice("tablet")}
                            className={`p-1.5 rounded text-xs cursor-pointer ${
                              instantPreviewDevice === "tablet"
                                ? "bg-purple-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Tablet View"
                          >
                            <Tablet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setInstantPreviewDevice("desktop")}
                            className={`p-1.5 rounded text-xs cursor-pointer ${
                              instantPreviewDevice === "desktop"
                                ? "bg-purple-600 text-white"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Desktop View"
                          >
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Replay Button */}
                        <button
                          type="button"
                          onClick={() => setInstantPreviewCounter((prev) => prev + 1)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Restart Animation"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Fullscreen Expand Button */}
                        <Button
                          type="button"
                          size="sm"
                          onClick={openInstantFolderPreview}
                          className="h-7 px-2 text-[11px] font-bold bg-purple-950/80 text-purple-200 hover:bg-purple-900 border border-purple-800/50 cursor-pointer"
                          title="Open Fullscreen Preview Modal"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Expand
                        </Button>
                      </div>
                    </div>

                    {/* Active Animation Viewport Shell */}
                    <div className="h-[390px] bg-[#050206] rounded-xl border border-white/[0.08] flex items-center justify-center p-2 relative overflow-hidden">
                      <div
                        className={`transition-all duration-300 relative shadow-2xl overflow-hidden flex flex-col ${
                          instantPreviewDevice === "mobile"
                            ? "w-[210px] h-[360px] rounded-[26px] border-4 border-slate-800 bg-black shrink-0"
                            : instantPreviewDevice === "tablet"
                            ? "w-[270px] h-[360px] rounded-[18px] border-4 border-slate-800 bg-black shrink-0"
                            : "w-full max-w-[500px] h-[310px] rounded-lg border border-slate-800 bg-black shadow-lg shrink-0"
                        }`}
                      >
                        {instantPreviewDevice === "mobile" && (
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-slate-800 rounded-full z-20 pointer-events-none" />
                        )}
                        {instantPreviewDevice === "tablet" && (
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rounded-full z-20 pointer-events-none" />
                        )}
                        {instantPreviewDevice === "desktop" && (
                          <div className="h-6 px-2.5 bg-slate-900 border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
                              <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">Desktop Viewport</span>
                            <div className="w-6" />
                          </div>
                        )}
                        <iframe
                          key={`${instantBlobUrl || newTplSlug}-${instantPreviewCounter}`}
                          src={instantBlobUrl || `/api/admin/templates/preview?slug=${newTplSlug || 'love-animation'}`}
                          className="flex-1 w-full h-full border-0 bg-black"
                          allow="autoplay; camera; microphone"
                          title="Instant Live Animation Preview"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-white/[0.06]">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Live animation running from your files</span>
                      </span>
                      <span className="text-purple-400 font-mono text-[10px]">
                        Interactive canvas / code
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
              <div>
                {selectedFiles.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openInstantFolderPreview}
                    className="text-xs border-purple-500/40 text-purple-300 hover:text-white cursor-pointer"
                    leftIcon={<Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />}
                  >
                    Open Fullscreen Preview
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCreateModalOpen(false);
                    resetCreateForm();
                  }}
                  className="text-xs cursor-pointer"
                  disabled={isUploading}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={handleUploadAndRegister}
                  disabled={isUploading || !newTplName || !newTplSlug}
                  className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 cursor-pointer shadow-md shadow-purple-600/25"
                  leftIcon={
                    isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : uploadMode === "folder" && selectedFiles.length > 0 ? (
                      <FolderUp className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isUploading
                    ? "Ingesting Template Files..."
                    : uploadMode === "folder" && selectedFiles.length > 0
                    ? `Upload Folder & Register (${selectedFiles.length} files)`
                    : "Register Master Template"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && selectedTemplateForDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <Card className="w-full max-w-sm bg-slate-900 border-white/[0.1] shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Delete Template?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently delete template <strong className="text-white">{selectedTemplateForDelete.name}</strong>?
            </p>
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDelete}
                className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
              >
                Delete Permanently
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* LIVE TEMPLATE ANIMATION PREVIEW MODAL */}
      {previewModalOpen && previewTemplate && (
        <AdminTemplatePreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          templateSlug={previewTemplate.slug}
          templateName={previewTemplate.name}
          category={previewTemplate.categoryId}
          customPreviewHtml={instantHtmlPreview}
          isNewlyUploaded={previewTemplate.slug === lastUploadedSlug}
        />
      )}
    </div>
  );
}
