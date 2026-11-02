export interface Palette {
  /** Page / stage background */
  bg: string;
  /** Deeper tone for gradients, shadows and the drawer */
  bgDark: string;
  /** Buttons, cursor, highlights */
  accent: string;
  /** Foreground text on bg */
  text: string;
}

/** Hand-tuned hints that normalise how each photo sits on the showcase stage. */
export interface StageHint {
  /** degrees, applied on top of the entrance animation */
  rotate: number;
  /** multiplier on the auto-fit size */
  scale: number;
  /** vertical offset as a fraction of the stage height (-1..1) */
  offsetY: number;
  flipX: boolean;
}

export interface ShoeImage {
  /** Natural size of the largest variant */
  width: number;
  height: number;
  aspect: number;
  /** Available widths, ascending */
  widths: number[];
  /** Tiny base64 placeholder */
  blur: string;
  /** Build "<url> <w>w, ..." strings per format */
  srcSet: { avif: string; webp: string; png: string };
  /** Largest PNG, used as the <img> fallback and for OG images */
  src: string;
}

export type ShoeCategory = "Platform" | "Lifestyle" | "Court" | "Runner" | "Mid-top" | "Dress";

export interface Shoe {
  /** The number of the source image (1, 2, ... 11) */
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ShoeCategory;
  /** minor units (cents) */
  price: number;
  currency: string;
  sizes: number[];
  /** sizes that are out of stock */
  soldOut: number[];
  colorway: string;
  palette: Palette;
  stage: StageHint;
  image: ShoeImage;
  /** extracted from the photo, kept for debugging / auto themes */
  colors: { dominant: string; secondary: string };
}
