"use client";

import { LazyMotion, type FeatureBundle } from "framer-motion";
import type { ReactNode } from "react";

// Framer's animation engine loads after hydration, off the critical path. Use `m.*`, not `motion.*`.
const loadFeatures = () => import("./motionFeatures").then((mod) => mod.default as FeatureBundle);

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
