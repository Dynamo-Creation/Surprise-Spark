import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string) || "Custom Template";
    let slug = (formData.get("slug") as string) || "";
    const category = (formData.get("category") as string) || "birthday";
    const description = (formData.get("description") as string) || "";
    const supportsPhotos = formData.get("supportsPhotos") === "true";
    const maxPhotos = parseInt((formData.get("maxPhotos") as string) || "1", 10);
    const audioDuration = parseInt((formData.get("audioDuration") as string) || "30", 10);

    // Sanitize slug
    slug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      slug = `template-${Date.now().toString(36)}`;
    }

    const files = formData.getAll("files") as File[];
    const pathsJson = formData.get("paths") as string;
    let relativePaths: string[] = [];

    if (pathsJson) {
      try {
        relativePaths = JSON.parse(pathsJson);
      } catch {
        relativePaths = [];
      }
    }

    // Prepare directories
    const rootDir = process.cwd();
    const publicDir = path.join(rootDir, "public", "templates", slug);
    const codeDir = path.join(rootDir, "lib", "engine", "templates", "custom", slug);

    await fs.mkdir(publicDir, { recursive: true });
    await fs.mkdir(codeDir, { recursive: true });

    let detectedThumbnailUrl = "/templates/sweet-celebration/thumbnail.jpg";
    const savedFilesList: string[] = [];

    // Media file extensions
    const mediaExtensions = new Set([
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
    ]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === "string") continue;

      // Determine subpath inside the folder
      let relativePath = relativePaths[i] || file.name;
      // Strip leading folder name if present (e.g. "my-template/index.tsx" -> "index.tsx")
      const parts = relativePath.split(/[/\\]/);
      if (parts.length > 1) {
        relativePath = parts.slice(1).join("/");
      }

      const ext = path.extname(file.name).toLowerCase();
      const isPublicAsset = mediaExtensions.has(ext) || ext === ".html" || ext === ".css" || ext === ".js" || ext === ".mjs" || ext === ".json";

      const buffer = Buffer.from(await file.arrayBuffer());

      // Always save to code directory
      const codeDest = path.join(codeDir, relativePath);
      await fs.mkdir(path.dirname(codeDest), { recursive: true });
      await fs.writeFile(codeDest, buffer);

      // Also save to public directory if it's media or web runnable asset
      if (isPublicAsset) {
        const publicDest = path.join(publicDir, relativePath);
        await fs.mkdir(path.dirname(publicDest), { recursive: true });
        await fs.writeFile(publicDest, buffer);
      }

      savedFilesList.push(relativePath);

      // Check if this file is a thumbnail
      const lowerName = path.basename(relativePath).toLowerCase();
      if (
        lowerName === "thumbnail.jpg" ||
        lowerName === "thumbnail.png" ||
        lowerName === "thumbnail.webp" ||
        lowerName === "cover.jpg" ||
        lowerName === "preview.jpg" ||
        lowerName === "preview.png"
      ) {
        detectedThumbnailUrl = `/templates/${slug}/${relativePath}`;
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
      message: `Template "${name}" uploaded and registered successfully!`,
      template: templateManifest,
      savedFilesCount: savedFilesList.length,
    });
  } catch (error: unknown) {
    console.error("Template upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error)?.message || "Failed to upload template folder.",
      },
      { status: 500 }
    );
  }
}
