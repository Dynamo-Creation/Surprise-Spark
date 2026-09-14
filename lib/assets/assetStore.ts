import {
  Asset3DModel,
  AssetCategory,
  AssetSlot,
  AssetUsageReference,
  SlotId,
  StandardAnimation,
  TransformDefaults,
} from "./types";
import { validate3DFile } from "./assetValidator";
import { resolveSlotAsset, ResolvedSlotAsset } from "./slotResolver";

// -----------------------------------------------------------------------------
// SEED ASSETS (Across all 10 categories)
// -----------------------------------------------------------------------------
export const INITIAL_3D_ASSETS: Asset3DModel[] = [
  // 1. Characters
  {
    id: "char-sparky",
    name: "Sparky the Party Pup",
    slug: "sparky-the-party-pup",
    category: "characters",
    description: "Cheerful low-poly canine celebrant with wagging tail and birthday party hat.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/characters/sparky_v1.glb",
        fileName: "sparky_v1.glb",
        fileSize: 1840000,
        format: "glb",
        polyCount: 2450,
        createdAt: "2026-09-01T10:00:00.000Z",
        changelog: "Initial release with 5 basic skeletal animations",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/characters/sparky_v1.glb",
    activeFileName: "sparky_v1.glb",
    format: "glb",
    polyCount: 2450,
    transformDefaults: {
      position: [0, -0.6, 0],
      rotation: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      anchor: "bottom",
      cameraFraming: { distance: 5.5, fov: 45, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Walk", "Happy_Dance", "Wave", "Present_Gift"],
    animationMappings: {
      Happy_Dance: "Celebrate",
      Present_Gift: "Gift",
    },
    status: "active",
    tags: ["Mascot", "Dog", "Party", "Cute", "Celebration"],
    thumbnailUrl: "/thumbnails/sparky.png",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "char-astro-bot",
    name: "Astro Bot Companion",
    slug: "astro-bot-companion",
    category: "characters",
    description: "Futuristic hovering robot companion with glowing neon expressive visor.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/characters/astro_bot_v1.glb",
        fileName: "astro_bot_v1.glb",
        fileSize: 2200000,
        format: "glb",
        polyCount: 3120,
        createdAt: "2026-09-05T14:30:00.000Z",
        changelog: "Hover flight rig and particle jet nodes",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/characters/astro_bot_v1.glb",
    activeFileName: "astro_bot_v1.glb",
    format: "glb",
    polyCount: 3120,
    transformDefaults: {
      position: [0, 0.2, 0],
      rotation: [0, 0.2, 0],
      scale: [1.0, 1.0, 1.0],
      anchor: "center",
      cameraFraming: { distance: 5, fov: 42, target: [0, 0.2, 0] },
    },
    availableAnimations: ["Idle", "Float_Hover", "Laser_Celebrate", "Robo_Dance"],
    animationMappings: {
      Float_Hover: "Walk",
      Laser_Celebrate: "Celebrate",
      Robo_Dance: "Dance",
    },
    status: "active",
    tags: ["Sci-Fi", "Robot", "Space", "Tech"],
    thumbnailUrl: "/thumbnails/astro_bot.png",
    createdAt: "2026-09-05T14:30:00.000Z",
    updatedAt: "2026-09-05T14:30:00.000Z",
  },
  {
    id: "char-coco",
    name: "Coco the Teddy Bear",
    slug: "coco-the-teddy-bear",
    category: "characters",
    description: "Soft plush vintage teddy bear that waves gently and offers hug celebrations.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/characters/coco_bear_v1.glb",
        fileName: "coco_bear_v1.glb",
        fileSize: 1950000,
        format: "glb",
        polyCount: 2800,
        createdAt: "2026-09-08T11:00:00.000Z",
        changelog: "Plush fabric normal map and gentle wave animation",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/characters/coco_bear_v1.glb",
    activeFileName: "coco_bear_v1.glb",
    format: "glb",
    polyCount: 2800,
    transformDefaults: {
      position: [0, -0.5, 0],
      rotation: [0, -0.1, 0],
      scale: [1.1, 1.1, 1.1],
      anchor: "bottom",
      cameraFraming: { distance: 5, fov: 45, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Plush_Walk", "Warm_Wave", "Hug_Celebrate"],
    animationMappings: {
      Plush_Walk: "Walk",
      Warm_Wave: "Wave",
      Hug_Celebrate: "Celebrate",
    },
    status: "active",
    tags: ["Plush", "Bear", "Sweet", "Emotional"],
    thumbnailUrl: "/thumbnails/coco.png",
    createdAt: "2026-09-08T11:00:00.000Z",
    updatedAt: "2026-09-08T11:00:00.000Z",
  },

  // 2. Gifts
  {
    id: "gift-classic-ribbon",
    name: "Classic Silk Ribbon Gift Box",
    slug: "classic-ribbon-gift-box",
    category: "gifts",
    description: "High-gloss festive present box with procedural silk bow and opening lid action.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/gifts/gift_box_ribbon_v1.glb",
        fileName: "gift_box_ribbon_v1.glb",
        fileSize: 850000,
        format: "glb",
        polyCount: 1420,
        createdAt: "2026-09-01T10:00:00.000Z",
        changelog: "V1 initial box and detached lid hierarchy",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/gifts/gift_box_ribbon_v1.glb",
    activeFileName: "gift_box_ribbon_v1.glb",
    format: "glb",
    polyCount: 1420,
    transformDefaults: {
      position: [0, 0, 0],
      rotation: [0.1, 0.4, 0],
      scale: [1.3, 1.3, 1.3],
      anchor: "center",
      cameraFraming: { distance: 4.8, fov: 40, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Shake", "Open_Lid"],
    animationMappings: {},
    status: "active",
    tags: ["Gift", "Box", "Mystery", "Unbox"],
    thumbnailUrl: "/thumbnails/gift_box.png",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "gift-luxury-chest",
    name: "Luxury Celebration Treasure Chest",
    slug: "luxury-celebration-chest",
    category: "gifts",
    description: "Ornate gold-trimmed chest with hinged curved lid for premium milestone surprises.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/gifts/treasure_chest_v1.glb",
        fileName: "treasure_chest_v1.glb",
        fileSize: 1120000,
        format: "glb",
        polyCount: 1980,
        createdAt: "2026-09-03T16:00:00.000Z",
        changelog: "PBR metallic edge trims",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/gifts/treasure_chest_v1.glb",
    activeFileName: "treasure_chest_v1.glb",
    format: "glb",
    polyCount: 1980,
    transformDefaults: {
      position: [0, -0.2, 0],
      rotation: [0, 0.3, 0],
      scale: [1.2, 1.2, 1.2],
      anchor: "bottom",
      cameraFraming: { distance: 5.2, fov: 45, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Open_Lid"],
    animationMappings: {},
    status: "active",
    tags: ["Chest", "Gold", "Luxury", "Milestone"],
    thumbnailUrl: "/thumbnails/chest.png",
    createdAt: "2026-09-03T16:00:00.000Z",
    updatedAt: "2026-09-03T16:00:00.000Z",
  },

  // 3. Cakes
  {
    id: "cake-tiered-birthday",
    name: "Tiered Celebration Cake with Candles",
    slug: "tiered-celebration-cake",
    category: "cakes",
    description: "Multi-tiered birthday cake adorned with icing rosettes and interactive candle flames.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/cakes/cake_tiered_v1.glb",
        fileName: "cake_tiered_v1.glb",
        fileSize: 1450000,
        format: "glb",
        polyCount: 2450,
        createdAt: "2026-09-02T12:00:00.000Z",
        changelog: "Tiered cake with multi-flame emitters",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/cakes/cake_tiered_v1.glb",
    activeFileName: "cake_tiered_v1.glb",
    format: "glb",
    polyCount: 2450,
    transformDefaults: {
      position: [0, -0.4, 0],
      rotation: [0.1, 0, 0],
      scale: [1.1, 1.1, 1.1],
      anchor: "bottom",
      cameraFraming: { distance: 5, fov: 42, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Blow_Candles"],
    animationMappings: {},
    status: "active",
    tags: ["Cake", "Candles", "Birthday", "Food"],
    thumbnailUrl: "/thumbnails/cake.png",
    createdAt: "2026-09-02T12:00:00.000Z",
    updatedAt: "2026-09-02T12:00:00.000Z",
  },

  // 4. Balloons
  {
    id: "balloon-rainbow-cluster",
    name: "Rainbow Helium Balloon Cluster",
    slug: "rainbow-helium-balloon-cluster",
    category: "balloons",
    description: "Buoyant cluster of 7 colorful pastel helium balloons with physics string sways.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/balloons/balloon_cluster_v1.glb",
        fileName: "balloon_cluster_v1.glb",
        fileSize: 720000,
        format: "glb",
        polyCount: 1200,
        createdAt: "2026-09-02T15:00:00.000Z",
        changelog: "Cluster rigging with dynamic float sway",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/balloons/balloon_cluster_v1.glb",
    activeFileName: "balloon_cluster_v1.glb",
    format: "glb",
    polyCount: 1200,
    transformDefaults: {
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1.0, 1.0, 1.0],
      anchor: "center",
      cameraFraming: { distance: 6, fov: 50, target: [0, 0.5, 0] },
    },
    availableAnimations: ["Idle", "Float_Up", "Pop"],
    animationMappings: {},
    status: "active",
    tags: ["Balloons", "Helium", "Rainbow", "Float"],
    thumbnailUrl: "/thumbnails/balloons.png",
    createdAt: "2026-09-02T15:00:00.000Z",
    updatedAt: "2026-09-02T15:00:00.000Z",
  },

  // 5. Doors
  {
    id: "door-mystery-portal",
    name: "Mysterious Gateway & Arch",
    slug: "mysterious-gateway-portal",
    category: "doors",
    description: "Double French doors set within an ornamental arch with door handle interaction.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/doors/door_portal_v1.glb",
        fileName: "door_portal_v1.glb",
        fileSize: 1300000,
        format: "glb",
        polyCount: 1840,
        createdAt: "2026-09-04T18:00:00.000Z",
        changelog: "Hinged double door opening sequence",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/doors/door_portal_v1.glb",
    activeFileName: "door_portal_v1.glb",
    format: "glb",
    polyCount: 1840,
    transformDefaults: {
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      anchor: "bottom",
      cameraFraming: { distance: 6.2, fov: 45, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Open_Door"],
    animationMappings: {},
    status: "active",
    tags: ["Door", "Portal", "Gateway", "Mystery"],
    thumbnailUrl: "/thumbnails/door.png",
    createdAt: "2026-09-04T18:00:00.000Z",
    updatedAt: "2026-09-04T18:00:00.000Z",
  },

  // 6. Environments
  {
    id: "env-celebration-room",
    name: "Confetti Celebration Room Stage",
    slug: "confetti-celebration-room-stage",
    category: "environments",
    description: "Curved cyclorama stage with ambient floor reflection and festive wall moldings.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/environments/room_stage_v1.glb",
        fileName: "room_stage_v1.glb",
        fileSize: 2600000,
        format: "glb",
        polyCount: 3200,
        createdAt: "2026-09-01T10:00:00.000Z",
        changelog: "Baked soft studio lighting map",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/environments/room_stage_v1.glb",
    activeFileName: "room_stage_v1.glb",
    format: "glb",
    polyCount: 3200,
    transformDefaults: {
      position: [0, -1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: "bottom",
      cameraFraming: { distance: 8, fov: 55, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle"],
    animationMappings: {},
    status: "active",
    tags: ["Stage", "Room", "Environment", "Studio"],
    thumbnailUrl: "/thumbnails/room.png",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 7. Decorations
  {
    id: "decor-golden-bunting",
    name: "Golden Celebration Bunting Flags",
    slug: "golden-celebration-bunting",
    category: "decorations",
    description: "Draped pennant banners with metallic gold and pastel triangles.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/decorations/bunting_v1.glb",
        fileName: "bunting_v1.glb",
        fileSize: 420000,
        format: "glb",
        polyCount: 650,
        createdAt: "2026-09-05T09:00:00.000Z",
        changelog: "Catenary curve garland mesh",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/decorations/bunting_v1.glb",
    activeFileName: "bunting_v1.glb",
    format: "glb",
    polyCount: 650,
    transformDefaults: {
      position: [0, 2.2, 0],
      rotation: [0, 0, 0],
      scale: [1.2, 1.2, 1.2],
      anchor: "top",
      cameraFraming: { distance: 6, fov: 45, target: [0, 1.5, 0] },
    },
    availableAnimations: ["Idle", "Gentle_Breeze"],
    animationMappings: {},
    status: "active",
    tags: ["Bunting", "Garland", "Gold", "Decor"],
    thumbnailUrl: "/thumbnails/bunting.png",
    createdAt: "2026-09-05T09:00:00.000Z",
    updatedAt: "2026-09-05T09:00:00.000Z",
  },

  // 8. Props
  {
    id: "prop-polaroid-frame",
    name: "Floating Memory Polaroid Frame",
    slug: "floating-memory-polaroid-frame",
    category: "props",
    description: "Classic 3:4 photo frame with paper texture and dynamic photo texture slot.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/props/polaroid_frame_v1.glb",
        fileName: "polaroid_frame_v1.glb",
        fileSize: 310000,
        format: "glb",
        polyCount: 380,
        createdAt: "2026-09-06T14:00:00.000Z",
        changelog: "UV mapped center plane for creator photos",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/props/polaroid_frame_v1.glb",
    activeFileName: "polaroid_frame_v1.glb",
    format: "glb",
    polyCount: 380,
    transformDefaults: {
      position: [0, 0.2, 0],
      rotation: [0, 0, 0.05],
      scale: [1, 1, 1],
      anchor: "center",
      cameraFraming: { distance: 4.5, fov: 40, target: [0, 0.2, 0] },
    },
    availableAnimations: ["Idle", "Float_Wobble"],
    animationMappings: {},
    status: "active",
    tags: ["Photo", "Polaroid", "Memory", "Frame"],
    thumbnailUrl: "/thumbnails/polaroid.png",
    createdAt: "2026-09-06T14:00:00.000Z",
    updatedAt: "2026-09-06T14:00:00.000Z",
  },

  // 9. Effects
  {
    id: "fx-confetti-cannon",
    name: "Twin Party Confetti Cannons",
    slug: "twin-confetti-cannons",
    category: "effects",
    description: "Dual cylindrical celebration cannons positioned to blast multi-colored paper ribbons.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/effects/confetti_cannons_v1.glb",
        fileName: "confetti_cannons_v1.glb",
        fileSize: 580000,
        format: "glb",
        polyCount: 920,
        createdAt: "2026-09-07T17:00:00.000Z",
        changelog: "Directional blast orientation markers",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/effects/confetti_cannons_v1.glb",
    activeFileName: "confetti_cannons_v1.glb",
    format: "glb",
    polyCount: 920,
    transformDefaults: {
      position: [0, -1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: "bottom",
      cameraFraming: { distance: 6, fov: 45, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Blast"],
    animationMappings: {},
    status: "active",
    tags: ["Confetti", "Cannon", "Party", "Burst"],
    thumbnailUrl: "/thumbnails/cannon.png",
    createdAt: "2026-09-07T17:00:00.000Z",
    updatedAt: "2026-09-07T17:00:00.000Z",
  },

  // 10. Other
  {
    id: "other-crystal-orb",
    name: "Magical Crystal Wish Orb",
    slug: "magical-crystal-wish-orb",
    category: "other",
    description: "Shimmering translucent crystal sphere with swirling internal stardust shaders.",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        fileUrl: "/models/other/crystal_orb_v1.glb",
        fileName: "crystal_orb_v1.glb",
        fileSize: 890000,
        format: "glb",
        polyCount: 1450,
        createdAt: "2026-09-09T10:00:00.000Z",
        changelog: "Transmission and roughness material setup",
        uploadedBy: "superadmin",
      },
    ],
    activeFileUrl: "/models/other/crystal_orb_v1.glb",
    activeFileName: "crystal_orb_v1.glb",
    format: "glb",
    polyCount: 1450,
    transformDefaults: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: "center",
      cameraFraming: { distance: 4.8, fov: 40, target: [0, 0, 0] },
    },
    availableAnimations: ["Idle", "Glow_Pulse"],
    animationMappings: {},
    status: "active",
    tags: ["Crystal", "Magic", "Orb", "Wish"],
    thumbnailUrl: "/thumbnails/orb.png",
    createdAt: "2026-09-09T10:00:00.000Z",
    updatedAt: "2026-09-09T10:00:00.000Z",
  },
];

// -----------------------------------------------------------------------------
// SEED ABSTRACT ASSET SLOTS
// -----------------------------------------------------------------------------
export const INITIAL_ASSET_SLOTS: AssetSlot[] = [
  {
    id: "birthday_character",
    name: "Main Birthday Character",
    description: "Primary animated celebrant or mascot delivering personal birthday greetings.",
    category: "characters",
    assignedAssetId: "char-sparky",
    fallbackType: "procedural",
    fallbackProceduralId: "obj-character",
    requiredAnimations: ["Idle", "Celebrate", "Wave"],
  },
  {
    id: "main_gift",
    name: "Hero Mystery Gift Box",
    description: "Interactive present box that vibrates and unboxes upon user click.",
    category: "gifts",
    assignedAssetId: "gift-classic-ribbon",
    fallbackType: "procedural",
    fallbackProceduralId: "obj-gift-box",
    requiredAnimations: ["Idle", "Celebrate"],
  },
  {
    id: "cake",
    name: "Celebration Birthday Cake",
    description: "Centerpiece cake with blowable candle flames and wish interaction.",
    category: "cakes",
    assignedAssetId: "cake-tiered-birthday",
    fallbackType: "procedural",
    fallbackProceduralId: "obj-cake",
  },
  {
    id: "balloon_bundle",
    name: "Floating Balloon Cluster",
    description: "Buoyant helium balloons that drift upward or frame celebratory text.",
    category: "balloons",
    assignedAssetId: "balloon-rainbow-cluster",
    fallbackType: "procedural",
    fallbackProceduralId: "obj-balloons",
  },
  {
    id: "door",
    name: "Surprise Mystery Door",
    description: "Interactive gateway opening to reveal the celebration environment.",
    category: "doors",
    assignedAssetId: "door-mystery-portal",
    fallbackType: "procedural",
    fallbackProceduralId: "obj-door",
  },
  {
    id: "background_environment",
    name: "Room Background Stage",
    description: "3D studio backdrop, stage cyclorama, or thematic environmental room.",
    category: "environments",
    assignedAssetId: "env-celebration-room",
    fallbackType: "procedural",
    fallbackProceduralId: "env-default",
  },
];

// -----------------------------------------------------------------------------
// ASSET STORE IMPLEMENTATION
// -----------------------------------------------------------------------------
const STORAGE_KEY_ASSETS = "surprisespark_admin_assets_v1";
const STORAGE_KEY_SLOTS = "surprisespark_admin_slots_v1";

class AssetStore {
  private assets: Asset3DModel[] = [];
  private slots: AssetSlot[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== "undefined") {
      try {
        const savedAssets = localStorage.getItem(STORAGE_KEY_ASSETS);
        this.assets = savedAssets ? JSON.parse(savedAssets) : [...INITIAL_3D_ASSETS];

        const savedSlots = localStorage.getItem(STORAGE_KEY_SLOTS);
        this.slots = savedSlots ? JSON.parse(savedSlots) : [...INITIAL_ASSET_SLOTS];
        return;
      } catch {
        // LocalStorage fallback
      }
    }
    this.assets = [...INITIAL_3D_ASSETS];
    this.slots = [...INITIAL_ASSET_SLOTS];
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(this.assets));
        localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(this.slots));
      } catch {
        // Storage fail
      }
    }
  }

  // ---------------------------------------------------------------------------
  // READ METHODS
  // ---------------------------------------------------------------------------
  public getAssets(category?: AssetCategory, search?: string): Asset3DModel[] {
    let result = [...this.assets];

    if (category) {
      result = result.filter((a) => a.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getAssetById(id: string): Asset3DModel | null {
    return this.assets.find((a) => a.id === id) || null;
  }

  public getSlots(): AssetSlot[] {
    return [...this.slots];
  }

  public getSlotById(slotId: SlotId): AssetSlot | null {
    return this.slots.find((s) => s.id === slotId) || null;
  }

  /**
   * Resolves a slot to its concrete asset with animation validation and transform defaults.
   */
  public resolveSlot(
    slotId: SlotId,
    pinnedVersion?: number,
    requestedAnimations?: StandardAnimation[]
  ): ResolvedSlotAsset {
    const slot = this.getSlotById(slotId);
    if (!slot) {
      throw new Error(`Slot '${slotId}' does not exist.`);
    }

    const asset = this.getAssetById(slot.assignedAssetId);
    return resolveSlotAsset({
      slot,
      asset,
      pinnedVersion: pinnedVersion ?? slot.assignedAssetVersion,
      requestedAnimations,
    });
  }

  // ---------------------------------------------------------------------------
  // USAGE INSPECTOR & NON-DESTRUCTIVE DELETION GATING
  // ---------------------------------------------------------------------------
  public inspectUsage(assetId: string): AssetUsageReference[] {
    const references: AssetUsageReference[] = [];

    // Check slot assignments
    this.slots.forEach((s) => {
      if (s.assignedAssetId === assetId) {
        references.push({
          type: "slot",
          id: s.id,
          name: `Slot: ${s.name}`,
          versionPinned: s.assignedAssetVersion,
        });
      }
    });

    // Known template references (e.g. Magic Gift, Cake Reveal, Balloon Room, etc.)
    if (assetId.includes("gift")) {
      references.push({ type: "template", id: "tpl-bday-1", name: "Magic Gift 🎁" });
      references.push({ type: "template", id: "tpl-bday-6", name: "Confetti Blast 🎉" });
    }
    if (assetId.includes("cake")) {
      references.push({ type: "template", id: "tpl-bday-2", name: "Birthday Cake Reveal 🎂" });
    }
    if (assetId.includes("balloon")) {
      references.push({ type: "template", id: "tpl-bday-3", name: "Balloon Room 🎈" });
      references.push({ type: "template", id: "tpl-bday-7", name: "Rainbow Surprise 🌈" });
    }
    if (assetId.includes("door")) {
      references.push({ type: "template", id: "tpl-bday-4", name: "Mystery Door 🚪" });
    }
    if (assetId.includes("char") || assetId.includes("sparky") || assetId.includes("astro")) {
      references.push({ type: "template", id: "tpl-bday-8", name: "Cute Character Mascot 🧸" });
      references.push({ type: "template", id: "tpl-bday-5", name: "Memory Journey 📸" });
    }

    return references;
  }

  // ---------------------------------------------------------------------------
  // MUTATION METHODS
  // ---------------------------------------------------------------------------
  /**
   * Uploads and registers a new 3D asset model into the system.
   */
  public uploadAsset(payload: {
    name: string;
    category: AssetCategory;
    description?: string;
    format: "glb" | "gltf";
    fileName: string;
    fileBuffer?: ArrayBuffer | Uint8Array;
    fileUrl?: string;
    tags?: string[];
    polyCount?: number;
    transformDefaults?: Partial<TransformDefaults>;
    availableAnimations?: string[];
    animationMappings?: Record<string, StandardAnimation>;
  }): Asset3DModel {
    // Validate if buffer provided
    let detectedAnimations: string[] = [];
    let size = 1500000;

    if (payload.fileBuffer) {
      const validation = validate3DFile(payload.fileName, payload.fileBuffer);
      if (!validation.valid) {
        throw new Error(`File validation failed: ${validation.errors.join("; ")}`);
      }
      if (validation.detectedAnimations) {
        detectedAnimations = validation.detectedAnimations;
      }
      if (validation.fileSize) {
        size = validation.fileSize;
      }
    }

    const slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `asset-${payload.category.slice(0, 4)}-${Date.now().toString(36)}`;
    const fileUrl = payload.fileUrl || `/models/${payload.category}/${payload.fileName}`;

    const defaultTransform: TransformDefaults = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: "center",
      cameraFraming: { distance: 5, fov: 45, target: [0, 0, 0] },
      ...payload.transformDefaults,
    };

    const newAsset: Asset3DModel = {
      id,
      name: payload.name,
      slug,
      category: payload.category,
      description: payload.description || `Uploaded ${payload.format.toUpperCase()} 3D model.`,
      currentVersion: 1,
      versions: [
        {
          versionNumber: 1,
          fileUrl,
          fileName: payload.fileName,
          fileSize: size,
          format: payload.format,
          polyCount: payload.polyCount || 1800,
          createdAt: new Date().toISOString(),
          changelog: "Initial upload version 1.0",
          uploadedBy: "admin",
        },
      ],
      activeFileUrl: fileUrl,
      activeFileName: payload.fileName,
      format: payload.format,
      polyCount: payload.polyCount || 1800,
      transformDefaults: defaultTransform,
      availableAnimations: payload.availableAnimations || detectedAnimations || ["Idle"],
      animationMappings: payload.animationMappings || {},
      status: "active",
      tags: payload.tags || [payload.category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.assets.unshift(newAsset);
    this.persist();
    return newAsset;
  }

  /**
   * Replaces an asset file by creating a new version.
   * Preserves historical versions so existing published surprises remain untouched!
   */
  public replaceAssetFile(
    assetId: string,
    payload: {
      fileName: string;
      fileBuffer?: ArrayBuffer | Uint8Array;
      fileUrl?: string;
      changelog?: string;
      polyCount?: number;
    }
  ): Asset3DModel {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset '${assetId}' not found.`);
    }

    let size = 2000000;
    let format = asset.format;
    let detectedAnimations: string[] = [];

    if (payload.fileBuffer) {
      const validation = validate3DFile(payload.fileName, payload.fileBuffer);
      if (!validation.valid) {
        throw new Error(`File validation failed: ${validation.errors.join("; ")}`);
      }
      if (validation.format) format = validation.format;
      if (validation.fileSize) size = validation.fileSize;
      if (validation.detectedAnimations) detectedAnimations = validation.detectedAnimations;
    }

    const nextVersionNumber = asset.currentVersion + 1;
    const fileUrl = payload.fileUrl || `/models/${asset.category}/${payload.fileName}`;

    const newVersion = {
      versionNumber: nextVersionNumber,
      fileUrl,
      fileName: payload.fileName,
      fileSize: size,
      format,
      polyCount: payload.polyCount || asset.polyCount,
      createdAt: new Date().toISOString(),
      changelog: payload.changelog || `Version ${nextVersionNumber} replacement file`,
      uploadedBy: "admin",
    };

    asset.versions.unshift(newVersion);
    asset.currentVersion = nextVersionNumber;
    asset.activeFileUrl = fileUrl;
    asset.activeFileName = payload.fileName;
    asset.format = format;
    if (payload.polyCount) asset.polyCount = payload.polyCount;
    if (detectedAnimations.length > 0) {
      asset.availableAnimations = Array.from(new Set([...asset.availableAnimations, ...detectedAnimations]));
    }
    asset.updatedAt = new Date().toISOString();

    this.persist();
    return asset;
  }

  /**
   * Updates metadata, transform defaults, or animation mappings for an asset.
   */
  public updateAsset(assetId: string, updates: Partial<Asset3DModel>): Asset3DModel {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset '${assetId}' not found.`);
    }

    Object.assign(asset, updates, { updatedAt: new Date().toISOString() });
    this.persist();
    return asset;
  }

  /**
   * Reassigns an abstract slot to a 3D asset model without modifying template code.
   */
  public assignSlotAsset(slotId: SlotId, assetId: string, versionNumber?: number): AssetSlot {
    const slot = this.getSlotById(slotId);
    if (!slot) {
      throw new Error(`Slot '${slotId}' not found.`);
    }

    const asset = this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Target asset '${assetId}' not found.`);
    }

    slot.assignedAssetId = assetId;
    slot.assignedAssetVersion = versionNumber; // Undefined = always track latest
    this.persist();
    return slot;
  }

  /**
   * Archives an asset (removes from active listings without deleting history).
   */
  public archiveAsset(assetId: string): Asset3DModel {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      throw new Error(`Asset '${assetId}' not found.`);
    }

    asset.status = "archived";
    asset.updatedAt = new Date().toISOString();
    this.persist();
    return asset;
  }

  /**
   * Safe, non-destructive deletion gating:
   * Strictly blocks deletion if the asset is currently referenced by any slot or template.
   */
  public deleteAsset(assetId: string): { success: boolean; error?: string } {
    const asset = this.getAssetById(assetId);
    if (!asset) {
      return { success: false, error: `Asset '${assetId}' not found.` };
    }

    const usage = this.inspectUsage(assetId);
    if (usage.length > 0) {
      const refNames = usage.map((u) => u.name).join(", ");
      return {
        success: false,
        error: `Cannot delete asset '${asset.name}': it is actively referenced by [${refNames}]. Please reassign the slots or remove references before deleting.`,
      };
    }

    this.assets = this.assets.filter((a) => a.id !== assetId);
    this.persist();
    return { success: true };
  }

  public resetToDefaults() {
    this.assets = [...INITIAL_3D_ASSETS];
    this.slots = [...INITIAL_ASSET_SLOTS];
    this.persist();
  }
}

export const assetStore = new AssetStore();
