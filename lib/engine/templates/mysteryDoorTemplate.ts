import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 4 — MYSTERY DOOR 🚪
 * Sequence:
 * 1. Someone left something for you...
 * 2. Colorful mysterious door
 * 3. Open interaction
 * 4. Door opens
 * 5. Camera enters
 * 6. Birthday environment activates
 * 7. Character enters with gift
 * 8. Gift opens
 * 9. Birthday message
 * 10. Final CTA
 */

export const MYSTERY_DOOR_SCENES: SceneModel[] = [
  // Scene 1: Someone left something for you...
  {
    id: "door-sc1",
    name: "Scene 1: Mysterious Message",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 0.9 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-slate-900", particlesPreset: "stars" },
    objects: [
      {
        id: "door-tag-1",
        name: "Mystery Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A Secret Awaits 🗝️", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "door-text-1",
        name: "Intro Text",
        type: "text",
        transform: { position: [0, 1.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Someone left something special for you...", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "door-btn-1",
        name: "Investigate Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Investigate 🚪", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-d1-next",
        type: "button_clicked",
        targetObjectId: "door-btn-1",
        actions: [
          { id: "act-d1-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-d1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 2: Colorful mysterious door
  {
    id: "door-sc2",
    name: "Scene 2: The Door Appears",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.1, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "stars" },
    objects: [
      {
        id: "mystery-door-model",
        name: "Mysterious Door",
        type: "model3d",
        assetRef: "asset-door",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "door-text-2",
        name: "Door Found Text",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A glowing door stands before you...", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "door-btn-unlock",
        name: "Unlock Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Turn The Handle ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-d2-unlock",
        type: "button_clicked",
        targetObjectId: "door-btn-unlock",
        actions: [{ id: "act-d2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 3: Open interaction
  {
    id: "door-sc3",
    name: "Scene 3: Unlocking",
    order: 3,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0.9, 3.4], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-slate-950 via-pink-950/60 to-purple-950", particlesPreset: "stars" },
    objects: [
      {
        id: "mystery-door-model",
        name: "Mysterious Door",
        type: "model3d",
        assetRef: "asset-door",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "door-text-3",
        name: "Unlocking Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "The lock clicks open...", typographyStyle: "headline", color: "#fde047" },
      },
    ],
    triggers: [
      {
        id: "trig-d3-auto-open",
        type: "scene_loaded",
        actions: [
          { id: "act-d3-click", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-d3-open", type: "play_animation", targetObjectId: "mystery-door-model", payload: { animationName: "open" } },
          { id: "act-d3-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1100 } },
        ],
      },
    ],
  },

  // Scene 4: Door opens
  {
    id: "door-sc4",
    name: "Scene 4: Door Swings Open",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.8, 2.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "mystery-door-model",
        name: "Wide Open Door",
        type: "model3d",
        assetRef: "asset-door",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        animation: { name: "opened", type: "open_lid" },
        props: {},
      },
      {
        id: "door-text-4",
        name: "Swinging Open Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Light pours out from within!", typographyStyle: "headline", color: "#ffffff" },
      },
    ],
    triggers: [
      {
        id: "trig-d4-enter",
        type: "scene_loaded",
        actions: [
          { id: "act-d4-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-d4-auto", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1000 } },
        ],
      },
    ],
  },

  // Scene 5: Camera enters
  {
    id: "door-sc5",
    name: "Scene 5: Stepping Inside",
    order: 5,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.9, 3.2], target: [0, 0, -2], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/60 via-purple-950 to-slate-950", particlesPreset: "stars" },
    objects: [
      {
        id: "door-text-5",
        name: "Inside Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Welcome to the celebration sanctuary ✨", typographyStyle: "headline", color: "#f472b6" },
      },
    ],
    triggers: [
      {
        id: "trig-d5-auto",
        type: "scene_loaded",
        actions: [{ id: "act-d5-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1200 } }],
      },
    ],
  },

  // Scene 6: Birthday environment activates
  {
    id: "door-sc6",
    name: "Scene 6: Birthday Atmosphere",
    order: 6,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.0], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "door-text-6",
        name: "Activate Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Look who is waiting to greet you! 🎉", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "door-btn-meet",
        name: "Meet Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Say Hello 👋", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-d6-meet",
        type: "button_clicked",
        targetObjectId: "door-btn-meet",
        actions: [
          { id: "act-d6-sound", type: "play_sound", payload: { soundUrl: "sparkle" } },
          { id: "act-d6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 7: Character enters with gift
  {
    id: "door-sc7",
    name: "Scene 7: Friend Brings Gift",
    order: 7,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/70 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "door-char-model",
        name: "Cute Mascot Character",
        type: "model3d",
        assetRef: "asset-character",
        transform: { position: [-0.6, -0.2, 0], rotation: [0, 0.3, 0], scale: [0.9, 0.9, 0.9] },
        visible: true,
        props: { color: "#f59e0b" },
      },
      {
        id: "door-gift-model",
        name: "Gift Box",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0.6, -0.2, 0], rotation: [0, 0, 0], scale: [0.85, 0.85, 0.85] },
        visible: true,
        props: { color: "#ec4899" },
      },
      {
        id: "door-text-7",
        name: "Delivery Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A special delivery from your friend!", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "door-btn-open-box",
        name: "Open Gift Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Open The Gift 🎁", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-d7-open",
        type: "button_clicked",
        targetObjectId: "door-btn-open-box",
        actions: [
          { id: "act-d7-sound", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-d7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 8: Gift opens
  {
    id: "door-sc8",
    name: "Scene 8: Gift Opens",
    order: 8,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.8, 3.2], target: [0, 0, 0], fov: 44 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "door-gift-model",
        name: "Opened Gift",
        type: "model3d",
        assetRef: "asset-gift-box-red",
        transform: { position: [0, -0.3, 0], rotation: [0, 0, 0], scale: [1.1, 1.1, 1.1] },
        visible: true,
        animation: { name: "opened", type: "open_lid" },
        props: { color: "#ec4899" },
      },
      {
        id: "door-text-8",
        name: "Explosion Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday, {{recipient_name}}! 🎉✨", typographyStyle: "headline", color: "#ffffff" },
      },
    ],
    triggers: [
      {
        id: "trig-d8-fanfare",
        type: "scene_loaded",
        actions: [
          { id: "act-d8-fanfare", type: "play_sound", payload: { soundUrl: "celebration_fanfare" } },
          { id: "act-d8-balloons", type: "spawn_effect", payload: { effectType: "balloons" } },
          { id: "act-d8-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1600 } },
        ],
      },
    ],
  },

  // Scene 9: Birthday message
  {
    id: "door-sc9",
    name: "Scene 9: Birthday Message",
    order: 9,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "door-letter",
        name: "Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#ffffff" },
      },
      {
        id: "door-sig",
        name: "Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "With love, {{sender_name}} ❤️", typographyStyle: "subtitle", color: "#fbcfe8" },
      },
      {
        id: "door-btn-finale",
        name: "Finale Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "A Final Note ❤️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-d9-final",
        type: "button_clicked",
        targetObjectId: "door-btn-finale",
        actions: [{ id: "act-d9-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 10: Final CTA
  {
    id: "door-sc10",
    name: "Scene 10: Final CTA",
    order: 10,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "door-final-title",
        name: "Final Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Unlocking Memories with You 🗝️", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "door-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Don't just send a wish. Send a surprise.", typographyStyle: "subtitle", color: "#f472b6" },
      },
      {
        id: "d-btn-replay",
        name: "Replay",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay Mystery Door ↺", buttonVariant: "secondary" },
      },
      {
        id: "d-btn-share",
        name: "Share",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 🔗", buttonVariant: "primary" },
      },
      {
        id: "d-btn-create",
        name: "Create Own",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create Your Own Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-d10-replay",
        type: "button_clicked",
        targetObjectId: "d-btn-replay",
        actions: [{ id: "act-d10-first", type: "transition_scene", payload: { targetSceneIndex: "first" } }],
      },
      {
        id: "trig-d10-sh",
        type: "button_clicked",
        targetObjectId: "d-btn-share",
        actions: [{ id: "act-d10-sh-ev", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-d10-cr",
        type: "button_clicked",
        targetObjectId: "d-btn-create",
        actions: [{ id: "act-d10-cr-ev", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const MYSTERY_DOOR_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-mystery-door-1-0-0",
  templateId: "tpl-mystery-door",
  version: "1.0.0",
  changelog: "Mystery Door template featuring door unlock, companion gift delivery, and confetti unbox.",
  isPublished: true,
  scenes: MYSTERY_DOOR_SCENES,
  createdAt: "2026-09-14T08:45:00Z",
};

export const MYSTERY_DOOR_TEMPLATE: TemplateModel = {
  id: "tpl-mystery-door",
  categoryId: "birthday",
  name: "Mystery Door 🚪",
  slug: "mystery-door",
  description: "A mysterious glowing door appears in a magical hallway. Unlock it to enter an enchanting celebration room.",
  tagline: "Turn the handle to unlock what is waiting.",
  thumbnailUrl: "/thumbnails/mystery-door.jpg",
  tags: ["3D Door", "Secret Room", "Character Delivery", "Adventure"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [MYSTERY_DOOR_VERSION_1_0_0],
  createdAt: "2026-09-14T08:45:00Z",
  updatedAt: "2026-09-14T08:45:00Z",
};
