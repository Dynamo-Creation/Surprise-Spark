export type ExperienceCategory =
  | "birthday"
  | "love"
  | "anniversary"
  | "friendship"
  | "proposal"
  | "wedding"
  | "congratulations"
  | "thank-you"
  | "festivals"
  | "valentines-day"
  | "christmas"
  | "diwali"
  | "durga-puja"
  | "mothers-day"
  | "fathers-day"
  | "custom";

export type ExperienceStatus = "draft" | "published" | "archived" | "expired";

export interface RecipientDetails {
  name: string;
  nickname?: string;
  relationship?: string;
  birthDate?: string;
  genderOrPronouns?: string;
}

export interface SenderDetails {
  name: string;
  email?: string;
  relationship?: string;
}

export interface PhotoMoment {
  id: string;
  url: string;
  caption?: string;
  yearOrDate?: string;
}

export interface AudioConfig {
  trackId: string;
  trackName: string;
  trackUrl: string;
  autoplay: boolean;
  loop: boolean;
  startDelayMs?: number;
}

export interface InteractiveHotspot {
  id: string;
  position: [number, number, number];
  title: string;
  revealedMessage: string;
  iconName?: string;
}

export interface SceneInstance {
  id: string;
  sceneType: "intro-gift-box" | "cake-candles" | "photo-gallery" | "confetti-explosion" | "letter-reveal" | "mini-game" | "outro-wishes";
  order: number;
  durationMs?: number;
  title: string;
  subtitle?: string;
  customText?: string;
  assetRefs?: string[];
  hotspots?: InteractiveHotspot[];
  backgroundTheme?: string;
}

export interface SurpriseExperience {
  id: string;
  publicId: string;
  userId: string;
  title: string;
  category: ExperienceCategory;
  templateId: string;
  recipient: RecipientDetails;
  sender: SenderDetails;
  scenes: SceneInstance[];
  photos: PhotoMoment[];
  audio?: AudioConfig;
  customMessage: string;
  status: ExperienceStatus;
  viewCount: number;
  unwrappedAt?: string;
  createdAt: string;
  updatedAt: string;
}
