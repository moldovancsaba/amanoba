/**
 * User Profile Page
 * 
 * Comprehensive public profile displaying user stats, achievements,
 * recent activity, and progression. Features tabbed navigation and
 * responsive design.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PlayerAvatar from '@/components/PlayerAvatar';
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  CreditCard,
  Award,
  Settings,
  Upload,
  Save,
  Link as LinkIcon,
  Check,
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function ProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const { data: session } = useSession();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity' | 'payments' | 'settings'>('overview');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [certificatesData, setCertificatesData] = useState<any[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [profileSaveLoading, setProfileSaveLoading] = useState(false);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [certificateLinkCopiedId, setCertificateLinkCopiedId] = useState<string | null>(null);

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
          setEditDisplayName(data.profile?.player?.displayName ?? '');
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

  // Check if viewing own profile - MUST be defined BEFORE useEffect that uses it
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const currentUserId = user?.playerId || user?.id;
  const isOwnProfile = currentUserId === playerId;

  // Step 8: Fetch payment history (only for own profile)
  useEffect(() => {
    if (!isOwnProfile || !session) return;

    const fetchPayments = async () => {
      setPaymentLoading(true);
      try {
        const res = await fetch('/api/payments/history');
        const data = await res.json();
        if (data.success) {
          setPaymentData(data.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      } finally {
        setPaymentLoading(false);
      }
    };

    fetchPayments();
  }, [isOwnProfile, session]);

  // Fetch certificates (for all profiles)
  useEffect(() => {
    if (!playerId) return;

    const fetchCertificates = async () => {
      setCertificatesLoading(true);
      try {
        // Get enrolled courses
        const coursesRes = await fetch(`/api/profile/${playerId}/courses`);
        const coursesData = await coursesRes.json();
        
        if (coursesData.success && coursesData.courses.length > 0) {
          // For each course, check certificate status
          const certificatePromises = coursesData.courses.map(async (course: any) => {
            try {
              const statusRes = await fetch(`/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(course.courseId)}`);
              const statusData = await statusRes.json();
              if (statusData.success && statusData.data.certificateEligible) {
                return {
                  courseId: course.courseId,
                  courseTitle: course.title,
                  score: statusData.data.finalExamScore,
                  verificationSlug: statusData.data.verificationSlug ?? null,
                };
              }
              return null;
            } catch (error) {
              console.error(`Failed to fetch certificate status for ${course.courseId}:`, error);
              return null;
            }
          });

          const certificates = (await Promise.all(certificatePromises)).filter((c) => c !== null);
          setCertificatesData(certificates);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                    <div className="bg-brand-black/20 rounded-lg p-3 relative">
                      <div className="text-gray-400 text-sm">Certificates</div>
                      <div className="text-white text-2xl font-bold">
                        {certificatesData.length}
                      </div>
                      {certificatesData.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-brand-black" />
                        </div>
                      )}
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
              
              {/* Step 4: Add Tabs */}
              <div className="flex gap-2 mb-6 mt-8">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'activity', label: 'Activity', icon: Clock },
                  ...(isOwnProfile ? [{ id: 'payments', label: 'Payments', icon: CreditCard }] : []),
                  ...(isOwnProfile ? [{ id: 'settings', label: 'Profile settings', icon: Settings }] : []),
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-brand-darkGrey text-brand-white'
                          : 'bg-brand-darkGrey text-brand-white/70 hover:bg-brand-black/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Step 5: Add Overview Tab Content */}
                    {/* Streaks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">🔥</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Win Streak</h3>
                            <p className="text-gray-400 text-sm">Current winning streak</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Current</div>
                            <div className="text-3xl font-bold text-orange-400">
                              {profileData.streaks?.win?.current || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Best</div>
                            <div className="text-3xl font-bold text-orange-400">
                              {profileData.streaks?.win?.longest || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">📅</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                            <p className="text-gray-400 text-sm">Consecutive login days</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Current</div>
                            <div className="text-3xl font-bold text-green-400">
                              {profileData.streaks?.daily?.current || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Best</div>
                            <div className="text-3xl font-bold text-green-400">
                              {profileData.streaks?.daily?.longest || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet & Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.wallet && (
                        <div className="page-card-dark p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-2xl">💰</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Points Wallet</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Current Balance</span>
                              <span className="text-white font-bold">
                                {profileData.wallet.currentBalance.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lifetime Earned</span>
                              <span className="text-green-400 font-bold">
                                {profileData.wallet.lifetimeEarned.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lifetime Spent</span>
                              <span className="text-red-400 font-bold">
                                {profileData.wallet.lifetimeSpent.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">🎯</span>
                          </div>
                          <h3 className="text-xl font-bold text-white">Performance</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Highest Score</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.highestScore?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Perfect Games</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.perfectGames || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Session</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.averageSessionTime
                                ? `${Math.round(profileData.statistics.averageSessionTime / 60)}m`
                                : '0m'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="page-card-dark p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Achievements</h3>
                    <p className="text-gray-400">Achievements content will be added in Step 6.</p>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="page-card-dark p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Activity</h3>
                    <p className="text-gray-400">Activity content will be added in Step 7.</p>
                  </div>
                )}

                {activeTab === 'payments' && isOwnProfile && (
                  <div className="page-card-dark p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Payments</h3>
                    <p className="text-gray-400">Payments content will be added in Step 8.</p>
                  </div>
                )}

                {activeTab === 'settings' && isOwnProfile && (
                  <div className="page-card-dark p-6 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Profile customization</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Profile photo</label>
                      <div className="flex items-center gap-4">
                        <PlayerAvatar
                          playerId={profileData.player?.id}
                          displayName={profileData.player?.displayName || 'Unknown'}
                          profilePicture={profileData.player?.profilePicture}
                          level={profileData.progression?.level || 1}
                          isPremium={profileData.player?.isPremium || false}
                          size="xl"
                          clickable={false}
                        />
                        <label className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 cursor-pointer disabled:opacity-50">
                          <Upload className="w-5 h-5" />
                          {photoUploadLoading ? 'Uploading...' : 'Change photo'}
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={photoUploadLoading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setPhotoUploadLoading(true);
                              try {
                                const formData = new FormData();
                                formData.append('image', file);
                                const res = await fetch('/api/profile/photo', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success && playerId) {
                                  const profileRes = await fetch(`/api/profile/${playerId}`);
                                  const profileJson = await profileRes.json();
                                  if (profileJson.success) setProfileData(profileJson.profile);
                                } else {
                                  alert(data.error || 'Failed to upload photo');
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Failed to upload photo');
                              } finally {
                                setPhotoUploadLoading(false);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP or GIF, max 5MB</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display name (nickname)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          maxLength={50}
                          className="flex-1 px-4 py-2 bg-brand-black/40 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent"
                          placeholder="Your display name"
                        />
                        <button
                          type="button"
                          disabled={profileSaveLoading || editDisplayName.trim() === (profileData.player?.displayName ?? '')}
                          onClick={async () => {
                            setProfileSaveLoading(true);
                            try {
                              const res = await fetch('/api/profile', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ displayName: editDisplayName.trim() }),
                              });
                              const data = await res.json();
                              if (data.success && playerId) {
                                const profileRes = await fetch(`/api/profile/${playerId}`);
                                const profileJson = await profileRes.json();
                                if (profileJson.success) {
                                  setProfileData(profileJson.profile);
                                  setEditDisplayName(profileJson.profile?.player?.displayName ?? '');
                                }
                              } else {
                                alert(data.error || 'Failed to save');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Failed to save');
                            } finally {
                              setProfileSaveLoading(false);
                            }
                          }}
                          className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {profileSaveLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Shown on profile, leaderboards, certificates. Max 50 characters.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Profile visibility</label>
                      <select
                        value={profileData.player?.profileVisibility ?? 'private'}
                        onChange={async (e) => {
                          const val = e.target.value as 'public' | 'private';
                          setProfileSaveLoading(true);
                          try {
                            const res = await fetch('/api/profile', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ profileVisibility: val }),
                            });
                            const data = await res.json();
                            if (data.success && playerId) {
                              const profileRes = await fetch(`/api/profile/${playerId}`);
                              const profileJson = await profileRes.json();
                              if (profileJson.success) setProfileData(profileJson.profile);
                            } else {
                              alert(data.error || 'Failed to save');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Failed to save');
                          } finally {
                            setProfileSaveLoading(false);
                          }
                        }}
                        className="px-4 py-2 bg-brand-black/40 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-accent"
                      >
                        <option value="private">Private — only you can see your profile</option>
                        <option value="public">Public — others can see your profile</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">When private, others see &quot;Profile not available&quot;.</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 4: Add Tabs */}
              <div className="flex gap-2 mb-6 mt-8">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'activity', label: 'Activity', icon: Clock },
                  ...(isOwnProfile ? [{ id: 'payments', label: 'Payments', icon: CreditCard }] : []),
                  ...(isOwnProfile ? [{ id: 'settings', label: 'Profile settings', icon: Settings }] : []),
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-brand-darkGrey text-brand-white'
                          : 'bg-brand-darkGrey text-brand-white/70 hover:bg-brand-black/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Step 5: Add Overview Tab Content */}
                    {/* Streaks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">🔥</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Win Streak</h3>
                            <p className="text-gray-400 text-sm">Current winning streak</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Current</div>
                            <div className="text-3xl font-bold text-orange-400">
                              {profileData.streaks?.win?.current || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Best</div>
                            <div className="text-3xl font-bold text-orange-400">
                              {profileData.streaks?.win?.longest || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">📅</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                            <p className="text-gray-400 text-sm">Consecutive login days</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Current</div>
                            <div className="text-3xl font-bold text-green-400">
                              {profileData.streaks?.daily?.current || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Best</div>
                            <div className="text-3xl font-bold text-green-400">
                              {profileData.streaks?.daily?.longest || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet & Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.wallet && (
                        <div className="page-card-dark p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-2xl">💰</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Points Wallet</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Current Balance</span>
                              <span className="text-white font-bold">
                                {profileData.wallet.currentBalance.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lifetime Earned</span>
                              <span className="text-green-400 font-bold">
                                {profileData.wallet.lifetimeEarned.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lifetime Spent</span>
                              <span className="text-red-400 font-bold">
                                {profileData.wallet.lifetimeSpent.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="page-card-dark p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-2xl">🎯</span>
                          </div>
                          <h3 className="text-xl font-bold text-white">Performance</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Highest Score</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.highestScore?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Perfect Games</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.perfectGames || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Session</span>
                            <span className="text-white font-bold">
                              {profileData.statistics?.averageSessionTime
                                ? `${Math.round(profileData.statistics.averageSessionTime / 60)}m`
                                : '0m'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="page-card-dark p-6 mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Certificates</h3>
                      </div>
                      {certificatesLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-brand-black/20 rounded-lg p-4 animate-pulse">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="h-5 bg-brand-darkGrey/50 rounded w-3/4 mb-2"></div>
                                  <div className="h-4 bg-brand-darkGrey/50 rounded w-1/2"></div>
                                </div>
                                <div className="h-4 bg-brand-darkGrey/50 rounded w-24"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : certificatesData.length > 0 ? (
                        <div className="space-y-3">
                          {certificatesData.map((cert) => {
                            const handleCopyLink = (e: React.MouseEvent) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!cert.verificationSlug) return;
                              const url = `${window.location.origin}/${locale}/certificate/${cert.verificationSlug}`;
                              navigator.clipboard.writeText(url).then(() => {
                                setCertificateLinkCopiedId(cert.courseId);
                                setTimeout(() => setCertificateLinkCopiedId(null), 2000);
                              });
                            };
                            return (
                              <div
                                key={cert.courseId}
                                className="block bg-brand-black/20 rounded-lg p-4 hover:bg-brand-black/30 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <a
                                    href={`/${locale}/profile/${playerId}/certificate/${cert.courseId}`}
                                    className="flex-1 min-w-0"
                                  >
                                    <h4 className="text-white font-bold">{cert.courseTitle}</h4>
                                    {cert.score !== null && (
                                      <p className="text-gray-400 text-sm">Score: {cert.score}%</p>
                                    )}
                                  </a>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {cert.verificationSlug && (
                                      <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-darkGrey/80 text-gray-300 hover:bg-brand-darkGrey text-sm font-medium border border-brand-accent/30"
                                      >
                                        {certificateLinkCopiedId === cert.courseId ? (
                                          <>
                                            <Check className="w-4 h-4 text-green-400" />
                                            Copied
                                          </>
                                        ) : (
                                          <>
                                            <LinkIcon className="w-4 h-4 text-brand-accent" />
                                            Copy link
                                          </>
                                        )}
                                      </button>
                                    )}
                                    <a
                                      href={`/${locale}/profile/${playerId}/certificate/${cert.courseId}`}
                                      className="text-brand-accent font-medium whitespace-nowrap"
                                    >
                                      View Certificate →
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No certificates yet</p>
                          <p className="text-gray-500 text-sm mt-2">
                            Complete courses and pass final exams to earn certificates
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'achievements' && (
                  <div className="page-card-dark p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold text-white">Achievement Progress</h3>
                        <span className="text-indigo-300 text-lg font-semibold">
                          {profileData.achievements?.progress || 0}% Complete
                        </span>
                      </div>
                      <div className="h-3 bg-brand-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-darkGrey"
                          style={{ width: `${profileData.achievements?.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profileData.achievements?.featured && profileData.achievements.featured.length > 0 ? (
                        profileData.achievements.featured.map((achievement: any) => (
                          <div key={achievement.id} className="bg-brand-black/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-brand-darkGrey/40 rounded-lg flex items-center justify-center text-2xl text-white">
                                {achievement.icon || '🏆'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-bold">{achievement.name}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    achievement.tier === 'legendary' ? 'bg-amber-600 text-white' :
                                    achievement.tier === 'epic' ? 'bg-purple-500 text-white' :
                                    achievement.tier === 'rare' ? 'bg-blue-500 text-white' :
                                    'bg-gray-500 text-white'
                                  }`}>
                                    {achievement.tier?.toUpperCase() || 'COMMON'}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                                <p className="text-gray-500 text-xs">
                                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-400">No achievements unlocked yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="page-card-dark p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-3">
                      {profileData.recentActivity && profileData.recentActivity.length > 0 ? (
                        profileData.recentActivity.map((activity: any, index: number) => (
                          <div key={index} className="bg-brand-black/20 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">{activity.gameIcon || '🎮'}</div>
                              <div>
                                <h4 className="text-white font-semibold">{activity.gameName}</h4>
                                <p className="text-gray-400 text-sm">
                                  {activity.outcome === 'win' ? '🏆 Victory' :
                                   activity.outcome === 'loss' ? '❌ Defeat' : '🤝 Draw'}
                                  {' · '}Score: {activity.score}
                                  {' · '}+{activity.pointsEarned} points
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">
                                {new Date(activity.playedAt).toLocaleDateString()}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {Math.round(activity.duration / 60)}m {activity.duration % 60}s
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-400">No recent activity.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && isOwnProfile && (
                  <div className="page-card-dark p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Payment History</h3>
                    {paymentLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading payment history...</div>
                    ) : paymentData && paymentData.length > 0 ? (
                      <div className="space-y-3">
                        {paymentData.map((tx: any) => {
                          const formattedAmount = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: tx.currency.toUpperCase(),
                          }).format(tx.amount / 100);

                          const statusColors: Record<string, string> = {
                            succeeded: 'text-green-400',
                            pending: 'text-yellow-400',
                            failed: 'text-red-400',
                            refunded: 'text-gray-400',
                          };

                          return (
                            <div key={tx.id} className="bg-brand-black/20 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-white font-semibold mb-1">
                                    {tx.courseName || 'Premium Access'}
                                  </h4>
                                  <p className="text-gray-400 text-sm">
                                    {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-bold text-lg">{formattedAmount}</div>
                                  <div className={`text-sm ${statusColors[tx.status] || 'text-gray-400'}`}>
                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-brand-black/40">
                                {tx.premiumGranted && tx.premiumExpiresAt && (
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Premium Expires</p>
                                    <p className="text-white text-sm">
                                      {new Date(tx.premiumExpiresAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                  </div>
                                )}
                                {tx.paymentMethod && (
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Payment Method</p>
                                    <p className="text-white text-sm">
                                      {tx.paymentMethod.brand ? (
                                        <>
                                          {tx.paymentMethod.brand.charAt(0).toUpperCase() + tx.paymentMethod.brand.slice(1)}
                                          {' •••• '}
                                          {tx.paymentMethod.last4}
                                        </>
                                      ) : (
                                        'Card'
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {tx.stripeCheckoutSessionId && (
                                <p className="text-gray-500 text-xs mt-3">
                                  Transaction ID: {tx.stripePaymentIntentId}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No payment history</p>
                        <p className="text-gray-500 text-sm mt-2">
                          Your payment transactions will appear here
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
