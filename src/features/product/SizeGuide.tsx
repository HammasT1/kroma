"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "@/lib/lenis";

/** Approximate conversions (EU men's/unisex). Foot length in cm. */
const ROWS = [
  [36, 3.5, 4, 22.5],
  [37, 4.5, 5, 23.2],
  [38, 5, 5.5, 24],
  [39, 6, 6.5, 24.7],
  [40, 6.5, 7, 25.4],
  [41, 7.5, 8, 26],
  [42, 8, 8.5, 26.7],
  [43, 9, 9.5, 27.5],
  [44, 9.5, 10, 28.2],
  [45, 10.5, 11, 28.9],
  [46, 11, 11.5, 29.6],
] as const;

export function SizeGuide({ current }: { current?: number | null }) {
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const btn = opener.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      getLenis()?.start();
      btn?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-bold tracking-[0.2em] uppercase underline underline-offset-4"
      >
        Size guide
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[130] grid place-items-center p-4">
            <div
              aria-hidden
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              data-lenis-prevent
              className="bg-bg-dark text-on-dark relative max-h-[88svh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="size-guide-title"
                  className="font-display text-5xl leading-none font-black uppercase"
                >
                  Size guide
                </h2>
                <button
                  ref={close}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close size guide"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-current"
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
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15">
                <table className="w-full text-center text-sm tabular-nums">
                  <caption className="sr-only">Shoe size conversion chart</caption>
                  <thead className="text-accent text-xs tracking-[0.15em] uppercase">
                    <tr className="border-b border-white/15">
                      <th scope="col" className="px-3 py-3">
                        EU
                      </th>
                      <th scope="col" className="px-3 py-3">
                        UK
                      </th>
                      <th scope="col" className="px-3 py-3">
                        US
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Foot (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(([eu, uk, us, cm]) => (
                      <tr
                        key={eu}
                        className={`border-b border-white/10 last:border-0 ${
                          eu === current ? "bg-accent text-on-accent font-bold" : ""
                        }`}
                      >
                        <th scope="row" className="px-3 py-2.5 font-semibold">
                          {eu}
                        </th>
                        <td className="px-3 py-2.5">{uk}</td>
                        <td className="px-3 py-2.5">{us}</td>
                        <td className="px-3 py-2.5">{cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-accent mt-7 text-xs font-bold tracking-[0.2em] uppercase">
                How to measure
              </h3>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-white/75">
                <li>Stand on a sheet of paper with your heel against a wall.</li>
                <li>Mark the tip of your longest toe and measure to the wall in cm.</li>
                <li>Find your length in the chart. Measure both feet and use the larger one.</li>
                <li>Between two sizes, or a wider foot? Go up one size.</li>
              </ol>
              <p className="mt-5 text-xs text-white/60">
                Conversions are approximate and can vary slightly by style. Not sure? Message us on
                WhatsApp and we will help you pick.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
