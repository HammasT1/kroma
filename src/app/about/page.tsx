import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why KROMA exists: eleven pairs, eleven moods, and a store that changes color with every shoe.",
};

const values = [
  {
    n: "01",
    t: "Color first",
    d: "Every pair gets its own palette and the whole store follows it. We pick shoes that deserve a room of their own.",
  },
  {
    n: "02",
    t: "Small on purpose",
    d: "Eleven pairs. No endless scroll, no filler. If it is in the collection, someone argued for it.",
  },
  {
    n: "03",
    t: "Honest details",
    d: "Real sizes, real foot lengths, clear returns. We would rather lose a sale than send the wrong fit.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      eyebrow="KROMA"
      intro="KROMA is a small footwear shop built around one idea: a shoe is a mood, so the store around it should change with it."
    >
      <Reveal as="ul" stagger={0.12} className="grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <li key={v.n} className="border-line rounded-3xl border p-6">
            <p
              aria-hidden
              className="text-stroke-current font-display text-6xl leading-none font-black"
            >
              {v.n}
            </p>
            <h2 className="font-display mt-4 text-4xl leading-none font-extrabold uppercase">
              {v.t}
            </h2>
            <p className="text-fg-muted mt-3 leading-relaxed">{v.d}</p>
          </li>
        ))}
      </Reveal>

      <Reveal className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          ["11", "pairs in the collection"],
          ["8", "sizes per pair, EU 38 to 45"],
          ["30", "day returns"],
        ].map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-8xl leading-none font-black sm:text-9xl">{n}</p>
            <p className="text-fg-muted mt-2">{l}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-16 flex flex-wrap gap-3">
        <TransitionLink
          href="/#collection"
          className="bg-accent text-on-accent inline-flex h-12 items-center rounded-full px-8 text-sm font-bold tracking-widest uppercase"
        >
          See the collection
        </TransitionLink>
        <TransitionLink
          href="/faq"
          className="inline-flex h-12 items-center rounded-full border-2 border-current px-8 text-sm font-bold tracking-widest uppercase"
        >
          Questions?
        </TransitionLink>
      </Reveal>
    </PageShell>
  );
}
