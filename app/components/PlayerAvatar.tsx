/**
 * Player Avatar Component
 * 
 * Reusable avatar component displaying player profile picture with level badge,
 * premium indicator, and online status. Used across profile pages, leaderboards,
 * and social features.
 * 
 * Features:
 * - Profile picture or fallback initials
 * - Level badge overlay
 * - Premium crown indicator
 * - Online status dot
 * - Multiple size variants
 * - Clickable link to profile
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, User } from 'lucide-react';

export interface PlayerAvatarProps {
  playerId: string;
  displayName: string;
  profilePicture?: string;
  level?: number;
  isPremium?: boolean;
  isOnline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  showPremium?: boolean;
  showOnline?: boolean;
  clickable?: boolean;
  className?: string;
}

/**
 * Size mappings for avatar dimensions
 */
const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-2xl',
};

const levelBadgeSize = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-6 h-6 text-xs',
  lg: 'w-8 h-8 text-sm',
  xl: 'w-12 h-12 text-base',
};

const crownSize = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export default function PlayerAvatar({
  playerId,
  displayName,
  profilePicture,
  level,
  isPremium = false,
  isOnline = false,
  size = 'md',
  showLevel = true,
  showPremium = true,
  showOnline = false,
  clickable = true,
  className = '',
}: PlayerAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Get initials from display name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  // Avatar content (image or initials)
  const avatarContent = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Main avatar circle */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 ${
        isPremium ? 'border-yellow-400' : 'border-gray-600'
      } bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center relative`}>
        {profilePicture && !imageError ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${sizeClasses[size]} flex items-center justify-center text-white font-bold`}>
            {initials}
          </div>
        )}
      </div>

      {/* Level badge - bottom right */}
      {showLevel && level !== undefined && (
        <div className={`absolute -bottom-1 -right-1 ${levelBadgeSize[size]} bg-indigo-600 border-2 border-gray-900 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-10`}>
          {level}
        </div>
      )}

      {/* Premium crown - top right */}
      {showPremium && isPremium && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-gray-900 shadow-lg z-10">
          <Crown className={`${crownSize[size]} text-yellow-900`} fill="currentColor" />
        </div>
      )}

      {/* Online status - top left */}
      {showOnline && isOnline && (
        <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full z-10"></div>
      )}
    </div>
  );

  // Return clickable or static avatar
  if (clickable) {
    return (
      <Link
        href={`/profile/${playerId}`}
        className="inline-block transition-transform hover:scale-105"
        title={`View ${displayName}'s profile`}
      >
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
}

/**
 * Player Avatar with Name
 * 
 * Convenience component that displays avatar with name label
 */
export function PlayerAvatarWithName({
  playerId,
  displayName,
  profilePicture,
  level,
  isPremium = false,
  size = 'md',
  showLevel = true,
  namePosition = 'right',
  clickable = true,
}: PlayerAvatarProps & { namePosition?: 'top' | 'right' | 'bottom' }) {
  const content = (
    <>
      <PlayerAvatar
        playerId={playerId}
        displayName={displayName}
        profilePicture={profilePicture}
        level={level}
        isPremium={isPremium}
        size={size}
        showLevel={showLevel}
        clickable={false}
      />
      <span className={`font-semibold ${isPremium ? 'text-yellow-400' : 'text-white'}`}>
        {displayName}
      </span>
    </>
  );

  const flexDirection = {
    top: 'flex-col',
    right: 'flex-row',
    bottom: 'flex-col-reverse',
  };

  if (clickable) {
    return (
      <Link
        href={`/profile/${playerId}`}
        className={`inline-flex items-center gap-2 ${flexDirection[namePosition]} transition-opacity hover:opacity-80`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${flexDirection[namePosition]}`}>
      {content}
    </div>
  );
}

/**
 * Player Avatar List
 * 
 * Display multiple player avatars in a horizontal stack with overlap
 */
export function PlayerAvatarList({
  players,
  maxVisible = 5,
  size = 'sm',
}: {
  players: Array<{ playerId: string; displayName: string; profilePicture?: string; level?: number; isPremium?: boolean }>;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const visiblePlayers = players.slice(0, maxVisible);
  const remainingCount = players.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2">
      {visiblePlayers.map((player) => (
        <div key={player.playerId} className="relative">
          <PlayerAvatar
            {...player}
            size={size}
            showLevel={false}
            showPremium={false}
            className="ring-2 ring-gray-900"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-white font-bold`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
