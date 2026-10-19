import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // let phones / other devices on the local network load the dev server (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
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
