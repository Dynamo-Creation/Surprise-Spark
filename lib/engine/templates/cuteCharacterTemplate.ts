import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 8 — CUTE CHARACTER 🧸
 *
 * Scenes:
 * 1. Character enters
 * 2. Finds gift
 * 3. Picks gift up
 * 4. Walks toward camera
 * 5. Places gift
 * 6. Gift opens
 * 7. Confetti
 * 8. Recipient name
 * 9. Message
 * 10. Character celebration
 * 11. Final CTA
 *
 * Fully data-driven animated mascot celebration template.
 */

export const CUTE_CHARACTER_SCENES: SceneModel[] = [
  // Scene 1: Character enters
  {
    id: "char-sc1",
    name: "Scene 1: Character Enters",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.4, 4.4], target: [0, 0.2, 0], fov: 48 },
    lighting: {
      ambientColor: "#fef3c7",
      ambientIntensity: 0.9,
      directionalColor: "#f59e0b",
      directionalPosition: [2, 4, 3],
    },
    environment: {
      backgroundGradient: "from-amber-950 via-slate-950 to-orange-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-1",
        name: "Teddy Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-1.5, -0.6, 0.2], rotation: [0, 0.4, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-tag-1",
        name: "Intro Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🐾 A SPECIAL VISITOR ARRIVED", typographyStyle: "badge", color: "#fbbf24" },
      },
      {
        id: "char-txt-1",
        name: "Intro Headline",
        type: "text",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Someone is tiptoeing in...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-1",
        name: "Who is that button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Who is that? 👀", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c1-start",
        type: "button_clicked",
        targetObjectId: "char-btn-1",
        actions: [
          { id: "act-c1-pop", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-c1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 2: Finds gift
  {
    id: "char-sc2",
    name: "Scene 2: Finds Gift",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.3, 4.0], target: [0, 0.1, 0], fov: 48 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.0,
      directionalColor: "#ec4899",
      directionalPosition: [-2, 4, 3],
    },
    environment: {
      backgroundGradient: "from-purple-950 via-slate-950 to-amber-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-2",
        name: "Curious Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-0.6, -0.6, 0.3], rotation: [0, 0.2, 0], scale: [0.9, 0.9, 0.9] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-obj-gift-2",
        name: "Discovered Gift",
        type: "model3d",
        assetRef: "asset-gift-box",
        transform: { position: [0.8, -0.7, 0.2], rotation: [0, -0.2, 0], scale: [0.65, 0.65, 0.65] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "char-txt-2",
        name: "Discovery Text",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Look! A shiny parcel!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-2",
        name: "Inspect Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Check it out 🎁", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c2-next",
        type: "button_clicked",
        targetObjectId: "char-btn-2",
        actions: [
          { id: "act-c2-chime", type: "play_sound", payload: { soundUrl: "chime" } },
          { id: "act-c2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 3: Picks gift up
  {
    id: "char-sc3",
    name: "Scene 3: Picks Gift Up",
    order: 3,
    durationMs: 0,
    transition: "slide",
    camera: { position: [0, 1.2, 3.8], target: [0, 0.2, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.1,
      directionalColor: "#f59e0b",
      directionalPosition: [1, 4, 3],
    },
    environment: {
      backgroundGradient: "from-amber-950 via-purple-950 to-slate-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-3",
        name: "Holding Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.6, 0.2], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-obj-gift-3",
        name: "Lifted Gift",
        type: "model3d",
        assetRef: "asset-gift-box",
        transform: { position: [0, -0.25, 0.7], rotation: [0, 0, 0], scale: [0.65, 0.65, 0.65] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "char-txt-3",
        name: "Tag Text",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "It has your name on the tag!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-3",
        name: "Carry Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Bring it over! 🐾", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c3-next",
        type: "button_clicked",
        targetObjectId: "char-btn-3",
        actions: [
          { id: "act-c3-pop", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-c3-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 4: Walks toward camera
  {
    id: "char-sc4",
    name: "Scene 4: Walks Toward Camera",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 3.4], target: [0, 0.1, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.2,
      directionalColor: "#fbbf24",
      directionalPosition: [0, 4, 3],
    },
    environment: {
      backgroundGradient: "from-rose-950 via-purple-950 to-indigo-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-4",
        name: "Close Bear",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.4, 0.7], rotation: [0, 0, 0], scale: [1.05, 1.05, 1.05] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-obj-gift-4",
        name: "Close Gift",
        type: "model3d",
        assetRef: "asset-gift-box",
        transform: { position: [0, -0.15, 1.0], rotation: [0, 0, 0], scale: [0.7, 0.7, 0.7] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "char-txt-4",
        name: "Walking Text",
        type: "text",
        transform: { position: [0, 1.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Almost there! Steady now...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-4",
        name: "Set Down Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Set it down safely 📦", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c4-next",
        type: "button_clicked",
        targetObjectId: "char-btn-4",
        actions: [
          { id: "act-c4-chime", type: "play_sound", payload: { soundUrl: "chime" } },
          { id: "act-c4-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 5: Places gift
  {
    id: "char-sc5",
    name: "Scene 5: Places Gift",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 3.6], target: [0, 0, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.1,
      directionalColor: "#ec4899",
      directionalPosition: [2, 4, 3],
    },
    environment: {
      backgroundGradient: "from-purple-950 via-slate-950 to-pink-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-5",
        name: "Mascot Waiting",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [1.1, -0.5, 0.1], rotation: [0, -0.4, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-obj-gift-box",
        name: "Ready Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box",
        transform: { position: [0, -0.5, 0.6], rotation: [0, 0, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "char-tag-5",
        name: "Ready Tag",
        type: "text",
        transform: { position: [0, 1.7, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🎁 DELIVERED WITH CARE", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "char-txt-5",
        name: "Prompt Text",
        type: "text",
        transform: { position: [0, 1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Here you go! Tap the gift box!",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-open",
        name: "Open Gift Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Open the Gift Box 🎀", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c5-box-click",
        type: "object_clicked",
        targetObjectId: "char-obj-gift-box",
        actions: [
          { id: "act-c5-box-open", type: "play_animation", targetObjectId: "char-obj-gift-box", payload: { animationName: "open" } },
          { id: "act-c5-box-snd", type: "play_sound", payload: { soundUrl: "box_open" } },
          { id: "act-c5-box-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
      {
        id: "trig-c5-btn-click",
        type: "button_clicked",
        targetObjectId: "char-btn-open",
        actions: [
          { id: "act-c5-btn-open", type: "play_animation", targetObjectId: "char-obj-gift-box", payload: { animationName: "open" } },
          { id: "act-c5-btn-snd", type: "play_sound", payload: { soundUrl: "box_open" } },
          { id: "act-c5-btn-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 6: Gift opens
  {
    id: "char-sc6",
    name: "Scene 6: Gift Opens",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.2], target: [0, 0, 0], fov: 46 },
    lighting: {
      ambientColor: "#fef3c7",
      ambientIntensity: 1.3,
      directionalColor: "#fbbf24",
      directionalPosition: [0, 4, 2],
    },
    environment: {
      backgroundGradient: "from-amber-950 via-purple-950 to-pink-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-gift-opened",
        name: "Opened Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box",
        transform: { position: [0, -0.4, 0.6], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "char-obj-bear-6",
        name: "Watching Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [1.2, -0.4, 0.1], rotation: [0, -0.5, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-txt-6",
        name: "Unboxing Text",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "The golden glow is bursting out...",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-6",
        name: "Look Inside Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Look Inside! ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c6-next",
        type: "button_clicked",
        targetObjectId: "char-btn-6",
        actions: [
          { id: "act-c6-shake", type: "play_animation", targetObjectId: "char-obj-gift-opened", payload: { animationName: "shake" } },
          { id: "act-c6-tada", type: "play_sound", payload: { soundUrl: "tada" } },
          { id: "act-c6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 7: Confetti
  {
    id: "char-sc7",
    name: "Scene 7: Confetti Explosion",
    order: 7,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 3.6], target: [0, 0.2, 0], fov: 48 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.4,
      directionalColor: "#f43f5e",
      directionalPosition: [2, 5, 3],
    },
    environment: {
      backgroundGradient: "from-fuchsia-950 via-purple-950 to-indigo-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "char-obj-balloons-7",
        name: "Floating Balloons",
        type: "model3d",
        assetRef: "asset-balloons",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "char-obj-bear-7",
        name: "Dancing Bear",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.6, 0.5], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-txt-7-boom",
        name: "Surprise Text",
        type: "text",
        transform: { position: [0, 1.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "SURPRISE! 🎉",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-7",
        name: "Who is it button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Who is this celebration for? 🌟", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c7-next",
        type: "button_clicked",
        targetObjectId: "char-btn-7",
        actions: [
          { id: "act-c7-fanfare", type: "play_sound", payload: { soundUrl: "fanfare" } },
          { id: "act-c7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 8: Recipient name
  {
    id: "char-sc8",
    name: "Scene 8: Recipient Dedication",
    order: 8,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 3.6], target: [0, 0.2, 0], fov: 46 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.2,
      directionalColor: "#facc15",
      directionalPosition: [0, 4, 3],
    },
    environment: {
      backgroundGradient: "from-amber-950 via-purple-950 to-slate-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-8",
        name: "Cheering Bear",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-1.2, -0.5, 0.3], rotation: [0, 0.3, 0], scale: [0.8, 0.8, 0.8] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-tag-8",
        name: "Celebration Badge",
        type: "text",
        transform: { position: [0, 1.7, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "👑 TODAY'S VIP GUEST OF HONOR", typographyStyle: "badge", color: "#facc15" },
      },
      {
        id: "char-txt-8-name",
        name: "Recipient Headline",
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
        id: "char-btn-8",
        name: "Read Note Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Personal Note 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-c8-next",
        type: "button_clicked",
        targetObjectId: "char-btn-8",
        actions: [
          { id: "act-c8-chime", type: "play_sound", payload: { soundUrl: "chime" } },
          { id: "act-c8-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 9: Message
  {
    id: "char-sc9",
    name: "Scene 9: Personal Message",
    order: 9,
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
        id: "char-obj-bear-9",
        name: "Attentive Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-1.4, -0.5, 0.3], rotation: [0, 0.4, 0], scale: [0.75, 0.75, 0.75] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-txt-message",
        name: "Message Content",
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
        id: "char-txt-sender",
        name: "Sender Name",
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
        id: "char-btn-9",
        name: "Dance Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Celebrate Together 💃", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c9-next",
        type: "button_clicked",
        targetObjectId: "char-btn-9",
        actions: [
          { id: "act-c9-pop", type: "play_sound", payload: { soundUrl: "pop" } },
          { id: "act-c9-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 10: Character celebration
  {
    id: "char-sc10",
    name: "Scene 10: Character Celebration",
    order: 10,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 3.4], target: [0, 0.2, 0], fov: 46 },
    lighting: {
      ambientColor: "#fef3c7",
      ambientIntensity: 1.3,
      directionalColor: "#f59e0b",
      directionalPosition: [0, 4, 3],
    },
    environment: {
      backgroundGradient: "from-amber-950 via-rose-950 to-purple-950",
      particlesPreset: "confetti",
    },
    objects: [
      {
        id: "char-obj-bear-10",
        name: "Celebration Mascot",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.5, 0.5], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-obj-balloons-10",
        name: "Flying Balloons",
        type: "model3d",
        assetRef: "asset-balloons",
        transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "char-txt-10",
        name: "Celebration Dance",
        type: "text",
        transform: { position: [0, 1.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Big Bear Hugs & High Fives! 🐾",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-10",
        name: "Finish Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Finish Celebration 🎈", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c10-next",
        type: "button_clicked",
        targetObjectId: "char-btn-10",
        actions: [
          { id: "act-c10-fanfare", type: "play_sound", payload: { soundUrl: "fanfare" } },
          { id: "act-c10-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 11: Final CTA
  {
    id: "char-sc11",
    name: "Scene 11: Finale & Sharing",
    order: 11,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.4, 4.4], target: [0, 0.3, 0], fov: 48 },
    lighting: {
      ambientColor: "#ffffff",
      ambientIntensity: 1.2,
      directionalColor: "#a855f7",
      directionalPosition: [0, 4, 4],
    },
    environment: {
      backgroundGradient: "from-purple-950 via-indigo-950 to-slate-950",
      particlesPreset: "stars",
    },
    objects: [
      {
        id: "char-obj-bear-11",
        name: "Waving Bear",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [0, -0.6, 0.5], rotation: [0, 0, 0], scale: [0.95, 0.95, 0.95] },
        visible: true,
        props: { color: "#d97706" },
      },
      {
        id: "char-txt-end-title",
        name: "Ending Title",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {
          text: "Happy Birthday {{recipient_name}}! 🎂",
          typographyStyle: "headline",
          color: "#ffffff",
        },
      },
      {
        id: "char-btn-replay",
        name: "Replay Experience",
        type: "button",
        transform: { position: [-1.2, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay 🔄", buttonVariant: "secondary" },
      },
      {
        id: "char-btn-create",
        name: "Create Your Own",
        type: "button",
        transform: { position: [1.2, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Send a Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-c11-replay",
        type: "button_clicked",
        targetObjectId: "char-btn-replay",
        actions: [{ id: "act-c11-rep", type: "transition_scene", payload: { targetSceneIndex: 0 } }],
      },
      {
        id: "trig-c11-create",
        type: "button_clicked",
        targetObjectId: "char-btn-create",
        actions: [{ id: "act-c11-cre", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const CUTE_CHARACTER_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-cute-character-1-0-0",
  templateId: "tpl-cute-character",
  version: "1.0.0",
  changelog: "Initial release of Cute Character animated mascot template",
  isPublished: true,
  scenes: CUTE_CHARACTER_SCENES,
  createdAt: "2026-09-14T08:55:00Z",
};

export const CUTE_CHARACTER_TEMPLATE: TemplateModel = {
  id: "tpl-cute-character",
  categoryId: "birthday",
  name: "Cute Character 🧸",
  slug: "cute-character",
  description:
    "An endearing animated 3D companion carries, delivers, and opens a personalized gift box filled with joy.",
  tagline: "A cuddly messenger delivering your love.",
  thumbnailUrl: "/thumbnails/cute-character.jpg",
  tags: ["Character", "Cute", "Mascot", "Interactive", "Story", "Heartwarming"],
  status: "active",
  isFree: true,
  supportsPhotos: false,
  maxPhotos: 0,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [CUTE_CHARACTER_VERSION_1_0_0],
  createdAt: "2026-09-14T08:55:00Z",
  updatedAt: "2026-09-14T08:55:00Z",
};
