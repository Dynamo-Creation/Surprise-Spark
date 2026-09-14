import { ExperienceCategory, SceneInstance } from "./experience";

export interface CategoryInfo {
  id: ExperienceCategory;
  name: string;
  description: string;
  iconName: string;
  badgeColor: string;
  accentColor: string;
  isPopular?: boolean;
}

export interface AssetReference {
  id: string;
  type: "model3d" | "texture" | "audio" | "particles" | "lottie";
  name: string;
  fileUrl: string;
  format: string;
  fileSizeBytes?: number;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: ExperienceCategory;
  description: string;
  tagline: string;
  tags: string[];
  thumbnailUrl: string;
  coverGradient: string;
  sceneCount: number;
  estimatedDuration: string;
  isFeatured: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  defaultScenes: SceneInstance[];
  compatibleAssetIds?: string[];
}
