/**
 * Locale-aware navigation (usePathname without locale, useRouter that prefixes).
 * Use these instead of next/navigation for correct locale switching and pathnames.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, usePathname, useRouter, getPathname, redirect, permanentRedirect } =
  createNavigation(routing);
