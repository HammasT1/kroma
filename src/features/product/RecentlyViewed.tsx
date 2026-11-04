"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Shoe } from "@/data";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/features/catalog/ProductCard";
import { useRecentStore } from "./recentStore";

const useRecentHydrated = () =>
  useSyncExternalStore(
    (cb) => useRecentStore.persist.onFinishHydration(cb),
    () => useRecentStore.persist.hasHydrated(),
    () => false,
  );

/** Records a product page visit once the saved list has loaded (an earlier push would be overwritten). */
export function TrackView({ shoeId }: { shoeId: number }) {
  const hydrated = useRecentHydrated();
  const push = useRecentStore((s) => s.push);
  useEffect(() => {
    if (hydrated) push(shoeId);
  }, [hydrated, push, shoeId]);
  return null;
}

export function RecentlyViewed({ shoes, excludeId }: { shoes: Shoe[]; excludeId?: number }) {
  const hydrated = useRecentHydrated();
  const ids = useRecentStore((s) => s.ids);
  if (!hydrated) return null;

  const seen = ids
    .filter((id) => id !== excludeId)
    .map((id) => shoes.find((s) => s.id === id))
    .filter((s): s is Shoe => !!s)
    .slice(0, 4);
  if (!seen.length) return null;

  return (
    <section aria-labelledby="recent-title" className="relative z-10 px-4 py-24 sm:px-8">
      <h2
        id="recent-title"
        className="font-display mb-8 text-5xl leading-[0.85] font-black uppercase sm:text-8xl"
      >
        Recently viewed
      </h2>
      <Reveal
        as="ul"
        stagger={0.1}
        className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4"
      >
        {seen.map((s) => (
          <li key={s.id}>
            <ProductCard shoe={s} />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
