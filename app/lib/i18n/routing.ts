/**
 * next-intl routing config shared by middleware and navigation.
 * Single source for locales, defaultLocale, and prefix/detection.
 */

import { defineRouting } from 'next-intl/routing';
import { locales } from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale: 'hu',
  localePrefix: 'always',
  localeDetection: true,
});
