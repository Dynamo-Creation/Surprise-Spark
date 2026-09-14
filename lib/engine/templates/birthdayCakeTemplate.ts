import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 2 — BIRTHDAY CAKE REVEAL 🎂
 * Sequence:
 * 1. Soft colorful environment
 * 2. Cake appears
 * 3. Candles light
 * 4. Text: Make a wish...
 * 5. Candles disappear
 * 6. Confetti celebration
 * 7. Recipient name
 * 8. Personal message
 * 9. Final CTA
 */

export const BIRTHDAY_CAKE_SCENES: SceneModel[] = [
  // Scene 1: Soft colorful environment
  {
    id: "bday-cake-sc1",
    name: "Scene 1: Soft Environment",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#fdf2f8", ambientIntensity: 0.9 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-pink-950/50", particlesPreset: "stars" },
    objects: [
      {
        id: "cake-tag-1",
        name: "Welcome Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A Sweet Celebration 🎂", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "cake-intro-text",
        name: "Intro Text",
        type: "text",
        transform: { position: [0, 1.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Something delicious was baked just for you...", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-btn-start",
        name: "Continue Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Enter Bakery ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c1-continue",
        type: "button_clicked",
        targetObjectId: "cake-btn-start",
        actions: [
          { id: "act-c1-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-c1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 2: Cake appears
  {
    id: "bday-cake-sc2",
    name: "Scene 2: Cake Appears",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.1, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "stars" },
    objects: [
      {
        id: "cake-model-obj",
        name: "Birthday Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "cake-heading-2",
        name: "Cake Headline",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Look what just arrived! 🎂", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-btn-light",
        name: "Light Candles Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Light Up Candles 🕯️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c2-light",
        type: "button_clicked",
        targetObjectId: "cake-btn-light",
        actions: [
          { id: "act-c2-sound", type: "play_sound", payload: { soundUrl: "sparkle" } },
          { id: "act-c2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 3: Candles light
  {
    id: "bday-cake-sc3",
    name: "Scene 3: Candles Light",
    order: 3,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0.9, 3.4], target: [0, 0.1, 0], fov: 45 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-slate-950 via-pink-950/60 to-purple-950", particlesPreset: "stars" },
    objects: [
      {
        id: "cake-model-obj",
        name: "Lit Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "cake-glow-text",
        name: "Glow Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "The flames are glowing warm and bright ✨", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-btn-wish",
        name: "Wish Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Make A Wish 🕯️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c3-wish",
        type: "button_clicked",
        targetObjectId: "cake-btn-wish",
        actions: [{ id: "act-c3-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 4: Text: Make a wish...
  {
    id: "bday-cake-sc4",
    name: "Scene 4: Make A Wish...",
    order: 4,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0.8, 3.2], target: [0, 0.2, 0], fov: 44 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-indigo-950", particlesPreset: "stars" },
    objects: [
      {
        id: "cake-model-obj",
        name: "Lit Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "cake-instruction",
        name: "Make a wish text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Close your eyes & make a heartfelt wish...", typographyStyle: "headline", color: "#fde047" },
      },
      {
        id: "cake-btn-blow",
        name: "Blow Candle Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Blow Out The Candle 💨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c4-blow",
        type: "button_clicked",
        targetObjectId: "cake-btn-blow",
        actions: [
          { id: "act-c4-blow-sound", type: "play_sound", payload: { soundUrl: "candle_blow" } },
          { id: "act-c4-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 5: Candles disappear
  {
    id: "bday-cake-sc5",
    name: "Scene 5: Candles Disappear",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0.8, 3.2], target: [0, 0.2, 0], fov: 44 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-slate-900", particlesPreset: "stars" },
    objects: [
      {
        id: "cake-model-obj",
        name: "Unlit Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "cake-smoke-text",
        name: "Wish Made Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Wish made! Into the universe it goes ✨", typographyStyle: "headline", color: "#f472b6" },
      },
    ],
    triggers: [
      {
        id: "trig-c5-auto-celebrate",
        type: "scene_loaded",
        actions: [
          { id: "act-c5-fanfare", type: "play_sound", payload: { soundUrl: "lid_pop", delayMs: 400 } },
          { id: "act-c5-to-confetti", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1200 } },
        ],
      },
    ],
  },

  // Scene 6: Confetti celebration
  {
    id: "bday-cake-sc6",
    name: "Scene 6: Confetti Celebration",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.6], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "cake-confetti-badge",
        name: "Celebration Badge",
        type: "text",
        transform: { position: [0, 2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🎉 CELEBRATION TIME 🎉", typographyStyle: "badge", color: "#fbbf24" },
      },
      {
        id: "cake-confetti-heading",
        name: "Confetti Heading",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "May all your birthday dreams come true!", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-confetti-next",
        name: "Continue Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Reveal Recipient ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c6-fanfare",
        type: "scene_loaded",
        actions: [
          { id: "act-c6-fanfare", type: "play_sound", payload: { soundUrl: "celebration_fanfare" } },
          { id: "act-c6-balloons", type: "spawn_effect", payload: { effectType: "balloons" } },
        ],
      },
      {
        id: "trig-c6-continue",
        type: "button_clicked",
        targetObjectId: "cake-confetti-next",
        actions: [{ id: "act-c6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 7: Recipient name
  {
    id: "bday-cake-sc7",
    name: "Scene 7: Recipient Name",
    order: 7,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.0], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "cake-name-tag",
        name: "Birthday Tag",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "TODAY WE CELEBRATE YOU ✨", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "cake-name-headline",
        name: "Name Headline",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday, {{recipient_name}}! 🎂✨", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-model-obj",
        name: "Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "cake-btn-read-msg",
        name: "Read Message Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Birthday Letter 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c7-msg",
        type: "button_clicked",
        targetObjectId: "cake-btn-read-msg",
        actions: [{ id: "act-c7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 8: Personal message
  {
    id: "bday-cake-sc8",
    name: "Scene 8: Personal Message",
    order: 8,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "cake-msg-letter",
        name: "Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#ffffff" },
      },
      {
        id: "cake-msg-signature",
        name: "Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "With love, {{sender_name}} ❤️", typographyStyle: "subtitle", color: "#fbcfe8" },
      },
      {
        id: "cake-msg-btn-finale",
        name: "Finale Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "A Final Surprise ❤️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c8-finale",
        type: "button_clicked",
        targetObjectId: "cake-msg-btn-finale",
        actions: [{ id: "act-c8-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 9: Final CTA
  {
    id: "bday-cake-sc9",
    name: "Scene 9: Final CTA",
    order: 9,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "cake-final-headline",
        name: "Final Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Baked with Love ❤️", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "cake-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Don't just send a wish. Send a surprise.", typographyStyle: "subtitle", color: "#f472b6" },
      },
      {
        id: "cake-btn-replay",
        name: "Replay",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay Cake Reveal ↺", buttonVariant: "secondary" },
      },
      {
        id: "cake-btn-share",
        name: "Share",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 🔗", buttonVariant: "primary" },
      },
      {
        id: "cake-btn-create",
        name: "Create Own",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create Your Own Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c9-replay",
        type: "button_clicked",
        targetObjectId: "cake-btn-replay",
        actions: [{ id: "act-c9-first", type: "transition_scene", payload: { targetSceneIndex: "first" } }],
      },
      {
        id: "trig-c9-share",
        type: "button_clicked",
        targetObjectId: "cake-btn-share",
        actions: [{ id: "act-c9-sh", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-c9-create",
        type: "button_clicked",
        targetObjectId: "cake-btn-create",
        actions: [{ id: "act-c9-cr", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const BIRTHDAY_CAKE_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-birthday-cake-1-0-0",
  templateId: "tpl-birthday-cake",
  version: "1.0.0",
  changelog: "Birthday Cake Reveal template featuring candle wish, extinguishing flame, and confetti eruption.",
  isPublished: true,
  scenes: BIRTHDAY_CAKE_SCENES,
  createdAt: "2026-09-14T08:35:00Z",
};

export const BIRTHDAY_CAKE_TEMPLATE: TemplateModel = {
  id: "tpl-birthday-cake",
  categoryId: "birthday",
  name: "Birthday Cake Reveal 🎂",
  slug: "birthday-cake-reveal",
  description: "An enchanting sweet celebration featuring a layered cake, candle lighting, tap-to-blow wish, and grand confetti finale.",
  tagline: "Make a wish and watch the magic unfold.",
  thumbnailUrl: "/thumbnails/birthday-cake.jpg",
  tags: ["3D Cake", "Candle Wish", "Sweet", "Confetti", "Letter"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [BIRTHDAY_CAKE_VERSION_1_0_0],
  createdAt: "2026-09-14T08:35:00Z",
  updatedAt: "2026-09-14T08:35:00Z",
};
