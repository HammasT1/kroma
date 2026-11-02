import type { Metadata } from "next";
import { CheckoutFlow } from "@/features/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main id="main" className="relative z-10 px-4 pt-28 pb-24 sm:px-8">
      <CheckoutFlow />
    </main>
  );
}
