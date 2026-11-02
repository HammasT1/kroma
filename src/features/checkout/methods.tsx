import type { ReactNode } from "react";
import type { MethodId } from "./types";

export interface Method {
  id: MethodId;
  name: string;
  tagline: string;
  /** card face background */
  gradient: string;
  /** readable text color on the gradient */
  ink: string;
  /** accent bar on the back face */
  bar: string;
}

// Original, generic payment types (no third-party brand names or marks).
export const methods: Method[] = [
  {
    id: "card",
    name: "Card",
    tagline: "Credit or debit",
    gradient: "linear-gradient(135deg,#0f0c29 0%,#302b63 55%,#5b3cc4 100%)",
    ink: "#ffffff",
    bar: "#8b7cf6",
  },
  {
    id: "wallet",
    name: "Wallet",
    tagline: "One-tap approval",
    gradient: "linear-gradient(135deg,#be185d 0%,#7e1d4f 100%)",
    ink: "#ffffff",
    bar: "#f472b6",
  },
  {
    id: "bank",
    name: "Bank transfer",
    tagline: "Pay from your bank",
    gradient: "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
    ink: "#ffffff",
    bar: "#5eead4",
  },
  {
    id: "cod",
    name: "Cash on delivery",
    tagline: "Pay when it arrives",
    gradient: "linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%)",
    ink: "#1b1200",
    bar: "#fbbf24",
  },
  {
    id: "later",
    name: "Pay in 4",
    tagline: "Split into 4, no fees",
    gradient: "linear-gradient(135deg,#0369a1 0%,#1d4ed8 100%)",
    ink: "#ffffff",
    bar: "#38bdf8",
  },
];

const svg = (children: ReactNode) => (
  <svg
    viewBox="0 0 32 32"
    width="32"
    height="32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

export const icons: Record<MethodId, ReactNode> = {
  card: svg(
    <>
      <rect x="3" y="7" width="26" height="18" rx="3" />
      <path d="M3 13h26M8 20h6" />
    </>,
  ),
  wallet: svg(
    <>
      <path d="M5 9h19a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9Zm0 0 16-4v4" />
      <circle cx="22" cy="18" r="1.5" fill="currentColor" />
    </>,
  ),
  bank: svg(
    <>
      <path d="M3 12 16 5l13 7M6 13v10M12 13v10M20 13v10M26 13v10M4 26h24" />
    </>,
  ),
  cod: svg(
    <>
      <path d="M3 9h16v13H3zM19 13h6l4 4v5h-10" />
      <circle cx="9" cy="24" r="2.5" />
      <circle cx="24" cy="24" r="2.5" />
    </>,
  ),
  later: svg(
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M16 4v12h12" />
    </>,
  ),
};
