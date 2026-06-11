// Pixap design tokens — must match native app exactly.
export const lightColors = {
  background: "#fafafa",
  surface: "#ffffff",
  card: "#ffffff",
  text: "#111111",
  textMuted: "#666666",
  border: "#eeeeee",
  primary: "#111111",
  accent: "#ec6544",
  onAccent: "#ffffff",
  danger: "#cc0000",
  link: "#2563eb",
  tagMuted: "#f4f4f5",
  tagMutedText: "#27272a",
  scrim: "rgba(0,0,0,0.6)",
  warningBorder: "#c45c26",
  successSurface: "rgba(34,197,94,0.15)",
  dangerSurface: "rgba(239,68,68,0.12)",
} as const;

export const darkColors = {
  background: "#0a0a0a",
  surface: "#141414",
  card: "#1a1a1a",
  text: "#f5f5f5",
  textMuted: "#a3a3a3",
  border: "#2a2a2a",
  primary: "#f5f5f5",
  accent: "#ff7a59",
  onAccent: "#ffffff",
  danger: "#ef4444",
  link: "#60a5fa",
  tagMuted: "#0d0d0f",
  tagMutedText: "#e8e8ea",
  scrim: "rgba(0,0,0,0.75)",
  warningBorder: "#c45c26",
  successSurface: "rgba(34,197,94,0.15)",
  dangerSurface: "rgba(239,68,68,0.12)",
} as const;

export type PixapPalette = typeof lightColors;
