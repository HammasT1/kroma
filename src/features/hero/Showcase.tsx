"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Shoe } from "@/data";
import { Magnetic } from "@/components/ui/Magnetic";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { TiltCard } from "@/components/ui/TiltCard";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { formatPrice } from "@/lib/format";
import { useUiStore } from "@/lib/uiStore";
import { useShoeTheme } from "@/features/theme/useShoeTheme";
import { ShoeImage } from "./HeroShoe";

/** Scroll distance (in viewport heights) that one shoe occupies while the stage is pinned. */
const STEP_VH = 0.7;
const DUR = 0.9;

const words = (name: string) => name.toUpperCase().split(" ");

export function Showcase({ shoes }: { shoes: Shoe[] }) {
  const n = shoes.length;
  const root = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const current = useRef(0);
  const locked = useRef(false);
  const showRef = useRef<(next: number, intro?: boolean) => void>(() => {});
  const ready = useUiStore((s) => s.ready);
  const { setActive } = useShoeTheme();
  const [active, setActiveIdx] = useState(0);

  // --- transition between two shoes (all transform/opacity) ---
  const show = useCallback(
    (next: number, intro = false) => {
      const el = root.current;
      if (!el) return;
      const prev = current.current;
      if (!intro && next === prev) return;
      const dir = next > prev || intro ? 1 : -1;
      const reduced = prefersReducedMotion();
      const d = reduced ? 0 : DUR;
      const q = <T extends Element>(k: string, i: number) =>
        el.querySelector<T>(`[data-${k}="${i}"]`);
      const hint = (i: number) => shoes[i].stage;
      const stackH = stack.current?.offsetHeight ?? 0;
      const rest = (i: number) => hint(i).offsetY * stackH;
      current.current = next;
      setActiveIdx(next);

      // colors + radial wipe from the shoe's position
      const r = stack.current?.getBoundingClientRect();
      setActive(next, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);

      if (!intro) {
        gsap.to(q("shoe", prev), {
          xPercent: -dir * 55,
          rotate: -dir * 14 + hint(prev).rotate,
          scale: hint(prev).scale * 0.82,
          autoAlpha: 0,
          duration: d * 0.8,
          ease: "power3.inOut",
          overwrite: true,
        });
        gsap.to(q("word", prev), {
          xPercent: -dir * 22,
          autoAlpha: 0,
          duration: d * 0.8,
          ease: "power3.inOut",
          overwrite: true,
        });
        gsap.to(q("info", prev), {
          y: -24,
          autoAlpha: 0,
          duration: d * 0.5,
          ease: "power2.in",
          overwrite: true,
        });
      }

      const tl = gsap.timeline({ defaults: { duration: d, ease: "power3.inOut" } });
      const shoe = q("shoe", next);
      const sc = hint(next).scale;
      tl.fromTo(
        shoe,
        intro
          ? { y: 140, xPercent: 0, rotate: -12, scale: sc * 0.7 }
          : {
              xPercent: dir * 60,
              y: rest(next),
              rotate: dir * 16 + hint(next).rotate,
              scale: sc * 0.78,
              autoAlpha: 0,
            },
        {
          xPercent: 0,
          y: rest(next),
          rotate: hint(next).rotate,
          scale: sc,

          autoAlpha: 1,
          overwrite: true,
        },
        intro ? 0 : 0.12,
      );
      tl.fromTo(
        q("word", next),
        intro ? { yPercent: 40, autoAlpha: 0 } : { xPercent: dir * 28, yPercent: 0, autoAlpha: 0 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1, overwrite: true },
        intro ? 0.1 : 0.05,
      );
      tl.fromTo(
        q("info", next),
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: d * 0.7, ease: "power3.out", overwrite: true },
        d * 0.45,
      );

      // floor shadow follows: slides with the shoe, narrows, then widens to the new footprint
      const img = q<HTMLElement>("shoe", next)?.querySelector("img");
      const stackW = stack.current?.offsetWidth || 1;
      const ratio = Math.min(1, ((img?.offsetWidth ?? stackW * 0.6) / stackW) * 0.9);
      if (shadow.current) {
        gsap
          .timeline({ defaults: { overwrite: "auto" } })
          .to(shadow.current, {
            scaleX: ratio * 0.45,
            autoAlpha: 0.2,
            x: -dir * stackW * 0.12,
            duration: d * 0.4,
            ease: "power2.in",
          })
          .fromTo(
            shadow.current,
            { x: dir * stackW * 0.14 },
            { scaleX: ratio, autoAlpha: 0.45, x: 0, duration: d * 0.6, ease: "power3.out" },
          );
      }
    },
    [shoes, setActive],
  );
  useEffect(() => {
    showRef.current = show;
  }, [show]);

  // --- initial hidden state, idle float, pin + scroll -> index ---
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // shoe 0 stays painted (under the preloader) so the LCP image never waits on JS; the rest start hidden in the markup
      gsap.set("[data-word],[data-info]", { autoAlpha: 0 });
      gsap.set(shadow.current, { autoAlpha: 0 });
      if (!reduced) {
        gsap.to("[data-float]", {
          y: -14,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
      let idle: ReturnType<typeof setTimeout>;
      const step = () => innerHeight * STEP_VH;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${(n - 1) * step()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (locked.current) return;
          const i = Math.round(self.progress * (n - 1));
          if (i !== current.current && useUiStore.getState().ready) showRef.current(i);
          clearTimeout(idle);
          idle = setTimeout(() => {
            // settle onto the nearest step so a shoe is always centered
            const target = self.start + Math.round(self.progress * (n - 1)) * step();
            if (Math.abs(scrollY - target) > 3 && scrollY >= self.start && scrollY <= self.end) {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(target, { duration: 0.5 });
              else scrollTo({ top: target });
            }
          }, 160);
        },
      });
      trigger.current = st;
      return () => clearTimeout(idle);
    }, el);
    return () => {
      ctx.revert();
      trigger.current = null;
    };
  }, [n]);

  // --- entrance once the preloader lifts ---
  useEffect(() => {
    if (!ready) return;
    showRef.current(0, true);
  }, [ready]);

  // --- navigation: every input funnels through here ---
  const goTo = useCallback(
    (i: number) => {
      const st = trigger.current;
      if (!st) return;
      const next = ((i % n) + n) % n;
      if (next === current.current) return;
      const lenis = getLenis();
      const target = st.start + next * innerHeight * STEP_VH;
      locked.current = true;
      showRef.current(next);
      const release = () => {
        locked.current = false;
      };
      if (lenis) lenis.scrollTo(target, { duration: 1.1, onComplete: release });
      else {
        scrollTo({ top: target });
        setTimeout(release, 120);
      }
    },
    [n],
  );

  // keyboard (only while the stage is on screen)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,select,[contenteditable]")) return;
      const r = root.current?.getBoundingClientRect();
      if (!r || r.bottom < innerHeight * 0.5 || r.top > innerHeight * 0.5) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(current.current + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // touch / pen swipe
  const start = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") start.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2)
      goTo(current.current + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      ref={root}
      aria-roledescription="carousel"
      aria-label="Featured shoes"
      onPointerDown={onDown}
      onPointerUp={onUp}
      className="relative z-10 h-svh w-full touch-pan-y overflow-hidden select-none [--stack-h:min(38svh,20rem)] sm:[--stack-h:min(58svh,38rem)]"
    >
      {/* giant background type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        {shoes.map((s, i) => (
          <div
            key={s.id}
            data-word={i}
            className="font-display absolute flex flex-col items-center justify-center text-center leading-[0.78] font-black uppercase"
          >
            {words(s.name).map((w, k) => (
              <span
                key={k}
                className={`text-[clamp(5.5rem,26vw,27rem)] ${k % 2 === 0 ? "text-stroke" : "opacity-[0.16]"}`}
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* shoe stack */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pt-8 pb-40 sm:pb-20">
        <TiltCard scope="window" max={7} className="w-full">
          <div ref={stack} className="relative mx-auto h-[var(--stack-h)] w-full max-w-[1100px]">
            <div
              ref={shadow}
              aria-hidden
              className="absolute -bottom-[6%] left-[5%] h-[7%] w-[90%] origin-center rounded-[50%] bg-black/60 blur-xl"
            />
            <div data-float-wrap className="absolute inset-0">
              <div data-float className="absolute inset-0">
                {shoes.map((s, i) => (
                  <div
                    key={s.id}
                    data-shoe={i}
                    className="absolute inset-x-0 bottom-0 flex justify-center will-change-transform"
                    style={i === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                  >
                    <div
                      style={{
                        width: `min(88vw, calc(var(--stack-h) * ${s.image.aspect}), 980px)`,
                      }}
                    >
                      <ShoeImage
                        shoe={s}
                        priority={i === 0}
                        preload
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* details */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 px-4 pb-6 sm:px-8 sm:pb-10">
        <div className="relative min-h-[7.5rem] w-full max-w-md sm:min-h-[8.5rem]">
          {shoes.map((s, i) => (
            <div
              key={s.id}
              data-info={i}
              inert={i !== active}
              className="absolute inset-x-0 bottom-0"
            >
              <p className="text-xs font-semibold tracking-[0.25em] uppercase">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {s.category}
              </p>
              <p className="font-display mt-1 text-4xl leading-none font-extrabold uppercase sm:text-6xl">
                {s.name}
              </p>
              <p className="text-fg-muted mt-2 max-w-xs text-sm sm:text-base">{s.tagline}</p>
              <div className="mt-4 flex items-center gap-4">
                <Magnetic>
                  <TransitionLink
                    sharedShoeId={s.id}
                    sharedFrom={() =>
                      root.current?.querySelector<HTMLElement>(`[data-shoe="${i}"] img`) ?? null
                    }
                    href={`/shoes/${s.slug}`}
                    className="bg-accent text-on-accent inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold tracking-wide uppercase"
                  >
                    View · {formatPrice(s.price, s.currency)}
                  </TransitionLink>
                </Magnetic>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Magnetic>
            <button
              type="button"
              onClick={() => goTo(current.current - 1)}
              aria-label="Previous shoe"
              className="border-accent text-accent flex h-12 w-12 items-center justify-center rounded-full border-2"
            >
              <Arrow dir="left" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => goTo(current.current + 1)}
              aria-label="Next shoe"
              className="bg-accent text-on-accent flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Arrow dir="right" />
            </button>
          </Magnetic>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shoes[active].name}, {active + 1} of {n}
      </p>
      <p
        aria-hidden
        className="absolute top-1/2 right-4 z-30 hidden -translate-y-1/2 text-[11px] tracking-[0.3em] uppercase opacity-70 [writing-mode:vertical-rl] sm:block"
      >
        Scroll · Swipe · ← →
      </p>
    </section>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={dir === "left" ? "rotate-180" : ""}
    >
      <path
        d="M3 10h13m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
