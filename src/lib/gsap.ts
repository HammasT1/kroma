"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins exactly once (safe under React Strict Mode and HMR). */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // Skip the automatic refresh on window `load` (a forced layout over every pinned section) and on mobile
  // toolbar resizes; we refresh once after fonts settle instead.
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded",
    ignoreMobileResize: true,
  });
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };
