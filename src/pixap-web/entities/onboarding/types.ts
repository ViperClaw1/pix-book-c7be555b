export type Vibe = "chic" | "cozy" | "lively" | "romantic" | "trendy" | "chill";
export type Frequency = "weekly" | "monthly" | "occasionally";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "late-night";
export type Music =
  | "pop"
  | "jazz"
  | "electronic"
  | "rock"
  | "hip-hop"
  | "classical"
  | "latin"
  | "lounge";
export type Temperament = "introvert" | "ambivert" | "extrovert";

export interface OnboardingPrefs {
  city: string | null;
  categoryIds: string[];
  vibes: Vibe[];
  frequency: Frequency | null;
  times: TimeOfDay[];
  music: Music[];
  temperament: Temperament | null;
}

export const emptyPrefs: OnboardingPrefs = {
  city: null,
  categoryIds: [],
  vibes: [],
  frequency: null,
  times: [],
  music: [],
  temperament: null,
};

export const ONBOARDING_STORAGE_KEY = "pixap_onboarding_draft";
