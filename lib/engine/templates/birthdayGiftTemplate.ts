import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE: BIRTHDAY BLOSSOM ARCHERY 🏹🌸
 * An interactive, cinematic archery birthday celebration:
 * 1. Interactive Cupid Bow & Arrow Aiming at a pulsing crystal heart
 * 2. Dynamic arrow flight and heart burst
 * 3. Kinetic 3D typography message with cursive underline draw
 * 4. Procedural 2D canvas heart blossom tree growth with floating sakura petals
 * 5. Heartfelt personalized birthday wish card with sender signature
 * 6. Harmonic romantic sound synthesizer with custom audio support
 */

export const BIRTHDAY_GIFT_SCENES: SceneModel[] = [
  // Scene 1: Interactive Archery
  {
    id: "bdaygift-sc1",
    name: "Scene 1: Cupid's Bow & Heart Aim",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.0], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#feecea", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-rose-50 via-pink-50 to-amber-50",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "bdaygift-hero-eyebrow",
        name: "Hero Eyebrow",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "a little something, for my love", typographyStyle: "subtitle", color: "#9c4f63" },
      },
      {
        id: "bdaygift-target-heart",
        name: "Target Crystal Heart",
        type: "model3d",
        transform: { position: [0, 0.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { modelType: "crystal_heart", pulseEffect: true },
      },
      {
        id: "bdaygift-bow",
        name: "Golden Cupid Bow",
        type: "button",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Release Arrow 🏹", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-archery-release",
        type: "button_clicked",
        targetObjectId: "bdaygift-bow",
        actions: [{ id: "act-fly-arrow", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 2: Kinetic Typography & Heart Strike
  {
    id: "bdaygift-sc2",
    name: "Scene 2: Kinetic Wish",
    order: 2,
    durationMs: 3500,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-pink-100 via-rose-100 to-amber-50",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "bdaygift-k-eyebrow",
        name: "Kinetic Eyebrow",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "make a wish…", typographyStyle: "badge", color: "#8a4055" },
      },
      {
        id: "bdaygift-k-line1",
        name: "Kinetic Line 1",
        type: "text",
        transform: { position: [0, 0.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "bdaygift-k-line2",
        name: "Kinetic Line 2",
        type: "text",
        transform: { position: [0, 0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{recipient_name}}", typographyStyle: "headline", color: "#ffd0dd" },
      },
      {
        id: "bdaygift-k-sub",
        name: "Kinetic Subtitle",
        type: "text",
        transform: { position: [0, -0.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "to the sweetest soul in the world", typographyStyle: "subtitle", color: "#fce7f3" },
      },
    ],
    triggers: [
      {
        id: "trig-sc2-auto",
        type: "timer",
        delayMs: 3500,
        actions: [{ id: "act-sc2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 3: Canvas Heart Blossom Tree
  {
    id: "bdaygift-sc3",
    name: "Scene 3: Blooming Sakura Heart Tree",
    order: 3,
    durationMs: 4600,
    transition: "fade",
    camera: { position: [0, 1.0, 3.6], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#feecee", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-rose-50 via-pink-100 to-amber-50",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "bdaygift-tree-canvas",
        name: "Procedural Heart Blossom Tree",
        type: "particle",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { canvasEngine: "procedural_tree_bloom", fallingPetals: true },
      },
    ],
    triggers: [
      {
        id: "trig-sc3-auto",
        type: "timer",
        delayMs: 4600,
        actions: [{ id: "act-sc3-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 4: Eternal Wish & Finale Card
  {
    id: "bdaygift-sc4",
    name: "Scene 4: Blooming Celebration Card",
    order: 4,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0.8, 3.5], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#fee8ee", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-pink-100 via-rose-50 to-amber-50",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "bdaygift-wish-eyebrow",
        name: "Wish Eyebrow",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "and… forever & always", typographyStyle: "subtitle", color: "#9c4f63" },
      },
      {
        id: "bdaygift-wish-hero",
        name: "Wish Hero Title",
        type: "text",
        transform: { position: [0, 0.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday {{recipient_name}}", typographyStyle: "headline", color: "#e85a83" },
      },
      {
        id: "bdaygift-wish-sub",
        name: "Wish Heartfelt Message",
        type: "text",
        transform: { position: [0, 0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "subtitle", color: "#6e3f4a" },
      },
      {
        id: "bdaygift-wish-sender",
        name: "Sender Signature",
        type: "text",
        transform: { position: [0, -0.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "— Forever yours, {{sender_name}} 💕", typographyStyle: "subtitle", color: "#b03858" },
      },
    ],
    triggers: [],
  },
];

export const BIRTHDAY_GIFT_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-birthday-gift-1-0-0",
  templateId: "tpl-birthday-gift",
  version: "1.0.0",
  changelog: "Birthday Blossom Archery cinematic experience featuring interactive bow aiming, crystal heart burst, procedural heart tree bloom, and customizable typography.",
  isPublished: true,
  scenes: BIRTHDAY_GIFT_SCENES,
  createdAt: "2026-09-28T12:00:00Z",
};

export const BIRTHDAY_GIFT_TEMPLATE: TemplateModel = {
  id: "tpl-birthday-gift",
  categoryId: "birthday",
  name: "Birthday Blossom Archery 🏹🌸",
  slug: "birthday-gift",
  description: "A cinematic, interactive archery birthday surprise. Draw Cupid's golden bow, release the arrow into a glowing crystal heart, and watch a procedural heart blossom tree bloom with falling petals and kinetic typography.",
  tagline: "Draw the golden bow, strike the heart, and watch eternal love blossom.",
  thumbnailUrl: "/templates/birthday-gift/thumbnail.jpg",
  tags: ["Interactive Archery", "Cupid Bow", "Sakura Blossom", "Kinetic Typography", "Heart Tree", "Audio Synth"],
  status: "active",
  isFree: true,
  supportsPhotos: false,
  maxPhotos: 0,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [BIRTHDAY_GIFT_VERSION_1_0_0],
  createdAt: "2026-09-28T12:00:00Z",
  updatedAt: "2026-09-28T12:00:00Z",
};
