/**
 * User Profile Page
 * 
 * Comprehensive public profile displaying user stats, achievements,
 * recent activity, and progression. Features tabbed navigation and
 * responsive design.
 */

'use client';

import { useState, useEffect } from 'react';

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
              <p className="text-green-400 mb-2">✅ API call successful!</p>
              <details className="text-gray-400 text-sm">
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
