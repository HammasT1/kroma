import type { Shoe } from "@/data";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/features/catalog/ProductCard";

export function RelatedRow({ shoes }: { shoes: Shoe[] }) {
  if (!shoes.length) return null;
  return (
    <section aria-labelledby="related-title" className="relative z-10 px-4 py-24 sm:px-8">
      <h2
        id="related-title"
        className="font-display mb-8 text-5xl leading-[0.85] font-black uppercase sm:text-8xl"
      >
        You may also like
      </h2>
      <Reveal
        as="ul"
        stagger={0.1}
        className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4"
      >
        {shoes.map((s) => (
          <li key={s.id}>
            <ProductCard shoe={s} />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
