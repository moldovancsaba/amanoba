/**
 * Admin Home Dashboard
 * 
 * Overview dashboard showing key platform metrics, recent activity,
 * and quick action buttons for common admin tasks.
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Users,
  Gamepad2,
  Trophy,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  // In a real implementation, this would fetch from an admin API
  // For now, using mock data to demonstrate the UI
  const stats = {
    totalPlayers: 1247,
    activePlayers: 342,
    totalGames: 3,
    totalSessions: 5821,
    pointsEarned: 125340,
    achievementsUnlocked: 892,
    revenueThisMonth: 0, // Not monetized yet
    growthRate: 23.5,
  };

  const recentActivity = [
    { type: 'player', message: 'New player registered: John Doe', time: '2 min ago' },
    { type: 'achievement', message: 'Achievement unlocked: First Win (x15)', time: '5 min ago' },
    { type: 'game', message: 'QUIZZZ played 47 times in last hour', time: '1 hour ago' },
    { type: 'reward', message: '8 rewards redeemed today', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Players */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalPlayers.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Players</div>
          <div className="mt-2 text-xs text-gray-500">{stats.activePlayers} active now</div>
        </div>

        {/* Game Sessions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+23%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalSessions.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Game Sessions</div>
          <div className="mt-2 text-xs text-gray-500">This month</div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.achievementsUnlocked.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Achievements Unlocked</div>
          <div className="mt-2 text-xs text-gray-500">This month</div>
        </div>

        {/* Points Economy */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-pink-500" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+31%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.pointsEarned.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Points Earned</div>
          <div className="mt-2 text-xs text-gray-500">This month</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/games"
            className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Add Game</span>
          </Link>

          <Link
            href="/admin/achievements"
            className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Add Achievement</span>
          </Link>

          <Link
            href="/admin/rewards"
            className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Add Reward</span>
          </Link>

          <Link
            href="/admin/players"
            className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Manage Players</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'player' ? 'bg-green-500' :
                  activity.type === 'achievement' ? 'bg-yellow-500' :
                  activity.type === 'game' ? 'bg-blue-500' : 'bg-pink-500'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/analytics"
            className="block mt-4 text-center text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            View All Activity →
          </Link>
        </div>

        {/* Platform Health */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">API Response Time</span>
                <span className="text-green-500">Excellent</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Database Performance</span>
                <span className="text-green-500">Good</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Error Rate</span>
                <span className="text-green-500">Low</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Active Connections</span>
                <span className="text-yellow-500">Normal</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">System Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">Version</div>
            <div className="text-white font-mono">v1.7.0</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Environment</div>
            <div className="text-white">Development</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Database</div>
            <div className="text-green-500">Connected</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Uptime</div>
            <div className="text-white">99.9%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
