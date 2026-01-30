/**
 * App URL constant and helpers
 *
 * What: Single source for the application base URL used in links, redirects, and emails
 * Why: Avoids inconsistent fallbacks (www.amanoba.com vs amanoba.com vs localhost) across the codebase
 *
 * Canonical production URL: https://www.amanoba.com
 * Set NEXT_PUBLIC_APP_URL in production; NEXTAUTH_URL for auth redirects when different
 */

/**
 * Canonical production URL (no trailing slash).
 * Set NEXT_PUBLIC_APP_URL in .env for production (e.g. https://www.amanoba.com) or local (http://localhost:3000).
 */
export const CANONICAL_APP_URL = 'https://www.amanoba.com';

/** Base URL for the app (with protocol, no trailing slash). Used in emails, redirects, share links. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || CANONICAL_APP_URL;

/**
 * Base URL for auth (NextAuth callbacks, SSO redirect, API callbacks).
 * Prefer NEXTAUTH_URL when set. In development without env, falls back to localhost.
 */
export function getAuthBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === 'production' ? CANONICAL_APP_URL : 'http://localhost:3000')
  );
}

/** Theme color for viewport/manifest (e.g. #FAB908). Override with NEXT_PUBLIC_THEME_COLOR in .env. */
export const THEME_COLOR = process.env.NEXT_PUBLIC_THEME_COLOR || '#FAB908';
