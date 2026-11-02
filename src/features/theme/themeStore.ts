import { create } from "zustand";
import type { Palette } from "@/data/types";

export interface WipeRequest {
  /** increments so repeated requests with the same color still fire */
  key: number;
  /** viewport coordinates the wipe expands from */
  x: number;
  y: number;
  /** palette the wipe reveals */
  to: Palette;
  from: Palette;
}

interface ThemeState {
  palettes: Palette[];
  index: number;
  wipe: WipeRequest | null;
  init: (palettes: Palette[], index?: number) => void;
  set: (index: number, wipe?: Omit<WipeRequest, "key" | "to" | "from">) => void;
}

let wipeKey = 0;

export const useThemeStore = create<ThemeState>((set, get) => ({
  palettes: [],
  index: 0,
  wipe: null,
  init: (palettes, index = 0) => set({ palettes, index }),
  set: (index, origin) => {
    const { palettes, index: prev } = get();
    if (index === prev || !palettes[index]) return;
    set({
      index,
      wipe: origin
        ? { ...origin, key: ++wipeKey, from: palettes[prev], to: palettes[index] }
        : null,
    });
  },
}));
