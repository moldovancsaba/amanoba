import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// What: Font configuration for Amanoba platform
// Why: Noto Sans provides broad unicode coverage including latin-ext, Inter as secondary for UI consistency
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-noto-sans",
});

// What: SEO and social media metadata for Amanoba
// Why: Optimizes discoverability and sharing across platforms
export const metadata: Metadata = {
  title: "Amanoba - Unified Game Platform",
  description: "Multi-game platform with comprehensive gamification, achievements, leaderboards, and premium content. Play QUIZZZ, WHACKPOP, and Madoku Sudoku.",
  keywords: ["games", "gamification", "achievements", "leaderboards", "sudoku", "puzzle", "interactive", "rewards"],
  authors: [{ name: "Narimato" }],
  creator: "Narimato",
  publisher: "Amanoba",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Amanoba",
    title: "Amanoba - Unified Game Platform",
    description: "Multi-game platform with gamification, achievements, and premium content.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amanoba - Unified Game Platform",
    description: "Play games, unlock achievements, compete on leaderboards.",
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
  themeColor: "#6366f1",
};

// What: Root layout component for Amanoba platform
// Why: Provides consistent structure, fonts, and styling across all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
      </body>
    </html>
  );
}
