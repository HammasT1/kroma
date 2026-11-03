"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef } from "react";
import { AnimatedPrice } from "@/components/ui/AnimatedNumber";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getLenis } from "@/lib/lenis";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { useUiStore } from "@/lib/uiStore";
import { MAX_QTY, selectCount, selectSubtotal, useCartStore, type CartLine } from "./cartStore";

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);
  const subtotal = useCartStore(selectSubtotal);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // lock page scroll, trap focus, close on Escape, restore focus
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (n) => n.offsetParent,
      );
      if (!items.length) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      getLenis()?.start();
      opener.current?.focus?.();
    };
  }, [open, setOpen]);

  const slide = reduced ? 0 : 0.55;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120]">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            onClick={() => setOpen(false)}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: slide, ease: [0.76, 0, 0.24, 1] }}
            className="bg-bg-dark text-on-dark absolute top-0 right-0 flex h-full w-full max-w-md flex-col shadow-2xl"
          >
            <header className="flex items-center justify-between px-5 py-5">
              <h2 className="font-display text-4xl leading-none font-black uppercase">
                Bag <span className="tabular-nums">({count})</span>
              </h2>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                aria-label="Close bag"
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-current"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path
                    d="M2 2l12 12M14 2 2 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="grid flex-1 place-content-center gap-4 px-8 text-center">
                <p className="font-display text-5xl leading-none font-black uppercase">
                  Your bag is empty
                </p>
                <p className="opacity-75">Eleven pairs are waiting.</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-accent text-on-accent mx-auto h-12 rounded-full px-8 text-sm font-bold tracking-widest uppercase"
                >
                  Keep browsing
                </button>
              </div>
            ) : (
              <ul data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {lines.map((line, i) => (
                    <Line key={line.key} line={line} index={i} reduced={!!reduced} />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {lines.length > 0 && (
              <footer className="border-t border-white/15 px-5 py-5">
                <FreeShippingBar subtotal={subtotal} currency={lines[0].currency} />
                <p className="flex items-baseline justify-between text-lg">
                  <span>Subtotal</span>
                  <strong className="font-display text-4xl tabular-nums">
                    <AnimatedPrice value={subtotal} currency={lines[0].currency} />
                  </strong>
                </p>
                <p className="mt-1 text-sm opacity-70">Shipping and taxes at checkout.</p>
                <TransitionLink
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="bg-accent text-on-accent mt-4 flex h-14 items-center justify-center rounded-full text-sm font-bold tracking-[0.15em] uppercase"
                >
                  Checkout
                </TransitionLink>
              </footer>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FreeShippingBar({ subtotal, currency }: { subtotal: number; currency: string }) {
  const left = SITE.freeShippingOver - subtotal;
  const pct = Math.min(100, (subtotal / SITE.freeShippingOver) * 100);
  return (
    <div className="mb-5">
      <p className="text-sm" aria-live="polite">
        {left > 0 ? (
          <>
            You are <strong>{formatPrice(left, currency)}</strong> away from free shipping.
          </>
        ) : (
          <strong>You have unlocked free shipping.</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"
      >
        <div
          className="bg-accent h-full origin-left rounded-full transition-transform duration-500"
          style={{ transform: `scaleX(${pct / 100})`, width: "100%" }}
        />
      </div>
    </div>
  );
}

function Line({ line, index, reduced }: { line: CartLine; index: number; reduced: boolean }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  return (
    <m.li
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: 60, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : index * 0.06 }}
      className="flex gap-4 rounded-2xl bg-white/10 p-3"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={line.image.src}
        alt=""
        width={96}
        height={Math.round(96 / line.image.aspect)}
        className="h-24 w-24 shrink-0 rounded-xl bg-white/10 object-contain p-1"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display truncate text-2xl leading-none font-extrabold uppercase">
              {line.name}
            </p>
            <p className="mt-1 text-sm opacity-75">
              EU {line.size} · {line.colorway}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Remove ${line.name}, size ${line.size}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full opacity-75 hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
              <path
                d="M2 2l12 12M14 2 2 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div
            role="group"
            aria-label={`Quantity for ${line.name}, size ${line.size}`}
            className="flex items-center rounded-full border border-white/40"
          >
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty - 1)}
              aria-label="Decrease quantity"
              className="grid h-9 w-9 place-items-center text-lg"
            >
              −
            </button>
            <output
              aria-live="polite"
              className="w-7 text-center text-sm font-semibold tabular-nums"
            >
              {line.qty}
            </output>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty + 1)}
              disabled={line.qty >= MAX_QTY}
              aria-label="Increase quantity"
              className="grid h-9 w-9 place-items-center text-lg disabled:opacity-40"
            >
              +
            </button>
          </div>
          <p className="font-semibold tabular-nums">
            {formatPrice(line.price * line.qty, line.currency)}
          </p>
        </div>
      </div>
    </m.li>
  );
}
