import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@restroverse/shared', '@restroverse/ui'],
};

export default nextConfig;
