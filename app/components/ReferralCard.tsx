'use client';

/**
 * Referral Card Component
 * 
 * Shows referral code, share link, stats, and referred friends list
 * Allows easy sharing and tracking of referral rewards
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ReferralData {
  referralCode: string;
  shareUrl: string;
  stats: {
    totalReferrals: number;
    pendingRewards: number;
    completedRewards: number;
    totalPointsEarned: number;
  };
  referrals: Array<{
    id: string;
    referredPlayer: {
      displayName: string;
      joinedAt: string;
    };
    status: string;
    rewardDetails?: {
      pointsEarned: number;
    };
    completedAt?: string;
  }>;
}

export function ReferralCard() {
  const { data: session } = useSession();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!session?.user?.id) return;

      try {
        const playerId = (session.user as any).id;
        const response = await fetch(`/api/referrals?playerId=${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReferralData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [session]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWhatsApp = () => {
    if (!referralData) return;
    const message = encodeURIComponent(
      `Join me on Amanoba! 🎮 Play games, earn achievements, and have fun! Use my referral code: ${referralData.referralCode}\n\n${referralData.shareUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!referralData) return;
    const subject = encodeURIComponent('Join me on Amanoba! 🎮');
    const body = encodeURIComponent(
      `Hi!\n\nI've been playing games on Amanoba and thought you might enjoy it too!\n\nUse my referral code: ${referralData.referralCode}\nOr click here: ${referralData.shareUrl}\n\nSee you in the games!\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🎁</span>
        Invite Friends
      </h3>

      {/* Referral Code Display */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-2xl font-bold text-indigo-600 tracking-wider">
            {referralData.referralCode}
          </code>
          <button
            onClick={() => copyToClipboard(referralData.referralCode)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => copyToClipboard(referralData.shareUrl)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-gray-700"
        >
          <span>🔗</span>
          Copy Link
        </button>
        <button
          onClick={shareViaWhatsApp}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
        >
          <span>📱</span>
          WhatsApp
        </button>
        <button
          onClick={shareViaEmail}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          <span>✉️</span>
          Email
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Join Amanoba!',
                text: `Use my referral code: ${referralData.referralCode}`,
                url: referralData.shareUrl,
              });
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
        >
          <span>📤</span>
          Share
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {referralData.stats.totalReferrals}
          </div>
          <div className="text-xs text-gray-600">Friends Invited</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {referralData.stats.totalPointsEarned}
          </div>
          <div className="text-xs text-gray-600">Points Earned</div>
        </div>
      </div>

      {/* Referred Friends List */}
      {referralData.referrals.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Referred Friends ({referralData.referrals.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {referralData.referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    {referral.referredPlayer.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {referral.referredPlayer.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(referral.referredPlayer.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {referral.status === 'completed' ? (
                    <div className="text-green-600 text-sm font-medium">
                      +{referral.rewardDetails?.pointsEarned || 0} pts
                    </div>
                  ) : (
                    <div className="text-yellow-600 text-xs">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it Works */}
      {referralData.referrals.length === 0 && (
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">🎯 How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Share your referral code with friends</li>
            <li>They sign up using your code</li>
            <li>You both earn bonus points!</li>
          </ol>
        </div>
      )}
    </div>
  );
}
