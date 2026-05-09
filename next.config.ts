import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources used in the app
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // Turbopack config (Next.js 16 default bundler).
  // @solana/web3.js references Node.js built-ins; stub them out for the browser.
  turbopack: {
    resolveAlias: {
      fs: { browser: "./lib/empty-module.ts" },
      net: { browser: "./lib/empty-module.ts" },
      tls: { browser: "./lib/empty-module.ts" },
      crypto: { browser: "./lib/empty-module.ts" },
      path: { browser: "./lib/empty-module.ts" },
      os: { browser: "./lib/empty-module.ts" },
      stream: { browser: "./lib/empty-module.ts" },
      http: { browser: "./lib/empty-module.ts" },
      https: { browser: "./lib/empty-module.ts" },
      zlib: { browser: "./lib/empty-module.ts" },
    },
  },
};

export default nextConfig;
