"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatedPrice } from "@/components/ui/AnimatedNumber";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";
import { selectSubtotal, useCartStore } from "./cartStore";
import { useCartHydrated } from "./useCartHydrated";

const FREE_SHIPPING_OVER = 15000;
const SHIPPING = 900;

const field =
  "h-12 w-full rounded-xl border-2 border-fg/40 bg-transparent px-4 text-base placeholder:text-fg-muted focus:border-accent";

/** Demo checkout: validates, "places" an order and clears the bag. No payment is taken or sent anywhere. */
export function CheckoutStub() {
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const clear = useCartStore((s) => s.clear);
  const [order, setOrder] = useState<string | null>(null);
  const done = useRef<HTMLDivElement>(null);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = `SD-${Math.floor(100000 + Math.random() * 900000)}`;
    clear();
    setOrder(id);
    requestAnimationFrame(() => {
      done.current?.focus();
      if (!prefersReducedMotion() && done.current) {
        gsap.from(done.current.children, {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    });
  };

  if (!hydrated) return <div className="min-h-[60svh]" aria-busy="true" />;

  if (order) {
    return (
      <div
        ref={done}
        tabIndex={-1}
        className="grid min-h-[60svh] content-center gap-4 outline-none"
      >
        <p className="text-xs font-bold tracking-[0.25em] uppercase">Order placed (demo)</p>
        <h1 className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl">
          Thank you
        </h1>
        <p className="text-fg-muted max-w-md">
          Order <strong className="text-fg">{order}</strong> is a demo: nothing was charged and no
          data left your browser.
        </p>
        <TransitionLink
          href="/"
          className="bg-accent text-on-accent inline-flex h-12 w-fit items-center rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          Back to the shoes
        </TransitionLink>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="grid min-h-[60svh] content-center gap-4">
        <h1 className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl">
          Bag is empty
        </h1>
        <TransitionLink
          href="/#collection"
          className="bg-accent text-on-accent inline-flex h-12 w-fit items-center rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          Pick a pair
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} className="grid gap-5" aria-labelledby="checkout-title">
        <h1
          id="checkout-title"
          className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl"
        >
          Checkout
        </h1>
        <p className="border-line text-fg-muted rounded-xl border px-4 py-3 text-sm">
          Demo only. Do not enter real personal or card details; nothing is stored or sent.
        </p>
        <label className="grid gap-1.5 text-sm font-semibold">
          Email
          <input
            className={field}
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Full name
          <input className={field} name="name" autoComplete="name" required />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Address
          <input className={field} name="address" autoComplete="street-address" required />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            City
            <input className={field} name="city" autoComplete="address-level2" required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Postal code
            <input className={field} name="zip" autoComplete="postal-code" required />
          </label>
        </div>
        <button
          type="submit"
          className="bg-accent text-on-accent mt-2 h-14 w-full rounded-full text-sm font-bold tracking-[0.15em] uppercase sm:w-fit sm:px-12"
        >
          Place demo order · {formatPrice(total, lines[0].currency)}
        </button>
      </form>

      <aside
        aria-label="Order summary"
        className="bg-bg-dark text-on-dark h-fit rounded-3xl p-6 lg:sticky lg:top-28"
      >
        <h2 className="font-display text-4xl leading-none font-black uppercase">Your order</h2>
        <ul className="mt-5 space-y-4">
          {lines.map((l) => (
            <li key={l.key} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l.image.src}
                alt=""
                width={64}
                height={Math.round(64 / l.image.aspect)}
                className="h-16 w-16 rounded-lg bg-white/10 object-contain p-1"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-xl leading-none font-extrabold uppercase">
                  {l.name}
                </p>
                <p className="text-sm opacity-75">
                  EU {l.size} · Qty {l.qty}
                </p>
              </div>
              <p className="font-semibold tabular-nums">
                {formatPrice(l.price * l.qty, l.currency)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid grid-cols-[1fr_auto] gap-2 border-t border-white/20 pt-4 text-sm">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal, lines[0].currency)}</dd>
          <dt>Shipping</dt>
          <dd className="tabular-nums">
            {shipping ? formatPrice(shipping, lines[0].currency) : "Free"}
          </dd>
          <dt className="text-base font-bold">Total</dt>
          <dd className="font-display text-3xl tabular-nums">
            <AnimatedPrice value={total} currency={lines[0].currency} />
          </dd>
        </dl>
      </aside>
    </div>
  );
}
