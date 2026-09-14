/**
 * TEMPLATE & SCENE ENGINE DOMAIN TYPES
 * Pipeline: DATA -> TEMPLATE -> SCENE -> OBJECT -> ANIMATION
 */

// -----------------------------------------------------------------------------
// 1. DYNAMIC VARIABLES & PERSONALIZATION
// -----------------------------------------------------------------------------
export interface PersonalizationData {
  recipient_name: string;
  sender_name: string;
  message: string;
  special_date?: string;
  photo_1?: string;
  photo_2?: string;
  photo_3?: string;
  photo_4?: string;
  photo_5?: string;
  [key: string]: string | undefined;
}

// -----------------------------------------------------------------------------
// 2. TRIGGER & ACTION EVENT SYSTEM
// -----------------------------------------------------------------------------
export type TriggerType =
  | "scene_loaded"
  | "timer"
  | "click"
  | "tap"
  | "double_tap"
  | "swipe"
  | "object_clicked"
  | "animation_completed"
  | "button_clicked"
  | "audio_completed"
  | "scene_completed"
  | "custom_event";

export type ActionType =
  | "play_animation"
  | "stop_animation"
  | "show_object"
  | "hide_object"
  | "change_camera"
  | "play_sound"
  | "show_text"
  | "spawn_effect"
  | "transition_scene"
  | "trigger_custom_event";

export interface ActionDefinition {
  id: string;
  type: ActionType;
  targetObjectId?: string;
  payload?: {
    animationName?: string;
    cameraPosition?: [number, number, number];
    cameraFov?: number;
    soundUrl?: string;
    textMessage?: string;
    effectType?: "confetti" | "balloons" | "fireworks" | "sparkles" | "hearts";
    targetSceneIndex?: number | "next" | "previous" | "first";
    customEventName?: string;
    delayMs?: number;
    durationMs?: number;
    [key: string]: unknown;
  };
}

export interface TriggerDefinition {
  id: string;
  type: TriggerType;
  targetObjectId?: string;
  delayMs?: number;
  eventName?: string;
  actions: ActionDefinition[];
}

// -----------------------------------------------------------------------------
// 3. OBJECT MODEL
// -----------------------------------------------------------------------------
export type SceneObjectType =
  | "model3d"
  | "text"
  | "image"
  | "particle"
  | "button"
  | "light"
  | "camera_target"
  | "audio";

export interface Transform3D {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ObjectAnimationConfig {
  name: string;
  type: "float" | "spin" | "bounce" | "pulse" | "shake" | "fade_in" | "scale_up" | "open_lid" | "extinguish" | "custom";
  speed?: number;
  delayMs?: number;
  durationMs?: number;
  loop?: boolean;
  isPlaying?: boolean;
}

export interface InteractionSettings {
  clickable?: boolean;
  cursor?: "pointer" | "grab" | "default";
  hoverScale?: number;
  hoverGlow?: string;
  tooltipText?: string;
}

export interface SceneObjectModel {
  id: string;
  name: string;
  type: SceneObjectType;
  assetRef?: string;
  transform: Transform3D;
  visible: boolean;
  parentObjectId?: string;
  animation?: ObjectAnimationConfig;
  interaction?: InteractionSettings;
  props: {
    text?: string;
    typographyStyle?: "headline" | "subtitle" | "letter" | "badge";
    imageUrl?: string;
    color?: string;
    particleCount?: number;
    particleColor?: string;
    buttonLabel?: string;
    buttonVariant?: "primary" | "secondary" | "accent";
    audioUrl?: string;
    autoplay?: boolean;
    volume?: number;
    [key: string]: unknown;
  };
}

// -----------------------------------------------------------------------------
// 4. SCENE MODEL
// -----------------------------------------------------------------------------
export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  allowOrbit?: boolean;
}

export interface LightingConfig {
  ambientColor: string;
  ambientIntensity: number;
  directionalColor?: string;
  directionalPosition?: [number, number, number];
  pointLights?: Array<{
    color: string;
    position: [number, number, number];
    intensity: number;
  }>;
}

export interface EnvironmentConfig {
  backgroundGradient: string;
  fogColor?: string;
  fogDensity?: number;
  particlesPreset?: "stars" | "confetti" | "balloons" | "snow" | "fireflies" | "hearts" | "none";
}

export interface SceneModel {
  id: string;
  name: string;
  order: number;
  durationMs?: number;
  transition: "fade" | "zoom" | "slide" | "dissolve" | "curtain";
  camera: CameraConfig;
  lighting: LightingConfig;
  environment: EnvironmentConfig;
  objects: SceneObjectModel[];
  triggers: TriggerDefinition[];
  requiresPhotoIndex?: number; // If set, scene is skipped if photo_X is missing
}

// -----------------------------------------------------------------------------
// 5. TEMPLATE & VERSION MODEL
// -----------------------------------------------------------------------------
export interface TemplateVersionModel {
  id: string;
  templateId: string;
  version: string; // e.g. "1.0.0"
  changelog?: string;
  isPublished: boolean;
  scenes: SceneModel[];
  createdAt: string;
}

export interface TemplateModel {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  thumbnailUrl: string;
  tags: string[];
  status: "draft" | "active" | "archived";
  isFree: boolean;
  supportsPhotos: boolean;
  maxPhotos: number;
  supportsMusic: boolean;
  supportsTheme: boolean;
  currentVersion: string;
  versions: TemplateVersionModel[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// 6. SURPRISE MODEL
// -----------------------------------------------------------------------------
export interface SurpriseModel {
  id: string;
  publicId: string;
  creatorId: string;
  templateId: string;
  templateVersionId: string; // Locked to specific version for immutability
  recipientName: string;
  senderName: string;
  message: string;
  specialDate?: string;
  photos: string[];
  status: "draft" | "published" | "archived";
  viewCount: number;
  unwrappedAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
