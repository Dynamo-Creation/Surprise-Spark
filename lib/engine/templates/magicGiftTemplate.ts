import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * PRODUCTION BIRTHDAY TEMPLATE: MAGIC GIFT 🎁
 * Complete 7-scene cinematic interactive birthday experience.
 * Sequenced as a tiny interactive animated movie:
 * Scene 1: Introduction ("Hey... I have something for you.")
 * Scene 2: Mystery Gift ("I think this belongs to you...")
 * Scene 3: Rewarding Tap Interaction (Shake -> Pause -> Lid Opens)
 * Scene 4: Surprise (Balloons, Confetti, Sparkles, Cinematic Zoom, Fanfare)
 * Scene 5: Birthday Reveal ("Happy Birthday, {{recipient_name}}!")
 * Scene 6: Personal Message ({{message}}, "From {{sender_name}}", Zero overflow)
 * Scene 7: Final Screen ("Made especially for you ❤️", Replay, Share, Create)
 */

export const MAGIC_GIFT_SCENES_V1: SceneModel[] = [
  // ---------------------------------------------------------------------------
  // SCENE 1 — INTRODUCTION
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-intro",
    name: "Scene 1: Introduction",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 1.4, 4.8],
      target: [0, 0, 0],
      fov: 50,
      allowOrbit: false,
    },
    lighting: {
      ambientColor: "#fdf2f8",
      ambientIntensity: 0.9,
      directionalColor: "#fbcfe8",
      directionalPosition: [3, 6, 4],
      pointLights: [
        { color: "#ec4899", position: [-3, 2, 2], intensity: 1.2 },
        { color: "#8b5cf6", position: [3, 2, -2], intensity: 1.2 },
      ],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-purple-950 to-slate-900",
      particlesPreset: "stars",
      fogColor: "#0f172a",
    },
    objects: [
      {
        id: "obj-intro-tag",
        name: "Intro Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "A Special Moment ✨",
          typographyStyle: "badge",
          color: "#f472b6",
        },
      },
      {
        id: "obj-intro-headline",
        name: "Intro Headline",
        type: "text",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Hey... I have something for you.",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-intro-subtitle",
        name: "Intro Subtitle",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Turn up your volume and get ready for a magical surprise.",
          typographyStyle: "subtitle",
          color: "#cbd5e1",
        },
      },
      {
        id: "obj-intro-continue-btn",
        name: "Intro Continue Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "See What's Waiting ✨",
          buttonVariant: "primary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-intro-continue",
        type: "button_clicked",
        targetObjectId: "obj-intro-continue-btn",
        actions: [
          {
            id: "act-intro-sound",
            type: "play_sound",
            payload: { soundUrl: "whoosh" },
          },
          {
            id: "act-intro-next",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 2 — MYSTERY GIFT
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-mystery",
    name: "Scene 2: Mystery Gift",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: {
      position: [0, 1.3, 4.5],
      target: [0, 0, 0],
      fov: 48,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 0.9,
      directionalColor: "#fff1f2",
      directionalPosition: [4, 7, 5],
      pointLights: [
        { color: "#f43f5e", position: [-2, 2, 2], intensity: 1.5 },
        { color: "#fbbf24", position: [2, 3, 1], intensity: 1.5 },
      ],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-pink-950/40 to-slate-900",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "obj-mystery-text",
        name: "Mystery Headline",
        type: "text",
        transform: { position: [0, 2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "I think this belongs to you...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-mystery-subtext",
        name: "Mystery Hint",
        type: "text",
        transform: { position: [0, 1.7, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "It was packed with heartfelt care. Tap the gift to unwrap!",
          typographyStyle: "subtitle",
          color: "#f472b6",
        },
      },
      {
        id: "obj-magic-gift-box",
        name: "Magic 3D Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.05, 1.05, 1.05] },
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
          tooltipText: "Tap to unwrap!",
        },
        props: {
          color: "#ec4899",
        },
      },
      {
        id: "obj-tap-gift-button",
        name: "Tap Gift Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Tap To Unwrap 🎁",
          buttonVariant: "primary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-gift-tapped",
        type: "object_clicked",
        targetObjectId: "obj-magic-gift-box",
        actions: [
          {
            id: "act-go-interaction",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
      {
        id: "trig-gift-btn-tapped",
        type: "button_clicked",
        targetObjectId: "obj-tap-gift-button",
        actions: [
          {
            id: "act-go-interaction-btn",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 3 — INTERACTION (Rewarding Unbox Sequence: Shake -> Pause -> Lid Opens)
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-interaction",
    name: "Scene 3: Unboxing Interaction",
    order: 3,
    durationMs: 0,
    transition: "zoom",
    camera: {
      position: [0, 1.1, 4.0],
      target: [0, 0.2, 0],
      fov: 46,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.0,
      directionalColor: "#fef08a",
      directionalPosition: [3, 7, 4],
      pointLights: [
        { color: "#ec4899", position: [-2, 2, 2], intensity: 1.8 },
        { color: "#fbbf24", position: [2, 3, 1], intensity: 1.8 },
      ],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-purple-950 to-pink-950/40",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "obj-interaction-text",
        name: "Interaction Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Unwrapping Your Surprise...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-magic-gift-box",
        name: "Magic 3D Gift Box (Animated)",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: {
          color: "#ec4899",
        },
      },
    ],
    // Cinematic Chained Sequence:
    // 1. Shake immediately (with rattle SFX)
    // 2. Pause (350ms)
    // 3. Lid opens at 450ms (with pop SFX)
    // 4. Rewarding hold (pause to enjoy unboxing)
    // 5. Transition to Scene 4 (Surprise Eruption) at 1200ms
    triggers: [
      {
        id: "trig-auto-unbox",
        type: "scene_loaded",
        actions: [
          {
            id: "act-sfx-shake",
            type: "play_sound",
            payload: { soundUrl: "gift_shake" },
          },
          {
            id: "act-shake-box",
            type: "play_animation",
            targetObjectId: "obj-magic-gift-box",
            payload: { animationName: "shake" },
          },
          {
            id: "act-sfx-pop",
            type: "play_sound",
            payload: { soundUrl: "lid_pop", delayMs: 450 },
          },
          {
            id: "act-open-lid",
            type: "play_animation",
            targetObjectId: "obj-magic-gift-box",
            payload: { animationName: "open_lid", delayMs: 450 },
          },
          {
            id: "act-to-surprise",
            type: "transition_scene",
            payload: { targetSceneIndex: "next", delayMs: 1200 },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 4 — SURPRISE (Balloons, Confetti, Sparkles, Fanfare, Zoom)
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-surprise",
    name: "Scene 4: The Big Surprise",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: {
      position: [0, 0.6, 3.2],
      target: [0, 0.4, 0],
      fov: 44,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.2,
      directionalColor: "#fff7ed",
      directionalPosition: [3, 8, 4],
      pointLights: [
        { color: "#ec4899", position: [-3, 3, 2], intensity: 2.2 },
        { color: "#fbbf24", position: [3, 3, 2], intensity: 2.2 },
        { color: "#38bdf8", position: [0, 4, -2], intensity: 1.8 },
      ],
    },
    environment: {
      backgroundGradient: "from-purple-950 via-slate-950 to-pink-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "obj-surprise-badge",
        name: "Surprise Badge",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "✨ SURPRISE! ✨",
          typographyStyle: "badge",
          color: "#fbbf24",
        },
      },
      {
        id: "obj-surprise-heading",
        name: "Surprise Heading",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "A Special Day For Someone Special! 🎉",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-magic-gift-box",
        name: "Opened Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, -0.3, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        animation: {
          name: "opened",
          type: "open_lid",
        },
        props: {
          color: "#ec4899",
        },
      },
      {
        id: "obj-surprise-continue-btn",
        name: "Continue To Reveal",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "See The Birthday Wish 🎂",
          buttonVariant: "primary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-surprise-burst",
        type: "scene_loaded",
        actions: [
          {
            id: "act-fanfare-sound",
            type: "play_sound",
            payload: { soundUrl: "celebration_fanfare" },
          },
          {
            id: "act-spawn-balloons",
            type: "spawn_effect",
            payload: { effectType: "balloons" },
          },
          {
            id: "act-spawn-sparkles",
            type: "spawn_effect",
            payload: { effectType: "sparkles", delayMs: 150 },
          },
          {
            id: "act-camera-zoom",
            type: "change_camera",
            payload: { cameraPosition: [0, 0.4, 2.8], cameraFov: 42, delayMs: 200 },
          },
        ],
      },
      {
        id: "trig-btn-to-reveal",
        type: "button_clicked",
        targetObjectId: "obj-surprise-continue-btn",
        actions: [
          {
            id: "act-go-reveal",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 5 — BIRTHDAY REVEAL ("Happy Birthday, {{recipient_name}}!")
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-reveal",
    name: "Scene 5: Birthday Reveal",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 1.2, 4.0],
      target: [0, 0, 0],
      fov: 48,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.1,
      directionalColor: "#fff1f2",
      directionalPosition: [4, 7, 5],
      pointLights: [
        { color: "#ec4899", position: [-2, 2, 2], intensity: 1.8 },
        { color: "#fbbf24", position: [2, 3, 1], intensity: 1.8 },
      ],
    },
    environment: {
      backgroundGradient: "from-pink-950/60 via-purple-950 to-slate-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "obj-reveal-tag",
        name: "Reveal Tag",
        type: "text",
        transform: { position: [0, 2.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "CELEBRATING YOU ✨",
          typographyStyle: "badge",
          color: "#f472b6",
        },
      },
      {
        id: "obj-reveal-headline",
        name: "Birthday Headline",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Happy Birthday, {{recipient_name}}! 🎂🎉",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-cake-model",
        name: "Celebration Cake",
        type: "model3d",
        assetRef: "asset-cake-layered",
        transform: { position: [0, -0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          color: "#f43f5e",
        },
      },
      {
        id: "obj-reveal-subtext",
        name: "Wish Instruction",
        type: "text",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "May your upcoming year be full of magic, joy, and dreams come true! 🕯️",
          typographyStyle: "subtitle",
          color: "#fde047",
        },
      },
      {
        id: "obj-reveal-next-btn",
        name: "Read Letter Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Read Your Personal Message 💌",
          buttonVariant: "secondary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-reveal-sfx",
        type: "scene_loaded",
        actions: [
          {
            id: "act-sfx-reveal",
            type: "play_sound",
            payload: { soundUrl: "sparkle" },
          },
        ],
      },
      {
        id: "trig-btn-to-message",
        type: "button_clicked",
        targetObjectId: "obj-reveal-next-btn",
        actions: [
          {
            id: "act-go-message",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 6 — PERSONAL MESSAGE ({{message}} + optional "From {{sender_name}}")
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-message",
    name: "Scene 6: Personal Message",
    order: 6,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 0, 4.5],
      target: [0, 0, 0],
      fov: 50,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.0,
      pointLights: [{ color: "#ec4899", position: [0, 2, 2], intensity: 1.4 }],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950",
      particlesPreset: "hearts",
    },
    objects: [
      {
        id: "obj-message-tag",
        name: "Message Tag",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "A Message From The Heart 💌",
          typographyStyle: "badge",
          color: "#f472b6",
        },
      },
      {
        id: "obj-personal-letter",
        name: "Personal Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "{{message}}",
          typographyStyle: "letter",
          color: "#ffffff",
        },
      },
      {
        id: "obj-sender-signature",
        name: "Sender Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "With love, {{sender_name}} ❤️",
          typographyStyle: "subtitle",
          color: "#fbcfe8",
        },
      },
      {
        id: "obj-message-continue-btn",
        name: "Continue To Finale",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "A Final Note ❤️",
          buttonVariant: "primary",
        },
      },
    ],
    triggers: [
      {
        id: "trig-btn-to-final",
        type: "button_clicked",
        targetObjectId: "obj-message-continue-btn",
        actions: [
          {
            id: "act-go-final",
            type: "transition_scene",
            payload: { targetSceneIndex: "next" },
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // SCENE 7 — FINAL ("Made especially for you ❤️", Replay, Share, Create)
  // ---------------------------------------------------------------------------
  {
    id: "sc-magic-final",
    name: "Scene 7: Finale",
    order: 7,
    durationMs: 0,
    transition: "fade",
    camera: {
      position: [0, 1.2, 4.4],
      target: [0, 0, 0],
      fov: 48,
    },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.1,
      directionalColor: "#fff1f2",
      directionalPosition: [3, 6, 4],
      pointLights: [
        { color: "#ec4899", position: [-2, 2, 2], intensity: 1.5 },
        { color: "#fbbf24", position: [2, 2, 2], intensity: 1.5 },
      ],
    },
    environment: {
      backgroundGradient: "from-pink-950/60 via-purple-950 to-slate-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "obj-final-heading",
        name: "Final Note",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Made especially for you ❤️",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "obj-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Don't just send a wish. Send a surprise.",
          typographyStyle: "subtitle",
          color: "#f472b6",
        },
      },
      {
        id: "obj-final-gift-icon",
        name: "Final Floating Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        animation: {
          name: "idle-float",
          type: "float",
          speed: 1,
          loop: true,
        },
        props: {
          color: "#ec4899",
        },
      },
      {
        id: "obj-btn-replay",
        name: "Replay Button",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Replay Experience ↺",
          buttonVariant: "secondary",
        },
      },
      {
        id: "obj-btn-share",
        name: "Share Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Share Surprise 🔗",
          buttonVariant: "primary",
        },
      },
      {
        id: "obj-btn-create-own",
        name: "Create Your Own Button",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          buttonLabel: "Create Your Own Surprise ✨",
          buttonVariant: "accent",
        },
      },
    ],
    triggers: [
      {
        id: "trig-replay-clicked",
        type: "button_clicked",
        targetObjectId: "obj-btn-replay",
        actions: [
          {
            id: "act-replay-first",
            type: "transition_scene",
            payload: { targetSceneIndex: "first" },
          },
        ],
      },
      {
        id: "trig-share-clicked",
        type: "button_clicked",
        targetObjectId: "obj-btn-share",
        actions: [
          {
            id: "act-share-event",
            type: "trigger_custom_event",
            payload: { customEventName: "open_share_dialog" },
          },
        ],
      },
      {
        id: "trig-create-clicked",
        type: "button_clicked",
        targetObjectId: "obj-btn-create-own",
        actions: [
          {
            id: "act-create-event",
            type: "trigger_custom_event",
            payload: { customEventName: "navigate_create" },
          },
        ],
      },
    ],
  },
];

export const MAGIC_GIFT_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-magic-gift-1-0-0",
  templateId: "tpl-magic-gift",
  version: "1.0.0",
  changelog: "Production release of the 7-scene Magic Gift experience with cinematic unboxing, audio, and personal messaging.",
  isPublished: true,
  scenes: MAGIC_GIFT_SCENES_V1,
  createdAt: "2026-09-14T08:30:00Z",
};

export const MAGIC_GIFT_TEMPLATE: TemplateModel = {
  id: "tpl-magic-gift",
  categoryId: "birthday",
  name: "Magic Gift 🎁",
  slug: "magic-gift",
  description: "The signature interactive birthday unboxing experience. Features cinematic camera sweeps, rewarding unboxing, blowable candle, and heartfelt personal letter.",
  tagline: "Unwrap the magic of a real celebration.",
  thumbnailUrl: "/thumbnails/magic-gift.jpg",
  tags: ["Signature", "3D Gift", "Unboxing", "Cinematic", "Letter", "Balloons"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 6,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [MAGIC_GIFT_VERSION_1_0_0],
  createdAt: "2026-09-14T08:30:00Z",
  updatedAt: "2026-09-14T08:30:00Z",
};
