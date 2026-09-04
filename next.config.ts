import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '',
  webpack: (config, { isServer }) => {
    if (isServer) {
      // The Capacitor SDK and RevenueCat plugins only work inside the native
      // Capacitor runtime. Exclude them from the server-side bundle so the
      // Next.js static export build doesn't error on these packages.
      const externals = [
        '@capacitor/core',
        '@revenuecat/purchases-capacitor',
        '@revenuecat/purchases-capacitor-ui',
      ];
      config.externals = [...(config.externals || []), ...externals];
    }
    return config;
  },
};

export default nextConfig;
