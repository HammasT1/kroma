"use client";

import { AnimatePresence, m } from "framer-motion";
import { useMemo, useState } from "react";
import type { Shoe, ShoeCategory } from "@/data";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";
type PriceBand = "any" | "under-130" | "130-150" | "over-150";

const BANDS: Record<PriceBand, [string, (cents: number) => boolean]> = {
  any: ["Any price", () => true],
  "under-130": ["Under $130", (c) => c < 13000],
  "130-150": ["$130 to $150", (c) => c >= 13000 && c <= 15000],
  "over-150": ["Over $150", (c) => c > 15000],
};

const selectClass =
  "border-accent bg-bg h-10 cursor-pointer rounded-full border-2 pr-9 pl-4 text-xs font-bold tracking-wider uppercase";

export function ProductGrid({ shoes, categories }: { shoes: Shoe[]; categories: ShoeCategory[] }) {
  const [filter, setFilter] = useState<ShoeCategory | "All">("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [size, setSize] = useState<number | "any">("any");
  const [band, setBand] = useState<PriceBand>("any");
  const allSizes = useMemo(
    () => [...new Set(shoes.flatMap((s) => s.sizes))].sort((a, b) => a - b),
    [shoes],
  );
  const filtering = filter !== "All" || size !== "any" || band !== "any";
  const reset = () => {
    setFilter("All");
    setSize("any");
    setBand("any");
  };
  const visible = useMemo(() => {
    const list = shoes.filter(
      (s) =>
        (filter === "All" || s.category === filter) &&
        (size === "any" || (s.sizes.includes(size) && !s.soldOut.includes(size))) &&
        BANDS[band][1](s.price),
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [shoes, filter, size, band, sort]);

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
            <span className="sr-only">Filter by size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value === "any" ? "any" : Number(e.target.value))}
              className={selectClass}
            >
              <option value="any">Any size</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>
                  EU {s}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">Filter by price</span>
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as PriceBand)}
              className={selectClass}
            >
              {Object.entries(BANDS).map(([k, [label]]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">Sort pairs</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className={selectClass}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>
      </div>

      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "pair" : "pairs"} shown
      </p>
      {visible.length === 0 && (
        <div className="border-line grid justify-items-center gap-4 rounded-3xl border px-6 py-16 text-center">
          <p className="font-display text-4xl font-black uppercase">No pairs match</p>
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-on-accent h-11 rounded-full px-6 text-xs font-bold tracking-widest uppercase"
          >
            Clear filters
          </button>
        </div>
      )}
      {filtering && visible.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mb-6 text-xs font-bold tracking-[0.2em] uppercase underline underline-offset-4"
        >
          Clear filters
        </button>
      )}
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
