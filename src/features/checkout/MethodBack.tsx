"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { formatPrecise } from "@/lib/format";
import type { Method } from "./methods";
import type { MethodId } from "./types";

const input =
  "h-11 w-full rounded-lg border border-white/30 bg-white/10 px-3 text-base text-white placeholder:text-white/60 outline-none focus:border-white";

const groups4 = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
const expiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const BANKS = ["Northwind Bank", "Harbor Credit Union", "Meridian Trust", "Alpine Savings"];

/** Back face of a payment card: the actual "checkout" for that method (demo only, nothing is sent). */
export function MethodBack({
  method,
  total,
  currency,
  paying,
  onBack,
  onPay,
}: {
  method: Method;
  total: number;
  currency: string;
  paying: boolean;
  onBack: () => void;
  onPay: (detail: string) => void;
}) {
  const [num, setNum] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [phone, setPhone] = useState("");
  const [ref] = useState(() => `KR-${Math.floor(1000 + Math.random() * 9000)}`);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const detail: Record<MethodId, string> = {
      card: `Card •••• ${num.replace(/\D/g, "").slice(-4) || "0000"}`,
      wallet: `Wallet ${String(f.get("wallet") ?? "").slice(0, 2)}•••`,
      bank: `${bank} · ref ${ref}`,
      cod: `Pay on delivery · ${phone.slice(-3).padStart(phone.length, "•")}`,
      later: `4 × ${formatPrecise(Math.round(total / 4), currency)}`,
    };
    onPay(detail[method.id]);
  };

  const pay = formatPrecise(total, currency);
  const quarter = formatPrecise(Math.round(total / 4), currency);

  return (
    <form onSubmit={submit} className="flex h-full flex-col" aria-label={`Pay with ${method.name}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-3xl leading-none font-extrabold uppercase">
          {method.name}
        </h3>
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          className="text-xs font-bold tracking-widest text-white/80 uppercase underline-offset-4 hover:underline disabled:opacity-40"
        >
          ← Change
        </button>
      </div>

      <fieldset
        disabled={paying}
        className="grid min-h-0 flex-1 content-start gap-2.5"
        data-back-field
      >
        {method.id === "card" && (
          <>
            <input
              className={input}
              name="number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Card number"
              aria-label="Card number"
              required
              minLength={19}
              value={num}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNum(groups4(e.target.value))}
            />
            <input
              className={input}
              name="holder"
              autoComplete="cc-name"
              placeholder="Name on card"
              aria-label="Name on card"
              required
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                className={input}
                name="exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                aria-label="Expiry date"
                required
                pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                onChange={(e) => (e.target.value = expiry(e.target.value))}
              />
              <input
                className={input}
                name="cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                aria-label="Security code"
                required
                pattern="[0-9]{3,4}"
                maxLength={4}
              />
            </div>
          </>
        )}
        {method.id === "wallet" && (
          <>
            <input
              className={input}
              name="wallet"
              autoComplete="tel"
              placeholder="Wallet phone or email"
              aria-label="Wallet phone or email"
              required
            />
            <p className="text-sm text-white/80">
              You will get an approval prompt on your device. Demo: approval is simulated.
            </p>
          </>
        )}
        {method.id === "bank" && (
          <>
            <select
              className={input}
              name="bank"
              aria-label="Your bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              {BANKS.map((b) => (
                <option key={b} className="text-black">
                  {b}
                </option>
              ))}
            </select>
            <input
              className={input}
              name="holder"
              autoComplete="name"
              placeholder="Account holder"
              aria-label="Account holder"
              required
            />
            <p className="text-sm text-white/80">
              Payment reference: <strong className="tracking-widest">{ref}</strong>
            </p>
          </>
        )}
        {method.id === "cod" && (
          <>
            <input
              className={input}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Phone for the courier"
              aria-label="Phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className={input}
              name="note"
              placeholder="Delivery note (optional)"
              aria-label="Delivery note"
            />
            <p className="text-sm text-white/80">
              Have {pay} ready. Card or cash accepted by the courier.
            </p>
          </>
        )}
        {method.id === "later" && (
          <>
            <div className="grid grid-cols-4 gap-2" aria-label="Payment schedule">
              {["Today", "2 wks", "4 wks", "6 wks"].map((w, i) => (
                <div key={w} className="rounded-lg bg-white/10 p-2 text-center">
                  <span
                    className="mx-auto mb-1 block h-1.5 rounded-full"
                    style={{ background: method.bar, opacity: 1 - i * 0.18 }}
                  />
                  <p className="text-sm font-bold tabular-nums">{quarter}</p>
                  <p className="text-[11px] text-white/70">{w}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-2 text-sm text-white/90">
              <input type="checkbox" required className="mt-1 h-4 w-4 accent-white" />I agree to the
              4 payments above (demo).
            </label>
          </>
        )}
      </fieldset>

      {paying ? (
        <div role="status" className="relative mt-3 h-12 overflow-hidden rounded-full bg-white/15">
          <span
            className="absolute inset-0 origin-left"
            style={{ background: method.bar, animation: "pay-fill 1.8s ease-in-out forwards" }}
          />
          <span className="relative grid h-full place-items-center text-sm font-bold tracking-widest text-[#0b0b10] uppercase">
            Processing…
          </span>
        </div>
      ) : (
        <button
          type="submit"
          className="mt-3 h-12 rounded-full text-sm font-bold tracking-[0.15em] text-[#0b0b10] uppercase"
          style={{ background: method.bar }}
        >
          {method.id === "later"
            ? `Pay ${quarter} today`
            : method.id === "cod"
              ? "Confirm order"
              : `Pay ${pay}`}
        </button>
      )}
    </form>
  );
}
