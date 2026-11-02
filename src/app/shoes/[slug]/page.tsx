import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productRepository } from "@/data";
import { ProductDetail } from "@/features/product/ProductDetail";
import { RelatedRow } from "@/features/product/RelatedRow";
import { cssVars } from "@/lib/theme";
import { absoluteUrl, productJsonLd, shoePath } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await productRepository.list()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const shoe = await productRepository.getBySlug((await params).slug);
  if (!shoe) return {};
  const title = `${shoe.name}: ${shoe.colorway} ${shoe.category}`;
  return {
    title,
    description: shoe.description,
    alternates: { canonical: absoluteUrl(shoePath(shoe)) },
    openGraph: {
      title,
      description: shoe.description,
      type: "website",
      url: absoluteUrl(shoePath(shoe)),
    },
    twitter: { card: "summary_large_image", title, description: shoe.description },
  };
}

export default async function ShoePage({ params }: Params) {
  const { slug } = await params;
  const [shoe, all] = await Promise.all([
    productRepository.getBySlug(slug),
    productRepository.list(),
  ]);
  if (!shoe) notFound();
  const related = await productRepository.related(slug, 4);
  const themeIndex = all.findIndex((s) => s.id === shoe.id);

  // Paint this shoe's palette from the first byte on direct loads (layout can't see the slug).
  const themeCss = `:root{${cssVars(shoe.palette)}}`;

  return (
    <main id="main">
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(shoe)).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetail shoe={shoe} themeIndex={themeIndex} />
      <RelatedRow shoes={related} />
    </main>
  );
}
