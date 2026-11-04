export interface Promo {
  code: string;
  /** shown next to the code in the bag */
  label: string;
  /** whole percent off the subtotal */
  percent?: number;
  freeShipping?: boolean;
}

/** Demo codes, checked in the browser. Move this behind an API before taking real payments. */
const PROMOS: readonly Promo[] = [
  { code: "WELCOME10", label: "10% off", percent: 10 },
  { code: "SNEAKER15", label: "15% off", percent: 15 },
  { code: "FREESHIP", label: "Free shipping", freeShipping: true },
];

export const findPromo = (raw: string | null | undefined): Promo | null => {
  const code = raw?.trim().toUpperCase();
  return (code && PROMOS.find((p) => p.code === code)) || null;
};

/** Minor units taken off the subtotal. */
export const promoDiscount = (promo: Promo | null, subtotal: number) =>
  promo?.percent ? Math.round((subtotal * promo.percent) / 100) : 0;
