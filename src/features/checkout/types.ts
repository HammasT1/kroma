import type { CartLine } from "@/features/cart/cartStore";

export type MethodId = "card" | "wallet" | "bank" | "cod" | "later";

export interface Details {
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
}

export interface PaidInfo {
  method: MethodId;
  methodName: string;
  /** e.g. "Card •••• 4242" */
  detail: string;
}

export interface Order {
  id: string;
  placedAt: string;
  lines: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  details: Details;
  payment: PaidInfo;
}
