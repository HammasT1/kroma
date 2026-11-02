"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/cartStore";
import { useWishlistStore } from "@/features/wishlist/wishlistStore";

/** Reads the persisted cart and wishlist from localStorage once, after mount. */
export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);
  return null;
}
