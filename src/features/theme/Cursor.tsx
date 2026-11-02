"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Dot + ring cursor painted in the active accent. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const ctx = gsap.context(() => {
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
      const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
      const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });
      let shown = false;
      const move = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
          gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const hot = (e.target as Element | null)?.closest("a,button,[data-cursor]");
        gsap.to(ring.current, { scale: hot ? 1.9 : 1, duration: 0.3, overwrite: "auto" });
        gsap.to(dot.current, { scale: hot ? 0.4 : 1, duration: 0.3, overwrite: "auto" });
      };
      const leave = () => {
        shown = false;
        gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerover", over);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
    return () => {
      ctx.revert();
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="border-accent pointer-events-none fixed top-0 left-0 z-[200] h-10 w-10 rounded-full border-[1.5px] opacity-0"
      />
      <div
        ref={dot}
        aria-hidden
        className="bg-accent pointer-events-none fixed top-0 left-0 z-[200] h-2 w-2 rounded-full opacity-0"
      />
    </>
  );
}
