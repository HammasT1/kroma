import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { productRepository } from "@/data";

export const alt = "Product preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await productRepository.list()).map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const shoe = await productRepository.getBySlug((await params).slug);
  if (!shoe) return new Response("Not found", { status: 404 });
  const file = await readFile(path.join(process.cwd(), "public", shoe.image.src));
  const src = `data:image/png;base64,${file.toString("base64")}`;
  const h = 500;
  const w = Math.min(640, Math.round(h * shoe.image.aspect));
  const imgH = Math.round(w / shoe.image.aspect);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: shoe.palette.bg,
        color: shoe.palette.text,
        padding: 64,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 480 }}>
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase" }}>
          {shoe.category}
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 0.9,
            textTransform: "uppercase",
            marginTop: 12,
          }}
        >
          {shoe.name}
        </div>
        <div style={{ fontSize: 40, marginTop: 24 }}>{`$${(shoe.price / 100).toFixed(0)}`}</div>
      </div>
      <img src={src} width={w} height={imgH} alt="" style={{ marginLeft: "auto" }} />
    </div>,
    size,
  );
}
