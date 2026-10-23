import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@nexfield/contracts', '@nexfield/ui'],
  reactStrictMode: true,
  experimental: {},
};

export default nextConfig;
