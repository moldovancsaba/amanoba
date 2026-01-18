'use client';

/**
 * Leaderboards Page
 * 
 * Why: Display competitive rankings across all games and time periods
 * What: Shows top players with filtering by game and period
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Trophy, ChevronLeft, Crown, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  rank: number;
  previousRank?: number;
  value: number;
  metadata?: {
    level?: number;
    gamesPlayed?: number;
  };
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  leaderboardType: string;
  period: string;
  gameId: string;
  totalPlayers: number;
  lastUpdated: string;
}

// Games will be translated dynamically
const GAMES = [
  { id: 'quizzz', nameKey: 'quizzz', iconComponent: MdPsychology as IconType },
  { id: 'whackpop', nameKey: 'whackpop', iconComponent: MdGpsFixed as IconType },
  { id: 'memory', nameKey: 'memory', iconComponent: MdCardMembership as IconType },
  { id: 'madoku', nameKey: 'madoku', iconComponent: MdNumbers as IconType },
];

// Periods will be translated dynamically
const PERIODS = [
  { id: 'alltime', nameKey: 'allTime', iconComponent: undefined },
  { id: 'monthly', nameKey: 'thisMonth', iconComponent: MdCalendarToday as IconType },
  { id: 'weekly', nameKey: 'thisWeek', iconComponent: MdBarChart as IconType },
  { id: 'daily', nameKey: 'today', iconComponent: MdTrendingUp as IconType },
];

export default function LeaderboardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('leaderboard');
  const tCommon = useTranslations('common');
  const tGames = useTranslations('games');
  const [selectedGame, setSelectedGame] = useState('quizzz');
  const [selectedPeriod, setSelectedPeriod] = useState('alltime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    
    const user = session.user as { id?: string; playerId?: string };
    setCurrentPlayerId(user.playerId || user.id || null);
  }, [session, status, router, locale]);

  useEffect(() => {
    if (!currentPlayerId) return;
    
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/leaderboards/${selectedGame}?period=${selectedPeriod}&playerId=${currentPlayerId}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          console.error('Failed to fetch leaderboard:', response.status);
          throw new Error('Failed to load leaderboard');
        }
        
        const raw = await response.json();
        const mapped = {
          entries: (raw.entries || []).map((e: Record<string, unknown>) => ({
            playerId: e.player?.id?.toString() || 'unknown',
            playerName: e.player?.displayName || 'Unknown Player',
            rank: e.rank,
            previousRank: e.previousRank,
            value: e.score,
            metadata: undefined,
          })),
          leaderboardType: 'score',
          period: (raw.metadata?.period || selectedPeriod).toString().toLowerCase(),
          gameId: selectedGame,
          totalPlayers: raw.metadata?.totalEntries || 0,
          lastUpdated: raw.metadata?.lastUpdated || new Date().toISOString(),
        } as LeaderboardData;
        setLeaderboardData(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedGame, selectedPeriod, currentPlayerId]);

  // Loading or auth check
  if (status === 'loading' || !currentPlayerId) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-2xl">{t('loading')}</div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankChange = (entry: LeaderboardEntry) => {
    if (!entry.previousRank || entry.previousRank === entry.rank) return null;
    if (entry.previousRank > entry.rank) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="page-container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-white flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                {t('title')}
              </h1>
              <p className="text-brand-white/80 mt-1">{t('subtitle')}</p>
            </div>
            <LocaleLink
              href="/dashboard"
              className="page-button-secondary border-2 border-brand-accent flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {tCommon('dashboard')}
            </LocaleLink>
          </div>
        </div>
      </header>

      <main className="page-container py-8">
        {/* Game Selection */}
        <div className="page-card p-4 mb-6">
          <h3 className="font-bold text-brand-black mb-3">{t('selectGame')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`p-4 rounded-lg font-medium transition-all border-2 ${
                  selectedGame === game.id
                    ? 'bg-brand-accent text-brand-black border-brand-accent shadow-md scale-105'
                    : 'bg-brand-white text-brand-darkGrey border-brand-darkGrey/20 hover:border-brand-accent'
                }`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="text-sm">{tGames(game.nameKey)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Period Selection */}
        <div className="page-card p-4 mb-6">
          <h3 className="font-bold text-brand-black mb-3">{t('timePeriod')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PERIODS.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`p-3 rounded-lg font-medium transition-all border-2 flex items-center gap-2 ${
                  selectedPeriod === period.id
                    ? 'bg-brand-accent text-brand-black border-brand-accent shadow-md'
                    : 'bg-brand-white text-brand-darkGrey border-brand-darkGrey/20 hover:border-brand-accent'
                }`}
              >
                {period.iconComponent ? <Icon icon={period.iconComponent} size={20} /> : null}
                {t(period.nameKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="page-card p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <p className="text-brand-darkGrey">{t('loadingRankings')}</p>
          </div>
        ) : error || !leaderboardData ? (
          <div className="page-card p-12 text-center">
            <Icon icon={MdSentimentDissatisfied} size={64} className="text-brand-darkGrey mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-black mb-2">{t('unableToLoad')}</h3>
            <p className="text-brand-darkGrey">{error || t('noDataAvailable')}</p>
          </div>
        ) : leaderboardData.entries.length === 0 ? (
          <div className="page-card p-12 text-center">
            <Icon icon={MdSportsEsports} size={64} className="text-brand-darkGrey mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-black mb-2">{t('noRankingsYet')}</h3>
            <p className="text-brand-darkGrey">{t('beFirstToPlay')}</p>
            <LocaleLink
              href="/games"
              className="inline-block mt-6 page-button-primary"
            >
              {tGames('playNow')}
            </LocaleLink>
          </div>
        ) : (
          <div className="page-card overflow-hidden">
            {/* Leaderboard Header */}
            <div className="bg-brand-accent text-brand-black p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {tGames(GAMES.find(g => g.id === selectedGame)?.nameKey || 'quizzz')} {t('rankings')}
                  </h2>
                  <p className="text-brand-black/80 text-sm mt-1">
                    {t(PERIODS.find(p => p.id === selectedPeriod)?.nameKey || 'allTime')} • {leaderboardData.totalPlayers} {t('players')}
                  </p>
                </div>
                <Trophy className="w-12 h-12 opacity-50 text-brand-black" />
              </div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-brand-darkGrey/20">
              {leaderboardData.entries.map((entry, index) => {
                const isCurrentPlayer = entry.playerId === currentPlayerId;
                
                return (
                  <div
                    key={entry.playerId}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isCurrentPlayer ? 'bg-brand-accent/20 border-l-4 border-brand-accent' : 'hover:bg-brand-darkGrey/5'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(entry.rank) || (
                          <div className="text-2xl font-bold text-brand-darkGrey">
                            {entry.rank}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${isCurrentPlayer ? 'text-brand-black' : 'text-brand-black'}`}>
                            {entry.playerName}
                            {isCurrentPlayer && <span className="text-sm font-normal text-brand-accent"> ({t('you')})</span>}
                          </h3>
                          {getRankChange(entry)}
                        </div>
                        {entry.metadata?.level && (
                          <p className="text-sm text-brand-darkGrey">{t('level')} {entry.metadata.level}</p>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-black">
                        {entry.value.toLocaleString()}
                      </div>
                      {entry.metadata?.gamesPlayed && (
                        <p className="text-xs text-brand-darkGrey">
                          {entry.metadata.gamesPlayed} {entry.metadata.gamesPlayed === 1 ? t('game') : t('games')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-brand-darkGrey/5 p-4 text-center text-sm text-brand-darkGrey">
              {t('lastUpdated')}: {new Date(leaderboardData.lastUpdated).toLocaleString('hu-HU')}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
