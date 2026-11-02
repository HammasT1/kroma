"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { RollingText } from "@/components/ui/RollingText";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/lib/gsap";

const MIN_SCALE = 0.82;
const MAX_SCALE = 1.12;

/** EU size to foot length (cm), Paris-point formula. */
export const footLengthCm = (eu: number) => eu / 1.5 - 1.5;

/** Maps a size to how large the shoe is drawn, relative to the size range. */
export const scaleForSize = (size: number, sizes: number[]) => {
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  if (max === min) return 1;
  return MIN_SCALE + ((size - min) / (max - min)) * (MAX_SCALE - MIN_SCALE);
};

/**
 * Wraps the shoe image and morphs it when the size changes: the shoe grows from its sole with an
 * elastic settle, a ring ripples out, the floor shadow and measuring bar stretch with it, and the
 * size label rolls like an odometer. Transform/opacity only.
 */
export function SizePreview({
  size,
  sizes,
  children,
}: {
  size: number | null;
  sizes: number[];
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  // direction of the last change, derived during render so the rolling label gets it on the same pass
  const [track, setTrack] = useState<{ size: number | null; dir: 1 | -1 }>({ size: null, dir: 1 });
  if (size !== track.size) {
    setTrack({ size, dir: track.size === null || size === null || size >= track.size ? 1 : -1 });
  }
  const dir = track.dir;

  useEffect(() => {
    const el = root.current;
    if (!el || size === null) return;
    const target = scaleForSize(size, sizes);
    const q = <T extends Element>(s: string) => el.querySelector<T>(s);
    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set(q("[data-size-scaler]"), { scale: target });
      gsap.set(q("[data-size-shadow]"), { scaleX: target, autoAlpha: 1 });
      gsap.set(q("[data-size-ruler]"), { scaleX: target, autoAlpha: 1 });
      gsap.set(q("[data-size-label]"), { autoAlpha: 1 });
      return;
    }

    const grow = dir === 1;
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    // squash, then spring to the new size
    tl.to(q("[data-size-scaler]"), {
      scaleY: target * (grow ? 0.94 : 1.05),
      scaleX: target * (grow ? 1.04 : 0.97),
      rotate: grow ? -1.5 : 1.5,
      duration: 0.14,
      ease: "power2.out",
    }).to(q("[data-size-scaler]"), {
      scale: target,
      rotate: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.45)",
    });
    tl.to(
      q("[data-size-shadow]"),
      { scaleX: target, autoAlpha: 1, duration: 0.9, ease: "elastic.out(1, 0.6)" },
      0,
    );
    tl.to(
      q("[data-size-ruler]"),
      { scaleX: target, autoAlpha: 1, duration: 0.9, ease: "elastic.out(1, 0.6)" },
      0.05,
    );
    tl.to(q("[data-size-label]"), { autoAlpha: 1, duration: 0.3 }, 0);
    // ripple ring from the sole
    tl.fromTo(
      q("[data-size-ring]"),
      { scale: 0.4, autoAlpha: 0.7 },
      { scale: 1.7, autoAlpha: 0, duration: 0.9, ease: "power2.out" },
      0,
    );
    tl.fromTo(q("[data-size-label]"), { y: 6 }, { y: 0, duration: 0.5, ease: "back.out(2)" }, 0);
  }, [size, sizes, dir]);

  const cm = size === null ? null : footLengthCm(size).toFixed(1);

  return (
    <div ref={root} className="relative">
      <div
        aria-hidden
        data-size-shadow
        className="absolute inset-x-[8%] -bottom-1 h-7 origin-center rounded-[50%] bg-black/40 opacity-0 blur-xl"
      />
      <div data-size-scaler className="relative origin-bottom will-change-transform">
        {children}
      </div>
      <div
        aria-hidden
        data-size-ring
        className="border-accent pointer-events-none absolute bottom-[8%] left-1/2 h-[38%] w-[38%] -translate-x-1/2 rounded-full border-2 opacity-0"
      />
      <div className="pointer-events-none absolute inset-x-0 -bottom-12 flex flex-col items-center gap-1">
        <div aria-hidden data-size-ruler className="relative h-3 w-full origin-center opacity-0">
          <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current opacity-60" />
          <span className="absolute top-0 left-0 h-full w-0.5 bg-current opacity-80" />
          <span className="absolute top-0 right-0 h-full w-0.5 bg-current opacity-80" />
        </div>
        <p
          data-size-label
          className="text-xs font-bold tracking-[0.2em] uppercase opacity-0"
          aria-live="polite"
        >
          {size === null ? (
            "Pick a size"
          ) : (
            <>
              EU <RollingText value={String(size)} dir={dir} className="tabular-nums" /> ·{" "}
              <RollingText value={cm ?? ""} dir={dir} className="tabular-nums" /> cm
            </>
          )}
        </p>
      </div>
    </div>
  );
}
