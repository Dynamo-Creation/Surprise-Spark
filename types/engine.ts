import { SurpriseExperience, SceneInstance } from "./experience";
import { Template, AssetReference } from "./template";

/**
 * Template Engine Interface
 * Responsible for loading, validating, and instantiating surprise templates.
 */
export interface TemplateEngine {
  getTemplate(idOrSlug: string): Promise<Template | null>;
  listTemplatesByCategory(category: string): Promise<Template[]>;
  validateTemplate(template: Template): { isValid: boolean; errors?: string[] };
  instantiateExperience(template: Template, personalization: Partial<SurpriseExperience>): SurpriseExperience;
}

/**
 * Scene Engine Interface
 * Coordinates 3D/2D scene transitions, camera paths, triggers, and sequencing.
 */
export interface SceneEngineState {
  currentSceneIndex: number;
  totalScenes: number;
  isPlaying: boolean;
  isInteractiveReady: boolean;
  activeHotspotId?: string;
}

export interface SceneEngine {
  loadScenes(scenes: SceneInstance[]): void;
  nextScene(): void;
  previousScene(): void;
  jumpToScene(index: number): void;
  triggerInteraction(actionId: string, payload?: unknown): void;
  getState(): SceneEngineState;
}

/**
 * Asset Engine Interface
 * Preloads, caches, and provides 3D GLTF/GLB models, audio tracks, and textures.
 */
export interface AssetEngine {
  preloadAssets(assetList: AssetReference[]): Promise<void>;
  getAsset(id: string): AssetReference | undefined;
  playAudio(audioUrl: string, options?: { volume?: number; loop?: boolean }): void;
  stopAudio(): void;
  getLoadingProgress(): number;
}

/**
 * Personalization Engine Interface
 * Injects user names, heartfelt letters, uploaded photos, and colors into dynamic scene nodes.
 */
export interface PersonalizationEngine {
  bindExperience(experience: SurpriseExperience): void;
  interpolateText(templateText: string): string;
  getRecipientGreeting(): string;
  getPhotos(): string[];
  getFormattedDate(): string;
}
