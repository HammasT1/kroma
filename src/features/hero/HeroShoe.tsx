"use client";

import type { Shoe } from "@/data";

const clearBlur = (img: HTMLImageElement) => {
  img.style.backgroundImage = "none";
};
/** The placeholder shows through transparent pixels, so drop it once the real image is in. */
const clearBlurWhenLoaded = (img: HTMLImageElement | null) => {
  if (img?.complete && img.naturalWidth) clearBlur(img);
};

const SIZES = "(min-width: 1024px) 50vw, 90vw";

/** Pre-optimized AVIF/WebP/PNG <picture> with an inline blur placeholder. */
export function ShoeImage({
  shoe,
  priority = false,
  preload = false,
  className,
  sizes = SIZES,
  contents = false,
}: {
  shoe: Shoe;
  priority?: boolean;
  preload?: boolean;
  className?: string;
  sizes?: string;
  /** make <picture> display:contents so percentage sizes on the <img> resolve against the parent */
  contents?: boolean;
}) {
  const { image } = shoe;
  return (
    <picture className={contents ? "contents" : undefined}>
      <source type="image/avif" srcSet={image.srcSet.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.srcSet.webp} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.srcSet.png}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={`${shoe.name}: ${shoe.colorway} ${shoe.category.toLowerCase()} sneaker`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        draggable={false}
        data-shoe-img=""
        data-preload={preload ? "" : undefined}
        ref={clearBlurWhenLoaded}
        onLoad={(e) => clearBlur(e.currentTarget)}
        className={className}
        style={{
          backgroundImage: `url(${image.blur})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}
