import type { MetadataRoute } from "next";
import { productRepository } from "@/data";
import { absoluteUrl, shoePath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shoes = await productRepository.list();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...shoes.map((s) => ({
      url: absoluteUrl(shoePath(s)),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
