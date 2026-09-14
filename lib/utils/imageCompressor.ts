/**
 * Client-Side Image Compression & Validation Utility
 * Validates, resizes, and compresses photos directly in the browser
 * to ensure fast uploads, lightweight textures, and smooth mobile 3D rendering.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  format: "image/webp" | "image/jpeg";
}

export interface ImageValidationOptions {
  maxSizeBytes?: number; // Default: 10MB
  minWidth?: number; // Default: 200px
  minHeight?: number; // Default: 200px
  maxDimension?: number; // Default: 1200px
  quality?: number; // Default: 0.85
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  minWidth: 200,
  minHeight: 200,
  maxDimension: 1200,
  quality: 0.85,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

export async function processAndCompressImage(
  file: File,
  options?: ImageValidationOptions
): Promise<ProcessedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 1. Validate MIME type
  if (
    !opts.allowedTypes.includes(file.type.toLowerCase()) &&
    !file.name.match(/\.(jpe?g|png|webp|heic|heif)$/i)
  ) {
    throw new Error(
      `Unsupported file type (${file.type || "unknown"}). Please upload a JPEG, PNG, or WebP photo.`
    );
  }

  // 2. Validate maximum file size
  if (file.size > opts.maxSizeBytes) {
    const mbLimit = Math.round(opts.maxSizeBytes / (1024 * 1024));
    throw new Error(`File size is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is ${mbLimit}MB.`);
  }

  // 3. Load into Image element to read dimensions
  return new Promise<ProcessedImageResult>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file."));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Unable to decode image. Please choose a valid photo file."));

      img.onload = () => {
        const origWidth = img.naturalWidth || img.width;
        const origHeight = img.naturalHeight || img.height;

        // Validate minimum dimensions
        if (origWidth < opts.minWidth || origHeight < opts.minHeight) {
          return reject(
            new Error(
              `Photo resolution is too low (${origWidth}×${origHeight}px). Minimum required is ${opts.minWidth}×${opts.minHeight}px.`
            )
          );
        }

        // Calculate aspect-ratio preserved target dimensions
        let targetWidth = origWidth;
        let targetHeight = origHeight;

        if (origWidth > opts.maxDimension || origHeight > opts.maxDimension) {
          if (origWidth >= origHeight) {
            targetWidth = opts.maxDimension;
            targetHeight = Math.round((origHeight / origWidth) * opts.maxDimension);
          } else {
            targetHeight = opts.maxDimension;
            targetWidth = Math.round((origWidth / origHeight) * opts.maxDimension);
          }
        }

        // Offscreen canvas rendering
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas 2D context unavailable for image compression."));
        }

        // Smooth bicubic downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Try WebP first; fall back to JPEG if unsupported
        let format: "image/webp" | "image/jpeg" = "image/webp";
        let dataUrl = canvas.toDataURL("image/webp", opts.quality);

        if (!dataUrl.startsWith("data:image/webp")) {
          format = "image/jpeg";
          dataUrl = canvas.toDataURL("image/jpeg", opts.quality);
        }

        // Estimate compressed bytes from base64 length
        const base64Str = dataUrl.split(",")[1] || "";
        const compressedSize = Math.round((base64Str.length * 3) / 4);

        resolve({
          dataUrl,
          width: targetWidth,
          height: targetHeight,
          originalSize: file.size,
          compressedSize,
          format,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
