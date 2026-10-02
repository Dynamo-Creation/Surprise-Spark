import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthorizedAdmin } from "@/lib/admin/adminAuth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB per file
const MAX_TOTAL_SIZE = 60 * 1024 * 1024; // 60 MB total payload
const MAX_FILE_COUNT = 250;

const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".mp3",
  ".wav",
  ".ogg",
  ".mp4",
  ".woff2",
  ".ttf",
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".glb",
  ".gltf",
]);

const PUBLIC_ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".mp3",
  ".wav",
  ".ogg",
  ".mp4",
  ".woff2",
  ".ttf",
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
]);

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Server-Side Administrator Authorization
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
    const isAuthedAdmin = Boolean(user?.email && isAuthorizedAdmin(user.email));

    if (!isAuthedAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "Custom Template").slice(0, 100);
    let rawSlug = String(formData.get("slug") || "").trim();
    const category = String(formData.get("category") || "birthday").slice(0, 50);
    const description = String(formData.get("description") || "").slice(0, 500);
    const supportsPhotos = formData.get("supportsPhotos") === "true";
    const maxPhotos = Math.min(Math.max(parseInt(String(formData.get("maxPhotos") || "1"), 10) || 1, 1), 20);
    const audioDuration = Math.min(Math.max(parseInt(String(formData.get("audioDuration") || "30"), 10) || 30, 5), 300);

    // 2. Strict Slug Sanitization (Alphanumeric, hyphens, underscores only)
    let slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50);

    if (!slug || !/^[a-z0-9_-]{2,50}$/.test(slug)) {
      slug = `template-${Date.now().toString(36)}`;
    }

    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided in template upload package." },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILE_COUNT) {
      return NextResponse.json(
        { success: false, error: `Too many files. Limit is ${MAX_FILE_COUNT} files.` },
        { status: 400 }
      );
    }

    const pathsJson = formData.get("paths") as string;
    let relativePaths: string[] = [];

    if (pathsJson) {
      try {
        const parsed = JSON.parse(pathsJson);
        if (Array.isArray(parsed)) {
          relativePaths = parsed.map((p) => String(p));
        }
      } catch {
        relativePaths = [];
      }
    }

    // 3. Prepare Target Directories with Canonical Path Verification
    const rootDir = process.cwd();
    const publicDir = path.resolve(rootDir, "public", "templates", slug);
    const codeDir = path.resolve(rootDir, "lib", "engine", "templates", "custom", slug);

    await fs.mkdir(publicDir, { recursive: true });
    await fs.mkdir(codeDir, { recursive: true });

    let detectedThumbnailUrl = "/templates/sweet-celebration/thumbnail.jpg";
    const savedFilesList: string[] = [];
    let totalBytesUploaded = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === "string") continue;

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds the 20MB per-file size limit.` },
          { status: 400 }
        );
      }

      totalBytesUploaded += file.size;
      if (totalBytesUploaded > MAX_TOTAL_SIZE) {
        return NextResponse.json(
          { success: false, error: "Total package upload size exceeds 60MB limit." },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `File format "${ext}" is not permitted for template assets.` },
          { status: 400 }
        );
      }

      // 4. Robust Path Traversal Prevention
      let rawRelativePath = relativePaths[i] || file.name;
      // Normalize slashes and strip leading directory names if full folder was uploaded
      let normalized = rawRelativePath.replace(/\\/g, "/");
      const segments = normalized.split("/").filter((s) => s && s !== "." && s !== "..");
      if (segments.length > 1) {
        // Strip top-level folder name (e.g., "my-template/index.html" -> "index.html")
        normalized = segments.slice(1).join("/");
      } else if (segments.length === 1) {
        normalized = segments[0];
      } else {
        normalized = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
      }

      // Final canonical path boundary checks
      const codeDest = path.resolve(codeDir, normalized);
      const publicDest = path.resolve(publicDir, normalized);

      if (!codeDest.startsWith(codeDir) || !publicDest.startsWith(publicDir)) {
        // Attempted path traversal out of destination directory
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Save to code directory
      await fs.mkdir(path.dirname(codeDest), { recursive: true });
      await fs.writeFile(codeDest, buffer);

      // Save to public directory if it's a web-runnable or media asset
      if (PUBLIC_ASSET_EXTENSIONS.has(ext)) {
        await fs.mkdir(path.dirname(publicDest), { recursive: true });
        await fs.writeFile(publicDest, buffer);
      }

      savedFilesList.push(normalized);

      // Thumbnail detection
      const lowerName = path.basename(normalized).toLowerCase();
      if (
        lowerName === "thumbnail.jpg" ||
        lowerName === "thumbnail.png" ||
        lowerName === "thumbnail.webp" ||
        lowerName === "cover.jpg" ||
        lowerName === "preview.jpg" ||
        lowerName === "preview.png"
      ) {
        detectedThumbnailUrl = `/templates/${slug}/${normalized}`;
      }
    }

    // Save manifest template.json in code directory
    const templateManifest = {
      id: `tpl-${slug}`,
      slug,
      name,
      categoryId: category,
      description,
      thumbnailUrl: detectedThumbnailUrl,
      previewUrl: `/api/admin/templates/preview?slug=${slug}`,
      supportsPhotos,
      maxPhotos,
      supportsMusic: true,
      audioDuration,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: savedFilesList,
    };

    await fs.writeFile(
      path.join(codeDir, "template.json"),
      JSON.stringify(templateManifest, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      message: `Template "${name}" uploaded and registered securely!`,
      template: templateManifest,
      savedFilesCount: savedFilesList.length,
    });
  } catch (error: unknown) {
    console.error("[Template Upload Security] Error during upload:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process template upload safely.",
      },
      { status: 500 }
    );
  }
}
