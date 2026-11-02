import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Familjen_Grotesk } from "next/font/google";
import { productRepository } from "@/data";
import { SearchMount } from "@/features/search/SearchMount";
import { StoreHydrator } from "@/lib/StoreHydrator";
import { Nav } from "@/components/ui/Nav";
import { Preloader } from "@/components/ui/Preloader";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ColorWipe } from "@/features/theme/ColorWipe";
import { CartDrawerMount } from "@/features/cart/CartDrawerMount";
import { Cursor } from "@/features/theme/Cursor";
import { NoiseOverlay } from "@/features/theme/NoiseOverlay";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { env } from "@/lib/env";
import { MotionProvider } from "@/lib/motion";
import { cssVars } from "@/lib/theme";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  display: "swap",
});

const body = Familjen_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${env.NEXT_PUBLIC_SITE_NAME} | Footwear in color`,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description: "Eleven pairs, eleven moods. A color-reactive sneaker showcase.",
};

export const viewport: Viewport = { themeColor: "#d9d4cc", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const shoes = await productRepository.list();
  const palettes = shoes.map((s) => s.palette);
  const searchItems = shoes.map((s) => ({
    slug: s.slug,
    name: s.name,
    category: s.category,
    colorway: s.colorway,
    price: s.price,
    currency: s.currency,
    bg: s.palette.bg,
    text: s.palette.text,
    img: s.image.src,
    aspect: s.image.aspect,
  }));
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <style
          id="theme-default"
          dangerouslySetInnerHTML={{ __html: `:root{${cssVars(palettes[0])}}` }}
        />
      </head>
      <body>
        <ThemeProvider palettes={palettes}>
          <MotionProvider>
            <SmoothScroll />
            <ColorWipe />
            <NoiseOverlay />
            <Cursor />
            <a
              href="#main"
              className="focus:bg-accent focus:text-on-accent sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:rounded-full focus:px-5 focus:py-3"
            >
              Skip to content
            </a>
            <Nav />
            {children}
            <CartDrawerMount />
            <SearchMount items={searchItems} />
            <StoreHydrator />
            <Preloader />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
