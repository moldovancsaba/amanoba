import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

// What: Next.js configuration for Amanoba platform
// Why: Provides runtime configuration, headers, and optimizations for the unified game platform

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const sharedProjectsRoot = path.resolve(__dirname, '..');

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  transpilePackages: ['@gds/theme', '@gds/core', '@gds/admin'],
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: sharedProjectsRoot,
    resolveAlias: {
      '@gds/theme': './GENERAL_DESIGN_SYSTEM/packages/gds-theme/dist/index.mjs',
      '@gds/core': './GENERAL_DESIGN_SYSTEM/packages/gds-core/dist/index.mjs',
      '@gds/admin': './GENERAL_DESIGN_SYSTEM/packages/gds-admin/dist/index.mjs',
      '@mantine/core': './amanoba/node_modules/@mantine/core/esm/index.mjs',
      '@mantine/hooks': './amanoba/node_modules/@mantine/hooks/esm/index.mjs',
      '@mantine/modals': './amanoba/node_modules/@mantine/modals/esm/index.mjs',
      '@mantine/notifications': './amanoba/node_modules/@mantine/notifications/esm/index.mjs',
    },
  },
  
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
