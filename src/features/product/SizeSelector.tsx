"use client";

import type { Shoe } from "@/data";
import { SizeGuide } from "./SizeGuide";

export function SizeSelector({
  shoe,
  value,
  onChange,
  invalid,
}: {
  shoe: Shoe;
  value: number | null;
  onChange: (size: number) => void;
  invalid?: boolean;
}) {
  return (
    <fieldset data-size-field aria-describedby={invalid ? "size-error" : undefined}>
      <legend className="mb-3 flex w-full items-baseline justify-between text-xs font-bold tracking-[0.2em] uppercase">
        <span>Size (EU)</span>
        {invalid && (
          <span id="size-error" role="alert" className="tracking-normal normal-case">
            Pick a size first
          </span>
        )}
        <SizeGuide current={value} />
      </legend>
      <div className="flex flex-wrap gap-2">
        {shoe.sizes.map((size) => {
          const out = shoe.soldOut.includes(size);
          return (
            <label key={size} className="relative">
              <input
                type="radio"
                name="size"
                value={size}
                disabled={out}
                checked={value === size}
                onChange={() => onChange(size)}
                className="peer sr-only"
              />
              <span className="border-fg peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-accent grid h-12 min-w-12 cursor-pointer place-items-center rounded-full border-2 px-3 text-sm font-semibold tabular-nums transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-disabled:cursor-not-allowed peer-disabled:line-through peer-disabled:opacity-40">
                {size}
                {out && <span className="sr-only"> (sold out)</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
