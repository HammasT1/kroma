"use client";

import { useLayoutEffect, useRef } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrecise } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { env } from "@/lib/env";
import type { Order } from "./types";

/** Deterministic bar pattern from the order id (decorative, not a scannable code). */
function bars(id: string) {
  let seed = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const out: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 196) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const w = 1 + (seed % 4);
    if ((seed >> 8) % 3) out.push({ x, w });
    x += w + 1 + ((seed >> 4) % 2);
  }
  return out;
}

const SPARKS = Array.from({ length: 16 }, (_, i) => i);

/** The order slip "prints" out of a slot, then a PAID stamp lands. Print / save as PDF via the browser. */
export function Slip({ order }: { order: Order }) {
  const root = useRef<HTMLDivElement>(null);
  const placed = new Date(order.placedAt);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-slip-paper]", { clipPath: "inset(0 0 100% 0)" });
      gsap.set("[data-slip-row]", { autoAlpha: 0, x: -14 });
      gsap.set("[data-stamp]", { autoAlpha: 0 });
      gsap.set("[data-slip-actions]", { autoAlpha: 0, y: 16 });
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(
        "[data-slot-glow]",
        { scaleX: 0.2, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
      );
      // printer feed: the slip extends down out of the slot in mechanical steps
      tl.to(
        "[data-slip-paper]",
        { clipPath: "inset(0 0 -24px 0)", duration: 2.6, ease: "steps(48)" },
        0.4,
      );
      tl.to(
        "[data-slip-row]",
        { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.13, ease: "power2.out" },
        0.9,
      );
      tl.fromTo(
        "[data-stamp]",
        { scale: 3.2, rotate: -28, autoAlpha: 0 },
        { scale: 1, rotate: -12, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)" },
        "+=0.05",
      );
      tl.fromTo(
        "[data-slip-paper]",
        { x: -7 },
        { x: 0, duration: 0.7, ease: "elastic.out(1, 0.25)" },
        "<0.18",
      );
      tl.fromTo(
        "[data-spark]",
        { x: 0, y: 0, scale: 0, autoAlpha: 1 },
        {
          x: (i) => Math.cos((i / SPARKS.length) * Math.PI * 2) * (90 + (i % 3) * 30),
          y: (i) => Math.sin((i / SPARKS.length) * Math.PI * 2) * (90 + (i % 3) * 30),
          scale: (i) => 0.6 + (i % 4) * 0.3,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        "<",
      );
      tl.to("[data-slot-glow]", { autoAlpha: 0, duration: 0.6 }, "<");
      tl.to(
        "[data-slip-actions]",
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const row = "flex items-baseline justify-between gap-3";

  return (
    <div ref={root} className="mx-auto w-full max-w-md">
      <h1 className="no-print sr-only">Order confirmed</h1>
      <div
        className="no-print bg-bg-dark relative z-10 mx-auto h-5 w-[calc(100%+1.5rem)] -translate-x-3 rounded-full shadow-lg"
        aria-hidden
      >
        <span
          data-slot-glow
          className="bg-accent absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 rounded-full shadow-[0_0_18px_4px_var(--accent)]"
        />
      </div>

      <div className="relative -mt-2 overflow-hidden px-0 pt-0 pb-5 print:overflow-visible">
        <div
          id="slip-paper"
          data-slip-paper
          className="slip-paper relative bg-white px-6 pt-8 pb-7 font-mono text-[13px] leading-relaxed text-[#14110f] shadow-xl"
        >
          <header className="text-center" data-slip-row>
            <p className="font-display text-5xl leading-none font-black tracking-[0.1em]">
              {env.NEXT_PUBLIC_SITE_NAME}
            </p>
            <p className="mt-1 text-[11px] tracking-[0.3em] uppercase">Order slip</p>
          </header>

          <div
            className="mt-4 grid gap-0.5 border-y border-dashed border-black/40 py-3"
            data-slip-row
          >
            <p className={row}>
              <span>Order</span>
              <strong>{order.id}</strong>
            </p>
            <p className={row}>
              <span>Date</span>
              <span>
                {placed.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </p>
            <p className={row}>
              <span>Customer</span>
              <span className="text-right">{order.details.name}</span>
            </p>
            <p className={row}>
              <span>Ship to</span>
              <span className="text-right">
                {order.details.address}, {order.details.city} {order.details.zip}
              </span>
            </p>
          </div>

          <ul className="mt-3 grid gap-2">
            {order.lines.map((l) => (
              <li key={l.key} data-slip-row>
                <p className={row}>
                  <strong className="uppercase">{l.name}</strong>
                  <span>{formatPrecise(l.price * l.qty, l.currency)}</span>
                </p>
                <p className="text-[12px] opacity-70">
                  EU {l.size} · {l.colorway} · {l.qty} × {formatPrecise(l.price, l.currency)}
                </p>
              </li>
            ))}
          </ul>

          <div
            className="mt-3 grid gap-0.5 border-t border-dashed border-black/40 pt-3"
            data-slip-row
          >
            <p className={row}>
              <span>Subtotal</span>
              <span>{formatPrecise(order.subtotal, order.currency)}</span>
            </p>
            {order.discount > 0 && (
              <p className={row}>
                <span>Discount ({order.promoCode})</span>
                <span>-{formatPrecise(order.discount, order.currency)}</span>
              </p>
            )}
            <p className={row}>
              <span>Shipping</span>
              <span>{order.shipping ? formatPrecise(order.shipping, order.currency) : "Free"}</span>
            </p>
            <p className={`${row} mt-1 text-lg`}>
              <strong>TOTAL</strong>
              <strong>{formatPrecise(order.total, order.currency)}</strong>
            </p>
          </div>

          <div className="mt-3 border-t border-dashed border-black/40 pt-3" data-slip-row>
            <p className={row}>
              <span>Paid with</span>
              <strong>{order.payment.methodName}</strong>
            </p>
            <p className="text-right text-[12px] opacity-70">{order.payment.detail}</p>
          </div>

          <div className="mt-5 flex flex-col items-center gap-1" data-slip-row>
            <svg
              viewBox="0 0 200 40"
              className="h-12 w-full"
              aria-hidden
              preserveAspectRatio="none"
            >
              {bars(order.id).map((b, i) => (
                <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#14110f" />
              ))}
            </svg>
            <p className="tracking-[0.3em]">{order.id}</p>
            <p className="mt-2 text-center text-[11px] opacity-70">
              Demo order. Nothing was charged and this is not a real receipt.
            </p>
          </div>

          <div
            data-stamp
            className="pointer-events-none absolute top-[64%] left-[62%] grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          >
            <span className="font-display rounded-lg border-[6px] border-double border-[#c8102e] px-5 py-1 text-6xl font-black tracking-[0.1em] text-[#c8102e] opacity-85 mix-blend-multiply">
              PAID
            </span>
            {SPARKS.map((i) => (
              <i
                key={i}
                data-spark
                className="absolute h-2 w-2 rounded-full opacity-0"
                style={{ background: i % 2 ? "#c8102e" : "#f59e0b" }}
              />
            ))}
          </div>
          <span aria-hidden className="slip-teeth" />
        </div>
      </div>

      <div
        data-slip-actions
        className="no-print mt-6 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-accent text-on-accent h-12 rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          Print / save as PDF
        </button>
        <TransitionLink
          href="/"
          className="inline-flex h-12 items-center rounded-full border-2 border-current px-8 text-sm font-bold tracking-widest uppercase"
        >
          Back to the shoes
        </TransitionLink>
      </div>
    </div>
  );
}
