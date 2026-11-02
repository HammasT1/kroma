"use client";

import { useUiStore } from "@/lib/uiStore";

export function SearchButton() {
  const open = useUiStore((s) => s.setSearchOpen);
  return (
    <button
      type="button"
      onClick={() => open(true)}
      aria-label="Search (press /)"
      className="grid h-11 w-11 place-items-center rounded-full"
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
    </button>
  );
}
