"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "./cartStore";

/** True once the persisted cart has been read from localStorage (avoids empty-cart flashes). */
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCartStore.persist.onFinishHydration(cb),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
