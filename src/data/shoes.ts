import generated from "./generated/shoes.assets.json";
import { defaultSizes, seed } from "./catalog.seed";
import { palettes } from "./palettes";
import type { ProductRepository } from "./repository";
import type { Shoe, ShoeCategory, StageHint } from "./types";

interface GeneratedShoe {
  id: number;
  source: string;
  width: number;
  height: number;
  aspect: number;
  widths: number[];
  blur: string;
  colors: { dominant: string; secondary: string };
  suggestedPalette: { bg: string; bgDark: string; accent: string; text: string };
}

const DEFAULT_STAGE: StageHint = { rotate: 0, scale: 1, offsetY: 0, flipX: false };
const CURRENCY = "USD";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const srcSetFor = (id: number, widths: number[], ext: string) =>
  widths.map((w) => `/shoes/shoe-${id}-${w}.${ext} ${w}w`).join(", ");

function build(g: GeneratedShoe): Shoe {
  const entry = seed[g.id];
  const name = entry?.name ?? `Model ${String(g.id).padStart(2, "0")}`;
  const largest = g.widths[g.widths.length - 1];
  return {
    id: g.id,
    slug: slugify(name),
    name,
    tagline: entry?.tagline ?? "New arrival.",
    description:
      entry?.description ?? "A new arrival. Add details for this pair in src/data/catalog.seed.ts.",
    category: entry?.category ?? "Lifestyle",
    price: (entry?.price ?? 130) * 100,
    currency: CURRENCY,
    sizes: entry?.sizes ?? defaultSizes,
    soldOut: entry?.soldOut ?? [],
    colorway: entry?.colorway ?? "Original",
    palette: palettes[g.id] ?? g.suggestedPalette,
    stage: { ...DEFAULT_STAGE, ...entry?.stage },
    colors: g.colors,
    image: {
      width: g.width,
      height: g.height,
      aspect: g.aspect,
      widths: g.widths,
      blur: g.blur,
      srcSet: {
        avif: srcSetFor(g.id, g.widths, "avif"),
        webp: srcSetFor(g.id, g.widths, "webp"),
        png: srcSetFor(g.id, g.widths, "png"),
      },
      src: `/shoes/shoe-${g.id}-${largest}.png`,
    },
  };
}

const all: Shoe[] = (generated.shoes as GeneratedShoe[]).map(build).sort((a, b) => a.id - b.id);

export class LocalRepository implements ProductRepository {
  async list() {
    return all;
  }
  async getById(id: number) {
    return all.find((s) => s.id === id) ?? null;
  }
  async getBySlug(slug: string) {
    return all.find((s) => s.slug === slug) ?? null;
  }
  async related(slug: string, limit = 4) {
    const current = all.find((s) => s.slug === slug);
    const others = all.filter((s) => s.slug !== slug);
    others.sort(
      (a, b) =>
        Number(b.category === current?.category) - Number(a.category === current?.category) ||
        Math.abs(a.id - (current?.id ?? 0)) - Math.abs(b.id - (current?.id ?? 0)),
    );
    return others.slice(0, limit);
  }
  async categories() {
    return [...new Set(all.map((s) => s.category))] as ShoeCategory[];
  }
}
