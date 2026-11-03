import { PageShell } from "./PageShell";

export interface LegalSection {
  heading: string;
  body: string[];
}

/** Long-form policy page: a PageShell with readable numbered sections. */
export function LegalDoc({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <PageShell title={title} eyebrow="Legal" intro={intro}>
      <div className="max-w-3xl space-y-10">
        <p className="text-fg-muted text-sm">Last updated {updated}</p>
        {sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`legal-${i}`}>
            <h2
              id={`legal-${i}`}
              className="font-display text-3xl leading-none font-extrabold uppercase sm:text-4xl"
            >
              {i + 1}. {s.heading}
            </h2>
            <div className="text-fg-muted mt-4 space-y-3 leading-relaxed">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
