import { useEffect, useState } from "react";
import {
  emptyPrefs,
  ONBOARDING_STORAGE_KEY,
  OnboardingPrefs,
} from "@/pixap-web/entities/onboarding/types";

/** Persists in-progress onboarding answers to localStorage so refreshes don't lose work. */
export function useOnboardingDraft() {
  const [prefs, setPrefs] = useState<OnboardingPrefs>(() => {
    if (typeof window === "undefined") return emptyPrefs;
    try {
      const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!raw) return emptyPrefs;
      return { ...emptyPrefs, ...(JSON.parse(raw) as Partial<OnboardingPrefs>) };
    } catch {
      return emptyPrefs;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(prefs),
      );
    } catch {
      /* ignore quota errors */
    }
  }, [prefs]);

  const update = <K extends keyof OnboardingPrefs>(
    key: K,
    value: OnboardingPrefs[K],
  ) => setPrefs((p) => ({ ...p, [key]: value }));

  const toggleInArray = <K extends keyof OnboardingPrefs>(
    key: K,
    value: string,
  ) => {
    setPrefs((p) => {
      const arr = (p[key] as unknown as string[]) ?? [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...p, [key]: next as unknown as OnboardingPrefs[K] };
    });
  };

  const clear = () => {
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPrefs(emptyPrefs);
  };

  return { prefs, setPrefs, update, toggleInArray, clear };
}
