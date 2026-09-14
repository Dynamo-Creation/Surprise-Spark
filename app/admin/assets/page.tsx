"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Upload,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  History,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Search,
  Tag,
  ArrowRight,
  ShieldAlert,
  Play,
  Maximize2,
  X,
  FileCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ASSET_CATEGORIES,
  AssetCategory,
  Asset3DModel,
  AssetSlot,
  SlotId,
  StandardAnimation,
  STANDARD_ANIMATIONS,
  TransformDefaults,
} from "@/lib/assets/types";
import { assetStore } from "@/lib/assets/assetStore";
import { validate3DFile, MAX_ASSET_SIZE_BYTES } from "@/lib/assets/assetValidator";
import { ExperienceCanvas } from "@/components/3d/ExperienceCanvas";
import { CameraController } from "@/components/3d/CameraController";
import { SceneLighting } from "@/components/3d/SceneLighting";
import { ModelRenderer } from "@/components/3d/ModelRenderer";

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset3DModel[]>([]);
  const [slots, setSlots] = useState<AssetSlot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer states
  const [previewAsset, setPreviewAsset] = useState<Asset3DModel | null>(null);
  const [editAsset, setEditAsset] = useState<Asset3DModel | null>(null);
  const [slotManagerOpen, setSlotManagerOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Preview interactive controls
  const [previewAnimation, setPreviewAnimation] = useState<StandardAnimation>("Idle");
  const [previewWireframe, setPreviewWireframe] = useState(false);
  const [previewWarning, setPreviewWarning] = useState<string | null>(null);

  // Upload form state
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<AssetCategory>("characters");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Deletion feedback state
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Refresh assets & slots from store
  const refresh = () => {
    setAssets(assetStore.getAssets());
    setSlots(assetStore.getSlots());
  };

  useEffect(() => {
    refresh();
  }, []);

  // Filtered asset list
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchCategory = selectedCategory === "all" || a.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [assets, selectedCategory, searchQuery]);

  // Handle file drop / select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_ASSET_SIZE_BYTES) {
      setUploadError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max limit is 25MB.`);
      return;
    }

    const buffer = await file.arrayBuffer();
    const val = validate3DFile(file.name, buffer);
    if (!val.valid) {
      setUploadError(val.errors.join("; "));
      return;
    }

    setUploadFile(file);
    if (!uploadName) {
      const cleanName = file.name
        .replace(/\.(glb|gltf)$/i, "")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setUploadName(cleanName);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadFile) {
      setUploadError("Please provide an asset name and select a valid .glb or .gltf file.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const buffer = await uploadFile.arrayBuffer();
      const format = uploadFile.name.toLowerCase().endsWith(".glb") ? "glb" : "gltf";

      assetStore.uploadAsset({
        name: uploadName,
        category: uploadCategory,
        format,
        fileName: uploadFile.name,
        fileBuffer: buffer,
        tags: [uploadCategory, "custom-upload"],
      });

      setUploadSuccess(`Successfully uploaded and registered '${uploadName}'!`);
      setUploadName("");
      setUploadFile(null);
      refresh();

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload 3D asset.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Safe non-destructive delete handler
  const handleDelete = (assetId: string) => {
    const result = assetStore.deleteAsset(assetId);
    if (result.success) {
      setActionNotice({ type: "success", message: "Asset deleted successfully." });
      refresh();
    } else {
      setActionNotice({ type: "error", message: result.error || "Failed to delete asset." });
    }
  };

  // Slot assignment change handler
  const handleAssignSlot = (slotId: SlotId, assetId: string) => {
    assetStore.assignSlotAsset(slotId, assetId);
    refresh();
    setActionNotice({ type: "success", message: `Slot '${slotId}' updated to use selected asset.` });
  };

  // Replace file handler (new version)
  const handleReplaceVersion = async (assetId: string, file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      assetStore.replaceAssetFile(assetId, {
        fileName: file.name,
        fileBuffer: buffer,
        changelog: `Uploaded replacement file: ${file.name}`,
      });
      refresh();
      if (editAsset && editAsset.id === assetId) {
        setEditAsset(assetStore.getAssetById(assetId));
      }
      setActionNotice({ type: "success", message: "Created new version successfully. Published experiences remain immutable." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Replacement failed.";
      setActionNotice({ type: "error", message: msg });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200 border ${
            actionNotice.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
              : "bg-rose-950/40 border-rose-800/80 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              3D Asset Management System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Reusable 3D Asset Library & Slots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage GLB/GLTF models, abstract semantic slots, animation mappings, and transform defaults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlotManagerOpen(true)}
            leftIcon={<Layers className="w-4 h-4 text-purple-400" />}
            className="text-xs border-slate-700 bg-slate-900"
            id="btn-open-slots"
          >
            Manage Slots ({slots.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="text-xs shadow-md shadow-pink-500/20"
            id="btn-open-upload"
          >
            Upload 3D Asset (.glb / .gltf)
          </Button>
        </div>
      </div>

      {/* Quick Slot Assignments Bar */}
      <Card className="p-4 bg-slate-900/80 border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Active Abstract Slots (Zero Code Template Swapping)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Templates link to slots, allowing instant asset replacement.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {slots.map((slot) => {
            const assigned = assets.find((a) => a.id === slot.assignedAssetId);
            return (
              <div
                key={slot.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
                id={`slot-card-${slot.id}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block truncate">
                    {slot.id}
                  </span>
                  <p className="font-bold text-xs text-white truncate mt-1">
                    {assigned ? assigned.name : "Procedural Fallback"}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{slot.category}</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    v{assigned?.currentVersion || 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter Bar & Category Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search 3D assets, tags, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="text-xs bg-slate-900/90 border-slate-800"
              id="input-asset-search"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredAssets.length}</strong> of{" "}
            {assets.length} assets
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            All Categories
          </button>
          {ASSET_CATEGORIES.map((cat) => {
            const count = assets.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="asset-grid">
        {filteredAssets.map((asset) => {
          const usage = assetStore.inspectUsage(asset.id);
          const assignedSlot = slots.find((s) => s.assignedAssetId === asset.id);
          const isReferenced = usage.length > 0;

          return (
            <Card
              key={asset.id}
              className="p-5 bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              id={`card-asset-${asset.id}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    size="sm"
                    className="capitalize text-[10px] text-purple-300 border-purple-800/80 bg-purple-950/30"
                  >
                    {asset.category}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {asset.format}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 font-bold">
                      v{asset.currentVersion}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {asset.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{asset.description}</p>

                {/* Slot or Reference indicator */}
                {assignedSlot && (
                  <div className="mb-3 p-2 rounded-lg bg-pink-950/30 border border-pink-900/40 flex items-center justify-between text-[10px]">
                    <span className="text-pink-300 font-semibold flex items-center gap-1">
                      <Layers className="w-3 h-3 text-pink-400" />
                      Assigned Slot:
                    </span>
                    <span className="font-mono text-white font-bold">{assignedSlot.id}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {asset.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{asset.polyCount ? `${asset.polyCount} polys` : "Optimized mesh"}</span>
                  <span>{asset.availableAnimations.length} animations</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setPreviewAsset(asset);
                      setPreviewAnimation("Idle");
                      setPreviewWarning(null);
                    }}
                    className="text-xs h-7 px-2 bg-purple-950/50 text-purple-200 hover:bg-purple-900/60"
                    leftIcon={<Eye className="w-3 h-3" />}
                    id={`btn-preview-${asset.id}`}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditAsset(asset)}
                    className="text-xs h-7 px-2 border-slate-700 hover:bg-slate-800 text-slate-300"
                    leftIcon={<Sliders className="w-3 h-3" />}
                    id={`btn-edit-${asset.id}`}
                  >
                    Config
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isReferenced}
                    onClick={() => handleDelete(asset.id)}
                    title={
                      isReferenced
                        ? `Cannot delete: referenced by ${usage.map((u) => u.name).join(", ")}`
                        : "Delete Asset"
                    }
                    className={`text-xs h-7 px-2 border-slate-800 ${
                      isReferenced
                        ? "opacity-40 cursor-not-allowed text-slate-600"
                        : "text-rose-400 hover:bg-rose-950/50 hover:border-rose-800"
                    }`}
                    id={`btn-delete-${asset.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 1. INTERACTIVE 3D PREVIEW MODAL                                     */}
      {/* ------------------------------------------------------------------- */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-700/60 flex items-center justify-center text-purple-300">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-white">{previewAsset.name}</h2>
                    <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                      v{previewAsset.currentVersion} • {previewAsset.format.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{previewAsset.activeFileName}</p>
                </div>
              </div>

              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                id="btn-close-preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Banner if Animation Fallback occurs */}
            {previewWarning && (
              <div className="p-3 bg-amber-950/60 border-b border-amber-800/80 text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{previewWarning}</span>
              </div>
            )}

            {/* 3D Viewport */}
            <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-950">
              <ExperienceCanvas fallbackSceneType="gift">
                <CameraController
                  position={previewAsset.transformDefaults.cameraFraming?.target ? [0, 1, 5] : [0, 0, 5]}
                  fov={previewAsset.transformDefaults.cameraFraming?.fov || 45}
                  allowOrbit={true}
                />
                <SceneLighting
                  ambientColor="#ffffff"
                  ambientIntensity={0.8}
                  directionalColor="#ffffff"
                  directionalPosition={[5, 8, 5]}
                />
                <ModelRenderer
                  url={previewAsset.activeFileUrl}
                  category={previewAsset.category}
                  transform={previewAsset.transformDefaults}
                  activeAnimation={previewAnimation}
                  animationMappings={previewAsset.animationMappings}
                  wireframe={previewWireframe}
                  onAnimationWarning={(warn) => setPreviewWarning(warn)}
                />
              </ExperienceCanvas>

              {/* Viewport Overlay Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setPreviewWireframe(!previewWireframe)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-md transition-colors ${
                    previewWireframe
                      ? "bg-purple-600 text-white border-purple-500"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                  id="btn-toggle-wireframe"
                >
                  Wireframe
                </button>
              </div>

              <div className="absolute bottom-3 left-3 text-[10px] text-slate-500 font-mono pointer-events-none">
                Drag to Rotate • Scroll to Zoom
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                  Test Animation Contract:
                </span>
                <div className="flex items-center gap-1.5">
                  {STANDARD_ANIMATIONS.map((anim) => (
                    <button
                      key={anim.name}
                      onClick={() => {
                        setPreviewAnimation(anim.name);
                        setPreviewWarning(null);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                        previewAnimation === anim.name
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                      id={`btn-anim-${anim.name.toLowerCase()}`}
                    >
                      {anim.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditAsset(previewAsset);
                  setPreviewAsset(null);
                }}
                className="text-xs border-slate-700 shrink-0"
              >
                Edit Transform & Mappings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 2. UPLOAD MODAL                                                     */}
      {/* ------------------------------------------------------------------- */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h2 className="font-bold text-lg text-white">Upload 3D Asset</h2>
                <p className="text-xs text-slate-400">Add a .glb or .gltf model to the asset catalog.</p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  3D Model File (.glb, .gltf)
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-purple-500/80 transition-colors bg-slate-950/40">
                  <input
                    type="file"
                    id="file-upload-input"
                    accept=".glb,.gltf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-xs font-bold text-white">
                      {uploadFile ? uploadFile.name : "Click to select or drag .glb/.gltf file"}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Max file size: 25MB • Formats: GLB (binary glTF), GLTF
                    </span>
                  </label>
                </div>
              </div>

              {/* Asset Name */}
              <Input
                label="Asset Name"
                placeholder="e.g. Astro Robot Companion"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                required
                id="input-upload-name"
              />

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asset Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as AssetCategory)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-purple-500"
                  id="select-upload-category"
                >
                  {ASSET_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label} — {cat.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadModalOpen(false)}
                  className="text-xs border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUploading}
                  className="text-xs"
                  id="btn-submit-upload"
                >
                  Register Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 3. SLOTS MANAGER MODAL                                              */}
      {/* ------------------------------------------------------------------- */}
      {slotManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="font-bold text-lg text-white">Abstract 3D Asset Slots</h2>
                <p className="text-xs text-slate-400">
                  Bind semantic slots to 3D models. All templates referencing the slot automatically update.
                </p>
              </div>
              <button
                onClick={() => setSlotManagerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                id="btn-close-slots"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {slots.map((slot) => {
                const assigned = assets.find((a) => a.id === slot.assignedAssetId);
                const matchingCategoryAssets = assets.filter((a) => a.category === slot.category);

                return (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    id={`slot-row-${slot.id}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-400">{slot.id}</span>
                        <Badge variant="outline" size="sm" className="text-[10px] capitalize">
                          {slot.category}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-0.5">{slot.name}</h4>
                      <p className="text-xs text-slate-400">{slot.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={slot.assignedAssetId}
                        onChange={(e) => handleAssignSlot(slot.id, e.target.value)}
                        className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                        id={`select-slot-${slot.id}`}
                      >
                        {matchingCategoryAssets.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} (v{a.currentVersion})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSlotManagerOpen(false)}
                className="text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 4. ASSET CONFIG & TRANSFORM EDITOR DRAWER                           */}
      {/* ------------------------------------------------------------------- */}
      {editAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h2 className="font-bold text-lg text-white">Asset Configuration</h2>
                  <p className="text-xs text-slate-400">{editAsset.name} (v{editAsset.currentVersion})</p>
                </div>
                <button
                  onClick={() => setEditAsset(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  id="btn-close-config"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transform Defaults Form */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                    Default Transform & Framing
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Pos X</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editAsset.transformDefaults.position[0]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const newPos: [number, number, number] = [
                            val,
                            editAsset.transformDefaults.position[1],
                            editAsset.transformDefaults.position[2],
                          ];
                          assetStore.updateAsset(editAsset.id, {
                            transformDefaults: { ...editAsset.transformDefaults, position: newPos },
                          });
                          refresh();
                          setEditAsset(assetStore.getAssetById(editAsset.id));
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        id="input-pos-x"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Pos Y</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editAsset.transformDefaults.position[1]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const newPos: [number, number, number] = [
                            editAsset.transformDefaults.position[0],
                            val,
                            editAsset.transformDefaults.position[2],
                          ];
                          assetStore.updateAsset(editAsset.id, {
                            transformDefaults: { ...editAsset.transformDefaults, position: newPos },
                          });
                          refresh();
                          setEditAsset(assetStore.getAssetById(editAsset.id));
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        id="input-pos-y"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Scale</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editAsset.transformDefaults.scale[0]}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 1;
                          const newScl: [number, number, number] = [val, val, val];
                          assetStore.updateAsset(editAsset.id, {
                            transformDefaults: { ...editAsset.transformDefaults, scale: newScl },
                          });
                          refresh();
                          setEditAsset(assetStore.getAssetById(editAsset.id));
                        }}
                        className="w-full h-8 px-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        id="input-scale"
                      />
                    </div>
                  </div>
                </div>

                {/* Animation Contract Mapping */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Character Animation Contract Mappings
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Standardized names used by templates
                    </span>
                  </div>

                  <div className="space-y-2">
                    {editAsset.availableAnimations.map((clip) => {
                      const currentStandard = editAsset.animationMappings[clip] || "Idle";
                      return (
                        <div
                          key={clip}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <span className="font-mono text-slate-300">{clip}</span>
                          <div className="flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                            <select
                              value={currentStandard}
                              onChange={(e) => {
                                const newMap = {
                                  ...editAsset.animationMappings,
                                  [clip]: e.target.value as StandardAnimation,
                                };
                                assetStore.updateAsset(editAsset.id, { animationMappings: newMap });
                                refresh();
                                setEditAsset(assetStore.getAssetById(editAsset.id));
                              }}
                              className="h-7 px-2 rounded bg-slate-900 border border-slate-700 text-[11px] text-white"
                              id={`select-mapping-${clip}`}
                            >
                              {STANDARD_ANIMATIONS.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Version History & Replace File */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                      Version History ({editAsset.versions.length})
                    </h4>
                    <label
                      htmlFor="replace-file-input"
                      className="cursor-pointer text-[11px] text-pink-400 font-bold hover:underline"
                    >
                      + Upload New Version
                    </label>
                    <input
                      type="file"
                      id="replace-file-input"
                      accept=".glb,.gltf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceVersion(editAsset.id, file);
                      }}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {editAsset.versions.map((ver) => (
                      <div
                        key={ver.versionNumber}
                        className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                          ver.versionNumber === editAsset.currentVersion
                            ? "bg-purple-950/30 border-purple-800/60 text-purple-200"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        <div>
                          <span className="font-bold">v{ver.versionNumber}.0</span>
                          <span className="text-[10px] text-slate-500 ml-2">{ver.fileName}</span>
                        </div>
                        <span className="text-[10px] font-mono">
                          {(ver.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Inspector */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Template & Slot References
                  </h4>
                  {assetStore.inspectUsage(editAsset.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No active template references. Safe to delete.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {assetStore.inspectUsage(editAsset.id).map((u) => (
                        <div
                          key={u.id}
                          className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                        >
                          <span className="text-slate-300 font-medium">{u.name}</span>
                          <Badge variant="outline" size="sm" className="text-[10px] capitalize">
                            {u.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setEditAsset(null)}
                className="text-xs"
              >
                Save & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
