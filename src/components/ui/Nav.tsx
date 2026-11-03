"use client";

import { useEffect, useState } from "react";
import { env } from "@/lib/env";
import { getLenis } from "@/lib/lenis";
import { CartButton } from "@/features/cart/CartButton";
import { SearchButton } from "@/features/search/SearchButton";
import { WishlistLink } from "@/features/wishlist/WishlistLink";
import { TransitionLink } from "./TransitionLink";

const links = [
  ["Collection", "/#collection"],
  ["Shop", "/#shop"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`bg-bg-dark text-accent overflow-hidden text-center text-[11px] font-semibold tracking-[0.22em] uppercase transition-[max-height,opacity] duration-300 ${
            scrolled || open ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
          }`}
        >
          <p className="px-4 py-2.5">Complimentary shipping over $150 · 30-day returns</p>
        </div>

        <div
          className={`border-b transition-colors duration-300 ${
            scrolled || open
              ? "bg-bg/80 border-line backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:h-[4.5rem] sm:px-8">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="-ml-2 grid h-11 w-11 place-items-center rounded-full lg:hidden"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
                </svg>
              </button>
              <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                {links.map(([label, href]) => (
                  <TransitionLink
                    key={label}
                    href={href}
                    className="hover:text-accent text-[13px] font-medium tracking-[0.18em] uppercase transition-colors"
                  >
                    {label}
                  </TransitionLink>
                ))}
              </nav>
            </div>

            <TransitionLink
              href="/"
              onClick={close}
              className="font-display text-center text-3xl font-black tracking-[0.2em] uppercase sm:text-4xl"
            >
              {env.NEXT_PUBLIC_SITE_NAME}
            </TransitionLink>

            <div className="flex items-center justify-end gap-0.5 sm:gap-2">
              <SearchButton />
              <WishlistLink />
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`bg-bg-dark text-on-dark fixed inset-0 z-40 flex flex-col justify-between px-6 pt-28 pb-10 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile">
          <ul className="grid gap-2">
            {[...links, ["Shipping & returns", "/shipping"] as const].map(([label, href]) => (
              <li key={label} className="border-b border-white/10">
                <TransitionLink
                  href={href}
                  onClick={close}
                  className="font-display block py-4 text-5xl font-extrabold uppercase"
                >
                  {label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-accent text-xs tracking-[0.22em] uppercase">
          Complimentary shipping over $150
        </p>
      </div>
    </>
  );
}
