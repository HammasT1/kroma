"use client";

import { AnimatePresence, m } from "framer-motion";
import { useMemo, useState } from "react";
import type { Shoe, ShoeCategory } from "@/data";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ shoes, categories }: { shoes: Shoe[]; categories: ShoeCategory[] }) {
  const [filter, setFilter] = useState<ShoeCategory | "All">("All");
  const visible = useMemo(
    () => (filter === "All" ? shoes : shoes.filter((s) => s.category === filter)),
    [shoes, filter],
  );

  return (
    <section
      id="shop"
      aria-labelledby="shop-title"
      className="relative z-10 px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="shop-title"
          className="font-display text-6xl leading-[0.85] font-black uppercase sm:text-9xl"
        >
          All pairs
        </h2>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className="border-accent aria-pressed:bg-accent aria-pressed:text-on-accent h-10 rounded-full border-2 px-4 text-xs font-bold tracking-wider uppercase transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <m.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((shoe, i) => (
            <m.li
              key={shoe.id}
              layout
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.08 }}
              className="col-span-1"
            >
              <ProductCard shoe={shoe} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </section>
  );
}
