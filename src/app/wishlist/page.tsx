import type { Metadata } from "next";
import { productRepository } from "@/data";
import { PageShell } from "@/components/ui/PageShell";
import { WishlistView } from "@/features/wishlist/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  const shoes = await productRepository.list();
  return (
    <PageShell title="Wishlist" intro="Pairs you've saved. They live in this browser only.">
      <WishlistView shoes={shoes} />
    </PageShell>
  );
}
