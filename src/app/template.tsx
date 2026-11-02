"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { getLenis } from "@/lib/lenis";

let firstRender = true;

/** Re-mounts on every navigation: fades the new page in (CSS) and resets scroll. */
export default function Template({ children }: { children: ReactNode }) {
  const isFirst = firstRender;

  useLayoutEffect(() => {
    firstRender = false;
    if (isFirst || location.hash) return;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [isFirst]);

  return (
    <div data-page className={isFirst ? undefined : "page-enter"}>
      {children}
    </div>
  );
}
