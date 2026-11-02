"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useThemeStore, type WipeRequest } from "./themeStore";
import { THEME_DURATION, THEME_EASE } from "./useShoeTheme";

/** Expanding circle (transform: scale only) that reveals the new background from the shoe's position. */
export function ColorWipe() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const run = (w: WipeRequest) => {
      if (prefersReducedMotion()) return;
      const r = Math.hypot(Math.max(w.x, innerWidth - w.x), Math.max(w.y, innerHeight - w.y));
      const disc = document.createElement("div");
      Object.assign(disc.style, {
        position: "absolute",
        left: `${w.x - r}px`,
        top: `${w.y - r}px`,
        width: `${r * 2}px`,
        height: `${r * 2}px`,
        borderRadius: "50%",
        background: w.to.bg,
        willChange: "transform",
      });
      el.appendChild(disc);
      gsap.fromTo(
        disc,
        { scale: 0 },
        { scale: 1, duration: THEME_DURATION, ease: THEME_EASE, onComplete: () => disc.remove() },
      );
    };
    return useThemeStore.subscribe((s, prev) => {
      if (s.wipe && s.wipe !== prev.wipe) run(s.wipe);
    });
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    />
  );
}
