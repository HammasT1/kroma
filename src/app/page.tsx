import { productRepository } from "@/data";
import { HorizontalGallery } from "@/features/catalog/HorizontalGallery";
import { ProductGrid } from "@/features/catalog/ProductGrid";
import { Showcase } from "@/features/hero/Showcase";
import { RecentlyViewed } from "@/features/product/RecentlyViewed";

export default async function Home() {
  const [shoes, categories] = await Promise.all([
    productRepository.list(),
    productRepository.categories(),
  ]);
  return (
    <main id="main">
      <Showcase shoes={shoes} />
      <HorizontalGallery shoes={shoes} />
      <ProductGrid shoes={shoes} categories={categories} />
      <RecentlyViewed shoes={shoes} />
    </main>
  );
}
