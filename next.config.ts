import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
