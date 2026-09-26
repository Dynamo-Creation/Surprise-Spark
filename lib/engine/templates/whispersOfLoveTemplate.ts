import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE: WHISPERS OF LOVE 💕
 * An interactive, cinematic 6-chapter digital romantic experience:
 * 1. 🌸 The Opening: Falling rose petals, ambient typography, typewriter intro
 * 2. 🌌 Starry Night: Soft twilight gradients, glowing stars, poetic romantic thoughts
 * 3. 🌹 Garden of Love: Interactive rose-picking quote generator with ripples and petal bursts
 * 4. 💌 The Love Letter: Glassmorphic interactive envelope with wax-seal opening
 * 5. 📸 Memory Carousel: Polaroid memory carousel displaying cherished moments
 * 6. 💖 The Finale: Celebratory confetti, typewriter love poem, handwritten signature, and celebration actions
 */

export const WHISPERS_OF_LOVE_SCENES: SceneModel[] = [
  {
    id: "whisper-sc1",
    name: "Scene 1: The Opening & Falling Petals",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#fff0f5", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-[#3d1a1a] via-[#1a0a14] to-[#0a0508]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "whisper-sc2",
    name: "Scene 2: Twilight Starry Skies",
    order: 2,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ffd6e0", ambientIntensity: 1.1 },
    environment: {
      backgroundGradient: "from-[#1a0a14] to-[#2d1222]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "whisper-sc3",
    name: "Scene 3: Garden of Love & Rose Picking",
    order: 3,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#f43f5e", ambientIntensity: 1.2 },
    environment: {
      backgroundGradient: "from-[#2d1222] to-[#3d1a2c]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "whisper-sc4",
    name: "Scene 4: Wax-Sealed Love Letter",
    order: 4,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ffd6e0", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-[#3d1a2c] to-[#200b1a]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "whisper-sc5",
    name: "Scene 5: Polaroid Memory Carousel",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#fce4ec", ambientIntensity: 1.1 },
    environment: {
      backgroundGradient: "from-[#200b1a] to-[#2a0e22]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "whisper-sc6",
    name: "Scene 6: The Finale & Confetti",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#fda4af", ambientIntensity: 1.3 },
    environment: {
      backgroundGradient: "from-[#2a0e22] to-[#12050e]",
      particlesPreset: "confetti",
    },
    objects: [],
    triggers: [],
  },
];

export const WHISPERS_OF_LOVE_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-whispers-of-love-1-0-0",
  templateId: "tpl-whispers-of-love",
  version: "1.0.0",
  changelog: "Cinematic 6-chapter romantic journey with falling petals, interactive quote garden, wax-sealed love letter, polaroid carousel, and confetti celebration.",
  isPublished: true,
  scenes: WHISPERS_OF_LOVE_SCENES,
  createdAt: "2026-09-26T00:00:00Z",
};

export const WHISPERS_OF_LOVE_TEMPLATE: TemplateModel = {
  id: "tpl-whispers-of-love",
  categoryId: "love",
  name: "Whispers of Love 💕",
  slug: "whispers-of-love",
  description: "An enchanting 6-chapter romantic journey featuring soft falling rose petals, twilight starry skies, an interactive rose-picking quote garden, wax-sealed love letter, and cherished memory carousel.",
  tagline: "A cinematic 6-chapter romantic journey through your love story.",
  thumbnailUrl: "/templates/whispers-of-love/thumbnail.jpg",
  tags: ["Romantic Letter", "Rose Petals", "Starry Sky", "Memory Carousel", "Quote Garden", "Love"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 4,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [WHISPERS_OF_LOVE_VERSION_1_0_0],
  createdAt: "2026-09-26T00:00:00Z",
  updatedAt: "2026-09-26T00:00:00Z",
};
