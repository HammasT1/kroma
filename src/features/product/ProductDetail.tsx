"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Shoe } from "@/data";
import { Magnetic } from "@/components/ui/Magnetic";
import { TiltCard } from "@/components/ui/TiltCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { useCartStore } from "@/features/cart/cartStore";
import { ShoeImage } from "@/features/hero/HeroShoe";
import { useShoeTheme } from "@/features/theme/useShoeTheme";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/format";
import { useUiStore } from "@/lib/uiStore";
import { flyToCart } from "./flyToCart";
import { SizeSelector } from "./SizeSelector";
import { landShared } from "./sharedElement";

export function ProductDetail({ shoe, themeIndex }: { shoe: Shoe; themeIndex: number }) {
  const root = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const ready = useUiStore((s) => s.ready);
  const add = useCartStore((s) => s.add);
  const { setActive, snap } = useShoeTheme();
  const [size, setSize] = useState<number | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [added, setAdded] = useState(false);

  // hide the real image until the flying clone lands (set before paint)
  useLayoutEffect(() => {
    if (slot.current) gsap.set(slot.current, { autoAlpha: 0 });
    gsap.set("[data-pdp-in]", { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = root.current;
    const target = slot.current;
    if (!el || !target) return;
    const reduced = prefersReducedMotion();
    const landing: { rect: DOMRect | null } = { rect: null };
    const ctx = gsap.context(() => {
      const infoDelay = { current: 0 };
      const startFloat = () => {
        gsap.set(target, { autoAlpha: 1 });
        if (!reduced)
          gsap.to("[data-pdp-float]", {
            y: -12,
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
      };
      landing.rect = reduced ? null : landShared(shoe.id, target, startFloat);
      if (landing.rect) {
        infoDelay.current = 0.55;
      } else {
        gsap.fromTo(
          target,
          { y: 80, scale: 0.85, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: reduced ? 0 : 1,
            ease: "power3.out",
            onComplete: startFloat,
          },
        );
      }
      gsap.fromTo(
        "[data-pdp-in]",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: reduced ? 0 : 0.8,
          ease: "power3.out",
          stagger: reduced ? 0 : 0.07,
          delay: infoDelay.current,
        },
      );
      gsap.fromTo(
        "[data-pdp-word]",
        { yPercent: 12, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: reduced ? 0 : 1.1, ease: "power3.out" },
      );
    }, el);
    // The theme change lives outside the context: Strict Mode reverts the context, which would undo it.
    const from = landing.rect;
    if (from)
      setActive(themeIndex, { x: from.left + from.width / 2, y: from.top + from.height / 2 });
    else snap(themeIndex);
    return () => ctx.revert();
  }, [ready, shoe.id, themeIndex, setActive, snap]);

  const onAdd = () => {
    if (size === null) {
      setInvalid(true);
      gsap.fromTo(
        "[data-size-field]",
        { x: -8 },
        { x: 0, duration: 0.5, ease: "elastic.out(1,0.3)" },
      );
      return;
    }
    setInvalid(false);
    add({
      shoeId: shoe.id,
      slug: shoe.slug,
      name: shoe.name,
      colorway: shoe.colorway,
      price: shoe.price,
      currency: shoe.currency,
      size,
      image: { src: shoe.image.src, aspect: shoe.image.aspect },
    });
    flyToCart(slot.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const [first, ...rest] = shoe.name.toUpperCase().split(" ");

  return (
    <section
      ref={root}
      className="relative z-10 min-h-svh px-4 pt-24 pb-16 sm:px-8 sm:pt-28 lg:pb-24"
    >
      <TransitionLink
        href="/#collection"
        className="relative z-30 text-xs font-bold tracking-[0.2em] uppercase"
        data-pdp-in
      >
        ← All pairs
      </TransitionLink>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div className="relative [--stage-h:min(48svh,26rem)] lg:[--stage-h:min(64svh,38rem)]">
          <div
            aria-hidden
            data-pdp-word
            className="font-display pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-[0.78] font-black uppercase"
          >
            <span className="text-stroke text-[clamp(4rem,13vw,11rem)]">{first}</span>
            {rest.length > 0 && (
              <span className="text-[clamp(4rem,13vw,11rem)] opacity-[0.16]">{rest.join(" ")}</span>
            )}
          </div>
          <TiltCard
            scope="window"
            max={6}
            className="relative flex min-h-[var(--stage-h)] items-center justify-center"
          >
            <div data-pdp-float>
              <div
                ref={slot}
                data-shared-target
                className="mx-auto will-change-transform"
                style={{ width: `min(92vw, calc(var(--stage-h) * ${shoe.image.aspect}), 780px)` }}
              >
                <ShoeImage
                  shoe={shoe}
                  priority
                  preload
                  sizes="(min-width: 1024px) 55vw, 92vw"
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </TiltCard>
        </div>

        <div className="relative z-20">
          <p data-pdp-in className="text-xs font-bold tracking-[0.25em] uppercase">
            {shoe.category} · {shoe.colorway}
          </p>
          <h1
            data-pdp-in
            className="font-display mt-2 text-6xl leading-[0.85] font-black uppercase sm:text-8xl"
          >
            {shoe.name}
          </h1>
          <p data-pdp-in className="mt-4 text-3xl font-semibold tabular-nums">
            {formatPrice(shoe.price, shoe.currency)}
          </p>
          <p data-pdp-in className="text-fg-muted mt-4 max-w-md text-base leading-relaxed">
            {shoe.description}
          </p>

          <div data-pdp-in className="mt-8">
            <SizeSelector
              shoe={shoe}
              value={size}
              onChange={(s) => (setSize(s), setInvalid(false))}
              invalid={invalid}
            />
          </div>

          <div data-pdp-in className="mt-8 flex items-center gap-4">
            <Magnetic>
              <button
                type="button"
                onClick={onAdd}
                className="bg-accent text-on-accent h-14 rounded-full px-10 text-sm font-bold tracking-[0.15em] uppercase"
              >
                {added ? "Added to bag ✓" : "Add to bag"}
              </button>
            </Magnetic>
          </div>
          <p className="sr-only" aria-live="polite">
            {added ? `${shoe.name} size ${size} added to bag` : ""}
          </p>

          <ul
            data-pdp-in
            className="border-line text-fg-muted mt-10 grid max-w-md gap-2 border-t pt-6 text-sm"
          >
            <li>Free shipping over $150</li>
            <li>30-day returns, no questions</li>
            <li>Ships in 2 to 4 working days</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
