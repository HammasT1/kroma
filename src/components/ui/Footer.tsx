import { env } from "@/lib/env";
import { TransitionLink } from "./TransitionLink";

const columns = [
  {
    title: "Shop",
    links: [
      ["Collection", "/#collection"],
      ["All pairs", "/#shop"],
      ["Wishlist", "/wishlist"],
    ],
  },
  {
    title: "Help",
    links: [
      ["FAQ", "/faq"],
      ["Shipping & returns", "/shipping"],
      ["Checkout", "/checkout"],
    ],
  },
  { title: "KROMA", links: [["About", "/about"]] },
] as const;

export function Footer() {
  return (
    <footer className="border-line relative z-10 border-t px-4 py-16 sm:px-8">
      <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <p className="font-display text-[18vw] leading-[0.8] font-black uppercase sm:text-[9vw]">
          {env.NEXT_PUBLIC_SITE_NAME}
        </p>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase">{c.title}</h2>
            <ul className="mt-4 grid gap-2">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <TransitionLink
                    href={href}
                    className="text-fg-muted hover:text-fg underline-offset-4 hover:underline"
                  >
                    {label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="text-fg-muted mt-12 text-sm">
        Demo storefront. All product names are fictional.
      </p>
    </footer>
  );
}
