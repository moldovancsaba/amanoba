'use client';

/**
 * Memory Match Game Page (Client)
 * 
 * Why: Use client-side session to avoid SSR auth redirect loops that send users back to dashboard.
 */

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MemoryGame from '@/components/games/MemoryGame';
import { Card } from '@/components/ui/card';

export default function MemoryGamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    router.push(signInUrl);
    return null;
  }

  const playerId = (session.user as { id: string }).id;
  const isPremium = (session.user as { isPremium?: boolean }).isPremium || false;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 md:p-8">
        <MemoryGame playerId={playerId} isPremium={isPremium} />
      </Card>
    </div>
  );
}
