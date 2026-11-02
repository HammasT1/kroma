"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Shoe } from "@/data";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ShoeImage } from "@/features/hero/HeroShoe";
import { useCartStore } from "@/features/cart/cartStore";
import { flyToCart } from "@/features/product/flyToCart";
import { contrast } from "@/lib/color";
import { formatPrice } from "@/lib/format";

const contrastInk = (bg: string) =>
  contrast("#ffffff", bg) >= contrast("#0e0e0e", bg) ? "#ffffff" : "#0e0e0e";
const onDark = contrastInk;

export function ProductCard({ shoe, priority = false }: { shoe: Shoe; priority?: boolean }) {
  const [picking, setPicking] = useState(false);
  const tile = useRef<HTMLDivElement>(null);
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    if (!picking) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPicking(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picking]);

  const quickAdd = (size: number) => {
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
    flyToCart(tile.current?.querySelector("img") ?? null);
    setPicking(false);
  };

  return (
    <article data-shared-card className="group relative">
      <TransitionLink
        href={`/shoes/${shoe.slug}`}
        sharedShoeId={shoe.id}
        className="block"
        aria-label={`${shoe.name}, ${formatPrice(shoe.price, shoe.currency)}`}
      >
        <div
          ref={tile}
          className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-3xl"
          style={{ background: shoe.palette.bg, color: shoe.palette.text }}
        >
          <span
            aria-hidden
            className="font-display absolute top-3 left-4 text-6xl leading-none font-black opacity-20"
          >
            {String(shoe.id).padStart(2, "0")}
          </span>
          <div className="absolute inset-x-[8%] top-[14%] bottom-[8%] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:scale-110 group-hover:scale-110">
            <ShoeImage
              shoe={shoe}
              priority={priority}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw"
              contents
              className="block h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl leading-none font-extrabold uppercase">
            {shoe.name}
          </h3>
          <p className="text-sm font-semibold tabular-nums">
            {formatPrice(shoe.price, shoe.currency)}
          </p>
        </div>
        <p className="text-fg-muted text-sm">
          {shoe.category} · {shoe.colorway}
        </p>
      </TransitionLink>

      <button
        type="button"
        onClick={() => setPicking((v) => !v)}
        aria-expanded={picking}
        aria-label={`Quick add ${shoe.name}`}
        className="absolute top-3 right-3 z-10 flex h-10 items-center gap-1 rounded-full px-4 text-xs font-bold tracking-wider uppercase opacity-100 transition-[opacity,transform] duration-300 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: shoe.palette.accent, color: contrastInk(shoe.palette.accent) }}
      >
        + Quick add
      </button>

      <AnimatePresence>
        {picking && (
          <m.div
            role="group"
            aria-label={`Choose a size for ${shoe.name}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-3 bottom-[4.5rem] z-20 rounded-2xl p-3 shadow-xl"
            style={{ background: shoe.palette.bgDark, color: onDark(shoe.palette.bgDark) }}
          >
            <p className="mb-2 text-xs font-semibold tracking-wider uppercase">Select size (EU)</p>
            <div className="flex flex-wrap gap-1.5">
              {shoe.sizes.map((size) => {
                const out = shoe.soldOut.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={out}
                    onClick={() => quickAdd(size)}
                    className="h-9 min-w-9 rounded-full border border-current px-2 text-sm font-semibold tabular-nums transition-colors enabled:hover:bg-white/20 disabled:line-through disabled:opacity-40"
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </article>
  );
}
