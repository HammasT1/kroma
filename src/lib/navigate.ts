import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Fade the current page out, then run `go` (same exit the TransitionLink uses). */
export function fadeThen(go: () => void) {
  if (prefersReducedMotion()) return go();
  gsap.to("[data-page]", { autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: go });
}
