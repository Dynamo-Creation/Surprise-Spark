import { TemplateModel, TemplateVersionModel, SceneModel } from "../types";

/**
 * TEMPLATE 5 — MEMORY JOURNEY 📸
 * Sequence:
 * 1. Do you remember these moments?
 * 2. Photo 1 (requiresPhotoIndex: 1)
 * 3. Photo 2 (requiresPhotoIndex: 2)
 * 4. Photo 3 (requiresPhotoIndex: 3)
 * 5. Photo 4 (requiresPhotoIndex: 4)
 * 6. Photo 5 (requiresPhotoIndex: 5)
 * 7. Photos form a heart
 * 8. Heart transforms into birthday decoration
 * 9. Final message
 * 10. CTA
 *
 * Automatically skips photo scenes 2-6 if the corresponding photo_X is missing.
 */

export const MEMORY_JOURNEY_SCENES: SceneModel[] = [
  // Scene 1: Do you remember these moments?
  {
    id: "mem-sc1",
    name: "Scene 1: Introduction",
    order: 1,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.2, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 0.9 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "stars" },
    objects: [
      {
        id: "mem-tag-1",
        name: "Intro Tag",
        type: "text",
        transform: { position: [0, 1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A Journey Through Time 📸", typographyStyle: "badge", color: "#f472b6" },
      },
      {
        id: "mem-text-1",
        name: "Question Headline",
        type: "text",
        transform: { position: [0, 1.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Do you remember these moments, {{recipient_name}}?", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "mem-btn-start",
        name: "Start Button",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Walk Down Memory Lane ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m1-start",
        type: "button_clicked",
        targetObjectId: "mem-btn-start",
        actions: [
          { id: "act-m1-sound", type: "play_sound", payload: { soundUrl: "whoosh" } },
          { id: "act-m1-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 2: Photo 1
  {
    id: "mem-sc2",
    name: "Scene 2: First Memory",
    order: 2,
    requiresPhotoIndex: 1,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.4, 4.0], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950/60", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-photo-1",
        name: "Photo 1 Polaroid",
        type: "image",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, -2], scale: [1, 1, 1] },
        visible: true,
        props: { imageUrl: "{{photo_1}}", text: "Chapter One: Where the magic began" },
      },
      {
        id: "mem-btn-p1",
        name: "Next Photo Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Next Memory 📸", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m2-next",
        type: "button_clicked",
        targetObjectId: "mem-btn-p1",
        actions: [{ id: "act-m2-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 3: Photo 2
  {
    id: "mem-sc3",
    name: "Scene 3: Second Memory",
    order: 3,
    requiresPhotoIndex: 2,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.4, 4.0], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950/70 via-purple-950 to-slate-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-photo-2",
        name: "Photo 2 Polaroid",
        type: "image",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 2], scale: [1, 1, 1] },
        visible: true,
        props: { imageUrl: "{{photo_2}}", text: "Every laugh shared is a treasure" },
      },
      {
        id: "mem-btn-p2",
        name: "Next Photo Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Next Memory 📸", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m3-next",
        type: "button_clicked",
        targetObjectId: "mem-btn-p2",
        actions: [{ id: "act-m3-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 4: Photo 3
  {
    id: "mem-sc4",
    name: "Scene 4: Third Memory",
    order: 4,
    requiresPhotoIndex: 3,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.4, 4.0], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-pink-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-photo-3",
        name: "Photo 3 Polaroid",
        type: "image",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, -1], scale: [1, 1, 1] },
        visible: true,
        props: { imageUrl: "{{photo_3}}", text: "Adventures we will never forget" },
      },
      {
        id: "mem-btn-p3",
        name: "Next Photo Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Next Memory 📸", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m4-next",
        type: "button_clicked",
        targetObjectId: "mem-btn-p3",
        actions: [{ id: "act-m4-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 5: Photo 4 (Optional)
  {
    id: "mem-sc5",
    name: "Scene 5: Fourth Memory",
    order: 5,
    requiresPhotoIndex: 4,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.4, 4.0], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-photo-4",
        name: "Photo 4 Polaroid",
        type: "image",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 2], scale: [1, 1, 1] },
        visible: true,
        props: { imageUrl: "{{photo_4}}", text: "Through thick and thin" },
      },
      {
        id: "mem-btn-p4",
        name: "Next Photo Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Next Memory 📸", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m5-next",
        type: "button_clicked",
        targetObjectId: "mem-btn-p4",
        actions: [{ id: "act-m5-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 6: Photo 5 (Optional)
  {
    id: "mem-sc6",
    name: "Scene 6: Fifth Memory",
    order: 6,
    requiresPhotoIndex: 5,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 0.4, 4.0], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950/80 via-purple-950 to-slate-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-photo-5",
        name: "Photo 5 Polaroid",
        type: "image",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, -2], scale: [1, 1, 1] },
        visible: true,
        props: { imageUrl: "{{photo_5}}", text: "To many more memories ahead!" },
      },
      {
        id: "mem-btn-p5",
        name: "Form Heart Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Form Constellation ❤️", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-m6-next",
        type: "button_clicked",
        targetObjectId: "mem-btn-p5",
        actions: [{ id: "act-m6-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 7: Photos form a heart
  {
    id: "mem-sc7",
    name: "Scene 7: Heart Formation",
    order: 7,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.1, 4.2], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.2 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-heart-title",
        name: "Heart Title",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "A constellation of memories in our hearts ❤️", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "mem-btn-transform",
        name: "Transform Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Transform Into Celebration ✨", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m7-tf",
        type: "button_clicked",
        targetObjectId: "mem-btn-transform",
        actions: [
          { id: "act-m7-sound", type: "play_sound", payload: { soundUrl: "sparkle" } },
          { id: "act-m7-next", type: "transition_scene", payload: { targetSceneIndex: "next" } },
        ],
      },
    ],
  },

  // Scene 8: Heart transforms into birthday decoration
  {
    id: "mem-sc8",
    name: "Scene 8: Celebration Transformation",
    order: 8,
    durationMs: 0,
    transition: "zoom",
    camera: { position: [0, 1.0, 3.8], target: [0, 0, 0], fov: 46 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.3 },
    environment: { backgroundGradient: "from-purple-950 via-slate-950 to-pink-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "mem-reveal-headline",
        name: "Celebration Headline",
        type: "text",
        transform: { position: [0, 2.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Happy Birthday, {{recipient_name}}! 🎉✨", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "mem-btn-read-msg",
        name: "Read Letter Button",
        type: "button",
        transform: { position: [0, -2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Read Heartfelt Letter 💌", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m8-fanfare",
        type: "scene_loaded",
        actions: [
          { id: "act-m8-fanfare", type: "play_sound", payload: { soundUrl: "celebration_fanfare" } },
          { id: "act-m8-balloons", type: "spawn_effect", payload: { effectType: "balloons" } },
        ],
      },
      {
        id: "trig-m8-msg",
        type: "button_clicked",
        targetObjectId: "mem-btn-read-msg",
        actions: [{ id: "act-m8-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 9: Final message
  {
    id: "mem-sc9",
    name: "Scene 9: Personal Message",
    order: 9,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 0, 4.5], target: [0, 0, 0], fov: 50 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.0 },
    environment: { backgroundGradient: "from-slate-950 via-purple-950 to-indigo-950", particlesPreset: "hearts" },
    objects: [
      {
        id: "mem-letter",
        name: "Letter Card",
        type: "text",
        transform: { position: [0, 0.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "{{message}}", typographyStyle: "letter", color: "#ffffff" },
      },
      {
        id: "mem-sig",
        name: "Signature",
        type: "text",
        transform: { position: [0, -1.0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "With love, {{sender_name}} ❤️", typographyStyle: "subtitle", color: "#fbcfe8" },
      },
      {
        id: "mem-btn-finale",
        name: "Finale Button",
        type: "button",
        transform: { position: [0, -2.1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "A Final Note ❤️", buttonVariant: "primary" },
      },
    ],
    triggers: [
      {
        id: "trig-m9-final",
        type: "button_clicked",
        targetObjectId: "mem-btn-finale",
        actions: [{ id: "act-m9-next", type: "transition_scene", payload: { targetSceneIndex: "next" } }],
      },
    ],
  },

  // Scene 10: CTA
  {
    id: "mem-sc10",
    name: "Scene 10: Final CTA",
    order: 10,
    durationMs: 0,
    transition: "fade",
    camera: { position: [0, 1.1, 4.4], target: [0, 0, 0], fov: 48 },
    lighting: { ambientColor: "#ffffff", ambientIntensity: 1.1 },
    environment: { backgroundGradient: "from-pink-950 via-purple-950 to-slate-950", particlesPreset: "confetti" },
    objects: [
      {
        id: "mem-final-title",
        name: "Final Headline",
        type: "text",
        transform: { position: [0, 2.3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Cherishing Every Moment With You 📸", typographyStyle: "headline", color: "#ffffff" },
      },
      {
        id: "mem-final-subtext",
        name: "Final Subtext",
        type: "text",
        transform: { position: [0, 1.6, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { text: "Don't just send a wish. Send a surprise.", typographyStyle: "subtitle", color: "#f472b6" },
      },
      {
        id: "m-btn-replay",
        name: "Replay",
        type: "button",
        transform: { position: [0, -1.2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Replay Memory Walk ↺", buttonVariant: "secondary" },
      },
      {
        id: "m-btn-share",
        name: "Share",
        type: "button",
        transform: { position: [0, -1.8, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Share Surprise 🔗", buttonVariant: "primary" },
      },
      {
        id: "m-btn-create",
        name: "Create Own",
        type: "button",
        transform: { position: [0, -2.4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        visible: true,
        props: { buttonLabel: "Create Your Own Surprise ✨", buttonVariant: "accent" },
      },
    ],
    triggers: [
      {
        id: "trig-m10-replay",
        type: "button_clicked",
        targetObjectId: "m-btn-replay",
        actions: [{ id: "act-m10-first", type: "transition_scene", payload: { targetSceneIndex: "first" } }],
      },
      {
        id: "trig-m10-sh",
        type: "button_clicked",
        targetObjectId: "m-btn-share",
        actions: [{ id: "act-m10-sh-ev", type: "trigger_custom_event", payload: { customEventName: "open_share_dialog" } }],
      },
      {
        id: "trig-m10-cr",
        type: "button_clicked",
        targetObjectId: "m-btn-create",
        actions: [{ id: "act-m10-cr-ev", type: "trigger_custom_event", payload: { customEventName: "navigate_create" } }],
      },
    ],
  },
];

export const MEMORY_JOURNEY_VERSION_1_0_0: TemplateVersionModel = {
  id: "ver-memory-journey-1-0-0",
  templateId: "tpl-memory-journey",
  version: "1.0.0",
  changelog: "Memory Journey template with up to 5 photos, dynamic photo skipping, and constellation heart formation.",
  isPublished: true,
  scenes: MEMORY_JOURNEY_SCENES,
  createdAt: "2026-09-14T08:48:00Z",
};

export const MEMORY_JOURNEY_TEMPLATE: TemplateModel = {
  id: "tpl-memory-journey",
  categoryId: "birthday",
  name: "Memory Journey 📸",
  slug: "memory-journey",
  description: "A nostalgic photographic voyage. Floating polaroids of cherished memories assemble into a glowing heart celebration.",
  tagline: "Walk down memory lane together.",
  thumbnailUrl: "/thumbnails/memory-journey.jpg",
  tags: ["Photos", "Polaroids", "Nostalgic", "Heart Constellation", "Emotional"],
  status: "active",
  isFree: true,
  supportsPhotos: true,
  maxPhotos: 5,
  supportsMusic: true,
  supportsTheme: true,
  currentVersion: "1.0.0",
  versions: [MEMORY_JOURNEY_VERSION_1_0_0],
  createdAt: "2026-09-14T08:48:00Z",
  updatedAt: "2026-09-14T08:48:00Z",
};
