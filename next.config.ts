import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Another lockfile exists further up the drive; pin the trace root to this
  // project so the build doesn't warn or walk outside it.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
