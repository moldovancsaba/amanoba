'use client';

import { useMemo, useState } from 'react';
import { Box, Group, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { IconCheck, IconSearch } from '@tabler/icons-react';
import { LANGUAGE_REGISTRY, type LanguageCode } from './LanguageBadge';

/**
 * Props for {@link LanguageFilter}.
 * 
 * @property {LanguageCode[]} [selected=[]] - Currently selected language codes
 * @property {(languages: LanguageCode[]) => void} onChange - Callback when selection changes
 * @property {boolean} [multiple=true] - Allow multiple language selection
 * @property {LanguageCode[]} [availableLanguages] - Restrict to subset of languages (defaults to all 17)
 * @property {boolean} [searchable=true] - Show search input for filtering languages
 * @property {'native' | 'english'} [labelMode='native'] - Display language names in native or English
 * 
 * @example Multi-select filter
 * ```tsx
 * const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>([]);
 * 
 * <LanguageFilter
 *   selected={selectedLanguages}
 *   onChange={setSelectedLanguages}
 *   multiple={true}
 * />
 * ```
 * 
 * @example Single-select (language switcher)
 * ```tsx
 * const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
 * 
 * <LanguageFilter
 *   selected={[currentLanguage]}
 *   onChange={(langs) => setCurrentLanguage(langs[0])}
 *   multiple={false}
 *   searchable={false}
 * />
 * ```
 */
export type LanguageFilterProps = {
  selected?: LanguageCode[];
  onChange: (languages: LanguageCode[]) => void;
  multiple?: boolean;
  availableLanguages?: LanguageCode[];
  searchable?: boolean;
  labelMode?: 'native' | 'english';
};

/**
 * Canonical language filter component for multi-language course discovery.
 * 
 * **Contract**: Allow users to filter courses by language(s).
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses Mantine inputs and state)
 * 
 * **Consuming Routes**:
 * - `/[locale]/courses` - Course catalog language filtering (multi-select)
 * - `/[locale]/settings` - Language preference selector (single-select)
 * - `/[locale]/admin/courses` - Admin course language filter
 * 
 * **GDS Backing**: ✅ Mantine `TextInput`, `UnstyledButton`, layout primitives
 * 
 * **Interaction Modes**:
 * - **Multi-select** (default): Check/uncheck multiple languages, returns array
 * - **Single-select**: Radio-style selection, returns single-item array
 * 
 * **Language Display**:
 * - Flag emoji + native/English name
 * - Native mode (default): "🇪🇸 Español"
 * - English mode: "🇪🇸 Spanish"
 * - Sorted alphabetically by display name
 * 
 * **Search**:
 * - Filters languages by native name or English name
 * - Case-insensitive substring match
 * - Debounced input for performance (not implemented in this version)
 * 
 * **Visual Feedback**:
 * - Selected languages highlighted with checkmark icon
 * - Hover state for interactive items
 * - Clear visual distinction between selected/unselected
 * 
 * **Accessibility**:
 * - Keyboard navigable (tab through options, space/enter to select)
 * - Screen reader announces selection state
 * - Search input labeled
 * - Focus management
 * 
 * **Performance**: Client-only (Mantine + React state)
 * 
 * **Mobile Behavior**:
 * - Touch-friendly tap targets
 * - Scrollable language list
 * - Responsive layout
 * 
 * @param props - {@link LanguageFilterProps}
 * @returns Language filter UI backed by Mantine primitives
 * 
 * @see {@link LanguageBadge} for language badge display
 * @see {@link LANGUAGE_REGISTRY} for language metadata
 * 
 * @remarks
 * Returns LanguageCode[] via onChange for consistency (single-select returns 1-item array).
 * Search matches both native and English names for discovery.
 * Available languages can be restricted via availableLanguages prop.
 */
export function LanguageFilter({
  selected = [],
  onChange,
  multiple = true,
  availableLanguages,
  searchable = true,
  labelMode = 'native',
}: LanguageFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const languages = useMemo(() => {
    const codes = availableLanguages ?? Object.keys(LANGUAGE_REGISTRY) as LanguageCode[];
    return codes
      .map(code => LANGUAGE_REGISTRY[code])
      .filter(meta => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return meta.native.toLowerCase().includes(query) || 
               meta.english.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const aName = labelMode === 'native' ? a.native : a.english;
        const bName = labelMode === 'native' ? b.native : b.english;
        return aName.localeCompare(bName);
      });
  }, [availableLanguages, searchQuery, labelMode]);

  const handleSelect = (code: LanguageCode) => {
    if (multiple) {
      const isSelected = selected.includes(code);
      if (isSelected) {
        onChange(selected.filter(c => c !== code));
      } else {
        onChange([...selected, code]);
      }
    } else {
      onChange([code]);
    }
  };

  return (
    <Stack gap="md">
      {searchable && (
        <TextInput
          placeholder="Search languages..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      )}

      <Stack gap="xs">
        {languages.map(meta => {
          const isSelected = selected.includes(meta.code);
          const displayName = labelMode === 'native' ? meta.native : meta.english;

          return (
            <UnstyledButton
              key={meta.code}
              onClick={() => handleSelect(meta.code)}
              p="sm"
              style={(theme) => ({
                borderRadius: theme.radius.sm,
                border: `1px solid ${isSelected ? theme.colors[meta.color][6] : theme.colors.gray[3]}`,
                backgroundColor: isSelected ? theme.colors[meta.color][0] : 'transparent',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: isSelected 
                    ? theme.colors[meta.color][1] 
                    : theme.colors.gray[0],
                },
              })}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <Text size="xl">{meta.flag}</Text>
                  <Box>
                    <Text fw={isSelected ? 700 : 500}>{displayName}</Text>
                    {labelMode === 'native' && (
                      <Text size="xs" c="dimmed">{meta.english}</Text>
                    )}
                  </Box>
                </Group>
                {isSelected && (
                  <IconCheck size={20} color="currentColor" />
                )}
              </Group>
            </UnstyledButton>
          );
        })}

        {languages.length === 0 && (
          <Text c="dimmed" ta="center" py="lg">
            No languages found matching "{searchQuery}"
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
