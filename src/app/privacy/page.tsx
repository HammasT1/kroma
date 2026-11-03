import type { Metadata } from "next";
import { LegalDoc } from "@/components/ui/LegalDoc";
import { env } from "@/lib/env";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal information we collect, why, and how to ask us to remove it.",
};

const name = env.NEXT_PUBLIC_SITE_NAME;

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy policy"
      updated="November 2026"
      intro={`How ${name} handles your personal information. We collect only what we need to deliver your order.`}
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you place an order we collect your name, phone number, email address and delivery address.",
            "If you contact us by email or WhatsApp we keep that conversation so we can help you.",
            "Your bag and wishlist are stored in your own browser. They are not sent to us.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "To process and deliver your order, send updates about it, and handle returns and refunds.",
            "To reply to your questions. If you join our email list, to send you news about new pairs. You can unsubscribe at any time.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "Only with the partners needed to complete your order, such as couriers and payment providers. We do not sell your personal information.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Card details are handled by the payment provider and are never stored on our servers. If you choose cash on delivery, you pay the courier when the parcel arrives.",
          ],
        },
        {
          heading: "Cookies and storage",
          body: [
            "We use your browser's local storage to remember your bag and wishlist. We may use basic analytics to understand which pages are useful.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            `You can ask to see, correct or delete the information we hold about you by emailing ${SITE.email}. We will reply within 14 days.`,
          ],
        },
        {
          heading: "Contact",
          body: [
            `${name}, ${SITE.address}. Email ${SITE.email} or WhatsApp ${SITE.whatsappDisplay}.`,
          ],
        },
      ]}
    />
  );
}
