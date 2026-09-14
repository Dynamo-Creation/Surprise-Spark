import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 3 — BALLOON ROOM 🎈
 * Sequence:
 * 1. Camera outside birthday room
 * 2. Door opens
 * 3. Camera enters
 * 4. Balloons surround camera
 * 5. Balloons rearrange
 * 6. Balloons form recipient name
 * 7. Celebration
 * 8. Personal message
 * 9. Final CTA
 */

export const BALLOON_ROOM_SCENES: SceneModel[] = [
  // Scene 1: Camera outside birthday room
  {
    id: "balloon-sc1",
    name: "Scene 1: Outside Birthday Room",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 0.8 },
    environment: { backgroundGradient: "from-slate-950 via-slate-900 to-purple-950", particlesPreset: "stars" },
    objects: [
      {
        id: "balloon-door-obj",
        name: "Mystery Room Door",
        type: "model3d",
        assetRef: "asset-door",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: {},
      },
      {
        id: "balloon-text-1",
        name: "Outside Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "There's a secret room down the hall...", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "balloon-btn-open",
        name: "Open Door Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Open The Door 🚪", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-b1-door",
        type: "button_clicked",
        targetObjectId: "balloon-btn-open",
        actions: [
          { id: "act-b1-open", type: "play_animation", targetObjectId: "balloon-door-obj", payload: { animationName: "open" } },
          { id: "act-b1-sound", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-b1-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 600 } },
        ],
      },
    ],
  },

  // Scene 2: Door opens
  {
    id: "balloon-sc2",
    name: "Scene 2: Door Opens",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.2], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "stars" },
    objects: [
      {
        id: "balloon-door-obj",
        name: "Open Door",
        type: "model3d",
        assetRef: "asset-door",
        transform: { position: [0, -0.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        animation: { name: "opened", type: "open_lid" },
        props: {},
      },
      {
        id: "balloon-text-2",
        name: "Door Open Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "The door swings wide open!", typographyStyle: "headline", color: "#ffffff" },
      },
    ],
    triggers: [
      {
        id: "trig-b2-enter",
        type: "scene_loaded",
        actions: [
          { id: "act-b2-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-b2-auto-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1000 } },
        ],
      },
    ],
  },

  // Scene 3: Camera enters
  {
    id: "balloon-sc3",
    name: "Scene 3: Entering Room",
    order: 3,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.8, 2.4], target: [0, 0, -2], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/60 via-purple-950 to-slate-950", particlesPreset: "balloons" },
    objects: [
      {
        id: "balloon-text-3",
        name: "Entering Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Step inside...", typographyStyle: "headline", color: "#f472b6" },
      },
    ],
    triggers: [
      {
        id: "trig-b3-auto-surround",
        type: "scene_loaded",
        actions: [
          { id: "act-b3-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1200 } },
        ],
      },
    ],
  },

  // Scene 4: Balloons surround camera
  {
    id: "balloon-sc4",
    name: "Scene 4: Balloons Surround",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 3.8], target: [0, 0, 0], fov: 52 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "balloons" },
    objects: [
      {
        id: "balloon-text-4",
        name: "Surrounded Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A sky of balloons fills the room! 🎈🎈🎈", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "balloon-btn-rearrange",
        name: "Rearrange Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Gather Balloons 🎈", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-b4-rearrange",
        type: "button_clicked",
        targetObjectId: "balloon-btn-rearrange",
        actions: [
          { id: "act-b4-sound", type: "play_sound", payload: { soundUrl: "sparkle" } },
          { id: "act-b4-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 5: Balloons rearrange
  {
    id: "balloon-sc5",
    name: "Scene 5: Balloons Rearrange",
    order: 5,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.2], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/70 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "balloon-text-5",
        name: "Rearranging Text",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Wait... the balloons are moving into formation!", typographyStyle: "headline", color: "#fde047" },
      },
    ],
    triggers: [
      {
        id: "trig-b5-auto-form",
        type: "scene_loaded",
        actions: [
          { id: "act-b5-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-b5-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1300 } },
        ],
      },
    ],
  },

  // Scene 6: Balloons form recipient name
  {
    id: "balloon-sc6",
    name: "Scene 6: Balloons Form Name",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "balloon-badge-6",
        name: "Name Badge",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "🎈 SPELLED IN BALLOONS 🎈", typographyStyle: "badge", color: "#fbbf24" },
      },
      {
        id: "balloon-name-heading",
        name: "Recipient Name Heading",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday, {{recipient_name}}!", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "balloon-btn-celebrate",
        name: "Celebrate Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Celebrate! 🎉", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-b6-celebrate",
        type: "button_clicked",
        targetObjectId: "balloon-btn-celebrate",
        actions: [
          { id: "act-b6-fanfare", type: "play_sound", payload: { soundUrl: "celebration_fanfare" } },
          { id: "act-b6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 7: Celebration
  {
    id: "balloon-sc7",
    name: "Scene 7: Grand Celebration",
    order: 7,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.2, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "balloon-celeb-headline",
        name: "Celebration Headline",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Another Magnificent Year of You! 🥳", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "balloon-btn-read-msg",
        name: "Read Letter Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Your Personal Message 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-b7-msg",
        type: "button_clicked",
        targetObjectId: "balloon-btn-read-msg",
        actions: [{ id: "act-b7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 8: Personal message
  {
    id: "balloon-sc8",
    name: "Scene 8: Personal Message",
    order: 8,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "balloon-letter",
        name: "Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#ffffff" },
      },
      {
        id: "balloon-sig",
        name: "Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "With love, {{sender_name}} ❤️", typographyStyle: "subtitle", color: "#fbcfe8" },
      },
      {
        id: "balloon-btn-final",
        name: "Final Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "A Final Note ❤️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-b8-final",
        type: "button_clicked",
        targetObjectId: "balloon-btn-final",
        actions: [{ id: "act-b8-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 9: Final CTA
  {
    id: "balloon-sc9",
    name: "Scene 9: Final CTA",
    order: 9,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "balloon-final-title",
        name: "Final Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Floating into an Amazing Year! 🎈", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "balloon-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Don't just send a wish. Send a surprise.", typographyStyle: "subtitle", color: "#f472b6" },
      },
      {
        id: "b-btn-replay",
        name: "Replay",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay Balloon Room ↺", buttonVariant: "secondary" },
      },
      {
        id: "b-btn-share",
        name: "Share",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 🔗", buttonVariant: "primary" },
      },
      {
        id: "b-btn-create",
        name: "Create Own",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create Your Own Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-b9-replay",
        type: "button_clicked",
        targetObjectId: "b-btn-replay",
        actions: [{ id: "act-b9-first", type: "transition_scene", payload: { targetSceneIndex: "first" } }],
      },
      {
        id: "trig-b9-sh",
        type: "button_clicked",
        targetObjectId: "b-btn-share",
        actions: [{ id: "act-b9-sh-ev", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-b9-cr",
        type: "button_clicked",
        targetObjectId: "b-btn-create",
        actions: [{ id: "act-b9-cr-ev", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const BALLOON_ROOM_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-balloon-room-1-0-0",
  templateId: "tpl-balloon-room",
  version: "1.0.0",
  changelog: "Balloon Room template featuring room entry, floating balloons surrounding camera, and name formation.",
  isPublished: true,
  scenes: BALLOON_ROOM_SCENES,
  createdAt: "2026-09-14T08:40:00Z",
};

export const BALLOON_ROOM_TEMPLATE: TemplateModel = {
  id: "tpl-balloon-room",
  categoryId: "birthday",
  name: "Balloon Room 🎈",
  slug: "balloon-room",
  description: "Step into an immersive room filled to the ceiling with vibrant balloons that rearrange to spell out the recipient's name.",
  tagline: "Float into another wonderful year.",
  thumbnailUrl: "/thumbnails/balloon-room.jpg",
  tags: ["Balloons", "Immersive Room", "Name Formation", "Joyful"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [BALLOON_ROOM_VERSION_1_0_0],
  createdAt: "2026-09-14T08:40:00Z",
  updatedAt: "2026-09-14T08:40:00Z",
};
