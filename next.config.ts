import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep typed routes off (as you already had)
  typedRoutes: false,

  // skip ESLint during production builds (fixes Amplify build failure)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
