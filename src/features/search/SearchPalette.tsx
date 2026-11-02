"use client";

import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatPrice } from "@/lib/format";
import { getLenis } from "@/lib/lenis";
import { fadeThen } from "@/lib/navigate";
import { useUiStore } from "@/lib/uiStore";
import type { SearchItem } from "./types";

const FOCUSABLE = 'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])';

const score = (item: SearchItem, tokens: string[]) => {
  const name = item.name.toLowerCase();
  const rest = `${item.category} ${item.colorway}`.toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (name.startsWith(t)) s += 4;
    else if (name.includes(t)) s += 3;
    else if (rest.includes(t)) s += 1;
    else return -1;
  }
  return s;
};

/** Command-style search: type, arrow keys, Enter. Full combobox semantics for screen readers. */
export function SearchPalette({ items }: { items: SearchItem[] }) {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const router = useRouter();
  const reduced = useReducedMotion();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return items;
    return items
      .map((it) => ({ it, s: score(it, tokens) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [items, q]);

  const close = () => {
    setOpen(false);
    setQ("");
    setActive(0);
  };

  const go = (item: SearchItem) => {
    close();
    fadeThen(() => router.push(`/shoes/${item.slug}`));
  };

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      getLenis()?.start();
      opener.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  const d = reduced ? 0 : 0.35;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center px-4 pt-[12svh]">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: d }}
            onClick={close}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Search shoes"
            initial={reduced ? false : { opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: d, ease: [0.22, 1, 0.36, 1] }}
            className="bg-bg-dark text-on-dark relative w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/15 px-5">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                ref={input}
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
                aria-label="Search by name, category or color"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search by name, category or color"
                className="h-16 w-full bg-transparent text-lg outline-none placeholder:text-white/60 focus-visible:outline-none"
              />
              <kbd className="rounded-md border border-white/30 px-2 py-0.5 text-xs">Esc</kbd>
            </div>

            <ul
              id="search-results"
              role="listbox"
              data-lenis-prevent
              aria-label="Results"
              className="max-h-[50svh] overflow-y-auto p-2"
            >
              {results.map((it, i) => (
                <li
                  key={it.slug}
                  id={`sr-${it.slug}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it)}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl p-2 ${i === active ? "bg-white/15" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.img}
                    alt=""
                    width={72}
                    height={Math.round(72 / it.aspect)}
                    className="h-16 w-16 shrink-0 rounded-xl object-contain p-1"
                    style={{ background: it.bg }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-2xl leading-none font-extrabold uppercase">
                      {it.name}
                    </p>
                    <p className="text-sm opacity-75">
                      {it.category} · {it.colorway}
                    </p>
                  </div>
                  <p className="font-semibold tabular-nums">{formatPrice(it.price, it.currency)}</p>
                </li>
              ))}
              {!results.length && (
                <li className="px-4 py-8 text-center opacity-75">
                  No pairs match &ldquo;{q}&rdquo;.
                </li>
              )}
            </ul>
            <p aria-live="polite" className="sr-only">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
