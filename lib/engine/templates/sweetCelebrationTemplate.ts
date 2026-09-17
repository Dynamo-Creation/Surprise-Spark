import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 9 — SWEET CELEBRATION 💌
 * A playful, heartfelt pastel celebration featuring:
 * 1. Festive bunting party flags drop
 * 2. 3D staggered Happy Birthday typography with animated party hat
 * 3. Typewriter date of birth badge with gold stars
 * 4. Recipient photo polaroid with animated balloon clusters and name badge
 * 5. Rotating circular badge
 * 6. Interactive letterbox with typewriter message, beating hearts, and cute cat sticker
 * 7. Real-time floating heart cursor trail
 */

export const SWEET_CELEBRATION_SCENES: SceneModel[] = [
  // Scene 1: Festive Intro & Party Welcome
  {
    id: "sweet-sc1",
    name: "Scene 1: Festive Entrance",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#feecea", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-pink-100 via-rose-50 to-amber-50",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "sweet-tag-1",
        name: "Welcome Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🎈 SWEET BIRTHDAY CELEBRATION 💌", typographyStyle: "badge", color: "#ff7882" },
      },
      {
        id: "sweet-intro-headline",
        name: "Intro Title",
        type: "text",
        transform: { position: [0, 1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday {{recipient_name}}!", typographyStyle: "headline", color: "#333333" },
      },
      {
        id: "sweet-intro-sub",
        name: "Intro Subtitle",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Someone special made this sweet surprise just for you.", typographyStyle: "subtitle", color: "#666666" },
      },
      {
        id: "sweet-btn-open",
        name: "Open Surprise Button",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Open Surprise 🎁", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-sc1-start",
        type: "button_clicked",
        targetObjectId: "sweet-btn-open",
        actions: [{ id: "act-sc1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 2: Interactive Letter & Polaroid
  {
    id: "sweet-sc2",
    name: "Scene 2: Heartfelt Letter",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-pink-100 via-rose-100 to-amber-50",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "sweet-letter-title",
        name: "Letter Title",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "To {{recipient_name}} ❤️", typographyStyle: "headline", color: "#ff3366" },
      },
      {
        id: "sweet-letter-body",
        name: "Letter Message",
        type: "text",
        transform: { position: [0, 0.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#334155" },
      },
      {
        id: "sweet-btn-celebrate",
        name: "Celebrate Button",
        type: "button",
        transform: { position: [0, -1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Celebrate Together 🎉", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-sc2-celebrate",
        type: "button_clicked",
        targetObjectId: "sweet-btn-celebrate",
        actions: [{ id: "act-sc2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 3: Grand Finale
  {
    id: "sweet-sc3",
    name: "Scene 3: Celebration Finale",
    order: 3,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.0, 4.0], target: [0, 0, 0], fov: 45 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: {
      backgroundGradient: "from-pink-200 via-rose-200 to-amber-100",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "sweet-fin-title",
        name: "Finale Title",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Wishing You The Best Birthday Ever! 🥳", typographyStyle: "headline", color: "#d946ef" },
      },
      {
        id: "sweet-fin-sender",
        name: "Sender Note",
        type: "text",
        transform: { position: [0, 0.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "From {{sender_name}} with lots of love 💕", typographyStyle: "subtitle", color: "#ff6699" },
      },
      {
        id: "sweet-btn-share",
        name: "Share Surprise",
        type: "button",
        transform: { position: [-1.1, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 💌", buttonVariant: "secondary" },
      },
      {
        id: "sweet-btn-create",
        name: "Make Your Own",
        type: "button",
        transform: { position: [1.1, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create One ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-sc3-share",
        type: "button_clicked",
        targetObjectId: "sweet-btn-share",
        actions: [{ id: "act-sc3-sh", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-sc3-create",
        type: "button_clicked",
        targetObjectId: "sweet-btn-create",
        actions: [{ id: "act-sc3-cr", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const SWEET_CELEBRATION_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-sweet-celebration-1-0-0",
  templateId: "tpl-sweet-celebration",
  version: "1.0.0",
  changelog: "Sweet Celebration interactive birthday template featuring bunting animation, polaroid, typewriter letterbox, and heart cursor trail.",
  isPublished: true,
  scenes: SWEET_CELEBRATION_SCENES,
  createdAt: "2026-09-16T10:00:00Z",
};

export const SWEET_CELEBRATION_TEMPLATE: TemplateModel = {
  id: "tpl-sweet-celebration",
  categoryId: "birthday",
  name: "Sweet Celebration 💌",
  slug: "sweet-celebration",
  description: "A heartwarming pastel birthday celebration with bouncing party flags, polaroid frame, animated balloons, typewriter letterbox, and real-time heart cursor trail.",
  tagline: "A heartwarming celebration with an interactive letterbox.",
  thumbnailUrl: "/templates/sweet-celebration/thumbnail.jpg",
  tags: ["Interactive Letter", "Pastel", "Typewriter", "Photo Polaroid", "Sweet", "Heart Cursor"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 1,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [SWEET_CELEBRATION_VERSION_1_0_0],
  createdAt: "2026-09-16T10:00:00Z",
  updatedAt: "2026-09-16T10:00:00Z",
};
