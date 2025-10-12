/**
 * Next.js Middleware
 * 
 * What: Request interceptor for authentication and route protection
 * Why: Protect routes that require authentication before page load
 * 
 * Note: This middleware runs in Edge Runtime, so it cannot import Mongoose/MongoDB
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authEdge as auth } from '@/auth.edge';

/**
 * Middleware Handler
 * 
 * Why: Check authentication status and redirect unauthenticated users
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;

  // Define protected routes
  // Why: These routes require authentication
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/games') ||
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/rewards');

  // Define public routes
  // Why: These routes should redirect authenticated users
  const isAuthRoute =
    req.nextUrl.pathname.startsWith('/auth/signin') ||
    req.nextUrl.pathname.startsWith('/auth/signup');

  // Redirect unauthenticated users to sign in
  // Why: Protect content that requires authentication
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.nextUrl)
    );
  }

  // Redirect authenticated users from auth pages
  // Why: No need for logged-in users to see sign in page
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
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
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
