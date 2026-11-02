import type { ReactNode } from "react";

/** Shared frame for content pages: oversized title, optional intro, then sections. */
export function PageShell({
  title,
  eyebrow,
  intro,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="relative z-10 px-4 pt-28 pb-24 sm:px-8 sm:pt-36">
      {eyebrow && <p className="mb-3 text-xs font-bold tracking-[0.25em] uppercase">{eyebrow}</p>}
      <h1 className="font-display text-7xl leading-[0.85] font-black uppercase sm:text-[10rem]">
        {title}
      </h1>
      {intro && <p className="text-fg-muted mt-6 max-w-2xl text-lg leading-relaxed">{intro}</p>}
      <div className="mt-14">{children}</div>
    </main>
  );
}
