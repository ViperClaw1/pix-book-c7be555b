import type {
  Frequency,
  Music,
  Temperament,
  TimeOfDay,
  Vibe,
} from "@/pixap-web/entities/onboarding/types";

export const CITIES = ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktau"];

export const VIBES: { value: Vibe; label: string; emoji: string }[] = [
  { value: "chic", label: "Chic", emoji: "✨" },
  { value: "cozy", label: "Cozy", emoji: "🕯️" },
  { value: "lively", label: "Lively", emoji: "🎉" },
  { value: "romantic", label: "Romantic", emoji: "🌹" },
  { value: "trendy", label: "Trendy", emoji: "🔥" },
  { value: "chill", label: "Chill", emoji: "🌿" },
];

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "A few times a month" },
  { value: "occasionally", label: "Occasionally" },
];

export const TIMES: { value: TimeOfDay; label: string; emoji: string }[] = [
  { value: "morning", label: "Morning", emoji: "🌅" },
  { value: "afternoon", label: "Afternoon", emoji: "☀️" },
  { value: "evening", label: "Evening", emoji: "🌆" },
  { value: "late-night", label: "Late night", emoji: "🌙" },
];

export const MUSIC: { value: Music; label: string }[] = [
  { value: "pop", label: "Pop" },
  { value: "jazz", label: "Jazz" },
  { value: "electronic", label: "Electronic" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "classical", label: "Classical" },
  { value: "latin", label: "Latin" },
  { value: "lounge", label: "Lounge" },
];

export const TEMPERAMENTS: {
  value: Temperament;
  label: string;
  description: string;
}[] = [
  {
    value: "introvert",
    label: "Introvert",
    description: "Small groups, quieter spaces",
  },
  {
    value: "ambivert",
    label: "Ambivert",
    description: "A bit of both",
  },
  {
    value: "extrovert",
    label: "Extrovert",
    description: "Crowds, energy, the louder the better",
  },
];
