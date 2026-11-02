import { env } from "@/lib/env";
import { CartButton } from "@/features/cart/CartButton";
import { SearchButton } from "@/features/search/SearchButton";
import { WishlistLink } from "@/features/wishlist/WishlistLink";
import { TransitionLink } from "./TransitionLink";

export function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
      <TransitionLink
        href="/"
        className="font-display pointer-events-auto text-2xl font-black tracking-[0.12em] uppercase"
      >
        {env.NEXT_PUBLIC_SITE_NAME}
      </TransitionLink>
      <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-1 sm:gap-4">
        <TransitionLink
          href="/#collection"
          className="hidden px-2 text-sm font-medium tracking-wide uppercase sm:block"
        >
          Collection
        </TransitionLink>
        <SearchButton />
        <WishlistLink />
        <CartButton />
      </nav>
    </header>
  );
}
