"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useUiStore } from "@/lib/uiStore";

/** Lenis wired to the GSAP ticker so ScrollTrigger and smooth scrolling share one clock. */
export function SmoothScroll() {
  const ready = useUiStore((s) => s.ready);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1, smoothWheel: true });
    lenis.stop();
    setLenis(lenis);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    getLenis()?.start();
  }, [ready]);

  return null;
}
