import { create } from "zustand";

interface UiState {
  /** preloader finished and the page may animate in */
  ready: boolean;
  cartOpen: boolean;
  setReady: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  ready: false,
  cartOpen: false,
  setReady: (ready) => set({ ready }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
}));
