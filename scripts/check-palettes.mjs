#!/usr/bin/env node
// Asserts WCAG AA for every hand-tuned palette. Run by `npm run assets`.
import { contrast } from "../src/lib/color.ts";
import { palettes } from "../src/data/palettes.ts";

let failed = 0;
for (const [id, p] of Object.entries(palettes)) {
  const checks = [
    ["text/bg", contrast(p.text, p.bg), 4.5],
    ["onDark/bgDark", Math.max(contrast("#ffffff", p.bgDark), contrast("#0e0e0e", p.bgDark)), 4.5],
    ["accent/bg", contrast(p.accent, p.bg), 3],
  ];
  for (const [label, ratio, min] of checks) {
    if (ratio < min) {
      failed++;
      console.error(`[palettes] #${id} ${label} ${ratio.toFixed(2)} < ${min}`);
    }
  }
}
if (failed) {
  console.error(`[palettes] ${failed} contrast failure(s)`);
  process.exit(1);
}
console.log(`[palettes] ${Object.keys(palettes).length} palettes pass WCAG AA`);
