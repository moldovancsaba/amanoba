/**
 * User Profile Page
 * 
 * Comprehensive public profile displaying user stats, achievements,
 * recent activity, and progression. Features tabbed navigation and
 * responsive design.
 */

'use client';

import { useState, useEffect } from 'react';
import PlayerAvatar from '@/components/PlayerAvatar';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Unwrap async params - following pattern from CourseDetailPage
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setPlayerId(resolvedParams.playerId);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        // Fallback: extract playerId from URL
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const profileIndex = pathParts.findIndex(part => part === 'profile');
          if (profileIndex !== -1 && pathParts[profileIndex + 1]) {
            setPlayerId(pathParts[profileIndex + 1]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  // Step 1: Add API call - fetch profile data when playerId is available
  useEffect(() => {
    if (!playerId) return;

    const fetchProfile = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/profile/${playerId}`);
        const data = await res.json();
        if (data.success) {
          setProfileData(data.profile);
        } else {
          setApiError(data.error || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setApiError('Network error - failed to load profile');
      } finally {
        setApiLoading(false);
      }
    };

    fetchProfile();
  }, [playerId]);

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!playerId) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="page-shell p-6">
      <div className="max-w-6xl mx-auto">
        <div className="page-card-dark rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Page</h1>
          <p className="text-brand-white text-lg mb-4">Player ID: {playerId}</p>
          
          {/* Step 1: Display API call status */}
          {apiLoading && (
            <div className="text-brand-white mb-4">Fetching profile data...</div>
          )}
          
          {apiError && (
            <div className="text-red-400 mb-4">Error: {apiError}</div>
          )}
          
          {profileData && (
            <div className="mt-4">
              {/* Step 3: Add Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                {/* Avatar */}
                <PlayerAvatar
                  playerId={profileData.player?.id}
                  displayName={profileData.player?.displayName || 'Unknown'}
                  profilePicture={profileData.player?.profilePicture}
                  level={profileData.progression?.level || 1}
                  isPremium={profileData.player?.isPremium || false}
                  size="xl"
                  clickable={false}
                />

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-4xl font-bold text-white">
                      {profileData.player?.displayName || 'Unknown Player'}
                    </h2>
                    {profileData.player?.isPremium && (
                      <span className="px-3 py-1 bg-brand-darkGrey text-brand-white rounded-full text-sm font-bold">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <p className="text-2xl text-brand-white font-semibold mb-4">
                    {profileData.progression?.title || 'Rookie'}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-black/20 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Level</div>
                      <div className="text-white text-2xl font-bold">
                        {profileData.progression?.level || 1}
                      </div>
                    </div>
                    <div className="bg-brand-black/20 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Games Played</div>
                      <div className="text-white text-2xl font-bold">
                        {profileData.statistics?.totalGamesPlayed || 0}
                      </div>
                    </div>
                    <div className="bg-brand-black/20 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Win Rate</div>
                      <div className="text-white text-2xl font-bold">
                        {profileData.statistics?.winRate || 0}%
                      </div>
                    </div>
                    <div className="bg-brand-black/20 rounded-lg p-3">
                      <div className="text-gray-400 text-sm">Achievements</div>
                      <div className="text-white text-2xl font-bold">
                        {profileData.achievements?.unlocked || 0}/{profileData.achievements?.total || 0}
                      </div>
                    </div>
                  </div>

                  {/* XP Progress */}
                  {profileData.progression && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>Level {profileData.progression.level}</span>
                        <span>
                          {profileData.progression.currentXP} / {profileData.progression.xpToNextLevel} XP
                        </span>
                      </div>
                      <div className="h-3 bg-brand-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-darkGrey transition-all duration-500"
                          style={{
                            width: `${(profileData.progression.currentXP / profileData.progression.xpToNextLevel) * 100}%`,
                          }}
                        />
                      </div>
                      {profileData.progression.nextTitle && (
                        <p className="text-gray-400 text-sm mt-2">
                          Next title: {profileData.progression.nextTitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Debug: Show API response (can be removed later) */}
              <details className="text-gray-400 text-sm mt-4">
                <summary className="cursor-pointer text-brand-white">View API Response (for debugging)</summary>
                <pre className="mt-2 p-4 bg-brand-black/40 rounded overflow-auto max-h-96">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
