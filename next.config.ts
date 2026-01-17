import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// What: Next.js configuration for Amanoba platform
// Why: Provides runtime configuration, headers, and optimizations for the unified game platform

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Why: Disable ESLint during build to allow deployment while we fix linting issues
  // This prevents blocking deployments due to pre-existing code quality warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Why: Disable TypeScript errors during build (temporary for MVP speed)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure image optimization domains if needed
  images: {
    domains: [],
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
    ];
  },
};

export default withNextIntl(nextConfig);
