import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PixapTheme = "light" | "dark";

interface ThemeCtx {
  theme: PixapTheme;
  setTheme: (t: PixapTheme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "pixap_theme";

function detect(): PixapTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as PixapTheme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* noop */
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<PixapTheme>(() => detect());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* noop */
    }
  }, [theme]);

  const setTheme = useCallback((t: PixapTheme) => setThemeState(t), []);
  const toggle = useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return (
    <Ctx.Provider value={value}>
      <div data-pixap data-theme={theme} className="min-h-screen">
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function usePixapTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePixapTheme must be used inside <ThemeProvider>");
  return ctx;
}
