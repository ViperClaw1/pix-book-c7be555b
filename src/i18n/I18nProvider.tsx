import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Lang, translations, type Dict, LANGS } from "./translations";

const STORAGE_KEY = "pixap_lang";

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };
const I18nCtx = createContext<Ctx | null>(null);

function detect(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && translations[stored]) return stored;
  } catch {
    /* noop */
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("kk") || nav.startsWith("kz")) return "kk";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detect());

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* noop */
    }
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({ lang, t: translations[lang], setLang: setLangState }),
    [lang]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nCtx);
  if (!ctx) {
    return { lang: "en", t: translations.en, setLang: () => {} };
  }
  return ctx;
}

export { LANGS };
export type { Lang };
