"use client";

import { useSyncExternalStore } from "react";
import type { Shoe } from "@/data";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ProductCard } from "@/features/catalog/ProductCard";
import { useWishlistStore } from "./wishlistStore";

const useHydrated = () =>
  useSyncExternalStore(
    (cb) => useWishlistStore.persist.onFinishHydration(cb),
    () => useWishlistStore.persist.hasHydrated(),
    () => false,
  );

export function WishlistView({ shoes }: { shoes: Shoe[] }) {
  const hydrated = useHydrated();
  const ids = useWishlistStore((s) => s.ids);
  const saved = shoes.filter((s) => ids.includes(s.id));

  if (!hydrated) return <div className="min-h-[40svh]" aria-busy="true" />;

  if (!saved.length) {
    return (
      <div className="grid min-h-[40svh] content-center gap-4">
        <p className="text-fg-muted">
          Nothing saved yet. Tap the heart on any pair to keep it here.
        </p>
        <TransitionLink
          href="/#collection"
          className="bg-accent text-on-accent inline-flex h-12 w-fit items-center rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          Browse the collection
        </TransitionLink>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
      {saved.map((s) => (
        <li key={s.id}>
          <ProductCard shoe={s} />
        </li>
      ))}
    </ul>
  );
}
