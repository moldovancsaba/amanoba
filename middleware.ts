/**
 * Next.js Middleware
 * 
 * What: Request interceptor for authentication, route protection, and i18n routing
 * Why: Protect routes that require authentication and handle language routing
 * 
 * Note: This middleware runs in Edge Runtime, so it cannot import Mongoose/MongoDB
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authEdge as auth } from '@/auth.edge';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create next-intl middleware for language routing
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Only show locale prefix when not default (hu)
  localeDetection: false, // Disable automatic locale detection - always use default (hu)
  // This means / always uses /hu (default locale) unless explicitly /en
});

/**
 * Middleware Handler
 * 
 * Why: Check authentication status, handle i18n routing, and redirect unauthenticated users
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const pathname = req.nextUrl.pathname;

  // CRITICAL: Skip middleware for static files in public/ folder
  // Why: Next.js serves these files directly, middleware should not process them
  // Static files include: manifest.json, icons, images, etc.
  if (
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/icon-') ||
    pathname.startsWith('/apple-touch-icon') ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|json)$/i)
  ) {
    return NextResponse.next();
  }

  // Get the actual pathname before i18n processing for route checking
  // Why: Need to check the real path for auth protection
  let actualPathname = pathname;
  
  // Remove locale prefix if present for route checking
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      actualPathname = pathname.replace(`/${locale}`, '') || '/';
      break;
    }
  }
  
  // Handle root path - force default locale (hu), then app/[locale]/page.tsx handles redirect
  if (pathname === '/' || pathname === '') {
    // With localeDetection: false, intlMiddleware should use defaultLocale (hu)
    // This rewrites / to /hu internally (no URL change with localePrefix: 'as-needed')
    const response = intlMiddleware(req);
    return response;
  }

  // First, handle i18n routing for all other paths
  // Why: Language routing should happen before auth checks
  const response = intlMiddleware(req);

  // Define protected routes (without locale prefix)
  // Why: These routes require authentication
  const isProtectedRoute =
    actualPathname.startsWith('/dashboard') ||
    actualPathname.startsWith('/games') ||
    actualPathname.startsWith('/profile') ||
    actualPathname.startsWith('/rewards') ||
    actualPathname.startsWith('/courses') ||
    actualPathname.startsWith('/my-courses') ||
    actualPathname.startsWith('/admin');

  // Define public routes
  // Why: These routes should redirect authenticated users
  const isAuthRoute =
    actualPathname.startsWith('/auth/signin') ||
    actualPathname.startsWith('/auth/signup');

  // Redirect unauthenticated users to sign in
  // Why: Protect content that requires authentication
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
    // Determine locale from pathname
    let locale = defaultLocale;
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        locale = loc;
        break;
      }
    }
    const signInPath = locale === defaultLocale 
      ? `/auth/signin` // No prefix for default locale
      : `/${locale}/auth/signin`;
    return NextResponse.redirect(
      new URL(`${signInPath}?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Redirect authenticated users from auth pages
  // Why: No need for logged-in users to see sign in page
  if (isAuthRoute && isLoggedIn) {
    // Determine locale from pathname
    let locale = defaultLocale;
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        locale = loc;
        break;
      }
    }
    const dashboardPath = locale === defaultLocale
      ? `/dashboard` // No prefix for default locale
      : `/${locale}/dashboard`;
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  }

  // Return the i18n response (which may have rewritten the URL)
  return response || NextResponse.next();
});

/**
 * Middleware Configuration
 * 
 * Why: Define which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest - handled by Next.js static file serving)
     * - api routes (handled separately)
     * 
     * Note: Static files in public/ folder are automatically excluded by Next.js
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|api).*)',
  ],
};
