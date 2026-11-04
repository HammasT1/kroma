"use client";

import { useState, type FormEvent } from "react";
import { findPromo } from "@/lib/promo";
import { useCartStore } from "./cartStore";

/** Promo code entry for the bag drawer. Shows the applied code with a remove button. */
export function PromoField() {
  const code = useCartStore((s) => s.promo);
  const setPromo = useCartStore((s) => s.setPromo);
  const [error, setError] = useState("");
  const applied = findPromo(code);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("code");
    const promo = findPromo(typeof input === "string" ? input : "");
    if (!promo) return setError("That code is not valid.");
    setError("");
    setPromo(promo.code);
  };

  if (applied) {
    return (
      <p className="mb-4 flex items-center justify-between gap-3 rounded-full border border-white/25 py-1.5 pr-1.5 pl-4 text-sm">
        <span>
          <strong>{applied.code}</strong> applied · {applied.label}
        </span>
        <button
          type="button"
          onClick={() => setPromo(null)}
          className="h-8 rounded-full px-3 text-xs font-bold tracking-widest uppercase underline underline-offset-4"
        >
          Remove
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          name="code"
          aria-label="Promo code"
          aria-invalid={!!error}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="Promo code"
          onChange={() => setError("")}
          className="h-11 min-w-0 flex-1 rounded-full border border-white/40 bg-transparent px-4 text-sm uppercase placeholder:normal-case placeholder:opacity-60"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-full border-2 border-current px-5 text-xs font-bold tracking-widest uppercase"
        >
          Apply
        </button>
      </div>
      <p role="status" className="mt-1.5 min-h-4 px-2 text-xs">
        {error || <span className="opacity-60">Try WELCOME10 for 10% off.</span>}
      </p>
    </form>
  );
}
