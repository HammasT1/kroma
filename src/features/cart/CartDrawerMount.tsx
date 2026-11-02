"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/uiStore";

const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });

/** Keeps the drawer (and its animation code) out of the initial bundle until it is first needed. */
export function CartDrawerMount() {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const unsub = useUiStore.subscribe((s) => {
      if (s.cartOpen) setWanted(true);
    });
    // warm the chunk when the browser is idle so the first open is instant
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 3000));
    idle(() => void import("./CartDrawer"));
    return unsub;
  }, []);

  return wanted ? <CartDrawer /> : null;
}
