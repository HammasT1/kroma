"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { startShared } from "@/features/product/sharedElement";

type Props = ComponentProps<typeof Link> & {
  /** Fly this shoe's image to its new position on the destination page. */
  sharedShoeId?: number;
  /** Where the image to clone lives; defaults to the closest [data-shared-card]. */
  sharedFrom?: (link: HTMLAnchorElement) => HTMLElement | null;
};

/** next/link that fades the page out (and starts a shared-element flight) before navigating. */
export function TransitionLink({ sharedShoeId, sharedFrom, onClick, href, ...rest }: Props) {
  const router = useRouter();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    if (rest.target && rest.target !== "_self") return;
    const url = new URL(typeof href === "string" ? href : (href.pathname ?? "/"), location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // same page: plain anchor / smooth-scroll
    e.preventDefault();

    if (sharedShoeId !== undefined) {
      const link = e.currentTarget;
      const src =
        sharedFrom?.(link) ??
        link.closest("[data-shared-card]")?.querySelector<HTMLElement>("img[data-shoe-img]") ??
        null;
      if (src) startShared(sharedShoeId, src);
    }

    const go = () =>
      router.push(typeof href === "string" ? href : url.pathname + url.search + url.hash);
    if (prefersReducedMotion()) return go();
    gsap.to("[data-page]", { autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: go });
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
