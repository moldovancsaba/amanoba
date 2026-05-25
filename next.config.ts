import type { NextConfig } from "next";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';

// What: Next.js configuration for Amanoba platform
// Why: Provides runtime configuration, headers, and optimizations for the unified game platform

const withNextIntl = createNextIntlPlugin('./i18n.ts');
const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const gdsRoot = path.resolve(repoRoot, '../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/packages');
const gdsResolveAlias = {
  '@gds/theme': path.join(gdsRoot, 'gds-theme'),
  '@gds/core': path.join(gdsRoot, 'gds-core'),
  '@gds/admin': path.join(gdsRoot, 'gds-admin'),
};

const nextConfig: NextConfig = {
  transpilePackages: ['@gds/theme', '@gds/core', '@gds/admin'],
  turbopack: {
    resolveAlias: gdsResolveAlias,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...gdsResolveAlias,
    };
    return config;
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Why: Enforce TypeScript during build (P1.7). Next 16: eslint option removed; run `npm run lint` in CI.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configure image optimization (Next 16: use remotePatterns only; domains deprecated)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        // Ensure manifest.json is accessible with proper content-type
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
