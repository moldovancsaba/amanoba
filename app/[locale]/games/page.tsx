'use client';

/**
 * Game Launcher Page
 * 
 * Why: Central hub for accessing all available games in the platform
 * What: Displays game cards with progressive disclosure and launches games
 */

import { useEffect, useState, type ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import Icon, { MdPsychology, MdGpsFixed, MdCardMembership, MdNumbers, MdLock, MdAccessTime } from '@/components/Icon';
import Logo from '@/components/Logo';

// Why: Type-safe game definitions
interface GameInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconComponent?: ComponentType<{ className?: string }>;
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
    icon: '🧠', // Will be replaced with icon component
    iconComponent: MdPsychology,
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
    iconComponent: MdGpsFixed,
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
    iconComponent: MdCardMembership,
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
    iconComponent: MdNumbers,
    route: '/games/sudoku',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '5-15 min',
  },
  {
    id: 'madoku',
    name: 'Madoku',
    description: 'Competitive number-picking strategy game against AI',
    icon: '🎯',
    iconComponent: MdGpsFixed,
    route: '/games/madoku',
    isPremium: false,
    requiredLevel: 1,
    estimatedTime: '3-8 min',
  },
];

export default function GamesLauncher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('games');
  const tCommon = useTranslations('common');
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Why: Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/${locale}/auth/signin`);
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
  }, [session, status, router, locale]);

  // Why: Determine if a game is accessible based on player progression
  const isGameAvailable = (game: GameInfo): boolean => {
    if (game.isPremium && !isPremium) return false;
    if (game.requiredLevel > playerLevel) return false;
    return true;
  };

  // Why: Provide user feedback on why a game is locked
  const getLockReason = (game: GameInfo): string | null => {
    if (game.isPremium && !isPremium) {
      return t('premiumOnly');
    }
    if (game.requiredLevel > playerLevel) {
      return t('unlockAtLevel', { level: game.requiredLevel });
    }
    return null;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black">
        <div className="text-brand-white text-2xl font-bold animate-pulse">
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Why: Header with branding and stats */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} linkTo="/dashboard" className="flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-brand-white flex items-center gap-2">
                  🎮 {tCommon('appName')} {t('title')}
                </h1>
                <p className="text-brand-white/80 mt-1">{t('chooseChallenge')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold">
                Level {playerLevel}
              </div>
              {isPremium && (
                <div className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold">
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
                  relative bg-brand-white rounded-2xl shadow-xl overflow-hidden border-2
                  transform transition-all duration-300 hover:scale-105
                  ${available ? 'cursor-pointer border-brand-accent' : 'opacity-60 cursor-not-allowed border-brand-darkGrey'}
                `}
                onClick={() => {
                  if (available) {
                    router.push(`/${locale}${game.route}`);
                  }
                }}
              >
                {/* Why: Lock overlay for unavailable games */}
                {!available && (
                  <div className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center text-brand-white">
                      <Icon icon={MdLock} size={40} className="mb-2 mx-auto" />
                      <div className="font-bold">{lockReason || t('locked')}</div>
                    </div>
                  </div>
                )}

                {/* Why: Game content */}
                <div className="p-6">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-brand-black mb-2">
                    {game.name}
                  </h3>
                  <p className="text-brand-darkGrey mb-4">{game.description}</p>
                  
                  {/* Why: Game metadata */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-darkGrey flex items-center gap-1">
                      <Icon icon={MdAccessTime} size={16} />
                      {game.estimatedTime}
                    </span>
                    {game.isPremium && (
                      <span className="bg-brand-accent text-brand-black px-2 py-1 rounded font-bold">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Why: Play button */}
                {available && (
                  <div className="bg-brand-accent p-4 text-center">
                    <span className="text-brand-black font-bold">{t('playNow')} →</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Why: Back to dashboard link */}
        <div className="mt-12 text-center">
          <LocaleLink
            href="/dashboard"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg hover:bg-brand-primary-400 transition-colors font-bold"
          >
            ← {t('backToDashboard')}
          </LocaleLink>
        </div>
      </main>
    </div>
  );
}
