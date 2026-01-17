/**
 * Locale Layout
 * 
 * What: Root layout with i18n support for each locale
 * Why: Provides consistent structure, fonts, and i18n context across all pages
 */

import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SessionProvider from "@/components/session-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import "../globals.css";
import "../mobile-styles.css";

// What: Font configuration for Amanoba platform
// Why: Noto Sans provides broad unicode coverage including latin-ext, Inter as secondary for UI consistency
// Note: display: "swap" allows text to render with fallback fonts immediately, then swaps when custom fonts load
// Note: Next.js automatically preloads fonts for performance - browser warnings about unused preloads are informational only
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: true,
  preload: false, // Disable automatic preload to reduce warnings
});

const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-noto-sans",
  adjustFontFallback: true,
  preload: false, // Disable automatic preload to reduce warnings
});

// What: SEO and social media metadata for Amanoba
// Why: Optimizes discoverability and sharing across platforms
export const metadata: Metadata = {
  title: "Amanoba - Unified Learning Platform",
  description: "30-day learning platform with gamified education, email-based lesson delivery, and interactive assessments.",
  keywords: ["learning", "courses", "education", "gamification", "achievements", "leaderboards"],
  authors: [{ name: "Narimato" }],
  creator: "Narimato",
  publisher: "Amanoba",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Amanoba",
    title: "Amanoba - Unified Learning Platform",
    description: "30-day learning platform with gamified education.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amanoba - Unified Learning Platform",
    description: "Learn, play, and grow with structured courses.",
  },
  manifest: "/manifest.json",
};

// What: Viewport configuration for responsive design
// Why: Ensures proper mobile rendering and PWA compatibility
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#FAB908",
};

/**
 * Root Layout Component
 * 
 * Why: Provides consistent structure, fonts, styling, and i18n context across all pages
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  // Determine HTML lang attribute
  const htmlLang = locale === 'hu' ? 'hu' : locale;

  return (
    <html lang={htmlLang} className={`${notoSans.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* Main content wrapper */}
              <div className="min-h-screen flex flex-col">
                {children}
              </div>
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
