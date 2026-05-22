/**
 * Language Switcher Component
 * 
 * What: Allows users to switch between available languages
 * Why: Provides easy access to language selection
 */

'use client';

import { useLocale } from 'next-intl';
import { Select } from '@mantine/core';
import { getPathname, usePathname, useRouter } from '@/app/lib/i18n/navigation';
import { locales, type Locale } from '@/app/lib/i18n/locales';

const languageNames: Record<Locale, string> = {
  hu: 'Magyar',
  en: 'English',
  ar: 'العربية',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  pt: 'Português',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  bg: 'Български',
  pl: 'Polski',
  ru: 'Русский',
  sw: 'Kiswahili',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  bn: 'বাংলা',
  ur: 'اردو',
};

/**
 * Language Switcher
 *
 * Uses next-intl navigation so pathname is without locale prefix; switching
 * locale keeps the same page (e.g. /en/dashboard -> /hu/dashboard).
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const safePath = (typeof pathname === 'string' ? pathname : '') || '/';

  const resolveNavigationPath = (path: string) => {
    // On course detail pages the courseId itself encodes the locale, so we can only guarantee
    // a valid route if we navigate to the courses listing instead of reusing the detail slug.
    return path.startsWith('/courses/') ? '/courses' : path;
  };

  const handleLanguageChange = (newLocale: Locale) => {
    const navigationPath = resolveNavigationPath(safePath);
    const targetPath = getPathname({
      href: navigationPath,
      locale: newLocale,
      forcePrefix: true,
    });
    router.push(navigationPath, { locale: newLocale });
    // Fallback: if client navigation doesn't run (e.g. outside router context), full navigate
    if (typeof window !== 'undefined') {
      const fallback = () => {
        if (window.location.pathname !== targetPath) {
          window.location.href = targetPath;
        }
      };
      setTimeout(fallback, 150);
    }
  };

  const displayLocale = locales.includes(locale) ? locale : 'hu';

  return (
    <Select
      aria-label="Select language"
      data={locales.map((loc) => ({ value: loc, label: languageNames[loc] }))}
      value={displayLocale}
      onChange={(value) => {
        if (value) handleLanguageChange(value as Locale);
      }}
      allowDeselect={false}
      w={220}
    />
  );
}
