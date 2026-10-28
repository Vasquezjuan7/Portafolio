import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Oculta el indicador "N" de Next.js en desarrollo (abajo a la izquierda).
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
