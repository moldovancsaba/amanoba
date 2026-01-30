/**
 * Icon Component
 * 
 * Replaces emojis with Material Icons from react-icons
 * Provides consistent icon styling across the application
 */

import { 
  MdDiamond, 
  MdEmojiEvents, 
  MdStar, 
  MdGpsFixed, 
  MdMenuBook, 
  MdEmail, 
  MdPsychology, 
  MdCardMembership, 
  MdNumbers, 
  MdCheckCircle, 
  MdCancel, 
  MdSentimentDissatisfied, 
  MdCalendarToday, 
  MdAutoAwesome, 
  MdCelebration, 
  MdStars, 
  MdBolt, 
  MdFitnessCenter, 
  MdLocalFireDepartment, 
  MdBarChart, 
  MdMap, 
  MdCardGiftcard, 
  MdPerson, 
  MdAutoStories, 
  MdTrendingUp,
  MdSportsEsports,
  MdGamepad,
  MdVideogameAsset,
  MdSchool,
  MdQuiz,
  MdExtension,
  MdWorkspacePremium,
  MdLock,
  MdLockOpen,
  MdAccessTime,
  MdMyLocation,
  MdFlag,
  MdRocketLaunch,
} from 'react-icons/md';
import { IconType } from 'react-icons';

// Emoji to Icon mapping
const EMOJI_TO_ICON: Record<string, IconType> = {
  '💎': MdDiamond,
  '🏆': MdEmojiEvents,
  '⭐': MdStar,
  '🎯': MdGpsFixed,
  '📚': MdMenuBook,
  '📧': MdEmail,
  '🧠': MdPsychology,
  '🃏': MdCardMembership,
  '🔢': MdNumbers,
  '✅': MdCheckCircle,
  '❌': MdCancel,
  '😕': MdSentimentDissatisfied,
  '📅': MdCalendarToday,
  '✨': MdAutoAwesome,
  '🎉': MdCelebration,
  '👑': MdStars,
  '⚡': MdBolt,
  '💪': MdFitnessCenter,
  '🔥': MdLocalFireDepartment,
  '📊': MdBarChart,
  '🗺️': MdMap,
  '🏅': MdEmojiEvents,
  '🎁': MdCardGiftcard,
  '👤': MdPerson,
  '📖': MdAutoStories,
  '📈': MdTrendingUp,
  '🎮': MdSportsEsports,
  '🎲': MdGamepad,
  '🎰': MdVideogameAsset,
  '📝': MdSchool,
  '❓': MdQuiz,
  '🧩': MdExtension,
};

interface IconProps {
  emoji?: string;
  icon?: IconType;
  className?: string;
  size?: number | string;
}

/**
 * Icon component that replaces emojis with Material Icons
 * 
 * Usage:
 * <Icon emoji="💎" size={24} />
 * <Icon icon={MdDiamond} size={24} />
 */
export default function Icon({ emoji, icon, className = '', size = 24 }: IconProps) {
  // If icon is provided directly, use it
  if (icon) {
    const IconComponent = icon;
    return <IconComponent className={className} size={size} />;
  }

  // If emoji is provided, map it to an icon
  if (emoji) {
    const IconComponent = EMOJI_TO_ICON[emoji];
    if (IconComponent) {
      return <IconComponent className={className} size={size} />;
    }
    // Fallback: return the emoji if no mapping exists
    if (process.env.NODE_ENV === 'development') console.warn(`No icon mapping found for emoji: ${emoji}`);
    return <span className={className} style={{ fontSize: size }}>{emoji}</span>;
  }

  return null;
}

// Export commonly used icons for direct use
export {
  MdDiamond,
  MdEmojiEvents,
  MdStar,
  MdGpsFixed,
  MdMenuBook,
  MdEmail,
  MdPsychology,
  MdCardMembership,
  MdNumbers,
  MdCheckCircle,
  MdCancel,
  MdSentimentDissatisfied,
  MdCalendarToday,
  MdAutoAwesome,
  MdCelebration,
  MdStars,
  MdBolt,
  MdFitnessCenter,
  MdLocalFireDepartment,
  MdBarChart,
  MdMap,
  MdCardGiftcard,
  MdPerson,
  MdAutoStories,
  MdTrendingUp,
  MdSportsEsports,
  MdGamepad,
  MdVideogameAsset,
  MdSchool,
  MdQuiz,
  MdExtension,
  MdWorkspacePremium,
  MdLock,
  MdLockOpen,
  MdAccessTime,
  MdMyLocation,
  MdFlag,
  MdRocketLaunch,
};
