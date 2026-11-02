"use client";

import { useState, type ReactNode } from "react";
import type { Palette } from "@/data/types";
import { useThemeStore } from "./themeStore";

/** Seeds the theme store synchronously so the first client render already knows the palettes. */
export function ThemeProvider({
  palettes,
  children,
}: {
  palettes: Palette[];
  children: ReactNode;
}) {
  useState(() => useThemeStore.getState().init(palettes, 0));
  return children;
}
