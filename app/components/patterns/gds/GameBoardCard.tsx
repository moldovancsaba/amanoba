'use client';

import type { ReactNode } from 'react';
import { GameBoardTile } from '@gds/core';

type GameBoardCardProps = {
  face: ReactNode;
  revealed: boolean;
  matched: boolean;
  disabled: boolean;
  onPress: () => void;
};

/** Amanoba adapter: yellow CTA highlight on governed GDS flip tile. */
export function GameBoardCard({ face, revealed, matched, disabled, onPress }: GameBoardCardProps) {
  return (
    <GameBoardTile
      face={face}
      revealed={revealed}
      matched={matched}
      disabled={disabled}
      onPress={onPress}
      highlightColor="amanoba.5"
    />
  );
}
