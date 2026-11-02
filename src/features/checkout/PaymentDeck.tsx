"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrecise } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { MethodBack } from "./MethodBack";
import { icons, methods, type Method } from "./methods";
import type { PaidInfo } from "./types";

const CH = 384; // card height (px)
const OFF = 68; // visible strip of each stacked card
const SPREAD = 104; // extra gap that opens under a hovered card
const N = methods.length;
const AREA = CH + (N - 1) * OFF + SPREAD;
const baseY = (i: number) => i * OFF;

/**
 * Wallet-style stack of payment cards. Hover fans the stack open; choosing one slides the others away,
 * centers the card and flips it (3D) to reveal that method's checkout. Paying releases it and calls onPaid.
 */
export function PaymentDeck({
  total,
  currency,
  onPaid,
}: {
  total: number;
  currency: string;
  onPaid: (info: PaidInfo) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const busy = useRef(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [paying, setPaying] = useState(false);

  const el = (i: number, part: "card" | "flip" | "tilt") =>
    root.current?.querySelector<HTMLElement>(`[data-${part}="${i}"]`) ?? null;

  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.set("[data-flip]", { transformPerspective: 1800 });
      methods.forEach((_, i) => gsap.set(el(i, "card"), { y: baseY(i) }));
      if (reduced) {
        entered.current = true;
        return;
      }
      gsap.from("[data-card]", {
        y: (i) => baseY(i) + 340,
        rotationX: -35,
        scale: 0.9,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.11,
        ease: "back.out(1.25)",
        onComplete: () => {
          entered.current = true;
        },
      });
      // idle breathing, each card a little out of phase
      gsap.to("[data-tilt]", {
        y: -5,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.35, from: "end" },
      });
    }, host);
    return () => ctx.revert();
  }, []);

  const spread = (open: number | null) => {
    if (!entered.current || selected !== null) return;
    methods.forEach((_, j) => {
      gsap.to(el(j, "card"), {
        y: baseY(j) + (open !== null && j > open ? SPREAD : 0),
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const tilt = (i: number, e: PointerEvent<HTMLElement>) => {
    if (selected !== null || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--mx", `${nx * 100}%`);
    e.currentTarget.style.setProperty("--my", `${ny * 100}%`);
    gsap.to(el(i, "tilt"), {
      rotationY: (nx - 0.5) * 14,
      rotationX: -(ny - 0.5) * 10,
      duration: 0.4,
      overwrite: "auto",
    });
  };
  const untilt = (i: number) =>
    gsap.to(el(i, "tilt"), { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });

  const select = (i: number) => {
    if (selected !== null || busy.current) return;
    busy.current = true;
    setSelected(i);
    const d = prefersReducedMotion() ? 0 : 1;
    const centerY = 0; // rises to the top of the deck area, where the eye already is
    gsap.set(el(i, "card"), { zIndex: 50 });
    untilt(i);
    const tl = gsap.timeline({ onComplete: () => (busy.current = false) });
    methods.forEach((_, j) => {
      if (j === i) return;
      tl.to(
        el(j, "card"),
        {
          y: baseY(j) + (j < i ? -70 : SPREAD + 150),
          scale: 0.9,
          rotationX: j < i ? 14 : -14,
          autoAlpha: 0,
          duration: 0.6 * d,
          ease: "power3.in",
        },
        Math.abs(j - i) * 0.05 * d,
      );
    });
    tl.to(el(i, "card"), { y: centerY, duration: 0.8 * d, ease: "power3.inOut" }, 0.2 * d);
    tl.to(el(i, "card"), { scale: 1.07, duration: 0.45 * d, ease: "power2.out" }, 0.7 * d);
    tl.to(el(i, "card"), { scale: 1, duration: 0.6 * d, ease: "power2.inOut" }, 1.15 * d);
    tl.to(el(i, "flip"), { rotationY: 180, duration: 1.15 * d, ease: "power3.inOut" }, 0.7 * d);
    tl.call(() => setFlipped(true), undefined, 1.55 * d);
  };

  const back = () => {
    if (selected === null || busy.current || paying) return;
    busy.current = true;
    const i = selected;
    const d = prefersReducedMotion() ? 0 : 1;
    setFlipped(false);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(el(i, "card"), { zIndex: 0 });
        setSelected(null);
        busy.current = false;
      },
    });
    tl.to(el(i, "flip"), { rotationY: 0, duration: 0.9 * d, ease: "power3.inOut" });
    tl.to(el(i, "card"), { y: baseY(i), duration: 0.7 * d, ease: "power3.inOut" }, 0.5 * d);
    methods.forEach((_, j) => {
      if (j === i) return;
      tl.to(
        el(j, "card"),
        {
          y: baseY(j),
          scale: 1,
          rotationX: 0,
          autoAlpha: 1,
          duration: 0.7 * d,
          ease: "back.out(1.3)",
        },
        (0.6 + Math.abs(j - i) * 0.05) * d,
      );
    });
  };

  const pay = (m: Method, detail: string) => {
    if (selected === null) return;
    const i = selected;
    setPaying(true);
    const reduced = prefersReducedMotion();
    setTimeout(
      () => {
        gsap.to(el(i, "card"), {
          y: `-=${reduced ? 0 : 90}`,
          scale: 0.9,
          autoAlpha: 0,
          duration: reduced ? 0 : 0.65,
          ease: "power3.in",
          onComplete: () => onPaid({ method: m.id, methodName: m.name, detail }),
        });
      },
      reduced ? 300 : 2000,
    );
  };

  return (
    <div
      ref={root}
      className="relative mx-auto w-full max-w-[34rem] select-none"
      style={{ height: AREA }}
      onPointerLeave={() => spread(null)}
    >
      {methods.map((m, i) => (
        <div
          key={m.id}
          data-card={i}
          className="absolute top-0 left-0 w-full"
          style={{ height: CH, zIndex: i }}
        >
          <div data-tilt={i} className="h-full will-change-transform">
            <div data-flip={i} className="relative h-full [transform-style:preserve-3d]">
              {/* front */}
              <button
                type="button"
                inert={selected === i}
                onClick={() => select(i)}
                onPointerEnter={() => spread(i)}
                onFocus={() => spread(i)}
                onBlur={() => spread(null)}
                onPointerMove={(e) => tilt(i, e)}
                onPointerLeave={() => untilt(i)}
                aria-label={`Pay with ${m.name}: ${m.tagline}`}
                className="group absolute inset-0 overflow-hidden rounded-3xl p-5 text-left shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
                style={{ background: m.gradient, color: m.ink }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx,30%) var(--my,0%), rgba(255,255,255,0.3), transparent 48%)",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.35)_50%,transparent_65%)] transition-transform duration-1000 group-hover:translate-x-full"
                />
                <span className="relative flex h-[52px] items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    {icons[m.id]}
                    <span className="font-display text-3xl leading-none font-extrabold uppercase">
                      {m.name}
                    </span>
                  </span>
                  <span className="text-xs font-semibold tracking-wider uppercase opacity-90">
                    {m.tagline}
                  </span>
                </span>
                <FrontArt m={m} total={total} currency={currency} />
              </button>

              {/* back: this method's checkout */}
              <div
                inert={!flipped || selected !== i}
                className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col overflow-hidden rounded-3xl bg-[#0d0d14] p-5 text-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: m.gradient }}
                />
                {selected === i && (
                  <MethodBack
                    method={m}
                    total={total}
                    currency={currency}
                    paying={paying}
                    onBack={back}
                    onPay={(detail) => pay(m, detail)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The decorative lower part of each card face (only the front-most card shows it fully). */
function FrontArt({ m, total, currency }: { m: Method; total: number; currency: string }) {
  const q = formatPrecise(Math.round(total / 4), currency);
  return (
    <span aria-hidden className="relative mt-8 grid gap-4">
      {m.id === "card" && (
        <>
          <span className="flex items-center gap-3">
            <span className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M8 8a6 6 0 0 1 0 8M12 5a10 10 0 0 1 0 14M16 2a14 14 0 0 1 0 20" />
            </svg>
          </span>
          <span className="font-mono text-2xl tracking-[0.18em]">•••• •••• •••• ••••</span>
          <span className="flex justify-between text-xs tracking-[0.25em] uppercase opacity-80">
            <span>Your name</span>
            <span>MM/YY</span>
          </span>
        </>
      )}
      {m.id === "wallet" && (
        <>
          <span className="font-display text-7xl leading-none font-black opacity-25">TAP</span>
          <span className="text-sm opacity-90">Approve on your phone in one tap.</span>
        </>
      )}
      {m.id === "bank" && (
        <>
          <span className="font-mono text-2xl tracking-[0.2em] opacity-90">KR •• •••• ••••</span>
          <span className="h-1.5 w-2/3 rounded-full bg-white/25" />
          <span className="text-sm opacity-80">Instant confirmation from your bank app.</span>
        </>
      )}
      {m.id === "cod" && (
        <>
          <span className="font-display text-7xl leading-none font-black opacity-25">CASH</span>
          <span className="text-sm opacity-90">No payment now. Pay the courier at your door.</span>
        </>
      )}
      {m.id === "later" && (
        <>
          <span className="flex gap-2">
            {[1, 0.75, 0.5, 0.3].map((o) => (
              <span
                key={o}
                className="h-14 flex-1 rounded-xl bg-white"
                style={{ opacity: o * 0.5 }}
              />
            ))}
          </span>
          <span className="font-display text-4xl leading-none font-extrabold">4 × {q}</span>
        </>
      )}
    </span>
  );
}
