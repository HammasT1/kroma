import type { Metadata } from "next";
import { LegalDoc } from "@/components/ui/LegalDoc";
import { env } from "@/lib/env";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms that apply when you browse and buy from our store.",
};

const name = env.NEXT_PUBLIC_SITE_NAME;

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of service"
      updated="November 2026"
      intro={`By using this website and placing an order you agree to these terms with ${name}.`}
      sections={[
        {
          heading: "Orders",
          body: [
            "Placing an order is an offer to buy. We confirm it by email or message. We may cancel an order, with a full refund, if an item is unavailable or the price was shown in error.",
          ],
        },
        {
          heading: "Prices and payment",
          body: [
            "Prices are shown on each product page and include any listed discounts. Shipping is shown at checkout. Orders over $150 ship free on standard delivery.",
            "You can pay by the methods offered at checkout, including cash on delivery where available.",
          ],
        },
        {
          heading: "Delivery",
          body: [
            "Delivery times on the Shipping page are estimates, not guarantees. Delays caused by couriers or events outside our control are not our liability, but we will help track your parcel.",
          ],
        },
        {
          heading: "Returns and refunds",
          body: ["Returns are covered by our Refund policy, which forms part of these terms."],
        },
        {
          heading: "Product information",
          body: [
            "We try to show colours and sizes accurately. Screens vary, so a colour may look slightly different in person. Use our size guide and contact us if you are unsure of your fit.",
          ],
        },
        {
          heading: "Our content",
          body: [
            "The text, images and design on this site belong to us or our licensors. Please do not copy or reuse them without permission.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "To the extent the law allows, our liability for any order is limited to the amount you paid for it. Nothing here limits rights you have under consumer law.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms: ${SITE.email}, ${SITE.address}.`],
        },
      ]}
    />
  );
}
