"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState, type FormEvent } from "react";
import { AnimatedPrice } from "@/components/ui/AnimatedNumber";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { selectSubtotal, useCartStore } from "@/features/cart/cartStore";
import { useCartHydrated } from "@/features/cart/useCartHydrated";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";
import { PaymentDeck } from "./PaymentDeck";
import { Slip } from "./Slip";
import type { Details, Order, PaidInfo } from "./types";

const FREE_SHIPPING_OVER = SITE.freeShippingOver;
const SHIPPING = 900;
const STEPS = ["Delivery", "Payment", "Slip"] as const;
type Step = (typeof STEPS)[number];

const field =
  "h-12 w-full rounded-xl border-2 border-fg/40 bg-transparent px-4 text-base placeholder:text-fg-muted focus:border-accent";
const pill =
  "inline-flex h-12 w-fit items-center rounded-full bg-accent px-8 text-sm font-bold tracking-widest text-on-accent uppercase";

/** Demo checkout: delivery details, then a payment-card deck that flips open, then a printed order slip. */
export function CheckoutFlow() {
  const hydrated = useCartHydrated();
  const reduced = useReducedMotion();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectSubtotal);
  const clear = useCartStore((s) => s.clear);
  const [step, setStep] = useState<Step>("Delivery");
  const [details, setDetails] = useState<Details | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const currency = lines[0]?.currency ?? "USD";
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING;
  const total = subtotal + shipping;

  const toPayment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setDetails({
      email: String(f.get("email")),
      name: String(f.get("name")),
      address: String(f.get("address")),
      city: String(f.get("city")),
      zip: String(f.get("zip")),
    });
    setStep("Payment");
    window.scrollTo({ top: 0 });
  };

  const onPaid = (payment: PaidInfo) => {
    if (!details) return;
    setOrder({
      id: `KR-${Math.floor(100000 + Math.random() * 900000)}`,
      placedAt: new Date().toISOString(),
      lines: lines.map((l) => ({ ...l })),
      subtotal,
      shipping,
      total,
      currency,
      details,
      payment,
    });
    clear();
    setStep("Slip");
    window.scrollTo({ top: 0 });
  };

  if (!hydrated) return <div className="min-h-[60svh]" aria-busy="true" />;

  if (step !== "Slip" && lines.length === 0) {
    return (
      <div className="grid min-h-[60svh] content-center gap-4">
        <h1 className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl">
          Bag is empty
        </h1>
        <TransitionLink href="/#collection" className={pill}>
          Pick a pair
        </TransitionLink>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);
  const summary = (
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
            <p className="font-semibold tabular-nums">{formatPrice(l.price * l.qty, l.currency)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-6 grid grid-cols-[1fr_auto] gap-2 border-t border-white/20 pt-4 text-sm">
        <dt>Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal, currency)}</dd>
        <dt>Shipping</dt>
        <dd className="tabular-nums">{shipping ? formatPrice(shipping, currency) : "Free"}</dd>
        <dt className="text-base font-bold">Total</dt>
        <dd className="font-display text-3xl tabular-nums">
          <AnimatedPrice value={total} currency={currency} />
        </dd>
      </dl>
    </aside>
  );

  return (
    <div>
      <ol
        aria-label="Checkout progress"
        className="no-print mb-10 flex items-center gap-3 sm:gap-5"
      >
        {STEPS.map((s, i) => (
          <li
            key={s}
            className="flex flex-1 flex-col gap-2"
            aria-current={i === stepIndex ? "step" : undefined}
          >
            <span className="bg-line relative block h-1 overflow-hidden rounded-full">
              <m.span
                className="bg-accent absolute inset-0 origin-left"
                initial={false}
                animate={{ scaleX: i <= stepIndex ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: [0.76, 0, 0.24, 1] }}
              />
            </span>
            <span
              className={`text-xs font-bold tracking-[0.2em] uppercase ${i <= stepIndex ? "" : "text-fg-muted"}`}
            >
              {i + 1}. {s}
            </span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={step}
          initial={reduced ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === "Delivery" && (
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <form onSubmit={toPayment} className="grid gap-5" aria-labelledby="checkout-title">
                <h1
                  id="checkout-title"
                  className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl"
                >
                  Delivery
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
                    defaultValue={details?.email}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Full name
                  <input
                    className={field}
                    name="name"
                    autoComplete="name"
                    required
                    defaultValue={details?.name}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Address
                  <input
                    className={field}
                    name="address"
                    autoComplete="street-address"
                    required
                    defaultValue={details?.address}
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-semibold">
                    City
                    <input
                      className={field}
                      name="city"
                      autoComplete="address-level2"
                      required
                      defaultValue={details?.city}
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-semibold">
                    Postal code
                    <input
                      className={field}
                      name="zip"
                      autoComplete="postal-code"
                      required
                      defaultValue={details?.zip}
                    />
                  </label>
                </div>
                <button type="submit" className={`${pill} mt-2 h-14`}>
                  Continue to payment
                </button>
              </form>
              {summary}
            </div>
          )}

          {step === "Payment" && (
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <section aria-labelledby="pay-title">
                <h1
                  id="pay-title"
                  className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-9xl"
                >
                  Pay
                </h1>
                <p className="text-fg-muted mt-3 mb-8">
                  Choose a method. Tap a card and it flips open to check out.
                </p>
                <PaymentDeck total={total} currency={currency} onPaid={onPaid} />
                <button
                  type="button"
                  onClick={() => setStep("Delivery")}
                  className="mt-6 text-xs font-bold tracking-widest uppercase underline underline-offset-4"
                >
                  ← Edit delivery details
                </button>
              </section>
              {summary}
            </div>
          )}

          {step === "Slip" && order && <Slip order={order} />}
        </m.div>
      </AnimatePresence>
    </div>
  );
}
