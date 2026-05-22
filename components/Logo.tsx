import Image from 'next/image';
import { Box, Group, Text } from '@mantine/core';
import { LocaleLink } from './LocaleLink';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  preventShrink?: boolean;
  linkTo?: string;
}

const logoSizes = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

const textSizes = {
  sm: 'lg',
  md: 'xl',
  lg: 'h2',
} as const;

export default function Logo({ 
  size = 'md', 
  showText = false,
  preventShrink = false,
  linkTo = '/dashboard'
}: LogoProps) {
  const logoSize = logoSizes[size];

  const logoContent = (
    <Group gap="sm" wrap="nowrap" flex={preventShrink ? '0 0 auto' : undefined}>
      <Box w={logoSize} h={logoSize} flex="0 0 auto">
        <Image
          src="/amanoba_logo.png"
          alt="Amanoba Logo"
          width={logoSize}
          height={logoSize}
          priority
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>
      {showText && (
        <Text fw={800} size={textSizes[size]} c="var(--mantine-color-text)" lh={1}>
          Amanoba
        </Text>
      )}
    </Group>
  );

  if (linkTo) {
    return (
      <Box component={LocaleLink} href={linkTo} display="inline-block">
        {logoContent}
      </Box>
    );
  }

  return logoContent;
}
