import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

interface Pending {
  shoeId: number;
  clone: HTMLElement;
  from: DOMRect;
  timeout: ReturnType<typeof setTimeout>;
}

let pending: Pending | null = null;

/** Rect the bitmap actually occupies inside an object-fit: contain <img>. */
export function containedRect(img: HTMLImageElement): DOMRect {
  const r = img.getBoundingClientRect();
  if (!img.naturalWidth || !img.naturalHeight) return r;
  const ar = img.naturalWidth / img.naturalHeight;
  let w = r.width;
  let h = r.height;
  if (w / h > ar) w = h * ar;
  else h = w / ar;
  return new DOMRect(r.left + (r.width - w) / 2, r.top + (r.height - h) / 2, w, h);
}

const discard = () => {
  if (!pending) return;
  clearTimeout(pending.timeout);
  gsap.killTweensOf(pending.clone);
  pending.clone.remove();
  pending = null;
};

/**
 * Step 1 (on click): pin a clone of the source image to the body at its current rect.
 * It lives outside React so it survives the route change.
 */
export function startShared(shoeId: number, source: HTMLElement) {
  if (prefersReducedMotion()) return null;
  discard();
  const img = source instanceof HTMLImageElement ? source : source.querySelector("img");
  if (!img) return null;
  const from = containedRect(img);
  if (!from.width) return null;
  const clone = document.createElement("div");
  Object.assign(clone.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    zIndex: "150",
    pointerEvents: "none",
    willChange: "transform",
    transformOrigin: "0 0",
  });
  const copy = document.createElement("img");
  copy.src = img.currentSrc || img.src;
  copy.alt = "";
  Object.assign(copy.style, {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  });
  clone.appendChild(copy);
  document.body.appendChild(clone);
  pending = { shoeId, clone, from, timeout: setTimeout(discard, 6000) };
  return from;
}

/** Is a shared transition waiting for this shoe? */
export const hasShared = (shoeId: number) => pending?.shoeId === shoeId;

/**
 * Step 2 (on the destination page): fly the clone (transform only) from the source rect to `target`.
 * Returns the source rect (for the color wipe origin) or null when there is nothing to land.
 */
export function landShared(
  shoeId: number,
  target: HTMLElement,
  onLanded: () => void,
): DOMRect | null {
  if (!pending || pending.shoeId !== shoeId) return null;
  const { clone, from } = pending;
  const t = target.getBoundingClientRect();
  Object.assign(clone.style, {
    left: `${t.left}px`,
    top: `${t.top}px`,
    width: `${t.width}px`,
    height: `${t.height}px`,
  });
  gsap.fromTo(
    clone,
    { x: from.left - t.left, y: from.top - t.top, scale: from.width / t.width },
    {
      x: 0,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        onLanded();
        discard();
      },
    },
  );
  return from;
}
