import type { Shoe, ShoeCategory } from "./types";

/**
 * The only door UI code uses to reach product data.
 * Swap `LocalRepository` (src/data/shoes.ts) for Shopify, Medusa, Stripe or a headless CMS
 * by implementing this interface and changing the export in src/data/index.ts.
 */
export interface ProductRepository {
  list(): Promise<Shoe[]>;
  getById(id: number): Promise<Shoe | null>;
  getBySlug(slug: string): Promise<Shoe | null>;
  /** Other shoes to suggest next to `slug`, closest category first. */
  related(slug: string, limit?: number): Promise<Shoe[]>;
  categories(): Promise<ShoeCategory[]>;
}
