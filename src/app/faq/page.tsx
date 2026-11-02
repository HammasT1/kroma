import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Sizing, delivery, returns and payments: quick answers.",
};

const faqs = [
  {
    q: "How do I find my size?",
    a: "Pick a size on any product page and the shoe resizes with a measuring bar and the matching foot length in centimetres. If you are between sizes, go up half a step for the chunkier pairs and stay true for the low profiles.",
  },
  {
    q: "Can I return a pair?",
    a: "Yes. You have 30 days from delivery to send unworn pairs back in the original box. We refund to your original payment method within 5 working days of receiving them.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery is 2 to 4 working days. Express is next working day for orders placed before 2pm. Orders over $150 ship free on standard.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cards, wallets, bank transfer, cash on delivery and a pay-in-4 plan with no fees. This demo store simulates all of them; nothing is charged.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Within one hour of placing it, yes. After that the pair is already being packed, but you can still return it once it arrives.",
  },
  {
    q: "How should I clean suede and leather?",
    a: "Brush suede dry with a soft brush and use a protector spray before the first wear. Wipe leather with a damp cloth and let it air dry away from heat.",
  },
  {
    q: "Do you restock sold-out sizes?",
    a: "Often, yes. Sold-out sizes are shown crossed out on the product page. Save the pair to your wishlist and check back.",
  },
  {
    q: "Is my data safe?",
    a: "This is a demonstration shop. The bag and wishlist live only in your browser, and the checkout never sends anything anywhere.",
  },
];

export default function FaqPage() {
  return (
    <PageShell
      title="FAQ"
      eyebrow="Help"
      intro="Quick answers. Still stuck? The shipping and returns page has the details."
    >
      <div className="border-line max-w-3xl divide-y divide-[color:var(--line,rgba(0,0,0,0.2))] border-y">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-current transition-transform duration-300 group-open:rotate-45"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </span>
            </summary>
            <p className="text-fg-muted mt-3 max-w-2xl leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-10">
        More detail on delivery times and returns:{" "}
        <TransitionLink href="/shipping" className="font-semibold underline underline-offset-4">
          Shipping &amp; returns
        </TransitionLink>
      </p>
    </PageShell>
  );
}
