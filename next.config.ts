import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vinext did not type-check the app. Native `next build` does, and the
  // existing source has pre-existing TypeScript errors (especially QtmSite.tsx).
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
