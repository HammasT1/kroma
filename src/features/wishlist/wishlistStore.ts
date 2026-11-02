import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  toggle: (id: number) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      clear: () => set({ ids: [] }),
    }),
    // hydrated manually after mount (StoreHydrator) so SSR markup matches
    { name: "kroma-wishlist", skipHydration: true, version: 1 },
  ),
);
