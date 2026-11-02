import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Delivery options, costs and how to return a pair.",
};

const options = [
  ["Standard", "2 to 4 working days", "$9 (free over $150)"],
  ["Express", "Next working day, order by 2pm", "$19"],
  ["Click & collect", "Ready in 2 hours", "Free"],
];

const steps = [
  ["Start", "Tell us the order number within 30 days of delivery."],
  ["Pack", "Put the unworn pair back in the original box with the slip."],
  ["Send", "Use the prepaid label. Drop it at any collection point."],
  ["Refund", "We refund to your original payment method within 5 working days."],
];

export default function ShippingPage() {
  return (
    <PageShell
      title="Shipping & returns"
      eyebrow="Help"
      intro="Clear costs, honest timings, and a return window long enough to actually try the shoes on."
    >
      <Reveal>
        <h2 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-6xl">
          Delivery
        </h2>
        <div className="border-line mt-6 max-w-3xl overflow-hidden rounded-3xl border">
          <table className="w-full text-left">
            <caption className="sr-only">Delivery options</caption>
            <thead className="bg-bg-dark text-on-dark text-xs tracking-[0.2em] uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Option
                </th>
                <th scope="col" className="px-5 py-3">
                  Speed
                </th>
                <th scope="col" className="px-5 py-3">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {options.map(([a, b, c]) => (
                <tr key={a} className="border-line border-t">
                  <th scope="row" className="px-5 py-4 font-semibold">
                    {a}
                  </th>
                  <td className="text-fg-muted px-5 py-4">{b}</td>
                  <td className="px-5 py-4 tabular-nums">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-6xl">
          Returns in four steps
        </h2>
        <ol className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          {steps.map(([t, d], i) => (
            <li key={t} className="border-line flex gap-4 rounded-3xl border p-5">
              <span
                aria-hidden
                className="text-stroke-current font-display text-5xl leading-none font-black"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="text-fg-muted mt-1 leading-relaxed">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </PageShell>
  );
}
