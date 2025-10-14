/**
 * Memory Match Game Page
 * 
 * Full-page route for the Memory card matching game.
 * Requires authentication and fetches player data.
 * 
 * Why this structure:
 * - Server component for auth check and data fetching
 * - Client game component handles interactivity
 * - Premium status passed down for feature gating
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import MemoryGame from '@/components/games/MemoryGame';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Memory Match | Amanoba',
  description: 'Test your memory with our card matching game',
};

export default async function MemoryGamePage() {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const playerId = (session.user as any).playerId;
  const isPremium = (session.user as any).isPremium || false;
  
  if (!playerId) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 md:p-8">
        <MemoryGame
          playerId={playerId}
          isPremium={isPremium}
        />
      </Card>
    </div>
  );
}
