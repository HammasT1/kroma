import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 8;

interface RecentState {
  /** newest first */
  ids: number[];
  push: (id: number) => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, MAX) })),
    }),
    // hydrated manually after mount (StoreHydrator) so SSR markup matches
    { name: "kroma-recent", skipHydration: true, version: 1 },
  ),
);
