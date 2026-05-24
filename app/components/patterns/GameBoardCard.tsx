'use client';

import type { ReactNode } from 'react';
import { Center, Paper, Text, UnstyledButton } from '@mantine/core';

type GameBoardCardProps = {
  face: ReactNode;
  revealed: boolean;
  matched: boolean;
  disabled: boolean;
  onPress: () => void;
};

/**
 * Governed flip tile for game boards (memory match, etc.).
 * Keeps flip/highlight animation inside a Mantine pattern instead of page-local styles.
 */
export function GameBoardCard({ face, revealed, matched, disabled, onPress }: GameBoardCardProps) {
  const highlighted = revealed && !matched;

  return (
    <UnstyledButton w="100%" disabled={disabled} onClick={onPress} aria-pressed={revealed}>
      <Paper
        withBorder
        radius="md"
        p="md"
        bg={revealed ? 'amanoba.5' : 'dark.6'}
        styles={{
          root: {
            aspectRatio: '1',
            opacity: matched ? 0.55 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'transform 0.25s ease, background-color 0.25s ease, opacity 0.25s ease',
            transform: highlighted ? 'scale(1.02)' : 'scale(1)',
          },
        }}
      >
        <Center h="100%">
          <Text size="xl" fw={700}>
            {face}
          </Text>
        </Center>
      </Paper>
    </UnstyledButton>
  );
}
