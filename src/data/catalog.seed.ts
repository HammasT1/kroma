import type { ShoeCategory, StageHint } from "./types";

export interface SeedEntry {
  name: string;
  tagline: string;
  description: string;
  category: ShoeCategory;
  /** whole currency units */
  price: number;
  colorway: string;
  sizes?: number[];
  soldOut?: number[];
  stage?: Partial<StageHint>;
}

const SIZES = [38, 39, 40, 41, 42, 43, 44, 45];

/**
 * Editorial copy per image number. Edit freely: names are fictional.
 * New numbered images without an entry get a generated placeholder (see shoes.ts).
 */
export const seed: Record<number, SeedEntry> = {
  1: {
    name: "Obsidian Loft",
    tagline: "Stacked, grained, unapologetic.",
    description:
      "A tall cloud of white midsole under pebbled black leather and suede overlays. Built to add height and take attention.",
    category: "Platform",
    price: 148,
    colorway: "Black / Chalk",
  },
  2: {
    name: "Bloom Atlas",
    tagline: "A garden you can lace up.",
    description:
      "Crackle-print floral leather on a clean white wedge. A derby that treats formal and playful as the same thing.",
    category: "Lifestyle",
    price: 132,
    colorway: "Lagoon / Poppy",
    soldOut: [38, 45],
  },
  3: {
    name: "Glacier Low",
    tagline: "Cold, calm, quietly layered.",
    description:
      "One steel-blue tone, three layers of texture. A low-top with a stepped upper and a deep-tread sole.",
    category: "Court",
    price: 118,
    colorway: "Steel Blue",
  },
  4: {
    name: "Redline Court",
    tagline: "Loud colors, flat out.",
    description:
      "Gloss red, black and white panels with flat black laces. A court silhouette with a heel that bites back.",
    category: "Court",
    price: 139,
    colorway: "Red / Black / White",
  },
  5: {
    name: "Dune Drift",
    tagline: "Soft suede, loose laces.",
    description:
      "A tan suede mid-top with a padded collar and tonal laces long enough to have opinions.",
    category: "Mid-top",
    price: 126,
    colorway: "Tan / Bone",
    stage: { scale: 1.2, offsetY: -0.08 },
    soldOut: [39],
  },
  6: {
    name: "Paper Pace",
    tagline: "White, then a flash of red.",
    description:
      "Crisp white leather, a mesh panel and a single red line along the sole. The everyday pair that never asks for attention.",
    category: "Lifestyle",
    price: 124,
    colorway: "White / Ink / Red",
  },
  7: {
    name: "Skyline Lift",
    tagline: "Sky-washed and weightless.",
    description:
      "A gradient of pale and cobalt blue over white leather, with laces that float like they forgot gravity.",
    category: "Lifestyle",
    price: 136,
    colorway: "Sky / White",
    stage: { scale: 1.4, offsetY: -0.16 },
  },
  8: {
    name: "Ink Denim",
    tagline: "Washed down, built up.",
    description:
      "Black washed denim with contrast stitching, a metal-ring tab and a cream sole that has seen some miles.",
    category: "Mid-top",
    price: 129,
    colorway: "Black / Cream",
    soldOut: [44],
  },
  9: {
    name: "Mono Runner",
    tagline: "Retro lines, modern layers.",
    description:
      "A layered runner in black, grey and white: mesh, suede and a stacked midsole with a rugged lug outsole.",
    category: "Runner",
    price: 156,
    colorway: "Black / Grey / Sail",
  },
  10: {
    name: "Cobalt Gum",
    tagline: "Royal blue on a gum sole.",
    description:
      "Deep blue leather and nylon, an oversized white overlay and a classic gum outsole. A court shoe with swagger.",
    category: "Court",
    price: 134,
    colorway: "Cobalt / White / Gum",
  },
  11: {
    name: "Cocoa Brogue",
    tagline: "Heritage, with a red-brown sole.",
    description:
      "Chocolate suede with full wingtip broguing, waxed laces and a rust-red sole. The smart option, taken off-road.",
    category: "Dress",
    price: 168,
    colorway: "Chocolate / Rust",
  },
};

export const defaultSizes = SIZES;
