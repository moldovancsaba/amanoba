'use client';

/**
 * Rewards Page
 * 
 * Why: Display rewards store with beautiful UI instead of raw JSON
 * What: Shows available rewards for redemption with points balance
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gift, ChevronLeft, Sparkles, ShoppingCart, Check, AlertCircle } from 'lucide-react';

interface Reward {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pointsCost: number;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  stock?: number;
  isPremiumOnly: boolean;
}

const TIER_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const playerId = (session.user as any).playerId;
        
        // Fetch rewards
        const rewardsResponse = await fetch('/api/rewards');
        if (!rewardsResponse.ok) {
          throw new Error('Failed to load rewards');
        }
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData.rewards || []);
        
        // Fetch player data for points
        const playerResponse = await fetch(`/api/players/${playerId}`);
        if (!playerResponse.ok) {
          throw new Error('Failed to load player data');
        }
        const playerData = await playerResponse.json();
        setPlayerPoints(playerData.wallet?.currentBalance || 0);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if (playerPoints < pointsCost) {
      return;
    }
    
    setRedeeming(rewardId);
    setRedeemSuccess(null);
    
    try {
      const playerId = (session!.user as any).playerId;
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          rewardId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to redeem reward');
      }
      
      const data = await response.json();
      setPlayerPoints(data.newBalance);
      setRedeemSuccess(rewardId);
      
      setTimeout(() => setRedeemSuccess(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading rewards...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Rewards</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(rewards.map(r => r.category))];
  const filteredRewards = filterCategory === 'all'
    ? rewards.filter(r => r.isActive)
    : rewards.filter(r => r.isActive && r.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Gift className="w-10 h-10" />
                Rewards Store
              </h1>
              <p className="text-white/80 mt-1">Redeem your points for awesome rewards</p>
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
        {/* Points Balance */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Points Balance</h2>
              <p className="text-gray-600">Use your points to redeem rewards</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-purple-600">
                {playerPoints.toLocaleString()}
              </div>
              <div className="text-gray-600 flex items-center gap-2 justify-end">
                <span className="text-2xl">💎</span>
                <span>Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map(reward => {
              const canAfford = playerPoints >= reward.pointsCost;
              const isRedeeming = redeeming === reward._id;
              const wasRedeemed = redeemSuccess === reward._id;

              return (
                <div
                  key={reward._id}
                  className={`bg-white rounded-xl shadow-lg p-6 relative overflow-hidden transition-all ${
                    canAfford ? 'border-2 border-green-500' : 'border-2 border-gray-300 opacity-75'
                  }`}
                >
                  {reward.isPremiumOnly && (
                    <div className="absolute top-0 left-0 bg-yellow-400 text-black px-3 py-1 rounded-br-lg font-bold text-xs">
                      ⭐ PREMIUM
                    </div>
                  )}
                  
                  {wasRedeemed && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg font-bold text-sm animate-pulse">
                      <Check className="w-4 h-4 inline mr-1" />
                      Redeemed!
                    </div>
                  )}
                  
                  <div className="text-6xl mb-4 text-center">{reward.icon}</div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${TIER_COLORS[reward.tier]} text-white`}>
                    {reward.tier.toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {reward.description}
                  </p>
                  
                  {reward.stock !== undefined && reward.stock > 0 && (
                    <div className="text-xs text-orange-600 font-medium mb-3">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Only {reward.stock} left in stock!
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      💎 {reward.pointsCost.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                      {reward.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleRedeem(reward._id, reward.pointsCost)}
                    disabled={!canAfford || isRedeeming || wasRedeemed}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                      canAfford && !wasRedeemed
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Redeeming...
                      </>
                    ) : wasRedeemed ? (
                      <>
                        <Check className="w-5 h-5" />
                        Redeemed!
                      </>
                    ) : !canAfford ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Not Enough Points
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Redeem Now
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No rewards available
            </h3>
            <p className="text-gray-600">
              {filterCategory === 'all'
                ? 'Check back later for new rewards!'
                : 'Try selecting a different category or check back later!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
