"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Pointer-reactive 3D tilt (rotateX/rotateY only, so it stays on the compositor).
 * scope="window" tilts toward the pointer anywhere on screen; "self" only while over the card.
 */
export function TiltCard({
  children,
  max = 8,
  scope = "self",
  className,
}: {
  children: ReactNode;
  max?: number;
  scope?: "self" | "window";
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = outer.current;
    const tilt = inner.current;
    if (!host || !tilt || prefersReducedMotion() || !matchMedia("(hover: hover)").matches) return;
    const ctx = gsap.context(() => {
      gsap.set(tilt, { transformPerspective: 1000, transformOrigin: "50% 60%" });
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.7, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.7, ease: "power3.out" });
      const target: HTMLElement | Window = scope === "window" ? window : host;
      const onMove = (e: Event) => {
        const p = e as PointerEvent;
        let nx: number, ny: number;
        if (scope === "window") {
          nx = p.clientX / innerWidth - 0.5;
          ny = p.clientY / innerHeight - 0.5;
        } else {
          const r = host.getBoundingClientRect();
          nx = (p.clientX - r.left) / r.width - 0.5;
          ny = (p.clientY - r.top) / r.height - 0.5;
        }
        ry(nx * max * 2);
        rx(-ny * max * 2);
      };
      const reset = () => {
        rx(0);
        ry(0);
      };
      target.addEventListener("pointermove", onMove);
      (scope === "window" ? document.documentElement : host).addEventListener(
        "pointerleave",
        reset,
      );
      return () => {
        target.removeEventListener("pointermove", onMove);
        (scope === "window" ? document.documentElement : host).removeEventListener(
          "pointerleave",
          reset,
        );
      };
    }, host);
    return () => ctx.revert();
  }, [max, scope]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
