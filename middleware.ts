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
import { defaultLocale } from './i18n';
import { locales, type Locale } from '@/app/lib/i18n/locales';

// Default locales for different route types
// Why: Public routes default to Hungarian, admin routes default to English
const publicDefaultLocale: Locale = 'hu';
const adminDefaultLocale: Locale = 'en';

// Create next-intl middleware for language routing
// Note: We'll handle admin-specific defaults in the middleware handler
// localeDetection: true = use Accept-Language and cookie for first-time and returning visitors
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: publicDefaultLocale, // Fallback when browser language is not supported
  localePrefix: 'always', // Always show locale prefix: /hu/..., /en/...
  localeDetection: true, // Use browser Accept-Language and locale cookie for default locale
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
    pathname.startsWith('/admin-docs/') ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|json|md)$/i)
  ) {
    return NextResponse.next();
  }

  // Check if this is an admin route BEFORE locale processing
  // Why: Admin routes should default to English, public routes use browser/default
  const hasLocalePrefix = locales.some((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);
  const isAdminRoute = pathname === '/admin' ||
                       pathname.startsWith('/admin/') ||
                       (!hasLocalePrefix && pathname.startsWith('/admin'));

  const isEditorRoute =
    pathname === '/editor' ||
    pathname.startsWith('/editor/') ||
    (!hasLocalePrefix && pathname.startsWith('/editor'));

  // Handle admin route default locale (English)
  // Why: Admin interface should default to English for better international admin experience
  if (isAdminRoute && !hasLocalePrefix) {
    // Redirect /admin to /en/admin
    const adminPath = pathname.replace('/admin', '') || '/';
    return NextResponse.redirect(new URL(`/en/admin${adminPath}${req.nextUrl.search}`, req.url));
  }

  // Handle editor route default locale (English)
  if (isEditorRoute && !hasLocalePrefix) {
    const editorPath = pathname.replace('/editor', '') || '/';
    return NextResponse.redirect(new URL(`/en/editor${editorPath}${req.nextUrl.search}`, req.url));
  }
  
  // FIRST: Let intlMiddleware handle ALL locale routing
  // With localePrefix: 'always', / redirects to /hu
  // This MUST happen first before any other processing
  const response = intlMiddleware(req);
  
  // Get the actual pathname for route checking (after locale processing)
  // Extract the path without locale for route protection checks
  let actualPathname = pathname;
  
  // Remove locale prefix if present for route checking
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      actualPathname = pathname.replace(`/${locale}`, '') || '/';
      break;
    }
  }
  
  // Ensure admin routes use English locale
  // Why: Admin UI is English-only; redirect any non-en locale on admin to /en/admin
  const pathLocale = locales.find((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);
  if (actualPathname.startsWith('/admin') && pathLocale && pathLocale !== 'en') {
    return NextResponse.redirect(new URL(`/en${actualPathname}${req.nextUrl.search}`, req.url));
  }

  // Define protected routes (without locale prefix)
  // Why: These routes require authentication
  // Note: Root path '/', '/courses', and '/profile/[playerId]' are public - users can browse before signing in
  // Profile pages are public so anyone can view user profiles
  // Only /profile (exact match, redirects to own profile) requires auth, not /profile/[playerId]
  const isProfileWithPlayerId = actualPathname.startsWith('/profile/') && actualPathname !== '/profile';
  const isProtectedRoute =
    (actualPathname.startsWith('/dashboard') ||
    actualPathname.startsWith('/games') ||
    (actualPathname.startsWith('/profile') && !isProfileWithPlayerId) || // Only /profile (own profile) is protected, not /profile/[playerId]
    actualPathname.startsWith('/rewards') ||
    actualPathname.startsWith('/my-courses') ||
    actualPathname.startsWith('/admin') ||
    actualPathname.startsWith('/editor')) &&
    actualPathname !== '/' && // Root path is public (landing page)
    !actualPathname.startsWith('/courses'); // Courses listing is public (enrollment requires auth)

  const isPublicAdminDoc = actualPathname.startsWith('/admin/docs/course-creation');

  // Define public routes
  // Why: These routes should redirect authenticated users
  const isAuthRoute =
    actualPathname.startsWith('/auth/signin') ||
    actualPathname.startsWith('/auth/signup');

  // Check admin role for admin routes
  // Why: Admin routes require admin role, not just authentication.
  if (actualPathname.startsWith('/admin') && !isPublicAdminDoc) {
    if (!isLoggedIn) {
      // Redirect to sign in if not authenticated
      const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
      const signInPath = `/${adminDefaultLocale}/auth/signin`;
      return NextResponse.redirect(
        new URL(`${signInPath}?callbackUrl=${callbackUrl}`, req.url)
      );
    }

    const user = req.auth?.user as { role?: 'user' | 'admin' } | undefined;
    const userRole = user?.role || 'user';

    if (userRole !== 'admin') {
      // Redirect non-admin users away from admin routes
      // Determine locale from pathname
      let locale = defaultLocale;
      for (const loc of locales) {
        if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
          locale = loc;
          break;
        }
      }
      // Redirect to dashboard with error message
      const dashboardPath = `/${locale}/dashboard`;
      const redirectUrl = new URL(dashboardPath, req.url);
      redirectUrl.searchParams.set('error', 'admin_access_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect unauthenticated users to sign in for other protected routes
  // Why: Protect content that requires authentication
  if (isProtectedRoute && !isLoggedIn && !isPublicAdminDoc) {
    const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
    // Determine locale from pathname
    // Admin routes should use English, public routes use Hungarian
    let locale: Locale = actualPathname.startsWith('/admin') ? adminDefaultLocale : publicDefaultLocale;
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        locale = loc;
        break;
      }
    }
    // With localePrefix: 'always', all routes have locale prefix
    const signInPath = `/${locale}/auth/signin`;
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
    // With localePrefix: 'always', all routes have locale prefix
    const dashboardPath = `/${locale}/dashboard`;
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
