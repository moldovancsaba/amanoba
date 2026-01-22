/**
 * Admin Dashboard Layout
 * 
 * Protected admin area layout with sidebar navigation and header.
 * Provides consistent navigation and structure for all admin pages.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  Trophy,
  Gift,
  Target,
  Scroll,
  BarChart3,
  Settings,
  Menu,
  X,
  Crown,
  BookOpen,
  FileText,
  CreditCard,
  ClipboardList,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Navigation items will be translated in the component
const navigationItems = [
  { key: 'dashboard', href: '/admin', icon: LayoutDashboard },
  { key: 'analytics', href: '/admin/analytics', icon: BarChart3 },
  { key: 'payments', href: '/admin/payments', icon: CreditCard },
  { key: 'surveys', href: '/admin/surveys', icon: ClipboardList },
  { key: 'courses', href: '/admin/courses', icon: BookOpen },
  { key: 'courseGuide', href: '/admin/docs/course-creation', icon: FileText },
  { key: 'certification', href: '/admin/certification', icon: Award },
  { key: 'players', href: '/admin/players', icon: Users },
  { key: 'games', href: '/admin/games', icon: Gamepad2 },
  { key: 'achievements', href: '/admin/achievements', icon: Trophy },
  { key: 'rewards', href: '/admin/rewards', icon: Gift },
  { key: 'challenges', href: '/admin/challenges', icon: Target },
  { key: 'quests', href: '/admin/quests', icon: Scroll },
  { key: 'featureFlags', href: '/admin/feature-flags', icon: Settings },
  { key: 'settings', href: '/admin/settings', icon: Settings },
];

// Create a client outside the component to avoid recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [version, setVersion] = useState<string>('2.7.0');
  const pathname = usePathname();

  useEffect(() => {
    // Fetch version from package.json via API
    fetch('/api/admin/system-info')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.systemInfo?.version) {
          setVersion(data.systemInfo.version);
        }
      })
      .catch(() => {
        // Fallback to default if API fails
      });
  }, []);
  
  // Build navigation with translations
  const navigation = navigationItems.map(item => ({
    ...item,
    label: t(item.key),
    href: item.href,
    icon: item.icon,
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-800 border-r border-gray-700`}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-700">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2">
            <Logo size="sm" showText={false} linkTo="" className="flex-shrink-0" />
            <div>
              <div className="text-white font-bold text-lg">Amanoba</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const fullPath = `/${locale}${item.href}`;
            const isActive = pathname === fullPath || pathname.startsWith(fullPath + '/');

            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center">
            v{version} | Admin Mode
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all ${
          sidebarOpen ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 text-gray-300"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white text-sm font-medium">Admin User</div>
              <div className="text-gray-400 text-xs">Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
    </QueryClientProvider>
  );
}
