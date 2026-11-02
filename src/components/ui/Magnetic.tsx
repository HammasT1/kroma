"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Pulls its child toward the pointer. No-op on touch and with reduced motion. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "inline-block",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const move = inner.current;
    if (!el || !move || prefersReducedMotion() || !matchMedia("(hover: hover)").matches) return;
    const ctx = gsap.context(() => {
      const x = gsap.quickTo(move, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(move, "y", { duration: 0.5, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * strength);
        y((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const reset = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", reset);
      };
    }, el);
    return () => ctx.revert();
  }, [strength]);

  return (
    <div ref={wrap} className={className}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
