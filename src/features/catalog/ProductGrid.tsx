"use client";

import { AnimatePresence, m } from "framer-motion";
import { useMemo, useState } from "react";
import type { Shoe, ShoeCategory } from "@/data";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export function ProductGrid({ shoes, categories }: { shoes: Shoe[]; categories: ShoeCategory[] }) {
  const [filter, setFilter] = useState<ShoeCategory | "All">("All");
  const [sort, setSort] = useState<Sort>("featured");
  const visible = useMemo(() => {
    const list = filter === "All" ? [...shoes] : shoes.filter((s) => s.category === filter);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [shoes, filter, sort]);

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
          <label className="relative">
            <span className="sr-only">Sort pairs</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="border-accent bg-bg h-10 cursor-pointer rounded-full border-2 pr-9 pl-4 text-xs font-bold tracking-wider uppercase"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
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
