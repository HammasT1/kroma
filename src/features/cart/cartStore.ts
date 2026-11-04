import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  /** `${shoeId}-${size}` */
  key: string;
  shoeId: number;
  slug: string;
  name: string;
  colorway: string;
  /** minor units */
  price: number;
  currency: string;
  size: number;
  qty: number;
  image: { src: string; aspect: number };
}

type NewLine = Omit<CartLine, "key" | "qty">;

interface CartState {
  lines: CartLine[];
  /** applied promo code, validated against lib/promo */
  promo: string | null;
  add: (line: NewLine, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setPromo: (code: string | null) => void;
}

export const MAX_QTY = 10;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      promo: null,
      add: (line, qty = 1) =>
        set((s) => {
          const key = `${line.shoeId}-${line.size}`;
          const hit = s.lines.find((l) => l.key === key);
          if (hit) {
            return {
              lines: s.lines.map((l) =>
                l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, key, qty }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [], promo: null }),
      setPromo: (promo) => set({ promo }),
    }),
    // hydrated manually after mount (CartButton) so SSR markup matches
    { name: "kroma-cart", skipHydration: true, version: 1 },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.qty * l.price, 0);
