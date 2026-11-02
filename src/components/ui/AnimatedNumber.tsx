"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";

/** Counts a price (minor units) up or down. Writes textContent directly: no re-render per frame. */
export function AnimatedPrice({ value, currency = "USD" }: { value: number; currency?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: value });

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const render = () => {
      node.textContent = formatPrice(Math.round(shown.current.v), currency);
    };
    if (prefersReducedMotion()) {
      shown.current.v = value;
      render();
      return;
    }
    const tween = gsap.to(shown.current, {
      v: value,
      duration: 0.6,
      ease: "power3.out",
      onUpdate: render,
    });
    return () => {
      tween.kill();
    };
  }, [value, currency]);

  return <span ref={el}>{formatPrice(value, currency)}</span>;
}
