import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE: LOVE ANIMATION 💖
 * An enchanting romantic canvas & React particle experience featuring:
 * 1. 💌 Interactive wax-seal love letter envelope with "TAP TO OPEN"
 * 2. ⚡ Cybernetic romantic matrix rain & circuit traces
 * 3. ⏱️ 3, 2, 1, You Are My Love particle sweeping countdown
 * 4. 💖 Centerpiece glowing pulsing heart with interactive particle deflection
 * 5. 🎵 Real-time procedural audio synthesizer soundtrack & heartbeat pulses
 */

export const LOVE_ANIMATION_SCENES: SceneModel[] = [
  {
    id: "love-sc1",
    name: "Scene 1: Wax-Seal Envelope Intro",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ff007f", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-[#0f040d] to-[#050206]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "love-sc2",
    name: "Scene 2: Cybernetic Matrix Love Rain",
    order: 2,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ff2a6d", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-black to-[#050206]",
      particlesPreset: "confetti",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "love-sc3",
    name: "Scene 3: Pulsing Heart Centerpiece",
    order: 3,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: {
      backgroundGradient: "from-[#1a0014] to-black",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
];

export const LOVE_ANIMATION_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-love-animation-1-0-0",
  templateId: "tpl-love-animation",
  version: "1.0.0",
  changelog: "Interactive wax-seal love letter envelope, cybernetic love rain, particle countdown, and glowing centerpiece heart.",
  isPublished: true,
  scenes: LOVE_ANIMATION_SCENES,
  createdAt: "2026-09-20T10:31:40Z",
};

export const LOVE_ANIMATION_TEMPLATE: TemplateModel = {
  id: "tpl-love-animation",
  categoryId: "birthday",
  name: "Love Animation 💖",
  slug: "love-animation",
  description: "An enchanting romantic experience featuring an interactive wax-seal envelope, cybernetic love rain, particle countdown, and a glowing pulsing heart centerpiece with live synth sound.",
  tagline: "Unwrap a magical wax-sealed love letter with glowing particle wonders.",
  thumbnailUrl: "/templates/sweet-celebration/thumbnail.jpg",
  tags: ["Interactive Envelope", "Wax Seal", "Cyber Rain", "Particle Heart", "Romantic", "Audio Synth"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 3,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [LOVE_ANIMATION_VERSION_1_0_0],
  createdAt: "2026-09-20T10:31:40Z",
  updatedAt: "2026-09-20T10:31:40Z",
};
