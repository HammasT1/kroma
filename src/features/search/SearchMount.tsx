"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/uiStore";
import type { SearchItem } from "./types";

const SearchPalette = dynamic(() => import("./SearchPalette").then((m) => m.SearchPalette), {
  ssr: false,
});

/** Global shortcuts (`/` or Ctrl/Cmd+K) and a lazy-loaded palette, so search costs nothing until used. */
export function SearchMount({ items }: { items: SearchItem[] }) {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const unsub = useUiStore.subscribe((s) => {
      if (s.searchOpen) setWanted(true);
    });
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t?.closest("input,textarea,select,[contenteditable]");
      const combo = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (combo || (e.key === "/" && !typing)) {
        e.preventDefault();
        useUiStore.getState().setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 3000));
    idle(() => void import("./SearchPalette"));
    return () => {
      unsub();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return wanted ? <SearchPalette items={items} /> : null;
}
