import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Listing any pattern here switches next/image to allowlist-only for
    // local images, so every local image src used anywhere on the site has
    // to be listed, not just the ones with a query string.
    localPatterns: [
      // /api/photos/[slot] serves our own admin-uploaded Blobs images,
      // versioned with a `?v=<timestamp>` cache-buster that changes on every
      // upload — can't use an exact `search` match. The route itself
      // controls which keys exist, so allowing any query string is safe.
      { pathname: "/api/photos/**" },
      { pathname: "/logo.png" },
      { pathname: "/founders.jpg" },
      { pathname: "/hero.jpg" },
    ],
  },
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
