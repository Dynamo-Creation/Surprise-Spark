import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 6 — CONFETTI BLAST 🎉
 * Sequence:
 * 1. Wait...
 * 2. 3
 * 3. 2
 * 4. 1
 * 5. Huge confetti explosion
 * 6. Balloons
 * 7. Recipient name
 * 8. Message
 * 9. CTA
 *
 * Fast-loading, high-energy, performance-optimized countdown experience.
 */

export const CONFETTI_BLAST_SCENES: SceneModel[] = [
  // Scene 1: Wait...
  {
    id: "blast-sc1",
    name: "Scene 1: Wait...",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 0.9 },
    environment: { backgroundGradient: "from-slate-950 via-slate-900 to-slate-950", particlesPreset: "none" },
    objects: [
      {
        id: "blast-tag-1",
        name: "Incoming Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "⚡ HIGH ENERGY CELEBRATION ⚡", typographyStyle: "badge", color: "#f59e0b" },
      },
      {
        id: "blast-text-1",
        name: "Wait text",
        type: "text",
        transform: { position: [0, 1.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Wait for it...", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "blast-btn-countdown",
        name: "Start Countdown",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Start Countdown ⏱️", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-cb1-start",
        type: "button_clicked",
        targetObjectId: "blast-btn-countdown",
        actions: [{ id: "act-cb1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 2: 3
  {
    id: "blast-sc2",
    name: "Scene 2: Three",
    order: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-slate-900", particlesPreset: "stars" },
    objects: [
      {
        id: "blast-num-3",
        name: "Number 3",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "3", typographyStyle: "headline", color: "#fbbf24" },
      },
    ],
    triggers: [
      {
        id: "trig-cb2-auto",
        type: "scene_loaded",
        actions: [
          { id: "act-cb2-sfx", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-cb2-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 800 } },
        ],
      },
    ],
  },

  // Scene 3: 2
  {
    id: "blast-sc3",
    name: "Scene 3: Two",
    order: 3,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950/40", particlesPreset: "stars" },
    objects: [
      {
        id: "blast-num-2",
        name: "Number 2",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "2", typographyStyle: "headline", color: "#f97316" },
      },
    ],
    triggers: [
      {
        id: "trig-cb3-auto",
        type: "scene_loaded",
        actions: [
          { id: "act-cb3-sfx", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-cb3-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 800 } },
        ],
      },
    ],
  },

  // Scene 4: 1
  {
    id: "blast-sc4",
    name: "Scene 4: One",
    order: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/60 via-purple-950 to-slate-950", particlesPreset: "stars" },
    objects: [
      {
        id: "blast-num-1",
        name: "Number 1",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "1", typographyStyle: "headline", color: "#ec4899" },
      },
    ],
    triggers: [
      {
        id: "trig-cb4-auto",
        type: "scene_loaded",
        actions: [
          { id: "act-cb4-sfx", type: "play_sound", payload: { soundUrl: "lid_pop" } },
          { id: "act-cb4-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 800 } },
        ],
      },
    ],
  },

  // Scene 5: Huge confetti explosion
  {
    id: "blast-sc5",
    name: "Scene 5: Explosion!",
    order: 5,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.9, 3.4], target: [0, 0, 0], fov: 44 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.4 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "blast-boom-title",
        name: "Explosion Headline",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "💥 BOOM! HAPPY BIRTHDAY! 💥", typographyStyle: "headline", color: "#fbbf24" },
      },
    ],
    triggers: [
      {
        id: "trig-cb5-blast",
        type: "scene_loaded",
        actions: [
          { id: "act-cb5-fanfare", type: "play_sound", payload: { soundUrl: "celebration_fanfare" } },
          { id: "act-cb5-confetti", type: "spawn_effect", payload: { effectType: "confetti" } },
          { id: "act-cb5-next", type: "transition_scene", payload: { targetSceneIndex: "next", delayMs: 1400 } },
        ],
      },
    ],
  },

  // Scene 6: Balloons
  {
    id: "blast-sc6",
    name: "Scene 6: Balloons Burst",
    order: 6,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.1, 4.0], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "balloons" },
    objects: [
      {
        id: "blast-balloons-title",
        name: "Balloons Headline",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Balloons taking over the sky! 🎈🎉", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "blast-btn-to-name",
        name: "Continue Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Reveal Recipient ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-cb6-next",
        type: "button_clicked",
        targetObjectId: "blast-btn-to-name",
        actions: [{ id: "act-cb6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 7: Recipient name
  {
    id: "blast-sc7",
    name: "Scene 7: Recipient Name",
    order: 7,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950/70 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "blast-name-tag",
        name: "Birthday Tag",
        type: "text",
        transform: { position: [0, 2.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A SPECIAL DAY FOR", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "blast-name-heading",
        name: "Recipient Name Heading",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday, {{recipient_name}}! 🎉✨", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "blast-btn-read-msg",
        name: "Read Letter Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Your Personal Message 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-cb7-msg",
        type: "button_clicked",
        targetObjectId: "blast-btn-read-msg",
        actions: [{ id: "act-cb7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 8: Message
  {
    id: "blast-sc8",
    name: "Scene 8: Personal Message",
    order: 8,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "blast-letter",
        name: "Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#ffffff" },
      },
      {
        id: "blast-sig",
        name: "Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "With love, {{sender_name}} ❤️", typographyStyle: "subtitle", color: "#fbcfe8" },
      },
      {
        id: "blast-btn-finale",
        name: "Finale Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "A Final Note ❤️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-cb8-final",
        type: "button_clicked",
        targetObjectId: "blast-btn-finale",
        actions: [{ id: "act-cb8-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 9: CTA
  {
    id: "blast-sc9",
    name: "Scene 9: Final CTA",
    order: 9,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "blast-final-title",
        name: "Final Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Celebrated with Full Energy! 💥", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "blast-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Don't just send a wish. Send a surprise.", typographyStyle: "subtitle", color: "#f472b6" },
      },
      {
        id: "cb-btn-replay",
        name: "Replay",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay Blast ↺", buttonVariant: "secondary" },
      },
      {
        id: "cb-btn-share",
        name: "Share",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 🔗", buttonVariant: "primary" },
      },
      {
        id: "cb-btn-create",
        name: "Create Own",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create Your Own Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-cb9-replay",
        type: "button_clicked",
        targetObjectId: "cb-btn-replay",
        actions: [{ id: "act-cb9-first", type: "transition_scene", payload: { targetSceneIndex: "first" } }],
      },
      {
        id: "trig-cb9-sh",
        type: "button_clicked",
        targetObjectId: "cb-btn-share",
        actions: [{ id: "act-cb9-sh-ev", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-cb9-cr",
        type: "button_clicked",
        targetObjectId: "cb-btn-create",
        actions: [{ id: "act-cb9-cr-ev", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const CONFETTI_BLAST_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-confetti-blast-1-0-0",
  templateId: "tpl-confetti-blast",
  version: "1.0.0",
  changelog: "Confetti Blast template featuring fast countdown (3, 2, 1), explosion celebration, and personal message.",
  isPublished: true,
  scenes: CONFETTI_BLAST_SCENES,
  createdAt: "2026-09-14T08:50:00Z",
};

export const CONFETTI_BLAST_TEMPLATE: TemplateModel = {
  id: "tpl-confetti-blast",
  categoryId: "birthday",
  name: "Confetti Blast 🎉",
  slug: "confetti-blast",
  description: "A fast-loading, lightning-paced birthday countdown experience featuring dramatic 3-2-1 suspense and a massive confetti explosion.",
  tagline: "Countdown to the loudest birthday cheer.",
  thumbnailUrl: "/thumbnails/confetti-blast.jpg",
  tags: ["Fast Loading", "Countdown", "Huge Confetti", "High Energy", "Party"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [CONFETTI_BLAST_VERSION_1_0_0],
  createdAt: "2026-09-14T08:50:00Z",
  updatedAt: "2026-09-14T08:50:00Z",
};
