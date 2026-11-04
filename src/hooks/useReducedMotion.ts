"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** localStorage key for the in-site "reduce motion" switch (applied before paint by a head script). */
export const MOTION_KEY = "kroma-motion";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True when the visitor turned motion off on the site itself. */
export const motionForcedOff = () =>
  typeof document !== "undefined" && document.documentElement.dataset.motion === "reduced";

const systemReduced = () => window.matchMedia(QUERY).matches;

/** True when the user asked the OS for less motion. Server render assumes motion is fine. */
export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, systemReduced, () => false);
}

/** True when the OS or the site switch asks for less motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => systemReduced() || motionForcedOff(),
    () => false,
  );
}

/** Non-hook read for use inside event handlers and timelines. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && (systemReduced() || motionForcedOff());
