'use client';

/**
 * Theme Toggle Component
 * 
 * Button to switch between light and dark themes.
 * 
 * Why this implementation:
 * - Client component for theme state access
 * - Animated icon transitions
 * - Accessible button with proper labels
 * - Handles loading state to prevent hydration mismatch
 */

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ActionIcon, Skeleton } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Why: Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton circle h={40} w={40} />;
  }

  const isDark = theme === 'dark';

  return (
    <ActionIcon
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      variant="default"
      size={40}
      radius="md"
      aria-label="Toggle theme"
    >
      {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
    </ActionIcon>
  );
}
