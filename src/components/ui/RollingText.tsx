"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Text that slides out one way and the next value in from the other. `dir` is 1 (up) or -1 (down). */
export function RollingText({
  value,
  dir = 1,
  className,
}: {
  value: string;
  dir?: 1 | -1;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const current = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = host.current;
    const old = current.current;
    if (!el || !old || shown.current === value) return;
    shown.current = value;
    if (prefersReducedMotion()) {
      old.textContent = value;
      return;
    }
    const next = old.cloneNode(false) as HTMLSpanElement;
    next.textContent = value;
    next.removeAttribute("data-current");
    el.appendChild(next);
    // grid-stack both spans in one cell so the box never changes size
    gsap.fromTo(
      next,
      { yPercent: dir * 110, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(1.6)" },
    );
    gsap.to(old, {
      yPercent: -dir * 110,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        old.remove();
        current.current = next;
      },
    });
    current.current = next;
  }, [value, dir]);

  return (
    <span ref={host} className={`inline-grid overflow-hidden align-bottom ${className ?? ""}`}>
      <span ref={current} className="col-start-1 row-start-1">
        {value}
      </span>
    </span>
  );
}
