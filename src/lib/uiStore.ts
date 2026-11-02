import { create } from "zustand";

interface UiState {
  /** preloader finished and the page may animate in */
  ready: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  setReady: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  ready: false,
  cartOpen: false,
  searchOpen: false,
  setReady: (ready) => set({ ready }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
