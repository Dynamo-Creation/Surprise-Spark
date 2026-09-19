import { CategoryInfo, Template } from "@/types/template";
import { SurpriseExperience } from "@/types/experience";

export const BRAND_NAME = "Partner in Crime";
export const BRAND_HEADLINE = "DON’T JUST SEND A WISH. SEND A SURPRISE.";
export const BRAND_SUBTITLE = "Create a tiny interactive experience for someone’s special day.";
export const BRAND_SUPPORTING_LINE = "A message takes seconds to read. A surprise becomes a memory.";

export const NAV_LINKS = [
  { label: "Birthday", href: "/birthday" },
  { label: "Explore", href: "/templates" },
  { label: "How It Works", href: "/#how-it-works" },
] as const;

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "birthday",
    name: "Birthday & Celebrations",
    description: "Cakes, candles to blow out, confetti pop, and emotional polaroids.",
    iconName: "Cake",
    badgeColor: "bg-pink-500/10 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-300",
    accentColor: "from-pink-500 to-rose-500",
    isPopular: true,
  },
  {
    id: "anniversary",
    name: "Anniversary",
    description: "Timeline of our memories, glowing lanterns, and heartfelt letters.",
    iconName: "HeartHandshake",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-300",
    accentColor: "from-purple-500 to-indigo-500",
    isPopular: true,
  },
  {
    id: "love",
    name: "Love & Romance",
    description: "Romantic starfield, floating origami hearts, and love notes.",
    iconName: "Heart",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800 dark:text-rose-300",
    accentColor: "from-rose-500 to-red-500",
    isPopular: true,
  },
  {
    id: "friendship",
    name: "Best Friend",
    description: "Inside jokes, memorable roast cards, and quirky celebration themes.",
    iconName: "Smile",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-300",
    accentColor: "from-amber-500 to-orange-500",
    isPopular: true,
  },
  {
    id: "proposal",
    name: "Proposal & Rings",
    description: "Immersive ring box opening with soft cinematic orchestral music.",
    iconName: "Gem",
    badgeColor: "bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:border-cyan-800 dark:text-cyan-300",
    accentColor: "from-cyan-500 to-blue-500",
  },
  {
    id: "wedding",
    name: "Wedding Wishes",
    description: "Floral archways, golden confetti, and congratulations guestbook.",
    iconName: "Sparkles",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-300",
    accentColor: "from-emerald-500 to-teal-500",
  },
  {
    id: "congratulations",
    name: "Congratulations",
    description: "Fireworks celebration, trophy reveal, and achievement highlights.",
    iconName: "Trophy",
    badgeColor: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800 dark:text-yellow-300",
    accentColor: "from-yellow-500 to-amber-500",
  },
  {
    id: "festivals",
    name: "Festivals & Holidays",
    description: "Diwali diyas, Christmas snowfall, Durga Puja dhak, and New Year countdown.",
    iconName: "Flame",
    badgeColor: "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-300",
    accentColor: "from-violet-500 to-fuchsia-500",
  },
];

export function getVisibleTemplates(templates: Template[] = MOCK_TEMPLATES): Template[] {
  if (typeof window === "undefined") return templates;
  try {
    const raw = localStorage.getItem("surprisespark_deleted_templates_v1");
    if (!raw) return templates;
    const deleted: string[] = JSON.parse(raw);
    if (!Array.isArray(deleted) || deleted.length === 0) return templates;
    return templates.filter((t) => !deleted.includes(t.slug) && !deleted.includes(t.id));
  } catch {
    return templates;
  }
}

