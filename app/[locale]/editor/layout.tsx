/**
 * Editor Layout
 *
 * What: Separate editor portal (not /admin)
 * Why: Editors should be able to manage their assigned courses without requiring admin role.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [canAccessEditor, setCanAccessEditor] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(`/${locale}/editor${window.location.search}`);
      router.replace(`/${locale}/auth/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    fetch('/api/editor/access')
      .then((r) => r.json())
      .then((d) => {
        if (d?.canAccessEditor !== true) {
          router.replace(`/${locale}/dashboard?error=admin_access_required`);
          return;
        }
        setCanAccessEditor(true);
      })
      .catch(() => {
        router.replace(`/${locale}/dashboard?error=admin_access_required`);
      });
  }, [locale, router, session?.user, status]);

  if (canAccessEditor !== true) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-sm text-gray-300">Loading editor portal…</div>
      </div>
    );
  }

  const coursesHref = `/${locale}/editor/courses`;
  const isCoursesActive = pathname === coursesHref || pathname.startsWith(`${coursesHref}/`);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href={coursesHref} className="font-bold">
            Amanoba — Editor
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={coursesHref}
              className={`px-3 py-2 rounded ${isCoursesActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
            >
              Courses
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-300">
            {session?.user?.email || session?.user?.name || 'Editor'}
          </div>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push(`/${locale}/auth/signin`);
            }}
            className="text-xs px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}

