import type { Shoe } from "@/data";
import { env } from "@/lib/env";

export const absoluteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

export const shoePath = (shoe: Shoe) => `/shoes/${shoe.slug}`;

/** schema.org Product + Offer for rich results. */
export function productJsonLd(shoe: Shoe) {
  const inStock = shoe.sizes.some((s) => !shoe.soldOut.includes(s));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: shoe.name,
    description: shoe.description,
    sku: `SHOE-${String(shoe.id).padStart(3, "0")}`,
    category: shoe.category,
    color: shoe.colorway,
    image: [absoluteUrl(shoe.image.src)],
    brand: { "@type": "Brand", name: env.NEXT_PUBLIC_SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(shoePath(shoe)),
      price: (shoe.price / 100).toFixed(2),
      priceCurrency: shoe.currency,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