export const MOCK_TEMPLATES: Template[] = [
  {
    id: "tpl-sweet-celebration",
    slug: "sweet-celebration",
    name: "Sweet Celebration 💌",
    category: "birthday",
    description: "A heartwarming pastel birthday celebration with bouncing party flags, polaroid frame, animated balloons, typewriter letterbox, and real-time heart cursor trail.",
    tagline: "A heartwarming celebration with an interactive letterbox.",
    tags: ["Interactive Letter", "Pastel", "Typewriter", "Photo Polaroid", "Sweet", "Heart Cursor"],
    thumbnailUrl: "/templates/sweet-celebration/thumbnail.jpg",
    coverGradient: "from-pink-400 via-rose-400 to-amber-300",
    sceneCount: 3,
    estimatedDuration: "2 mins",
    isFeatured: true,
    isNew: true,
    isPremium: false,
    defaultScenes: [],
  },
  {
    id: "tpl-love-01",
    slug: "origami-hearts-sanctuary",
    name: "Floating Origami Sanctuary",
    category: "love",
    description: "Delicate paper cranes and glowing heart origami floating over serene reflection waters.",
    tagline: "Every fold holds a reason I cherish you.",
    tags: ["Romantic", "Origami", "Orchestral", "Gentle"],
    thumbnailUrl: "/thumbnails/origami.jpg",
    coverGradient: "from-rose-500 via-red-400 to-purple-600",
    sceneCount: 3,
    estimatedDuration: "2 mins",
    isFeatured: false,
    isNew: true,
    isPremium: false,
    defaultScenes: [],
  },
  {
    id: "tpl-anniv-01",
    slug: "golden-milestone-journey",
    name: "Golden Milestone Lanterns",
    category: "anniversary",
    description: "Release illuminated sky lanterns into twilight clouds marking each year you've celebrated together.",
    tagline: "To all our yesterdays and every tomorrow.",
    tags: ["Lanterns", "Twilight", "Milestones", "Golden"],
    thumbnailUrl: "/thumbnails/lanterns.jpg",
    coverGradient: "from-violet-600 via-purple-500 to-amber-400",
    sceneCount: 4,
    estimatedDuration: "3 mins",
    isFeatured: false,
    isNew: false,
    isPremium: false,
    defaultScenes: [],
  },
  {
    id: "tpl-friend-01",
    slug: "roast-and-toast-squad",
    name: "The Ultimate Roast & Toast",
    category: "friendship",
    description: "Hilarious interactive scratch-cards, funny inside jokes, and a joyful trophy reveal at the end.",
    tagline: "Because normal birthday cards are too boring for best friends.",
    tags: ["Funny", "Interactive Cards", "Trophy", "Party"],
    thumbnailUrl: "/thumbnails/roast.jpg",
    coverGradient: "from-yellow-400 via-amber-500 to-red-500",
    sceneCount: 3,
    estimatedDuration: "2 mins",
    isFeatured: false,
    isNew: true,
    isPremium: false,
    defaultScenes: [],
  },
];

export const SAMPLE_SURPRISE: SurpriseExperience = {
  id: "exp-sample-001",
  publicId: "sample-birthday-123",
  userId: "user-demo-1",
  title: "Maya's 25th Magical Birthday",
  category: "birthday",
  templateId: "tpl-bday-01",
  recipient: {
    name: "Maya",
    relationship: "Best Friend",
    birthDate: "2026-09-14",
  },
  sender: {
    name: "Alex",
    relationship: "Best Friend",
  },
  scenes: [
    {
      id: "sc-1",
      sceneType: "intro-gift-box",
      order: 1,
      title: "Tap To Unwrap Your Surprise",
      subtitle: "Made with love, just for Maya",
      customText: "You thought I'd just send a boring text? Think again!",
    },
    {
      id: "sc-2",
      sceneType: "cake-candles",
      order: 2,
      title: "Make Your 25th Wish!",
      subtitle: "Tap the candles to blow them out",
      customText: "May this year bring you all the joy, success, and laughter in the universe!",
    },
  ],
  photos: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
      caption: "That spontaneous road trip adventure!",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop",
      caption: "Always finding reasons to laugh together.",
    },
  ],
  customMessage: "Happy Birthday Maya! You are one of the brightest lights in my life. Thank you for always being there through thick and thin. Here is to another year of big adventures!",
  status: "published",
  viewCount: 14,
  createdAt: "2026-09-12T10:00:00Z",
  updatedAt: "2026-09-12T10:30:00Z",
};
