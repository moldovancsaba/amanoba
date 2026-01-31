import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// What: Next.js configuration for Amanoba platform
// Why: Provides runtime configuration, headers, and optimizations for the unified game platform

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Why: Run ESLint during build; errors are fixed, warnings (e.g. exhaustive-deps) do not fail build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Why: Enforce TypeScript during build (P1.7) — app code passes tsc --noEmit; scripts excluded per tsconfig
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configure image optimization domains if needed
  images: {
    domains: ['i.ibb.co', 'i.imgbb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
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
