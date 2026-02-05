/**
 * Admin Dashboard Layout
 * 
 * Protected admin area layout with sidebar navigation and header.
 * Provides consistent navigation and structure for all admin pages.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  User,
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [version, setVersion] = useState<string>('2.7.0');
  const [isEditorOnly, setIsEditorOnly] = useState<boolean | null>(null);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

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
        if (data?.canAccessAdmin !== true) {
          router.replace(`/${locale}/dashboard?error=admin_access_required`);
          return;
        }
        setIsEditorOnly(data.isEditorOnly === true);
      })
      .catch(() => {
        router.replace(`/${locale}/dashboard?error=admin_access_required`);
      });
  }, [locale, router]);

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
      <div className="min-h-screen bg-brand-black">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-brand-darkGrey`}
        style={{ width: '260px' }}
      >
        {/* Logo */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-4">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2">
            <Logo size="sm" showText={false} linkTo="" className="flex-shrink-0" />
            <div>
              <div className="text-brand-white font-bold text-lg">Amanoba</div>
              <div className="text-xs text-brand-white/70">Admin Panel</div>
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
                    ? 'bg-brand-accent text-brand-black'
                    : 'text-brand-white hover:bg-brand-secondary-700 hover:text-brand-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Version only — user actions moved to header */}
        <div className="flex-shrink-0 p-4 text-xs text-brand-white/60 text-center">
          v{version} | Admin Mode
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all ${
          sidebarOpen ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-brand-darkGrey flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-brand-secondary-700 text-brand-white"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* User menu: profile, logout, version */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-secondary-700 text-brand-white transition-colors"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="text-right hidden sm:block">
                <div className="text-brand-white text-sm font-medium">
                  {session?.user?.name || session?.user?.email || t('adminUser')}
                </div>
                <div className="text-brand-white/70 text-xs">
                  {isEditorOnly ? t('editor') : t('administrator')}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-brand-black" />
              </div>
              <ChevronDown className={`w-5 h-5 text-brand-white/80 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 py-2 rounded-lg bg-brand-darkGrey border border-brand-white/10 shadow-xl z-50"
                role="menu"
              >
                <Link
                  href={session?.user?.id ? `/${locale}/profile/${session.user.id}` : `/${locale}/dashboard`}
                  className="flex items-center gap-3 px-4 py-2.5 text-brand-white hover:bg-brand-secondary-700 transition-colors"
                  role="menuitem"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>{t('profile')}</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setUserMenuOpen(false);
                    await signOut({ redirect: false });
                    router.push(`/${locale}/auth/signin`);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-brand-white hover:bg-brand-secondary-700 transition-colors text-left"
                  role="menuitem"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('logout')}</span>
                </button>
                <div className="border-t border-brand-white/10 mt-2 pt-2 px-4 py-1.5 text-xs text-brand-white/60">
                  v{version} | Admin Mode
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-brand-black text-brand-white">{children}</main>
      </div>
    </div>
    </QueryClientProvider>
  );
}
