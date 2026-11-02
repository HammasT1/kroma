export const formatPrice = (minor: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    minor / 100,
  );

/** Same as formatPrice but always shows cents (slips, installments). */
export const formatPrecise = (minor: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(minor / 100);
