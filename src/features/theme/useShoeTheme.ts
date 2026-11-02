"use client";

import { useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { paletteVars } from "@/lib/theme";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useThemeStore } from "./themeStore";

export const THEME_DURATION = 0.9;
export const THEME_EASE = "power3.inOut";

/**
 * Owns the active palette and the color transition. Every section reads from here.
 *
 * `setActive` tweens the CSS variables on <html> (power3.inOut, ~0.9s). When an `origin`
 * is passed, <ColorWipe /> paints a radial wipe from that point; in that case the page
 * background variables are committed when the wipe lands so the wipe stays visible
 * (everything else, text/accent/etc., still tweens in parallel).
 */
export function useShoeTheme() {
  const palettes = useThemeStore((s) => s.palettes);
  const index = useThemeStore((s) => s.index);
  const palette = palettes[index];

  const setActive = useCallback((next: number, origin?: { x: number; y: number }) => {
    const { palettes: all, index: current, set } = useThemeStore.getState();
    if (next === current || !all[next]) return;
    set(next, origin);

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : THEME_DURATION;
    const vars = paletteVars(all[next]);
    const root = document.documentElement;

    if (origin && !reduced) {
      const { "--bg": bg, "--bg-dark": bgDark, ...rest } = vars;
      gsap.to(root, { ...rest, duration, ease: THEME_EASE, overwrite: "auto" });
      gsap.to(root, { "--bg": bg, "--bg-dark": bgDark, duration: 0.001, delay: duration });
    } else {
      gsap.to(root, { ...vars, duration, ease: THEME_EASE, overwrite: "auto" });
    }
  }, []);

  /** Jump to a palette with no animation (direct page loads, route entry without a wipe). */
  const snap = useCallback((next: number) => {
    const { palettes: all, set } = useThemeStore.getState();
    if (!all[next]) return;
    set(next);
    gsap.killTweensOf(document.documentElement);
    gsap.set(document.documentElement, paletteVars(all[next]));
  }, []);

  return { palette, palettes, index, setActive, snap };
}
