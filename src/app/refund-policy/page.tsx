import type { Metadata } from "next";
import { LegalDoc } from "@/components/ui/LegalDoc";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "30-day returns: what qualifies, how to send a pair back, and when you are refunded.",
};

export default function RefundPolicyPage() {
  return (
    <LegalDoc
      title="Refund policy"
      updated="November 2026"
      intro="Try the shoes on at home. If they are not right, send them back within 30 days."
      sections={[
        {
          heading: "30-day returns",
          body: [
            "You can return a pair within 30 days of delivery for a refund or exchange, as long as it is unworn, undamaged and in its original box.",
          ],
        },
        {
          heading: "How to return",
          body: [
            `Contact us at ${SITE.email} or on WhatsApp (${SITE.whatsappDisplay}) with your order number. We will send a prepaid return label. Pack the pair in the original box with the slip and drop it at any collection point.`,
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Once we receive and check the pair we refund the original payment method within 5 working days. For cash on delivery orders we will arrange a bank transfer or an exchange.",
          ],
        },
        {
          heading: "Exchanges",
          body: [
            "Need a different size or colour? Tell us when you start the return and we will reserve the new pair for you, subject to stock.",
          ],
        },
        {
          heading: "Faulty or wrong items",
          body: [
            "If your pair arrives damaged, faulty or not what you ordered, contact us within 7 days with a photo. We will replace it or refund you in full, including shipping.",
          ],
        },
        {
          heading: "What we cannot accept",
          body: ["Worn, washed or damaged pairs, and pairs returned without the original box."],
        },
      ]}
    />
  );
}
