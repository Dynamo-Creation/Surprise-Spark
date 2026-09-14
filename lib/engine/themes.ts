import { SceneModel } from "./types";

/**
 * THEME ENGINE
 * Supports the 6 initial aesthetic themes:
 * - Candy
 * - Pastel
 * - Rainbow
 * - Magical
 * - Party
 * - Galaxy
 *
 * Safely overrides background gradients, lighting, and ambient particle presets
 * without breaking 3D procedural meshes, camera trajectories, or interactive triggers.
 */

export type ThemeId = "candy" | "pastel" | "rainbow" | "magical" | "party" | "galaxy";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: string;
  colorSwatch: string[];
  backgroundGradient: string;
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    directionalColor: string;
  };
  particlesPreset: "stars" | "confetti" | "hearts" | "balloons";
  accentColor: string;
  badgeStyle: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  candy: {
    id: "candy",
    name: "Candy",
    tagline: "Sweet berry tints, bubblegum glows, and floating heart sparkles",
    icon: "🍭",
    colorSwatch: ["#f472b6", "#ec4899", "#d946ef"],
    backgroundGradient: "from-pink-950 via-rose-950 to-purple-950",
    lighting: {
      ambientColor: "#fdf2f8",
      ambientIntensity: 1.15,
      directionalColor: "#f472b6",
    },
    particlesPreset: "hearts",
    accentColor: "#ec4899",
    badgeStyle: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  pastel: {
    id: "pastel",
    name: "Pastel",
    tagline: "Soft lavender clouds, gentle mint air, and calming warmth",
    icon: "🌸",
    colorSwatch: ["#c084fc", "#a78bfa", "#fbcfe8"],
    backgroundGradient: "from-slate-950 via-purple-950 to-pink-950",
    lighting: {
      ambientColor: "#faf5ff",
      ambientIntensity: 1.05,
      directionalColor: "#e9d5ff",
    },
    particlesPreset: "stars",
    accentColor: "#a855f7",
    badgeStyle: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  rainbow: {
    id: "rainbow",
    name: "Rainbow",
    tagline: "Prismatic vibrant arcs, energetic daylight, and confetti pop",
    icon: "🌈",
    colorSwatch: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
    backgroundGradient: "from-sky-950 via-indigo-950 to-purple-950",
    lighting: {
      ambientColor: "#fef3c7",
      ambientIntensity: 1.25,
      directionalColor: "#38bdf8",
    },
    particlesPreset: "confetti",
    accentColor: "#f59e0b",
    badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  magical: {
    id: "magical",
    name: "Magical",
    tagline: "Twilight celestial violet, golden stardust, and starry mystery",
    icon: "✨",
    colorSwatch: ["#8b5cf6", "#6366f1", "#facc15"],
    backgroundGradient: "from-violet-950 via-purple-950 to-slate-950",
    lighting: {
      ambientColor: "#fdf4ff",
      ambientIntensity: 1.1,
      directionalColor: "#c084fc",
    },
    particlesPreset: "stars",
    accentColor: "#8b5cf6",
    badgeStyle: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  party: {
    id: "party",
    name: "Party",
    tagline: "Electric celebratory neon, vibrant excitement, and festive energy",
    icon: "🥳",
    colorSwatch: ["#ef4444", "#f59e0b", "#ec4899"],
    backgroundGradient: "from-amber-950 via-rose-950 to-purple-950",
    lighting: {
      ambientColor: "#fff7ed",
      ambientIntensity: 1.3,
      directionalColor: "#f43f5e",
    },
    particlesPreset: "confetti",
    accentColor: "#ef4444",
    badgeStyle: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  galaxy: {
    id: "galaxy",
    name: "Galaxy",
    tagline: "Deep cosmic nebula, celestial starlight, and deep obsidian skies",
    icon: "🌌",
    colorSwatch: ["#06b6d4", "#3b82f6", "#6366f1"],
    backgroundGradient: "from-slate-950 via-indigo-950 to-slate-900",
    lighting: {
      ambientColor: "#e0f2fe",
      ambientIntensity: 0.95,
      directionalColor: "#38bdf8",
    },
    particlesPreset: "stars",
    accentColor: "#06b6d4",
    badgeStyle: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
};

export const THEME_LIST = Object.values(THEMES);

/**
 * Applies a theme's visual properties (background gradient, ambient/directional lighting)
 * to a scene without modifying its 3D objects, meshes, or triggers.
 */
export function applyThemeToScene(scene: SceneModel, theme: ThemeConfig): SceneModel {
  return {
    ...scene,
    lighting: {
      ...scene.lighting,
      ambientColor: theme.lighting.ambientColor,
      ambientIntensity: theme.lighting.ambientIntensity,
      directionalColor: theme.lighting.directionalColor,
    },
    environment: {
      ...scene.environment,
      backgroundGradient: theme.backgroundGradient,
      particlesPreset:
        scene.environment.particlesPreset === "confetti" || scene.environment.particlesPreset === "balloons"
          ? scene.environment.particlesPreset // Preserve climatic confetti & balloons
          : theme.particlesPreset,
    },
  };
}
