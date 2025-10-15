'use client';

/**
 * Game Launcher Page
 * 
 * Why: Central hub for accessing all available games in the platform
 * What: Displays game cards with progressive disclosure and launches games
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Why: Type-safe game definitions
interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isPremium: boolean;
  requiredLevel: number;
  estimatedTime: string;
}

// Why: Hardcoded game catalog matching our database Game definitions
const AVAILABLE_GAMES: GameInfo[] = [
  {
    id: 'quizzz',
    name: 'QUIZZZ',
    description: 'Test your knowledge with rapid-fire trivia questions!',
    icon: '🧠',
    route: '/games/quizzz',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '2-3 min',
  },
  {
    id: 'whackpop',
    name: 'WHACKPOP',
    description: 'Click targets as fast as you can in this fast-paced game!',
    icon: '🎯',
    route: '/games/whackpop',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '1-2 min',
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Find matching pairs in this card-flipping memory game!',
    icon: '🃏',
    route: '/games/memory',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '2-5 min',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    description: 'Classic Sudoku puzzles with progressive difficulty',
    icon: '🔢',
    route: '/games/sudoku',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '5-15 min',
  },
];

export default function GamesLauncher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Why: Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Why: Fetch player progression data to determine game availability
    const fetchPlayerData = async () => {
      try {
        const playerId = session.user.id;
        const response = await fetch(`/api/players/${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setPlayerLevel(data.progression?.level || 1);
          setIsPremium(data.player?.isPremium || false);
        }
      } catch (error) {
        console.error('Failed to fetch player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [session, status, router]);

  // Why: Determine if a game is accessible based on player progression
  const isGameAvailable = (game: GameInfo): boolean => {
    if (game.isPremium && !isPremium) return false;
    if (game.requiredLevel > playerLevel) return false;
    return true;
  };

  // Why: Provide user feedback on why a game is locked
  const getLockReason = (game: GameInfo): string | null => {
    if (game.isPremium && !isPremium) {
      return 'Premium Only';
    }
    if (game.requiredLevel > playerLevel) {
      return `Unlock at Level ${game.requiredLevel}`;
    }
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading Games...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Why: Header with branding and stats */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                🎮 Amanoba Games
              </h1>
              <p className="text-white/80 mt-1">Choose your challenge</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg text-white">
                <span className="font-bold">Level {playerLevel}</span>
              </div>
              {isPremium && (
                <div className="bg-yellow-500/80 px-4 py-2 rounded-lg text-white font-bold">
                  ⭐ Premium
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Why: Game cards grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_GAMES.map((game) => {
            const available = isGameAvailable(game);
            const lockReason = getLockReason(game);

            return (
              <div
                key={game.id}
                className={`
                  relative bg-white rounded-2xl shadow-xl overflow-hidden
                  transform transition-all duration-300 hover:scale-105
                  ${available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                `}
                onClick={() => {
                  if (available) {
                    router.push(game.route);
                  }
                }}
              >
                {/* Why: Lock overlay for unavailable games */}
                {!available && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🔒</div>
                      <div className="font-bold">{lockReason}</div>
                    </div>
                  </div>
                )}

                {/* Why: Game content */}
                <div className="p-6">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  
                  {/* Why: Game metadata */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">⏱️ {game.estimatedTime}</span>
                    {game.isPremium && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Why: Play button */}
                {available && (
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-center">
                    <span className="text-white font-bold">Play Now →</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Why: Back to dashboard link */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
