export type MusicCategory = "happy" | "sweet" | "magical" | "party" | "emotional";

export interface MusicTrack {
  id: string;
  name: string;
  category: MusicCategory;
  artist: string;
  duration: string;
  description: string;
  tags: string[];
  soundPreset: string;
}

export const MUSIC_CATEGORIES: { id: MusicCategory; label: string; icon: string; description: string }[] = [
  { id: "happy", label: "Happy", icon: "☀️", description: "Sunny, cheerful melodies packed with upbeat smiles" },
  { id: "sweet", label: "Sweet", icon: "🍰", description: "Gentle music box lullabies and acoustic warmth" },
  { id: "magical", label: "Magical", icon: "✨", description: "Shimmering celestial bells and fairy-tale atmosphere" },
  { id: "party", label: "Party", icon: "🎉", description: "High-energy festival rhythms and joyful celebration" },
  { id: "emotional", label: "Emotional", icon: "💖", description: "Heartfelt piano chords and sentimental warmth" },
];

export const MUSIC_TRACKS: MusicTrack[] = [
  // Happy
  {
    id: "track-happy-sunshine",
    name: "Sunshine Serenade",
    category: "happy",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:15",
    description: "Bouncy acoustic ukulele and playful bells",
    tags: ["Upbeat", "Playful", "Joyful"],
    soundPreset: "happy",
  },
  {
    id: "track-happy-birthday-hop",
    name: "Birthday Bounce",
    category: "happy",
    artist: "Spark Originals (Royalty-Free)",
    duration: "1:50",
    description: "Crisp handclaps with vibrant marimba hooks",
    tags: ["Energetic", "Smile", "Modern"],
    soundPreset: "happy",
  },

  // Sweet
  {
    id: "track-sweet-musicbox",
    name: "Golden Music Box",
    category: "sweet",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:40",
    description: "Classic chime music box tinkles that melt your heart",
    tags: ["Delicate", "Lullaby", "Warm"],
    soundPreset: "sweet",
  },
  {
    id: "track-sweet-acoustic",
    name: "Warm Hugs & Whispers",
    category: "sweet",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:20",
    description: "Soft fingerstyle acoustic guitar and gentle celesta",
    tags: ["Cozy", "Tender", "Acoustic"],
    soundPreset: "sweet",
  },

  // Magical
  {
    id: "track-magic-stardust",
    name: "Stardust Odyssey",
    category: "magical",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:30",
    description: "Dreamy orchestral harps with shimmering glockenspiel",
    tags: ["Dreamy", "Fantasy", "Storybook"],
    soundPreset: "magical",
  },
  {
    id: "track-magic-enchanted",
    name: "Enchanted Meadow",
    category: "magical",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:05",
    description: "Airy ethereal woodwinds and celestial bells",
    tags: ["Ethereal", "Wonder", "Airy"],
    soundPreset: "magical",
  },

  // Party
  {
    id: "track-party-confetti",
    name: "Confetti Carnival",
    category: "party",
    artist: "Spark Originals (Royalty-Free)",
    duration: "1:45",
    description: "Pounding bass drum, brass hits, and festive energy",
    tags: ["Horns", "Carnival", "Celebration"],
    soundPreset: "party",
  },
  {
    id: "track-party-disco",
    name: "Sparkle Floor Fever",
    category: "party",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:10",
    description: "Groovy modern pop beat with sparkling synth drops",
    tags: ["Dance", "Groove", "Excitement"],
    soundPreset: "party",
  },

  // Emotional
  {
    id: "track-emotional-memories",
    name: "Cherished Memories",
    category: "emotional",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:55",
    description: "Deep evocative piano chords and strings swell",
    tags: ["Sentimental", "Piano", "Tearjerker"],
    soundPreset: "emotional",
  },
  {
    id: "track-emotional-together",
    name: "Through All The Years",
    category: "emotional",
    artist: "Spark Originals (Royalty-Free)",
    duration: "2:40",
    description: "Nostalgic orchestral swell celebrating long-lasting friendship",
    tags: ["Nostalgia", "Friendship", "Timeless"],
    soundPreset: "emotional",
  },
];

export const ALL_MUSIC_TRACKS = MUSIC_TRACKS;
