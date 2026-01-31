/**
 * Admin Dashboard Layout
 * 
 * Protected admin area layout with sidebar navigation and header.
 * Provides consistent navigation and structure for all admin pages.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
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
  CreditCard,
  ClipboardList,
  LogOut,
  Award,
  HelpCircle,
  Mail,
  ThumbsUp,
} from 'lucide-react';
import Logo from '@/components/Logo';

// Full nav for admins; editor-only users see only dashboard + courses
const allNavigationItems = [
  { key: 'dashboard', href: '/admin', icon: LayoutDashboard },
  { key: 'analytics', href: '/admin/analytics', icon: BarChart3 },
  { key: 'payments', href: '/admin/payments', icon: CreditCard },
  { key: 'emailAnalytics', href: '/admin/email-analytics', icon: Mail },
  { key: 'surveys', href: '/admin/surveys', icon: ClipboardList },
  { key: 'votes', href: '/admin/votes', icon: ThumbsUp },
  { key: 'courses', href: '/admin/courses', icon: BookOpen },
  { key: 'questions', href: '/admin/questions', icon: HelpCircle },
  { key: 'certificates', href: '/admin/certificates', icon: Award },
  { key: 'users', href: '/admin/players', icon: Users },
  { key: 'games', href: '/admin/games', icon: Gamepad2 },
  { key: 'achievements', href: '/admin/achievements', icon: Trophy },
  { key: 'rewards', href: '/admin/rewards', icon: Gift },
  { key: 'challenges', href: '/admin/challenges', icon: Target },
  { key: 'quests', href: '/admin/quests', icon: Scroll },
  { key: 'featureFlags', href: '/admin/feature-flags', icon: Settings },
  { key: 'settings', href: '/admin/settings', icon: Settings },
];

const editorOnlyNavKeys = new Set(['dashboard', 'courses']);

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
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [version, setVersion] = useState<string>('2.7.0');
  const [isEditorOnly, setIsEditorOnly] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/admin/system-info')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.systemInfo?.version) {
          setVersion(data.systemInfo.version);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/admin/access')
      .then(res => res.json())
      .then(data => {
        setIsEditorOnly(data.isEditorOnly === true);
      })
      .catch(() => setIsEditorOnly(false));
  }, []);

  const navigationItems =
    isEditorOnly === true
      ? allNavigationItems.filter((item) => editorOnlyNavKeys.has(item.key))
      : allNavigationItems;

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
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700 space-y-2">
          {/* Logout Button */}
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push(`/${locale}/auth/signin`);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('logout')}</span>
          </button>
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
              <div className="text-white text-sm font-medium">
                {session?.user?.name || session?.user?.email || 'Admin User'}
              </div>
              <div className="text-gray-400 text-xs">
                {isEditorOnly ? t('editor') : 'Administrator'}
              </div>
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
