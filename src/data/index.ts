import { LocalRepository } from "./shoes";
import type { ProductRepository } from "./repository";

/** Change this one line to point the whole site at another backend. */
export const productRepository: ProductRepository = new LocalRepository();

export type { ProductRepository } from "./repository";
export type { Shoe, Palette, ShoeCategory, ShoeImage, StageHint } from "./types";
