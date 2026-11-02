import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

const bump = (target: Element | null) => {
  if (!target) return;
  gsap.fromTo(
    target,
    { scale: 1 },
    { scale: 1.2, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" },
  );
};

/** Arcs a copy of the shoe image into the bag button, then bumps the button. Transform/opacity only. */
export function flyToCart(from: HTMLElement | null) {
  const target = document.querySelector("[data-cart-target]");
  const img = from instanceof HTMLImageElement ? from : from?.querySelector("img");
  if (!target || !img || prefersReducedMotion()) return bump(target);

  const r = img.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  const fly = document.createElement("img");
  fly.src = img.currentSrc || img.src;
  fly.alt = "";
  Object.assign(fly.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    objectFit: "contain",
    zIndex: "160",
    pointerEvents: "none",
    willChange: "transform",
  });
  document.body.appendChild(fly);

  const dx = t.left + t.width / 2 - (r.left + r.width / 2);
  const dy = t.top + t.height / 2 - (r.top + r.height / 2);
  const end = Math.min(1, 36 / r.width);
  gsap
    .timeline({ onComplete: () => (fly.remove(), bump(target)) })
    .to(fly, { y: -70, scale: 0.72, rotate: -8, duration: 0.28, ease: "power2.out" })
    .to(fly, {
      x: dx,
      y: dy,
      scale: end,
      rotate: 18,
      opacity: 0.7,
      duration: 0.75,
      ease: "power3.in",
    });
}
