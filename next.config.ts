import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  ...(isProd && { basePath: '/1234webtool' }),
};

export default nextConfig;
