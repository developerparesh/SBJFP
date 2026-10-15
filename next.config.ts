import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // OpenNext/Cloudflare Workers requires standalone output
  // Do NOT use output: 'export' — it conflicts with OpenNext bundling
  output: "standalone",
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
