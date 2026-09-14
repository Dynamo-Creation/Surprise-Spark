import { TemplateModel, TemplateVersionModel, SceneModel } from "./types";

/**
 * Data-Driven Demo Template: "Birthday Magic Surprise" (v1.0.0)
 * Demonstrates the full DATA -> TEMPLATE -> SCENE -> OBJECT -> ANIMATION pipeline
 * with chained triggers, dynamic variables, and multi-scene progression.
 */

export const DEMO_SCENES_V1: SceneModel[] = [
  // Scene 1: The Mystery Gift Box
  {
    id: "sc-mystery-gift",
    name: "The Mystery Gift Delivery",
    order: 1,
    durationMs: 0,
    transition: "zoom",
    camera: {
      position: [0, 1, 5],
      target: [0, 0, 0],
      fov: 50,
      allowOrbit: true,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 0.8,
      pointLights: [{ color: "#ec4899", position: [0, 2, 2], intensity: 1.5 }],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-purple-950 to-slate-900",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "obj-headline-1",
        name: "Intro Headline",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "A Special Delivery For {{recipient_name}}! 🎁",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-subtext-1",
        name: "Intro Subtitle",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Someone sent you a magical surprise. Tap the gift box to unwrap!",
          typographyStyle: "subtitle",
          color: "#f472b6",
        },
      },
      {
        id: "obj-gift-box",
        name: "3D Interactive Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        animation: {
          name: "idle-float",
          type: "float",
          speed: 1,
          loop: true,
        },
        interaction: {
          clickable: true,
          cursor: "pointer",
          hoverScale: 1.08,
          tooltipText: "Tap to Unwrap!",
        },
        props: {
          color: "#ec4899",
        },
      },
      {
        id: "obj-unbox-button",
        name: "Unwrap Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Tap To Unwrap 🎁",
          buttonVariant: "primary",
        },
      },
    ],
    // The Data-Driven Trigger Chain required by prompt:
    // Gift clicked -> gift shakes -> wait -> gift opens -> balloons appear -> camera zooms -> sound plays -> next scene
    triggers: [
      {
        id: "trig-gift-clicked",
        type: "object_clicked",
        targetObjectId: "obj-gift-box",
        actions: [
          {
            id: "act-shake",
            type: "play_animation",
            targetObjectId: "obj-gift-box",
            payload: { animationName: "shake" },
          },
          {
            id: "act-wait-and-open",
            type: "play_animation",
            targetObjectId: "obj-gift-box",
            payload: { animationName: "open_lid", delayMs: 500 },
          },
          {
            id: "act-balloons",
            type: "spawn_effect",
            payload: { effectType: "balloons", delayMs: 250 },
          },
          {
            id: "act-confetti",
            type: "spawn_effect",
            payload: { effectType: "confetti", delayMs: 150 },
          },
          {
            id: "act-zoom-camera",
            type: "change_camera",
            payload: { cameraPosition: [0, 0.5, 3.2], cameraFov: 45, delayMs: 200 },
          },
          {
            id: "act-sound",
            type: "play_sound",
            payload: { soundUrl: "/audio/cheer.mp3", delayMs: 100 },
          },
          {
            id: "act-transition-next",
            type: "transition_scene",
            payload: { targetSceneIndex: "next", delayMs: 900 },
          },
        ],
      },
      {
        id: "trig-btn-clicked",
        type: "button_clicked",
        targetObjectId: "obj-unbox-button",
        actions: [
          {
            id: "act-btn-trigger-gift",
            type: "trigger_custom_event",
            payload: { customEventName: "open_gift_event" },
          },
        ],
      },
      {
        id: "trig-custom-open",
        type: "custom_event",
        eventName: "open_gift_event",
        actions: [
          {
            id: "act-chain-shake",
            type: "play_animation",
            targetObjectId: "obj-gift-box",
            payload: { animationName: "shake" },
          },
          {
            id: "act-chain-open",
            type: "play_animation",
            targetObjectId: "obj-gift-box",
            payload: { animationName: "open_lid", delayMs: 500 },
          },
          {
            id: "act-chain-balloons",
            type: "spawn_effect",
            payload: { effectType: "balloons", delayMs: 250 },
          },
          {
            id: "act-chain-transition",
            type: "transition_scene",
            payload: { targetSceneIndex: "next", delayMs: 1000 },
          },
        ],
      },
    ],
  },

  // Scene 2: Birthday Cake & Candle Wish
  {
    id: "sc-birthday-cake",
    name: "Make A Wish & Blow Candles",
    order: 2,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 1, 4],
      target: [0, 0, 0],
      fov: 50,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 0.9,
    },
    environment: {
      backgroundGradient: "from-purple-950 via-slate-950 to-pink-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "obj-headline-2",
        name: "Birthday Celebration Heading",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Happy Birthday, {{recipient_name}}! 🎂✨",
          typographyStyle: "headline",
          color: "#fbcfe8",
        },
      },
      {
        id: "obj-cake-model",
        name: "3D Birthday Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        animation: {
          name: "cake-spin",
          type: "spin",
          speed: 0.5,
          loop: true,
        },
        props: {
          color: "#f43f5e",
        },
      },
      {
        id: "obj-candle-flame",
        name: "Interactive Candle Flame",
        type: "particle",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        interaction: {
          clickable: true,
          cursor: "pointer",
          hoverGlow: "rgba(251, 191, 36, 0.8)",
          tooltipText: "Tap to blow out candle!",
        },
        props: {
          particleColor: "#fbbf24",
          particleCount: 20,
        },
      },
      {
        id: "obj-candle-instruction",
        name: "Blow Instruction",
        type: "text",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Tap the candle flame to make your heartfelt wish! 🕯️",
          typographyStyle: "subtitle",
          color: "#fde047",
        },
      },
      {
        id: "obj-continue-button",
        name: "Read Letter Button",
        type: "button",
        transform: { position: [0, -2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Read Heartfelt Letter 💌",
          buttonVariant: "secondary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-blow-candle",
        type: "object_clicked",
        targetObjectId: "obj-candle-flame",
        actions: [
          {
            id: "act-extinguish",
            type: "play_animation",
            targetObjectId: "obj-candle-flame",
            payload: { animationName: "extinguish" },
          },
          {
            id: "act-hide-flame",
            type: "hide_object",
            targetObjectId: "obj-candle-flame",
            payload: { delayMs: 400 },
          },
          {
            id: "act-sparkles",
            type: "spawn_effect",
            payload: { effectType: "sparkles", delayMs: 100 },
          },
          {
            id: "act-wish-text",
            type: "show_text",
            payload: { textMessage: "✨ Wish made! May all your dreams come true!" },
          },
        ],
      },
      {
        id: "trig-btn-next",
        type: "button_clicked",
        targetObjectId: "obj-continue-button",
        actions: [
          {
            id: "act-go-letter",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // Scene 3: Memory Polaroid & Heartfelt Letter
  {
    id: "sc-polaroid-letter",
    name: "Treasured Memories & Letter",
    order: 3,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 0, 4.5],
      target: [0, 0, 0],
      fov: 50,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1,
    },
    environment: {
      backgroundGradient: "from-indigo-950 via-slate-950 to-purple-950",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "obj-photo-polaroid",
        name: "Memory Polaroid",
        type: "image",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, -2], scale: [1, 1, 1] },
        visible: true,
        props: {
          imageUrl: "{{photo_1}}",
          text: "Unforgettable Moments",
        },
      },
      {
        id: "obj-letter-card",
        name: "Personalized Letter",
        type: "text",
        transform: { position: [0, -0.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "{{message}}",
          typographyStyle: "letter",
          color: "#ffffff",
        },
      },
      {
        id: "obj-signature",
        name: "Sender Signature",
        type: "text",
        transform: { position: [0, -1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Forever your friend, {{sender_name}} ❤️",
          typographyStyle: "badge",
          color: "#f472b6",
        },
      },
      {
        id: "obj-replay-button",
        name: "Replay Button",
        type: "button",
        transform: { position: [0, -2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Replay Surprise ✨",
          buttonVariant: "primary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-replay",
        type: "button_clicked",
        targetObjectId: "obj-replay-button",
        actions: [
          {
            id: "act-go-first",
            type: "transition_scene",
            payload: { targetSceneIndex: "first" },
          },
        ],
      },
    ],
  },
];

export const DEMO_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-birthday-magic-1-0-0",
  templateId: "tpl-birthday-magic",
  version: "1.0.0",
  changelog: "Initial release with mystery unboxing, candle blow, and polaroid letter.",
  isPublished: true,
  scenes: DEMO_SCENES_V1,
  createdAt: "2026-09-14T08:00:00Z",
};

export const DEMO_TEMPLATE_MODEL: TemplateModel = {
  id: "tpl-birthday-magic",
  categoryId: "birthday",
  name: "Birthday Magic Surprise",
  slug: "birthday-magic-surprise",
  description: "An enchanting interactive birthday celebration with 3D unboxing, blowable candles, and memory polaroids.",
  tagline: "Unwrap the magic of another special year.",
  thumbnailUrl: "/thumbnails/birthday-magic.jpg",
  tags: ["3D Gift", "Candle Blow", "Balloons", "Confetti", "Letter"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [DEMO_VERSION_1_0_0],
  createdAt: "2026-09-14T08:00:00Z",
  updatedAt: "2026-09-14T08:00:00Z",
};
