"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";
import { useWishlistStore } from "./wishlistStore";

/** Heart toggle with a pop + ring burst. Colors come from props (cards) or the page theme (default). */
export function WishlistButton({
  shoeId,
  name,
  className = "",
  color,
  fill,
}: {
  shoeId: number;
  name: string;
  className?: string;
  /** outline / icon color; defaults to the page foreground */
  color?: string;
  /** fill when saved; defaults to the page accent */
  fill?: string;
}) {
  const saved = useWishlistStore((s) => s.ids.includes(shoeId));
  const toggle = useWishlistStore((s) => s.toggle);
  const btn = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const adding = !saved;
    toggle(shoeId);
    if (!adding || prefersReducedMotion() || !btn.current) return;
    const el = btn.current;
    gsap.fromTo(
      el.querySelector("[data-heart]"),
      { scale: 0.5 },
      { scale: 1, duration: 0.7, ease: "elastic.out(1.1, 0.4)" },
    );
    gsap.fromTo(
      el.querySelector("[data-ring]"),
      { scale: 0.4, autoAlpha: 0.9 },
      { scale: 2.1, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
    );
    gsap.fromTo(
      el.querySelectorAll("[data-spark]"),
      { x: 0, y: 0, scale: 1, autoAlpha: 1 },
      {
        x: (i) => Math.cos((i / 6) * Math.PI * 2) * 26,
        y: (i) => Math.sin((i / 6) * Math.PI * 2) * 26,
        scale: 0.2,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power2.out",
      },
    );
  };

  return (
    <button
      ref={btn}
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={`grid h-11 w-11 place-items-center rounded-full ${className}`}
      style={{ color: color ?? "var(--fg)" }}
    >
      <span
        data-ring
        aria-hidden
        className="pointer-events-none absolute inset-1 rounded-full border-2 opacity-0"
        style={{ borderColor: fill ?? "var(--accent)" }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          data-spark
          aria-hidden
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full opacity-0"
          style={{ background: fill ?? "var(--accent)" }}
        />
      ))}
      <svg
        data-heart
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden
        className="relative"
        fill={saved ? (fill ?? "var(--accent)") : "none"}
        stroke={saved ? (fill ?? "var(--accent)") : "currentColor"}
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 7.7 3.8 4.5 7 4.5c1.9 0 3.5 1 5 3 1.5-2 3.1-3 5-3 3.2 0 5.3 3.2 4.2 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
      </svg>
    </button>
  );
}
