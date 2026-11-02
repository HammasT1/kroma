"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Runs `build` inside a gsap.context scoped to `scope`, and reverts everything on cleanup.
 * Works with React Strict Mode (the effect runs twice in dev; the first context is fully reverted).
 *
 * `build` may return nothing; use `ctx.add()` / returned timelines as you like.
 */
export function useGsapTimeline<T extends HTMLElement>(
  build: (ctx: gsap.Context, scope: T) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const ctx = gsap.context((self) => build(self, el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
