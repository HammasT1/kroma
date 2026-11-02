"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/env";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useUiStore } from "@/lib/uiStore";

/** Shortest intro, and how long we wait for the non-hero shoes before lifting anyway. */
const MIN_MS = 900;
const SOFT_CAP_MS = 2200;
const MAX_MS = 9000;

/** Counter + wordmark intro. Counts real image decodes (every <img data-preload>), then lifts like a curtain. */
export function Preloader() {
  const panel = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const reduced = prefersReducedMotion();
    const started = performance.now();
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-preload]"));
    let done = 0;
    const state = { v: 0 };
    let finished = false;
    let dead = false;

    const render = () => {
      if (num.current) num.current.textContent = String(Math.round(state.v)).padStart(3, "0");
    };

    const finish = () => {
      if (finished || dead) return;
      finished = true;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            root.style.overflow = "";
            setGone(true);
          },
        });
        tl.to(state, { v: 100, duration: 0.25, onUpdate: render, ease: "none" });
        tl.to(
          "[data-pre-text]",
          { yPercent: -120, autoAlpha: 0, duration: reduced ? 0 : 0.6, ease: "power3.in" },
          "+=0.1",
        );
        tl.call(() => useUiStore.getState().setReady(true), undefined, "<0.15");
        tl.to(
          panel.current,
          { yPercent: -100, duration: reduced ? 0 : 1, ease: "power4.inOut" },
          "<0.1",
        );
      }, panel);
      return ctx;
    };

    // Lift once the first (priority) image is decoded and either everything is in or the soft cap passed.
    // The remaining shoes keep loading in the background.
    let firstDone = false;
    const tryFinish = () => {
      const elapsed = performance.now() - started;
      if (!firstDone || (done < imgs.length && elapsed < SOFT_CAP_MS)) return;
      setTimeout(finish, reduced ? 0 : Math.max(0, MIN_MS - elapsed));
    };
    const softCap = setTimeout(tryFinish, SOFT_CAP_MS);

    const bump = (i: number) => {
      done++;
      if (i === 0) firstDone = true;
      const target = (done / Math.max(imgs.length, 1)) * 100;
      gsap.to(state, {
        v: Math.min(target, 99),
        duration: 0.5,
        ease: "power2.out",
        onUpdate: render,
        overwrite: true,
      });
      tryFinish();
    };

    if (!imgs.length) setTimeout(finish, 300);
    imgs.forEach((img, i) => {
      const settle = () => bump(i);
      if (img.complete && img.naturalWidth) img.decode().then(settle, settle);
      else {
        img.addEventListener("load", () => img.decode().then(settle, settle), { once: true });
        img.addEventListener("error", settle, { once: true });
      }
    });
    const guard = setTimeout(finish, MAX_MS);

    return () => {
      dead = true;
      clearTimeout(guard);
      clearTimeout(softCap);
      root.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div
      ref={panel}
      role="status"
      aria-label="Loading"
      className="bg-bg-dark text-on-dark fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden p-5 sm:p-10"
    >
      <p data-pre-text className="font-display text-xl font-extrabold tracking-[0.3em] uppercase">
        {env.NEXT_PUBLIC_SITE_NAME}
      </p>
      <p
        data-pre-text
        className="font-display self-end text-[34vw] leading-[0.8] font-black tabular-nums sm:text-[22vw]"
      >
        <span ref={num}>000</span>
      </p>
    </div>
  );
}
