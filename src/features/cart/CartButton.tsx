"use client";

import { Magnetic } from "@/components/ui/Magnetic";
import { useUiStore } from "@/lib/uiStore";
import { selectCount, useCartStore } from "./cartStore";

export function CartButton() {
  const count = useCartStore(selectCount);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  return (
    <Magnetic>
      <button
        type="button"
        data-cart-target
        onClick={() => setCartOpen(true)}
        aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
        className="bg-accent text-on-accent flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold tracking-wide uppercase"
      >
        Bag <span className="tabular-nums">{count}</span>
      </button>
    </Magnetic>
  );
}
