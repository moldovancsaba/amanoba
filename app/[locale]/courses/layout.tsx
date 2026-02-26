import type { Metadata } from 'next';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales } from '@/app/lib/i18n/locales';

interface CoursesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CoursesLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}/courses`;
  const languages = Object.fromEntries(locales.map((loc) => [loc, `${base}/${loc}/courses`]));

  return {
    alternates: {
      canonical,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return children;
}
