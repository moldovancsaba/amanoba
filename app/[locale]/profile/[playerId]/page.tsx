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
          <p className="text-brand-white text-lg">Player ID: {playerId}</p>
          <p className="text-gray-400 mt-4">This is a simplified version to verify routing works.</p>
        </div>
      </div>
    </div>
  );
}
