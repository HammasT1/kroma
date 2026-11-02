import type { Palette } from "./types";

/**
 * Hand-tuned palettes, keyed by image number.
 * Every entry is checked by `npm run assets` for WCAG AA:
 *   text on bg >= 4.5, accent on bg >= 3 (UI text on bgDark is auto white/ink).
 * Images without an entry here fall back to the palette auto-derived from the photo
 * (see `suggestedPalette` in src/data/generated/shoes.assets.json).
 */
export const palettes: Record<number, Palette> = {
  1: { bg: "#D9D4CC", bgDark: "#2A2723", accent: "#111111", text: "#141311" },
  2: { bg: "#0F6E86", bgDark: "#08414F", accent: "#F4B83C", text: "#FFFFFF" },
  3: { bg: "#B9CADB", bgDark: "#2F4A66", accent: "#1E3A5F", text: "#0E1A2B" },
  4: { bg: "#C8202E", bgDark: "#6E0F18", accent: "#FFFFFF", text: "#FFFFFF" },
  5: { bg: "#D8A869", bgDark: "#5E3D1A", accent: "#3B2410", text: "#2A1A0A" },
  6: { bg: "#EDEAE4", bgDark: "#3A3732", accent: "#C41E1A", text: "#121212" },
  7: { bg: "#9CC6F0", bgDark: "#1F4A85", accent: "#0B1F3B", text: "#0B1F3B" },
  8: { bg: "#1B1612", bgDark: "#0A0806", accent: "#E9B77A", text: "#F5E9D8" },
  9: { bg: "#CFCFCF", bgDark: "#2E2E2E", accent: "#C2410C", text: "#111111" },
  10: { bg: "#1E3FC4", bgDark: "#0F2178", accent: "#E7B46A", text: "#FFFFFF" },
  11: { bg: "#4A2E22", bgDark: "#1E110B", accent: "#E5A98A", text: "#F6EBE3" },
};
