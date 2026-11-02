# KROMA: animation-first shoe store

Next.js (App Router) + TypeScript (strict) + Tailwind 4, GSAP + ScrollTrigger, Lenis, Framer Motion, Zustand.
Every shoe, palette, route and OG image is generated from the numbered photos in `Assets/`.

```bash
npm install
npm run dev        # runs the asset pipeline first (incremental), then Next
npm run build      # asset pipeline + palette contrast check + production build
npm run lint && npm run typecheck
```

## Adding shoes (numbered images)

1. Drop `12.png` (or `.jpg`, `.jpeg`, `.webp`, `.avif`) into `Assets/` (an `assets/` folder works too). Numbers sort numerically; originals are never renamed or modified.
2. Run `npm run assets` (or just `npm run dev` / `npm run build`). The pipeline:
   - keeps existing transparency, or removes a flat/white background if the image is opaque,
   - trims empty margins, exports AVIF + WebP + PNG at up to 3 widths to `public/shoes/`,
   - writes a blur placeholder, dominant/secondary colors and a suggested palette to `src/data/generated/shoes.assets.json`.
3. The new shoe appears everywhere (hero, gallery, grid, `/shoes/<slug>`, sitemap, OG image). Until you add copy it is named "Model 12" with a palette auto-derived from the photo.
4. Optional polish:
   - `src/data/catalog.seed.ts`: name, tagline, description, category, price, sizes, sold-out sizes, `stage` hints (`scale`, `offsetY`, `rotate`) for how the photo sits in the hero.
   - `src/data/palettes.ts`: hand-tuned `{ bg, bgDark, accent, text }`. `npm run assets` fails if a palette is below WCAG AA (text/bg 4.5, accent/bg 3).
   - `scripts/asset-overrides.json`: per-image pipeline options, e.g. `{ "10": { "despeckle": 6 } }` removes thin hanging threads (the number is the blur sigma).

Re-runs skip unchanged images; `npm run assets -- --force` rebuilds everything.

## Architecture

```
scripts/            prepare-assets.mjs (sharp), check-palettes.mjs, asset-overrides.json
src/data/           types, palettes, seed copy, ProductRepository + LocalRepository, generated/ JSON
src/features/
  hero/             Showcase (pinned stage, scroll/swipe/keys/buttons), ShoeImage (<picture>)
  theme/            themeStore + useShoeTheme (CSS-variable tweening), ColorWipe, Cursor, NoiseOverlay
  catalog/          HorizontalGallery (velocity skew), ProductGrid, ProductCard (+ quick add)
  product/          ProductDetail, SizeSelector, RelatedRow, sharedElement (FLIP flight), flyToCart
  cart/             cartStore (persisted), CartDrawer, CheckoutStub
src/components/ui/  Magnetic, TiltCard, Reveal, Preloader, SmoothScroll, TransitionLink, Nav, Footer
src/hooks/          useGsapTimeline, useReducedMotion
src/lib/            gsap (single plugin registration), lenis, color (WCAG), theme, seo, env, format
```

- **Data layer.** UI only talks to `productRepository` (`src/data/index.ts`). To move to Shopify, Medusa, Stripe or a CMS, implement `ProductRepository` (`src/data/repository.ts`) and change that one export. Components never import the JSON or seed files.
- **Theme.** `useShoeTheme().setActive(i, origin?)` tweens `--bg --bg-dark --accent --fg --on-dark --on-accent` on `<html>` (power3.inOut, 0.9s). With an `origin` it also requests the radial `ColorWipe`; the page background variables commit when the wipe lands.
- **Animation hygiene.** Plugins register once in `src/lib/gsap.ts`. Components animate inside `gsap.context()` and revert on cleanup (Strict Mode safe). Anything that must survive a context revert (theme changes) is called outside it. Layout-affecting properties are never animated; only `transform` and `opacity`, apart from the palette variables.
- **Shared element.** `TransitionLink` clones the source image to `<body>` (`startShared`), the product page lands it on its slot (`landShared`) while the theme wipes from the shoe's position. Reduced motion skips the flight.
- **Env.** `src/lib/env.ts` validates `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_NAME` (see `.env.example`). Add server secrets there when a backend arrives.
- **Cart.** Zustand + localStorage (hydrated after mount). Checkout is a stub: it validates a form, clears the bag and shows a demo confirmation. No payment or data leaves the browser.

## Accessibility and motion

`prefers-reduced-motion` turns off Lenis, pinned animation timing, tilt, magnetic pull, the cursor and the color wipe; navigation still works with buttons and arrow keys. Keyboard: arrow keys drive the hero, radios for sizes, focus trap + Esc in the bag, skip link. axe (WCAG 2.1 AA) reports no violations on home, product, drawer and checkout.

## Notes

- Product photos contain third-party logos. UI copy and names are fictional and brand-free; replace the photography before any real launch.
- Shoes render through `<picture>` with pre-generated AVIF/WebP/PNG instead of `next/image` to avoid re-encoding transparent art at runtime.
