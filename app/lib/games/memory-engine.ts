/**
 * Memory Game Engine
 * 
 * Card matching game with multiple difficulty levels and scoring system.
 * Players flip cards to find matching pairs within a time limit.
 * 
 * Why this approach:
 * - Pure game logic separated from UI for testability
 * - Configurable difficulty levels for progression
 * - Score multipliers based on speed and accuracy
 * - Event-driven architecture for UI integration
 */

export type MemoryDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface MemoryCard {
  id: string;
  value: string; // Emoji or icon identifier
  isFlipped: boolean;
  isMatched: boolean;
  position: number;
}

export interface MemoryGameConfig {
  difficulty: MemoryDifficulty;
  timeLimit: number; // seconds
  gridSize: { rows: number; cols: number };
  cardValues: string[];
}

export interface MemoryGameState {
  cards: MemoryCard[];
  flippedCards: string[];
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  timeElapsed: number;
  score: number;
  isComplete: boolean;
  isPaused: boolean;
}

// Card themes - emojis for visual variety
const CARD_THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'],
  food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝', '🍍', '🥥', '🥑', '🍆', '🥕', '🌽'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🥊'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃'],
};

/**
 * Get difficulty configuration
 * Easy: 4x3 grid (6 pairs), 180s
 * Medium: 4x4 grid (8 pairs), 150s
 * Hard: 6x4 grid (12 pairs), 120s
 * Expert: 6x6 grid (18 pairs), 90s
 */
export function getDifficultyConfig(difficulty: MemoryDifficulty): MemoryGameConfig {
  const theme = CARD_THEMES.animals; // Can be randomized or user-selected
  
  switch (difficulty) {
    case 'EASY':
      return {
        difficulty,
        timeLimit: 180,
        gridSize: { rows: 3, cols: 4 },
        cardValues: theme.slice(0, 6),
      };
    case 'MEDIUM':
      return {
        difficulty,
        timeLimit: 150,
        gridSize: { rows: 4, cols: 4 },
        cardValues: theme.slice(0, 8),
      };
    case 'HARD':
      return {
        difficulty,
        timeLimit: 120,
        gridSize: { rows: 4, cols: 6 },
        cardValues: theme.slice(0, 12),
      };
    case 'EXPERT':
      return {
        difficulty,
        timeLimit: 90,
        gridSize: { rows: 6, cols: 6 },
        cardValues: theme.slice(0, 18),
      };
  }
}

/**
 * Initialize game state with shuffled cards
 */
export function initializeGame(config: MemoryGameConfig): MemoryGameState {
  const totalPairs = config.cardValues.length;
  
  // Create pairs of cards
  const cardPairs: string[] = [];
  config.cardValues.forEach(value => {
    cardPairs.push(value, value);
  });
  
  // Shuffle cards using Fisher-Yates algorithm
  const shuffled = [...cardPairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Create card objects
  const cards: MemoryCard[] = shuffled.map((value, index) => ({
    id: `card-${index}`,
    value,
    isFlipped: false,
    isMatched: false,
    position: index,
  }));
  
  return {
    cards,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs,
    moves: 0,
    timeElapsed: 0,
    score: 0,
    isComplete: false,
    isPaused: false,
  };
}

/**
 * Handle card flip action
 * Returns updated state or null if flip not allowed
 */
export function flipCard(
  state: MemoryGameState,
  cardId: string
): MemoryGameState | null {
  if (state.isPaused || state.isComplete) {
    return null;
  }
  
  const card = state.cards.find(c => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) {
    return null;
  }
  
  // Already have 2 cards flipped - need to reset first
  if (state.flippedCards.length >= 2) {
    return null;
  }
  
  const newCards = state.cards.map(c =>
    c.id === cardId ? { ...c, isFlipped: true } : c
  );
  
  const newFlippedCards = [...state.flippedCards, cardId];
  
  return {
    ...state,
    cards: newCards,
    flippedCards: newFlippedCards,
  };
}

/**
 * Check if two flipped cards match
 * Returns updated state with match result
 */
export function checkMatch(state: MemoryGameState): MemoryGameState {
  if (state.flippedCards.length !== 2) {
    return state;
  }
  
  const [card1Id, card2Id] = state.flippedCards;
  const card1 = state.cards.find(c => c.id === card1Id);
  const card2 = state.cards.find(c => c.id === card2Id);
  
  if (!card1 || !card2) {
    return state;
  }
  
  const isMatch = card1.value === card2.value;
  const newMoves = state.moves + 1;
  
  if (isMatch) {
    // Match found
    const newCards = state.cards.map(c =>
      c.id === card1Id || c.id === card2Id
        ? { ...c, isMatched: true }
        : c
    );
    
    const newMatchedPairs = state.matchedPairs + 1;
    const isComplete = newMatchedPairs === state.totalPairs;
    
    return {
      ...state,
      cards: newCards,
      flippedCards: [],
      matchedPairs: newMatchedPairs,
      moves: newMoves,
      isComplete,
    };
  } else {
    // No match - cards will be flipped back by UI after delay
    return {
      ...state,
      moves: newMoves,
    };
  }
}

/**
 * Reset non-matched flipped cards
 */
export function resetFlippedCards(state: MemoryGameState): MemoryGameState {
  const newCards = state.cards.map(c =>
    c.isFlipped && !c.isMatched ? { ...c, isFlipped: false } : c
  );
  
  return {
    ...state,
    cards: newCards,
    flippedCards: [],
  };
}

/**
 * Calculate final score based on performance
 * Formula: base_score * time_bonus * accuracy_bonus * difficulty_multiplier
 */
export function calculateScore(
  state: MemoryGameState,
  config: MemoryGameConfig
): number {
  if (!state.isComplete) {
    return 0;
  }
  
  // Base score per pair matched
  const baseScore = state.matchedPairs * 100;
  
  // Time bonus: faster = higher bonus (0.5x to 2x)
  const timeRatio = state.timeElapsed / config.timeLimit;
  const timeBonus = Math.max(0.5, Math.min(2, 2 - timeRatio));
  
  // Accuracy bonus: fewer moves = higher bonus (0.5x to 2x)
  const perfectMoves = state.totalPairs; // Minimum possible moves
  const accuracyRatio = perfectMoves / state.moves;
  const accuracyBonus = Math.max(0.5, Math.min(2, accuracyRatio * 1.5));
  
  // Difficulty multiplier
  const difficultyMultipliers = {
    EASY: 1,
    MEDIUM: 1.5,
    HARD: 2,
    EXPERT: 3,
  };
  const difficultyMultiplier = difficultyMultipliers[config.difficulty];
  
  const finalScore = Math.round(
    baseScore * timeBonus * accuracyBonus * difficultyMultiplier
  );
  
  return finalScore;
}

/**
 * Update time elapsed
 */
export function updateTime(state: MemoryGameState, seconds: number): MemoryGameState {
  return {
    ...state,
    timeElapsed: seconds,
  };
}

/**
 * Pause/resume game
 */
export function togglePause(state: MemoryGameState): MemoryGameState {
  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

/**
 * Get game statistics for session completion
 */
export function getGameStats(state: MemoryGameState, config: MemoryGameConfig) {
  return {
    moves: state.moves,
    timeElapsed: state.timeElapsed,
    matchedPairs: state.matchedPairs,
    totalPairs: state.totalPairs,
    accuracy: state.totalPairs > 0 ? (state.totalPairs / state.moves) * 100 : 0,
    timeRemaining: Math.max(0, config.timeLimit - state.timeElapsed),
    difficulty: config.difficulty,
  };
}
