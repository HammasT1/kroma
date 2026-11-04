"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/cartStore";
import { useRecentStore } from "@/features/product/recentStore";
import { useWishlistStore } from "@/features/wishlist/wishlistStore";

/** Reads the persisted cart, wishlist and recently viewed list from localStorage once, after mount. */
export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
    void useRecentStore.persist.rehydrate();
  }, []);
  return null;
}
