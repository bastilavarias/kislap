import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  allowedDevOrigins: ['kislap.app', '*.kislap.app', 'kislap.test', '*.kislap.test'],
};

export default nextConfig;
