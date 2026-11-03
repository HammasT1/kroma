import type { Palette } from "./types";

/**
 * Hand-tuned palettes, keyed by image number.
 * Every entry is checked by `npm run assets` for WCAG AA:
 *   text on bg >= 4.5, accent on bg >= 3 (UI text on bgDark is auto white/ink).
 * Images without an entry here fall back to the palette auto-derived from the photo
 * (see `suggestedPalette` in src/data/generated/shoes.assets.json).
 */
export const palettes: Record<number, Palette> = {
  1: { bg: "#0E0E10", bgDark: "#060607", accent: "#D4B27A", text: "#F3EEE6" }, // obsidian
  2: { bg: "#0B1A26", bgDark: "#050E16", accent: "#D4B27A", text: "#F1EEE8" }, // deep teal-navy
  3: { bg: "#14181F", bgDark: "#0A0C10", accent: "#C9CFD8", text: "#EEF0F3" }, // graphite, platinum
  4: { bg: "#2A1015", bgDark: "#14070A", accent: "#E0B48A", text: "#F6ECE4" }, // oxblood
  5: { bg: "#21170F", bgDark: "#0F0A06", accent: "#D9B27C", text: "#F4EADD" }, // espresso
  6: { bg: "#18181B", bgDark: "#09090B", accent: "#D4B27A", text: "#F4F1EC" }, // charcoal
  7: { bg: "#0D1C30", bgDark: "#060E1A", accent: "#C9CFD8", text: "#EDF1F6" }, // midnight blue
  8: { bg: "#13110E", bgDark: "#080706", accent: "#E0BE86", text: "#F5E9D8" }, // warm black
  9: { bg: "#1A1C1F", bgDark: "#0B0C0D", accent: "#D9A57A", text: "#F1EFEB" }, // slate, copper
  10: { bg: "#10173F", bgDark: "#070B24", accent: "#D4B27A", text: "#F0EFF6" }, // royal indigo
  11: { bg: "#261914", bgDark: "#120B08", accent: "#E2AE92", text: "#F6EBE3" }, // mocha, rose gold
};
