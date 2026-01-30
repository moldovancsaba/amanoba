/**
 * Admin Games Management Page
 * 
 * What: Manage all games in the platform
 * Why: Allows admins to view, create, edit, and configure games
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Gamepad2,
} from 'lucide-react';

interface Game {
  _id: string;
  gameId: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  isPremium: boolean;
  isAssessment: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminGamesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/games');
      const data = await response.json();

      if (data.success) {
        // Filter by search if provided
        let filteredGames = data.games || [];
        if (search) {
          filteredGames = filteredGames.filter((game: Game) =>
            game.name.toLowerCase().includes(search.toLowerCase()) ||
            game.gameId.toLowerCase().includes(search.toLowerCase())
          );
        }
        setGames(filteredGames);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  const toggleGameStatus = async (_gameId: string, _currentStatus: boolean) => {
    try {
      // TODO: Create API endpoint for updating game status
      // For now, just refresh the list
      alert('Game status update coming soon');
      fetchGames();
    } catch (error) {
      console.error('Failed to toggle game status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('gamesManagement')}</h1>
          <p className="text-gray-400">{t('gamesDescription')}</p>
        </div>
        <Link
          href={`/${locale}/admin/games/new`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addGame')}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchGames')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Games Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {t('game')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('premium')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {t('assessment')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {games.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    {tCommon('noDataFound')}
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {game.thumbnail ? (
                          <img
                            src={game.thumbnail}
                            alt={game.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">{game.name}</div>
                          <div className="text-gray-400 text-sm">{game.gameId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{game.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleGameStatus(game._id, game.isActive)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          game.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {game.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            {tCommon('active')}
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            {tCommon('inactive')}
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {game.isPremium ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                          {tCommon('premium')}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">{tCommon('free')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {game.isAssessment ? (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          {t('assessment')}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/admin/games/${game._id}`}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          title={tCommon('edit')}
                        >
                          <Edit className="w-4 h-4 text-gray-300" />
                        </Link>
                        <button
                          className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                          title={tCommon('delete')}
                        >
                          <Trash2 className="w-4 h-4 text-gray-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('totalGames')}</div>
          <div className="text-2xl font-bold text-white">{games.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('activeGames')}</div>
          <div className="text-2xl font-bold text-green-400">
            {games.filter((g) => g.isActive).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('assessmentGames')}</div>
          <div className="text-2xl font-bold text-blue-400">
            {games.filter((g) => g.isAssessment).length}
          </div>
        </div>
      </div>
    </div>
  );
}
