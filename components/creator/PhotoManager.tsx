"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Eye,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { processAndCompressImage } from "@/lib/utils/imageCompressor";

export interface PhotoManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos: number;
  templateName?: string;
  supportsPhotos?: boolean;
}

export function PhotoManager({
  photos,
  onChange,
  maxPhotos,
  templateName = "Template",
  supportsPhotos = true,
}: PhotoManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // If template does not support photos
  if (!supportsPhotos || maxPhotos <= 0) {
    return (
      <div className="p-8 rounded-3xl border border-dashed border-pink-200 dark:border-pink-900/40 bg-pink-50/30 dark:bg-pink-950/10 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {templateName} is a 3D Storybook Experience
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          This template uses 100% real-time 3D geometry and characters without requiring photo uploads. You can jump straight to Theme & Music!
        </p>
      </div>
    );
  }

  const remainingSlots = Math.max(0, maxPhotos - photos.length);

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles = Array.from(files);

    if (validFiles.length === 0) return;

    if (validFiles.length > remainingSlots) {
      setErrorMessage(
        `You can only add ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} (Limit: ${maxPhotos}).`
      );
      return;
    }

    setIsProcessing(true);
    const newPhotos = [...photos];

    try {
      for (const file of validFiles) {
        const result = await processAndCompressImage(file);
        newPhotos.push(result.dataUrl);
      }
      onChange(newPhotos);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process photo.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceIndex === null || !e.target.files || e.target.files.length === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const file = e.target.files[0];
      const result = await processAndCompressImage(file);
      const updated = [...photos];
      updated[replaceIndex] = result.dataUrl;
      onChange(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to replace photo.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      setReplaceIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleDelete = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length) return;
    const updated = [...photos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFile}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-pink-500" />
            Photo Memories ({photos.length} / {maxPhotos})
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Upload cherished photos. They float as 3D polaroids in the celebration scenes.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 self-start sm:self-auto">
          {remainingSlots === 0 ? "Maximum limit reached" : `${remainingSlots} slots remaining`}
        </span>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone (if space available) */}
      {remainingSlots > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 scale-[1.01]"
              : "border-slate-200 dark:border-slate-800 hover:border-pink-400 bg-slate-50/50 dark:bg-slate-900/40"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-pink-500 shadow-sm flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {isProcessing ? "Optimizing & Compressing..." : "Drag & drop photos here, or browse"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports JPEG, PNG, WebP up to 10MB each (auto-resized for 3D performance)
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isProcessing}
            className="text-xs pointer-events-none"
          >
            {isProcessing ? "Processing..." : "Select Photos"}
          </Button>
        </div>
      )}

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photoUrl, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm aspect-square flex flex-col justify-between p-2"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${photoUrl})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

              {/* Top Controls: Order badge & Preview / Delete */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full">
                  #{index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewModalUrl(photoUrl);
                    }}
                    className="p-1 rounded-lg bg-black/50 hover:bg-black text-white transition-colors cursor-pointer"
                    title="Preview full size"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="p-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Controls: Reorder & Replace */}
              <div className="relative z-10 flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, index - 1)}
                    className="p-1 rounded-lg bg-black/60 hover:bg-black text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move earlier"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={index === photos.length - 1}
                    onClick={() => handleMove(index, index + 1)}
                    className="p-1 rounded-lg bg-black/60 hover:bg-black text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move later"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReplaceIndex(index);
                    replaceInputRef.current?.click();
                  }}
                  className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-2 shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Photo preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
