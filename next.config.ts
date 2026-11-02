import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // lets a second instance (tests, previews) use its own build folder
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["framer-motion", "gsap"] },
};

export default nextConfig;
