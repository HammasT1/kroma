"use client";

import { useSyncExternalStore } from "react";
import { MOTION_KEY, motionForcedOff, useSystemReducedMotion } from "@/hooks/useReducedMotion";

const noopSubscribe = () => () => {};

/** Footer switch for animations. Reloads once, because GSAP, smooth scroll and the cursor set up at load. */
export function MotionToggle() {
  const forced = useSyncExternalStore(noopSubscribe, motionForcedOff, () => false);
  const system = useSystemReducedMotion();

  const toggle = () => {
    try {
      if (forced) localStorage.removeItem(MOTION_KEY);
      else localStorage.setItem(MOTION_KEY, "reduced");
    } catch {}
    window.location.reload();
  };

  if (system) {
    return <p>Animations are off (device setting)</p>;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={forced}
      onClick={toggle}
      className="inline-flex items-center gap-2 tracking-[0.18em] uppercase hover:text-white"
    >
      <span
        aria-hidden
        className={`relative h-4 w-7 rounded-full transition-colors ${forced ? "bg-white" : "bg-white/30"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-black transition-transform ${forced ? "translate-x-3" : "bg-white!"}`}
        />
      </span>
      Reduce motion
    </button>
  );
}
