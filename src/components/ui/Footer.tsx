import { env } from "@/lib/env";

export function Footer() {
  return (
    <footer className="border-line relative z-10 border-t px-4 py-16 sm:px-8">
      <p className="font-display text-[18vw] leading-[0.8] font-black uppercase sm:text-[14vw]">
        {env.NEXT_PUBLIC_SITE_NAME}
      </p>
      <p className="text-fg-muted mt-6 text-sm">
        Demo storefront. All product names are fictional.
      </p>
    </footer>
  );
}
