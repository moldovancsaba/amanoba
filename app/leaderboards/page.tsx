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
import Link from 'next/link';
import { Trophy, ChevronLeft, Crown, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';

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

const GAMES = [
  { id: 'quizzz', name: 'QUIZZZ', icon: '🧠' },
  { id: 'whackpop', name: 'WHACKPOP', icon: '🎯' },
  { id: 'memory', name: 'Memory', icon: '🃏' },
  { id: 'madoku', name: 'Madoku', icon: '🔢' },
];

const PERIODS = [
  { id: 'alltime', name: 'All Time', icon: '♾️' },
  { id: 'monthly', name: 'This Month', icon: '📅' },
  { id: 'weekly', name: 'This Week', icon: '📊' },
  { id: 'daily', name: 'Today', icon: '📈' },
];

export default function LeaderboardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState('quizzz');
  const [selectedPeriod, setSelectedPeriod] = useState('alltime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setCurrentPlayerId(session.user.id);
  }, [session, status, router]);

  useEffect(() => {
    if (!currentPlayerId) return;
    
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/leaderboards/${selectedGame}?period=${selectedPeriod}&playerId=${currentPlayerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load leaderboard');
        }
        
        const raw = await response.json();
        const mapped = {
          entries: (raw.entries || []).map((e: any) => ({
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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading leaderboards...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                Leaderboards
              </h1>
              <p className="text-white/80 mt-1">Compete for the top spot</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Selection */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Select Game</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`p-4 rounded-lg font-medium transition-all ${
                  selectedGame === game.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="text-sm">{game.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Time Period</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PERIODS.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl mr-2">{period.icon}</span>
                {period.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <p className="text-gray-600">Loading rankings...</p>
          </div>
        ) : error || !leaderboardData ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Leaderboard</h3>
            <p className="text-gray-600">{error || 'No data available'}</p>
          </div>
        ) : leaderboardData.entries.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
            <p className="text-gray-600">Be the first to play and claim the #1 spot!</p>
            <Link
              href="/games"
              className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Play Now
            </Link>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            {/* Leaderboard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {GAMES.find(g => g.id === selectedGame)?.name} Rankings
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {PERIODS.find(p => p.id === selectedPeriod)?.name} • {leaderboardData.totalPlayers} players
                  </p>
                </div>
                <Trophy className="w-12 h-12 opacity-50" />
              </div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-gray-200">
              {leaderboardData.entries.map((entry, index) => {
                const isCurrentPlayer = entry.playerId === currentPlayerId;
                
                return (
                  <div
                    key={entry.playerId}
                    className={`p-4 flex items-center justify-between transition-colors ${
                      isCurrentPlayer ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(entry.rank) || (
                          <div className="text-2xl font-bold text-gray-600">
                            {entry.rank}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${isCurrentPlayer ? 'text-blue-600' : 'text-gray-900'}`}>
                            {entry.playerName}
                            {isCurrentPlayer && <span className="text-sm font-normal text-blue-600"> (You)</span>}
                          </h3>
                          {getRankChange(entry)}
                        </div>
                        {entry.metadata?.level && (
                          <p className="text-sm text-gray-600">Level {entry.metadata.level}</p>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {entry.value.toLocaleString()}
                      </div>
                      {entry.metadata?.gamesPlayed && (
                        <p className="text-xs text-gray-500">
                          {entry.metadata.gamesPlayed} {entry.metadata.gamesPlayed === 1 ? 'game' : 'games'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
              Last updated: {new Date(leaderboardData.lastUpdated).toLocaleString()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
