"use client";

import { useLayoutEffect, useRef } from "react";
import type { Shoe } from "@/data";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { formatPrice } from "@/lib/format";
import { ShoeImage } from "@/features/hero/HeroShoe";

/** Pinned horizontal scroller. Vertical scroll drives x; scroll velocity skews the track. */
export function HorizontalGallery({ shoes }: { shoes: Shoe[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const skewer = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, tr.scrollWidth - innerWidth);
      const skew = gsap.quickTo(skewer.current, "skewX", { duration: 0.5, ease: "power3.out" });
      let idle: ReturnType<typeof setTimeout>;
      gsap.to(tr, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(bar.current, { scaleX: self.progress });
            skew(gsap.utils.clamp(-9, 9, self.getVelocity() / -350));
            clearTimeout(idle);
            idle = setTimeout(() => skew(0), 90);
          },
        },
      });
      document.fonts?.ready.then(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
        idle(() => ScrollTrigger.refresh());
      });
      return () => clearTimeout(idle);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="collection"
      aria-labelledby="collection-title"
      className="relative z-10 flex min-h-svh flex-col justify-center overflow-hidden py-24"
    >
      <div className="px-4 sm:px-8">
        <h2
          id="collection-title"
          className="font-display text-6xl leading-[0.85] font-black uppercase sm:text-9xl"
        >
          <span className="text-stroke">The</span> collection
        </h2>
      </div>
      <div className="mt-8 overflow-x-auto motion-safe:overflow-visible">
        <div ref={skewer} className="will-change-transform">
          <ul ref={track} className="flex w-max gap-4 px-4 sm:gap-8 sm:px-8">
            {shoes.map((s, i) => (
              <li key={s.id} className="w-[78vw] shrink-0 sm:w-[min(46vw,38rem)]">
                <article data-shared-card className="group">
                  <TransitionLink
                    href={`/shoes/${s.slug}`}
                    sharedShoeId={s.id}
                    aria-label={`${s.name}, ${formatPrice(s.price, s.currency)}`}
                    className="relative block h-[min(52svh,30rem)] overflow-hidden rounded-[2rem]"
                    style={{ background: s.palette.bg, color: s.palette.text }}
                  >
                    <span
                      aria-hidden
                      className="text-stroke-current font-display absolute top-3 left-5 text-8xl leading-none font-black sm:text-9xl"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute inset-x-[8%] top-[12%] bottom-[22%] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                      <ShoeImage
                        shoe={s}
                        sizes="(min-width: 640px) 40vw, 70vw"
                        contents
                        className="block h-full w-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
                      <p className="font-display text-3xl leading-none font-extrabold uppercase sm:text-4xl">
                        {s.name}
                      </p>
                      <p className="text-sm font-semibold tabular-nums">
                        {formatPrice(s.price, s.currency)}
                      </p>
                    </div>
                  </TransitionLink>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden className="bg-line mx-4 mt-8 h-0.5 sm:mx-8">
        <span ref={bar} className="bg-accent block h-full origin-left scale-x-0" />
      </div>
    </section>
  );
}
