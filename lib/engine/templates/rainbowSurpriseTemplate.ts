import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 7 — RAINBOW SURPRISE 🌈
 *
 * Scenes:
 * 1. Cute landscape
 * 2. Character appears
 * 3. Character follows rainbow
 * 4. Environment changes
 * 5. Name parts revealed
 * 6. Rainbow transforms into "HAPPY BIRTHDAY {{recipient_name}}"
 * 7. Personal message
 * 8. Final CTA
 *
 * Fully data-driven interactive 3D storytelling experience.
 */

export const RAINBOW_SURPRISE_SCENES: SceneModel[] = [
  // Scene 1: Cute landscape
  {
    id: "rb-sc1",
    name: "Scene 1: Cute Landscape",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.6, 5.2], target: [0, 0.4, 0], fov: 50 },
    lighting: {
      ambientColor: "#fdf2f8",
      ambientIntensity: 0.9,
      directionalColor: "#f472b6",
      directionalPosition: [3, 5, 4],
    },
    environment: {
      backgroundGradient: "from-sky-950 via-indigo-950 to-purple-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "rb-obj-rainbow-1",
        name: "3D Storybook Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, -0.6, -1.0], rotation: [0, 0, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: {},
      },
      {
        id: "rb-tag-1",
        name: "Adventure Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "✨ A COLORFUL STORYBOOK ADVENTURE", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "rb-txt-1",
        name: "Headline",
        type: "text",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Follow the magical rainbow...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-start",
        name: "Start Journey Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Begin Journey 🌈", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb1-start",
        type: "button_clicked",
        targetObjectId: "rb-btn-start",
        actions: [
          { id: "act-rb1-sound", type: "play_sound", payload: { soundUrl: "chime" } },
          { id: "act-rb1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 2: Character appears
  {
    id: "rb-sc2",
    name: "Scene 2: Character Appears",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.4, 4.4], target: [0, 0.2, 0], fov: 48 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.0,
      directionalColor: "#fbbf24",
      directionalPosition: [2, 4, 3],
    },
    environment: {
      backgroundGradient: "from-indigo-950 via-purple-950 to-slate-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "rb-obj-rainbow-2",
        name: "3D Storybook Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, -0.4, -0.8], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9] },
        visible: true,
        props: {},
      },
      {
        id: "rb-obj-char-2",
        name: "Cute Mascot Companion",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-1.3, -0.6, 0.5], rotation: [0, 0.3, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-txt-2",
        name: "Companion Text",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Look who hopped in!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-follow",
        name: "Follow Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Follow Along 🐾", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-rb2-char-click",
        type: "object_clicked",
        targetObjectId: "rb-obj-char-2",
        actions: [
          { id: "act-rb2-char-sound", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-rb2-char-part", type: "spawn_effect", payload: { effectType: "sparkles" } },
        ],
      },
      {
        id: "trig-rb2-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-follow",
        actions: [
          { id: "act-rb2-sound", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-rb2-next-sc", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 3: Character follows rainbow
  {
    id: "rb-sc3",
    name: "Scene 3: Following Rainbow",
    order: 3,
    durationMs: 0,
    transition: "slide",
    camera: { position: [0, 1.2, 3.8], target: [0, 0.3, 0], fov: 46 },
    lighting: {
      ambientColor: "#fef3c7",
      ambientIntensity: 1.1,
      directionalColor: "#38bdf8",
      directionalPosition: [-2, 4, 3],
    },
    environment: {
      backgroundGradient: "from-blue-950 via-purple-950 to-fuchsia-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "rb-obj-rainbow-3",
        name: "3D Storybook Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, -0.2, -0.5], rotation: [0, 0, 0], scale: [1.05, 1.05, 1.05] },
        visible: true,
        props: {},
      },
      {
        id: "rb-obj-char-3",
        name: "Cute Companion Center",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.5, 0.6], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-txt-3",
        name: "Glowing Path Text",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "The colors are glowing brighter!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-sc3",
        name: "Next Arc Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Reach the Cloud Peak ☁️", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb3-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-sc3",
        actions: [
          { id: "act-rb3-chime", type: "play_sound", payload: { soundUrl: "chime" } },
          { id: "act-rb3-next-sc", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 4: Environment changes
  {
    id: "rb-sc4",
    name: "Scene 4: Sky Metamorphosis",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.4, 3.8], target: [0, 0.4, 0], fov: 48 },
    lighting: {
      ambientColor: "#fdf4ff",
      ambientIntensity: 1.2,
      directionalColor: "#e879f9",
      directionalPosition: [2, 5, 2],
    },
    environment: {
      backgroundGradient: "from-fuchsia-950 via-purple-950 to-pink-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "rb-obj-rainbow-4",
        name: "Luminous Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, 0.1, -0.5], rotation: [0, 0, 0], scale: [1.15, 1.15, 1.15] },
        visible: true,
        props: {},
      },
      {
        id: "rb-obj-char-4",
        name: "Excited Companion",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [1.2, -0.4, 0.4], rotation: [0, -0.4, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-tag-4",
        name: "Magic Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🌟 THE MAGIC AWAKENS", typographyStyle: "badge", color: "#e879f9" },
      },
      {
        id: "rb-txt-4",
        name: "Transform Text",
        type: "text",
        transform: { position: [0, 1.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "The whole sky is shifting!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-sc4",
        name: "Reveal Name Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Who is this for? 💖", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb4-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-sc4",
        actions: [
          { id: "act-rb4-tada", type: "play_sound", payload: { soundUrl: "tada" } },
          { id: "act-rb4-shake", type: "play_animation", targetObjectId: "rb-obj-rainbow-4", payload: { animationName: "shake" } },
          { id: "act-rb4-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 5: Name parts revealed
  {
    id: "rb-sc5",
    name: "Scene 5: Recipient Dedication",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 3.6], target: [0, 0.3, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.1,
      directionalColor: "#facc15",
      directionalPosition: [0, 4, 3],
    },
    environment: {
      backgroundGradient: "from-violet-950 via-purple-900 to-indigo-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "rb-obj-rainbow-5",
        name: "Rainbow Arc",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, 0.4, -0.8], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: {},
      },
      {
        id: "rb-tag-5",
        name: "Dedication Tag",
        type: "text",
        transform: { position: [0, 1.7, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "👑 CRAFTED ESPECIALLY FOR", typographyStyle: "badge", color: "#facc15" },
      },
      {
        id: "rb-txt-name-5",
        name: "Recipient Name",
        type: "text",
        transform: { position: [0, 0.9, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "{{recipient_name}}",
          typographyStyle: "headline",
          color: "#facc15",
        },
      },
      {
        id: "rb-btn-sc5",
        name: "Ignite Celebration Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Ignite Grand Rainbow 🌟", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb5-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-sc5",
        actions: [
          { id: "act-rb5-fanfare", type: "play_sound", payload: { soundUrl: "fanfare" } },
          { id: "act-rb5-confetti", type: "spawn_effect", payload: { effectType: "confetti" } },
          { id: "act-rb5-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 6: Rainbow transforms into Birthday Reveal
  {
    id: "rb-sc6",
    name: "Scene 6: Grand Rainbow Reveal",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 3.4], target: [0, 0.3, 0], fov: 46 },
    lighting: {
      ambientColor: "#fff7ed",
      ambientIntensity: 1.3,
      directionalColor: "#f43f5e",
      directionalPosition: [2, 5, 3],
    },
    environment: {
      backgroundGradient: "from-pink-950 via-purple-950 to-indigo-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "rb-obj-rainbow-6",
        name: "Grand Glowing Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, 0.5, -0.6], rotation: [0, 0, 0], scale: [1.2, 1.2, 1.2] },
        visible: true,
        props: {},
      },
      {
        id: "rb-obj-char-6",
        name: "Dancing Companion",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.6, 0.6], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-obj-balloons-6",
        name: "Celebration Balloons",
        type: "model3d",
        assetRef: "asset-balloons",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "rb-txt-hbd",
        name: "Happy Birthday Text",
        type: "text",
        transform: { position: [0, 1.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "HAPPY BIRTHDAY, {{recipient_name}}! 🌈",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-read-msg",
        name: "Read Message Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Secret Wish 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-rb6-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-read-msg",
        actions: [
          { id: "act-rb6-pop", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-rb6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 7: Personal Message
  {
    id: "rb-sc7",
    name: "Scene 7: Heartfelt Message",
    order: 7,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 3.6], target: [0, 0.2, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.0,
      directionalColor: "#ec4899",
      directionalPosition: [1, 4, 3],
    },
    environment: {
      backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "rb-obj-char-7",
        name: "Companion Listening",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-1.4, -0.5, 0.3], rotation: [0, 0.4, 0], scale: [0.75, 0.75, 0.75] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-txt-message-body",
        name: "Personalized Message",
        type: "text",
        transform: { position: [0, 0.9, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "{{custom_message}}",
          typographyStyle: "letter",
          color: "#ffffff",
        },
      },
      {
        id: "rb-txt-sender",
        name: "Sender Attribution",
        type: "text",
        transform: { position: [0, 0.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "— With love, {{sender_name}}",
          typographyStyle: "subtitle",
          color: "#f472b6",
        },
      },
      {
        id: "rb-btn-sc7-finish",
        name: "Finish Celebration",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Complete Celebration 🎈", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb7-next",
        type: "button_clicked",
        targetObjectId: "rb-btn-sc7-finish",
        actions: [
          { id: "act-rb7-fanfare", type: "play_sound", payload: { soundUrl: "fanfare" } },
          { id: "act-rb7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 8: Final CTA
  {
    id: "rb-sc8",
    name: "Scene 8: Finale & Sharing",
    order: 8,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.4, 4.4], target: [0, 0.3, 0], fov: 48 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.2,
      directionalColor: "#a855f7",
      directionalPosition: [0, 4, 4],
    },
    environment: {
      backgroundGradient: "from-purple-950 via-indigo-950 to-slate-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "rb-obj-rainbow-8",
        name: "Grand Finale Rainbow",
        type: "model3d",
        assetRef: "asset-rainbow",
        transform: { position: [0, 0.3, -0.8], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: {},
      },
      {
        id: "rb-obj-char-8",
        name: "Cheering Companion",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.6, 0.5], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "rb-txt-end-title",
        name: "Ending Title",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Happy Birthday {{recipient_name}}! 🎉",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "rb-btn-replay",
        name: "Replay Experience",
        type: "button",
        transform: { position: [-1.2, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay 🔄", buttonVariant: "secondary" },
      },
      {
        id: "rb-btn-create",
        name: "Create Your Own",
        type: "button",
        transform: { position: [1.2, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Send a Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-rb8-replay",
        type: "button_clicked",
        targetObjectId: "rb-btn-replay",
        actions: [{ id: "act-rb8-rep", type: "transition_scene", payload: { targetSceneIndex: 0 } }],
      },
      {
        id: "trig-rb8-create",
        type: "button_clicked",
        targetObjectId: "rb-btn-create",
        actions: [{ id: "act-rb8-cre", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const RAINBOW_SURPRISE_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-rainbow-surprise-1-0-0",
  templateId: "tpl-rainbow-surprise",
  version: "1.0.0",
  changelog: "Initial release of Rainbow Surprise storytelling template",
  isPublished: true,
  scenes: RAINBOW_SURPRISE_SCENES,
  createdAt: "2026-09-14T08:52:00Z",
};

export const RAINBOW_SURPRISE_TEMPLATE: TemplateModel = {
  id: "tpl-rainbow-surprise",
  categoryId: "birthday",
  name: "Rainbow Surprise 🌈",
  slug: "rainbow-surprise",
  description:
    "A magical storybook landscape where a playful companion chases a glowing rainbow into a vibrant birthday wonderland.",
  tagline: "Follow the vibrant rainbow to a secret birthday world.",
  thumbnailUrl: "/thumbnails/rainbow-surprise.jpg",
  tags: ["Magical", "Rainbow", "Character", "Colorful", "Storybook", "Joyful"],
  status: "active",
  isFree: true,
  supportsPhotos: false,
  maxPhotos: 0,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [RAINBOW_SURPRISE_VERSION_1_0_0],
  createdAt: "2026-09-14T08:52:00Z",
  updatedAt: "2026-09-14T08:52:00Z",
};
