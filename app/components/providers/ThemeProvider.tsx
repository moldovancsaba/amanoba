'use client';

/**
 * Theme Provider Component
 * 
 * Wraps the app with next-themes provider for dark mode support.
 * 
 * Why this approach:
 * - Uses next-themes for seamless SSR dark mode
 * - Persists theme preference in localStorage
 * - Supports system preference detection
 * - Prevents flash of wrong theme on load
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
