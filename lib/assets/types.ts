/**
 * 3D ASSET MANAGEMENT SYSTEM - CORE TYPES
 * Supports: GLB, GLTF, Abstract Slots, Transform Defaults, and Animation Contracts
 */

export type AssetCategory =
  | "characters"
  | "gifts"
  | "cakes"
  | "balloons"
  | "doors"
  | "decorations"
  | "environments"
  | "props"
  | "effects"
  | "other";

export const ASSET_CATEGORIES: { id: AssetCategory; label: string; icon: string; description: string }[] = [
  { id: "characters", label: "Characters", icon: "🧸", description: "Animated mascots, celebrants, and friendly avatars" },
  { id: "gifts", label: "Gifts", icon: "🎁", description: "Mystery boxes, gift containers, and reward chests" },
  { id: "cakes", label: "Cakes", icon: "🎂", description: "Celebration cakes, cupcakes, candles, and pastries" },
  { id: "balloons", label: "Balloons", icon: "🎈", description: "Helium balloons, clusters, and buoyant decorations" },
  { id: "doors", label: "Doors", icon: "🚪", description: "Portals, gateways, and surprise mystery doors" },
  { id: "decorations", label: "Decorations", icon: "✨", description: "Bunting, ribbons, banners, and table decor" },
  { id: "environments", label: "Environments", icon: "🏰", description: "Room backdrops, stages, and themed landscapes" },
  { id: "props", label: "Props", icon: "📦", description: "Interactive objects, cards, letters, and accessories" },
  { id: "effects", label: "Effects", icon: "🎆", description: "Particle emitters, sparklers, and burst geometries" },
  { id: "other", label: "Other", icon: "🔮", description: "Specialty, experimental, or miscellaneous assets" },
];

export type AssetFormat = "glb" | "gltf";

export type StandardAnimation =
  | "Idle"
  | "Walk"
  | "Wave"
  | "Celebrate"
  | "Gift"
  | "Jump"
  | "Dance";

export const STANDARD_ANIMATIONS: { name: StandardAnimation; description: string; defaultFallback: StandardAnimation }[] = [
  { name: "Idle", description: "Natural baseline resting loop with breathing or subtle sway", defaultFallback: "Idle" },
  { name: "Walk", description: "Locomotion or entrance cycle onto the stage", defaultFallback: "Idle" },
  { name: "Wave", description: "Friendly welcoming gesture to the recipient", defaultFallback: "Idle" },
  { name: "Celebrate", description: "High-energy victory, cheers, or confetti toss", defaultFallback: "Dance" },
  { name: "Gift", description: "Presenting, offering, or unboxing a surprise parcel", defaultFallback: "Wave" },
  { name: "Jump", description: "Joyful hop or ecstatic celebration burst", defaultFallback: "Celebrate" },
  { name: "Dance", description: "Rhythmic groove matching the background soundtrack", defaultFallback: "Celebrate" },
];

export interface TransformDefaults {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  anchor: "center" | "bottom" | "top";
  cameraFraming?: {
    distance: number;
    fov: number;
    target: [number, number, number];
  };
}

export interface AssetVersion {
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSize: number; // bytes
  format: AssetFormat;
  polyCount?: number;
  createdAt: string;
  changelog?: string;
  uploadedBy?: string;
}

export interface Asset3DModel {
  id: string;
  name: string;
  slug: string;
  category: AssetCategory;
  description: string;
  currentVersion: number;
  versions: AssetVersion[];
  activeFileUrl: string;
  activeFileName: string;
  format: AssetFormat;
  polyCount?: number;
  transformDefaults: TransformDefaults;
  availableAnimations: string[];
  animationMappings: Record<string, StandardAnimation>;
  status: "active" | "archived" | "draft";
  tags: string[];
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type SlotId =
  | "birthday_character"
  | "main_gift"
  | "cake"
  | "balloon_bundle"
  | "door"
  | "background_environment";

export interface AssetSlot {
  id: SlotId;
  name: string;
  description: string;
  category: AssetCategory;
  assignedAssetId: string;
  assignedAssetVersion?: number; // Pinned version or latest if undefined
  fallbackType: "procedural" | "none";
  fallbackProceduralId?: string;
  requiredAnimations?: StandardAnimation[];
}

export interface AssetUsageReference {
  type: "template" | "scene" | "slot" | "published_surprise";
  id: string;
  name: string;
  versionPinned?: number;
}
