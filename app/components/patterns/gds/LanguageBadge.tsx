'use client';

import type { ReactNode } from 'react';
import { Badge } from '@mantine/core';
import type { MantineColor } from '@mantine/core';

/**
 * Language code (ISO 639-1).
 */
export type LanguageCode = 
  | 'hu' | 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'pt' | 'vi' 
  | 'tr' | 'bg' | 'pl' | 'ru' | 'sw' | 'fr' | 'bn' | 'ur' | 'id';

/**
 * Language display metadata.
 */
type LanguageMeta = {
  code: LanguageCode;
  native: string;
  english: string;
  flag: string;
  color: MantineColor;
  script: 'latin' | 'cjk' | 'cyrillic' | 'devanagari' | 'arabic' | 'bengali';
  rtl: boolean;
};

/**
 * Canonical language metadata registry.
 * 
 * Supports all 17 Amanoba languages with native name, flag emoji, color, and script metadata.
 */
export const LANGUAGE_REGISTRY: Record<LanguageCode, LanguageMeta> = {
  hu: { code: 'hu', native: 'Magyar', english: 'Hungarian', flag: '🇭🇺', color: 'green', script: 'latin', rtl: false },
  en: { code: 'en', native: 'English', english: 'English', flag: '🇬🇧', color: 'blue', script: 'latin', rtl: false },
  es: { code: 'es', native: 'Español', english: 'Spanish', flag: '🇪🇸', color: 'yellow', script: 'latin', rtl: false },
  zh: { code: 'zh', native: '简体中文', english: 'Chinese', flag: '🇨🇳', color: 'red', script: 'cjk', rtl: false },
  hi: { code: 'hi', native: 'हिन्दी', english: 'Hindi', flag: '🇮🇳', color: 'orange', script: 'devanagari', rtl: false },
  ar: { code: 'ar', native: 'العربية', english: 'Arabic', flag: '🇸🇦', color: 'teal', script: 'arabic', rtl: true },
  pt: { code: 'pt', native: 'Português', english: 'Portuguese', flag: '🇧🇷', color: 'green', script: 'latin', rtl: false },
  vi: { code: 'vi', native: 'Tiếng Việt', english: 'Vietnamese', flag: '🇻🇳', color: 'red', script: 'latin', rtl: false },
  tr: { code: 'tr', native: 'Türkçe', english: 'Turkish', flag: '🇹🇷', color: 'red', script: 'latin', rtl: false },
  bg: { code: 'bg', native: 'Български', english: 'Bulgarian', flag: '🇧🇬', color: 'green', script: 'cyrillic', rtl: false },
  pl: { code: 'pl', native: 'Polski', english: 'Polish', flag: '🇵🇱', color: 'red', script: 'latin', rtl: false },
  ru: { code: 'ru', native: 'Русский', english: 'Russian', flag: '🇷🇺', color: 'blue', script: 'cyrillic', rtl: false },
  sw: { code: 'sw', native: 'Kiswahili', english: 'Swahili', flag: '🇰🇪', color: 'green', script: 'latin', rtl: false },
  fr: { code: 'fr', native: 'Français', english: 'French', flag: '🇫🇷', color: 'blue', script: 'latin', rtl: false },
  bn: { code: 'bn', native: 'বাংলা', english: 'Bengali', flag: '🇧🇩', color: 'green', script: 'bengali', rtl: false },
  ur: { code: 'ur', native: 'اردو', english: 'Urdu', flag: '🇵🇰', color: 'green', script: 'arabic', rtl: true },
  id: { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', flag: '🇮🇩', color: 'red', script: 'latin', rtl: false },
};

/**
 * Props for {@link LanguageBadge}.
 * 
 * @property {LanguageCode} language - ISO 639-1 language code
 * @property {'native' | 'english' | 'code' | 'flag-only'} [display='native'] - Display format
 * @property {'light' | 'filled' | 'outline'} [variant='light'] - Badge variant
 * @property {boolean} [showFlag=true] - Show flag emoji
 * @property {ReactNode} [leftSection] - Optional left icon (overrides flag)
 * 
 * @example Native name with flag
 * ```tsx
 * <LanguageBadge language="es" />
 * // Renders: 🇪🇸 Español
 * ```
 * 
 * @example English name
 * ```tsx
 * <LanguageBadge language="es" display="english" />
 * // Renders: 🇪🇸 Spanish
 * ```
 * 
 * @example Code only (compact)
 * ```tsx
 * <LanguageBadge language="es" display="code" showFlag={false} />
 * // Renders: ES
 * ```
 */
export type LanguageBadgeProps = {
  language: LanguageCode;
  display?: 'native' | 'english' | 'code' | 'flag-only';
  variant?: 'light' | 'filled' | 'outline';
  showFlag?: boolean;
  leftSection?: ReactNode;
};

/**
 * Canonical language badge component for multi-language course discovery.
 * 
 * **Contract**: Display language metadata (native name, English name, flag, script) consistently.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses Mantine Badge)
 * 
 * **Consuming Routes**:
 * - `/[locale]/courses` - Course catalog filtering
 * - `/[locale]/my-courses` - Enrolled course language display
 * - `/[locale]/dashboard` - Active course language indicator
 * 
 * **GDS Backing**: ✅ Mantine `Badge` primitive
 * 
 * **Display Modes**:
 * - `native`: Native language name with flag (default, e.g., "🇪🇸 Español")
 * - `english`: English name with flag (e.g., "🇪🇸 Spanish")
 * - `code`: Language code uppercase with optional flag (e.g., "🇪🇸 ES")
 * - `flag-only`: Only flag emoji (compact mode, e.g., "🇪🇸")
 * 
 * **Language Metadata**:
 * - All 17 Amanoba languages supported
 * - Native name, English name, flag emoji, color, script type
 * - RTL flag for Arabic/Urdu (future layout support)
 * 
 * **Accessibility**:
 * - Badge color provides visual distinction
 * - Text label readable by screen readers
 * - Flag emoji is decorative (language name conveys meaning)
 * 
 * **Performance**: Client-only (Mantine Badge)
 * 
 * **Mobile Behavior**:
 * - Responsive badge sizing via Mantine
 * - Compact `code` or `flag-only` modes for dense layouts
 * 
 * @param props - {@link LanguageBadgeProps}
 * @returns Language badge backed by Mantine Badge
 * 
 * @see {@link LanguageFilter} for language selection UI
 * @see {@link LANGUAGE_REGISTRY} for metadata
 * 
 * @remarks
 * Color assigned by language (not arbitrary). Script metadata available for font rendering.
 * RTL languages flagged for future bidirectional layout support.
 */
export function LanguageBadge({
  language,
  display = 'native',
  variant = 'light',
  showFlag = true,
  leftSection,
}: LanguageBadgeProps) {
  const meta = LANGUAGE_REGISTRY[language];

  if (!meta) {
    console.warn(`LanguageBadge: Unknown language code "${language}"`);
    return null;
  }

  let label = '';
  
  switch (display) {
    case 'native':
      label = meta.native;
      break;
    case 'english':
      label = meta.english;
      break;
    case 'code':
      label = meta.code.toUpperCase();
      break;
    case 'flag-only':
      label = '';
      break;
  }

  const finalLeftSection = leftSection ?? (showFlag && display !== 'flag-only' ? meta.flag : undefined);

  return (
    <Badge
      color={meta.color}
      variant={variant}
      leftSection={finalLeftSection}
    >
      {display === 'flag-only' ? meta.flag : label}
    </Badge>
  );
}
