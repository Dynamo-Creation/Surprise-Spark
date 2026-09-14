import { AssetFormat, StandardAnimation, STANDARD_ANIMATIONS } from "./types";

export interface ValidationResult {
  valid: boolean;
  format?: AssetFormat;
  detectedAnimations?: string[];
  fileSize?: number;
  warnings: string[];
  errors: string[];
}

export const MAX_ASSET_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validates a binary ArrayBuffer or File for GLB/GLTF integrity.
 */
export function validate3DFile(
  fileName: string,
  buffer: ArrayBuffer | Uint8Array
): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const size = bytes.byteLength;

  if (size === 0) {
    return { valid: false, warnings, errors: ["Uploaded file is empty (0 bytes)."] };
  }

  if (size > MAX_ASSET_SIZE_BYTES) {
    return {
      valid: false,
      warnings,
      errors: [
        `File size exceeds 25MB limit (${(size / (1024 * 1024)).toFixed(1)}MB). Please optimize textures and geometry for mobile WebGL performance.`,
      ],
    };
  }

  const lowerName = fileName.toLowerCase();
  const isGlbExt = lowerName.endsWith(".glb");
  const isGltfExt = lowerName.endsWith(".gltf");

  if (!isGlbExt && !isGltfExt) {
    return {
      valid: false,
      warnings,
      errors: ["Invalid file extension. Only .glb (binary glTF) and .gltf (JSON glTF) formats are supported."],
    };
  }

  // 1. Binary GLB Validation (Magic bytes: 0x46546C67 = "glTF" in ASCII)
  if (isGlbExt || (bytes[0] === 0x67 && bytes[1] === 0x6c && bytes[2] === 0x54 && bytes[3] === 0x46)) {
    if (bytes.byteLength < 12) {
      return { valid: false, warnings, errors: ["Corrupted GLB: file header is smaller than 12 bytes."] };
    }

    const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    if (magic !== "glTF") {
      return {
        valid: false,
        warnings,
        errors: [`Invalid GLB header: expected 'glTF' magic bytes, got '${magic}'.`],
      };
    }

    // Read version (little-endian uint32 at offset 4)
    const version = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24);
    if (version !== 2) {
      warnings.push(`GLB version ${version} detected. Modern Three.js engines perform best with glTF 2.0.`);
    }

    // Extract embedded animation names from JSON chunk if present
    const detectedAnimations = extractAnimationsFromGlb(bytes);

    return {
      valid: true,
      format: "glb",
      fileSize: size,
      detectedAnimations,
      warnings,
      errors,
    };
  }

  // 2. ASCII/JSON GLTF Validation
  if (isGltfExt) {
    try {
      const text = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(text);

      if (!parsed.asset || !parsed.asset.version) {
        return {
          valid: false,
          warnings,
          errors: ["Invalid GLTF: missing required 'asset.version' property in JSON payload."],
        };
      }

      const detectedAnimations: string[] = [];
      if (Array.isArray(parsed.animations)) {
        parsed.animations.forEach((anim: { name?: string }, idx: number) => {
          detectedAnimations.push(anim.name || `Animation_${idx}`);
        });
      }

      return {
        valid: true,
        format: "gltf",
        fileSize: size,
        detectedAnimations,
        warnings,
        errors,
      };
    } catch {
      return {
        valid: false,
        warnings,
        errors: ["Invalid GLTF: file content is not well-formed JSON."],
      };
    }
  }

  return {
    valid: false,
    warnings,
    errors: ["Unsupported 3D format."],
  };
}

/**
 * Extracts animation clip names from the first JSON chunk of a binary GLB.
 */
function extractAnimationsFromGlb(bytes: Uint8Array): string[] {
  const animations: string[] = [];
  try {
    // GLB header: 12 bytes [magic(4), version(4), length(4)]
    // Chunk 0 header: 8 bytes [chunkLength(4), chunkType(4)]
    if (bytes.byteLength < 20) return animations;

    const chunk0Length = bytes[12] | (bytes[13] << 8) | (bytes[14] << 16) | (bytes[15] << 24);
    const chunk0Type = String.fromCharCode(bytes[16], bytes[17], bytes[18], bytes[19]);

    if (chunk0Type === "JSON" && bytes.byteLength >= 20 + chunk0Length) {
      const jsonBytes = bytes.subarray(20, 20 + chunk0Length);
      const jsonText = new TextDecoder().decode(jsonBytes);
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed.animations)) {
        parsed.animations.forEach((a: { name?: string }, i: number) => {
          animations.push(a.name || `Animation_${i}`);
        });
      }
    }
  } catch {
    // Non-fatal if chunk parsing fails
  }
  return animations;
}

/**
 * Validates whether an asset satisfies the required animations of a slot or template.
 * Generates clear, non-fatal warnings without breaking the experience.
 */
export function validateAnimationContract(
  requiredAnimations: StandardAnimation[] = [],
  availableAnimations: string[] = [],
  animationMappings: Record<string, StandardAnimation> = {}
): {
  compliant: boolean;
  warnings: string[];
  resolvedActionMap: Record<StandardAnimation, string | null>;
} {
  const warnings: string[] = [];
  const resolvedActionMap: Record<StandardAnimation, string | null> = {
    Idle: null,
    Walk: null,
    Wave: null,
    Celebrate: null,
    Gift: null,
    Jump: null,
    Dance: null,
  };

  // Build reverse lookup: StandardAnimation -> clipName
  const reverseMap = new Map<StandardAnimation, string>();

  // 1. Direct mappings explicit from admin
  Object.entries(animationMappings).forEach(([clipName, standardName]) => {
    if (availableAnimations.includes(clipName)) {
      reverseMap.set(standardName, clipName);
    }
  });

  // 2. Direct name matches (case-insensitive)
  STANDARD_ANIMATIONS.forEach(({ name }) => {
    if (!reverseMap.has(name)) {
      const directMatch = availableAnimations.find(
        (clip) => clip.toLowerCase() === name.toLowerCase() || clip.toLowerCase().includes(name.toLowerCase())
      );
      if (directMatch) {
        reverseMap.set(name, directMatch);
      }
    }
  });

  // 3. Verify requirements
  requiredAnimations.forEach((req) => {
    const matchedClip = reverseMap.get(req);
    if (matchedClip) {
      resolvedActionMap[req] = matchedClip;
    } else {
      // Find standard fallback
      const standardDef = STANDARD_ANIMATIONS.find((s) => s.name === req);
      const fallbackTarget = standardDef?.defaultFallback || "Idle";
      const fallbackClip = reverseMap.get(fallbackTarget) || availableAnimations[0] || null;

      resolvedActionMap[req] = fallbackClip;
      warnings.push(
        `Animation Warning: Required animation '${req}' is not present in model. Falling back gracefully to '${
          fallbackClip || "procedural idle"
        }'.`
      );
    }
  });

  return {
    compliant: warnings.length === 0,
    warnings,
    resolvedActionMap,
  };
}
