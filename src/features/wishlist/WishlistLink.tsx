"use client";

import { TransitionLink } from "@/components/ui/TransitionLink";
import { useWishlistStore } from "./wishlistStore";

export function WishlistLink() {
  const count = useWishlistStore((s) => s.ids.length);
  return (
    <TransitionLink
      href="/wishlist"
      aria-label={`Wishlist, ${count} ${count === 1 ? "pair" : "pairs"} saved`}
      className="relative grid h-11 w-11 place-items-center rounded-full"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        aria-hidden
        fill={count ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 7.7 3.8 4.5 7 4.5c1.9 0 3.5 1 5 3 1.5-2 3.1-3 5-3 3.2 0 5.3 3.2 4.2 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden
          className="bg-accent text-on-accent absolute top-0.5 right-0 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] leading-none font-bold tabular-nums"
        >
          {count}
        </span>
      )}
    </TransitionLink>
  );
}
