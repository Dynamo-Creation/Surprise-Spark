import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE: THE GOLDEN PROPOSAL 💍
 * A cinematic interactive proposal & love story surprise featuring:
 * 1. 💌 Romantic confession intro screen
 * 2. 📱 Automatic Mobile Landscape / Horizontal viewport presentation
 * 3. 🖼️ Illustrated cutscene story moments (face-to-face, kneeling proposal, warm embrace, celebration)
 * 4. 💬 Interactive dialogue with quick reply pills or personalized message input
 * 5. 💍 Interactive proposal question with big YES & playful dodging NO button
 * 6. 🎵 Web Audio procedural romantic synthesizer soundtrack with chimes & fanfare
 */

export const GOLDEN_PROPOSAL_SCENES: SceneModel[] = [
  {
    id: "prop-sc1",
    name: "Scene 1: Golden Confession Intro",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#fff0f5", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-[#fff7f9] via-[#ffeaf0] to-[#fcd6e2]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "prop-sc2",
    name: "Scene 2: Cutscene Dialogue & Mutual Spark",
    order: 2,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ffd6e0", ambientIntensity: 1.1 },
    environment: {
      backgroundGradient: "from-[#ffeaf0] to-[#f8bbd0]",
      particlesPreset: "hearts",
    },
    objects: [],
    triggers: [],
  },
  {
    id: "prop-sc3",
    name: "Scene 3: The Golden Proposal & Celebration",
    order: 3,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0, 4], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#d4af37", ambientIntensity: 1.3 },
    environment: {
      backgroundGradient: "from-[#fcd6e2] to-[#fff7f9]",
      particlesPreset: "confetti",
    },
    objects: [],
    triggers: [],
  },
];

export const GOLDEN_PROPOSAL_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-golden-proposal-1-0-0",
  templateId: "tpl-the-golden-proposal",
  version: "1.0.0",
  changelog: "Cinematic romantic love story, auto-horizontal mobile presentation, illustrated cutscenes, personalized confession, interactive dialogue, audio synthesizer, and playful yes/no dodging physics.",
  isPublished: true,
  scenes: GOLDEN_PROPOSAL_SCENES,
  createdAt: "2026-09-21T00:00:00Z",
};

export const GOLDEN_PROPOSAL_TEMPLATE: TemplateModel = {
  id: "tpl-the-golden-proposal",
  categoryId: "love",
  name: "The Golden Proposal 💍",
  slug: "the-golden-proposal",
  description: "A cinematic romantic love story and interactive proposal experience with responsive landscape auto-rotation, illustrated cutscenes, personalized confession, interactive dialogue, audio synthesizer, and playful yes/no dodging physics.",
  tagline: "Step into a golden romantic confession with unforgettable proposal magic.",
  thumbnailUrl: "/templates/the-golden-proposal/images/propose.png",
  tags: ["Proposal", "Romantic", "Landscape Cinema", "Interactive Dialogue", "Yes/No Physics", "Audio Synth"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 3,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [GOLDEN_PROPOSAL_VERSION_1_0_0],
  createdAt: "2026-09-21T00:00:00Z",
  updatedAt: "2026-09-21T00:00:00Z",
};
