/**
 * Language Switcher Component
 * 
 * What: Allows users to switch between available languages
 * Why: Provides easy access to language selection
 */

'use client';

import { useLocale } from 'next-intl';
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
    <div className="relative inline-block">
      <select
        value={displayLocale}
        onChange={(e) => handleLanguageChange(e.target.value as Locale)}
        className="relative z-10 appearance-none bg-brand-white border border-brand-darkGrey/20 text-brand-black rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent cursor-pointer"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageNames[loc]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-darkGrey z-0">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
