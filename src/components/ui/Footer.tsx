import { env } from "@/lib/env";
import { SITE, whatsappLink } from "@/lib/site";
import { Newsletter } from "./Newsletter";
import { TransitionLink } from "./TransitionLink";

const columns = [
  {
    title: "Shop",
    links: [
      ["Collection", "/#collection"],
      ["All pairs", "/#shop"],
      ["Wishlist", "/wishlist"],
      ["Bag & checkout", "/checkout"],
    ],
  },
  {
    title: "Help",
    links: [
      ["FAQ", "/faq"],
      ["Shipping & returns", "/shipping"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Privacy policy", "/privacy"],
      ["Terms of service", "/terms"],
      ["Refund policy", "/refund-policy"],
    ],
  },
] as const;

const perks = [
  ["Complimentary shipping", "On every order over $150"],
  ["30-day returns", "Try them on, send them back free"],
  ["Secure payment", "Cards, wallets and cash on delivery"],
] as const;

const socials = [
  ["Instagram", SITE.social.instagram],
  ["TikTok", SITE.social.tiktok],
  ["YouTube", SITE.social.youtube],
] as const;

export function Footer() {
  const name = env.NEXT_PUBLIC_SITE_NAME;
  return (
    <footer className="bg-bg-dark text-on-dark relative z-10 mt-12">
      <div className="border-b border-white/10">
        <ul className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-8">
          {perks.map(([title, text]) => (
            <li key={title}>
              <p className="text-accent text-xs font-bold tracking-[0.22em] uppercase">{title}</p>
              <p className="mt-2 text-sm text-white/70">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="font-display text-5xl font-black tracking-[0.2em] uppercase">{name}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Considered footwear, made to be worn. Join the list for early access to new pairs and
            private releases.
          </p>
          <div className="mt-8 text-white">
            <Newsletter />
          </div>
          <address className="mt-10 grid gap-2 text-sm text-white/70 not-italic">
            <p className="text-accent text-xs font-bold tracking-[0.25em] uppercase">Contact</p>
            <a href={`mailto:${SITE.email}`} className="w-fit hover:text-white">
              {SITE.email}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit hover:text-white"
            >
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <p>{SITE.address}</p>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="text-accent text-xs font-bold tracking-[0.25em] uppercase">
                {c.title}
              </h2>
              <ul className="mt-5 grid gap-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <TransitionLink
                      href={href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Social" className="col-span-2 sm:col-span-3">
            <h2 className="text-accent text-xs font-bold tracking-[0.25em] uppercase">Follow</h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {socials.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {name}. Demo storefront, all product names are fictional.
          </p>
          <p className="tracking-[0.18em] uppercase">Visa · Mastercard · Apple Pay · COD</p>
        </div>
      </div>
    </footer>
  );
}
