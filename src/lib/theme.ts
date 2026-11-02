import { contrast } from "@/lib/color";
import type { Palette } from "@/data/types";

export type ThemeVars = Record<`--${string}`, string>;

/** Single source for the CSS variables the whole site is painted with. */
export function paletteVars(p: Palette): ThemeVars {
  const onDark =
    contrast("#ffffff", p.bgDark) >= contrast("#0e0e0e", p.bgDark) ? "#ffffff" : "#0e0e0e";
  const onAccent =
    contrast("#ffffff", p.accent) >= contrast("#0e0e0e", p.accent) ? "#ffffff" : "#0e0e0e";
  return {
    "--bg": p.bg,
    "--bg-dark": p.bgDark,
    "--accent": p.accent,
    "--fg": p.text,
    "--on-dark": onDark,
    "--on-accent": onAccent,
  };
}

/** `--bg:#fff;--fg:#000;...` for use inside a <style> rule. */
export const cssVars = (p: Palette) =>
  Object.entries(paletteVars(p))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
