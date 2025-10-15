/**
 * ELO Calculator
 * 
 * Purpose: Calculate ELO rating changes for competitive games (Madoku)
 * Why: Provides skill-based matchmaking and ranking system
 * 
 * Based on the ELO rating system used in chess and competitive games.
 */

/**
 * Calculate ELO rating change
 * 
 * @param playerElo - Current player ELO rating
 * @param opponentElo - Opponent's ELO rating (or AI difficulty level)
 * @param result - Game result: 1 = win, 0.5 = draw, 0 = loss
 * @param kFactor - K-factor (rating change sensitivity, default 32)
 * @returns New ELO rating for the player
 * 
 * Why: Standard ELO formula with configurable K-factor for different player tiers
 */
export function calculateEloChange(
  playerElo: number,
  opponentElo: number,
  result: 1 | 0.5 | 0,
  kFactor: number = 32
): { newElo: number; change: number } {
  // Expected score formula: 1 / (1 + 10^((opponentElo - playerElo) / 400))
  // Why: Calculates probability of winning based on rating difference
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));

  // ELO change formula: K * (actual - expected)
  // Why: Larger changes for unexpected results, smaller for expected ones
  const change = Math.round(kFactor * (result - expectedScore));

  const newElo = Math.max(0, playerElo + change); // ELO cannot go below 0

  return { newElo, change };
}

/**
 * Get K-factor based on player rating
 * 
 * @param elo - Current ELO rating
 * @returns K-factor (higher for new players, lower for established players)
 * 
 * Why: New players' ratings should adjust faster, established players more slowly
 */
export function getKFactor(elo: number): number {
  if (elo < 1400) return 40; // Beginners: fast adjustment
  if (elo < 1800) return 32; // Intermediate: moderate adjustment
  if (elo < 2200) return 24; // Advanced: slower adjustment
  return 16; // Masters: very slow adjustment
}

/**
 * Calculate ELO for AI opponent based on difficulty
 * 
 * @param difficulty - AI difficulty level ('easy', 'medium', 'hard', 'expert')
 * @returns Estimated ELO rating of the AI
 * 
 * Why: Allows players to gain/lose ELO when playing against AI
 */
export function getAiElo(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): number {
  const aiEloMap = {
    easy: 1000,    // Beginner level
    medium: 1300,  // Intermediate level
    hard: 1600,    // Advanced level
    expert: 1900,  // Master level
  };
  return aiEloMap[difficulty] || 1200; // Default to medium if unknown
}

/**
 * Get ELO tier/rank name
 * 
 * @param elo - Current ELO rating
 * @returns Rank name (e.g., "Beginner", "Expert")
 * 
 * Why: Human-readable rank for UI display
 */
export function getEloRank(elo: number): string {
  if (elo < 1000) return 'Novice';
  if (elo < 1200) return 'Beginner';
  if (elo < 1400) return 'Intermediate';
  if (elo < 1600) return 'Advanced';
  if (elo < 1800) return 'Expert';
  if (elo < 2000) return 'Master';
  if (elo < 2200) return 'Grandmaster';
  return 'Legend';
}

/**
 * Get ELO tier icon
 * 
 * @param elo - Current ELO rating
 * @returns Icon emoji for the tier
 * 
 * Why: Visual representation of player rank
 */
export function getEloIcon(elo: number): string {
  if (elo < 1000) return '🌱';
  if (elo < 1200) return '⚪';
  if (elo < 1400) return '🟢';
  if (elo < 1600) return '🔵';
  if (elo < 1800) return '🟣';
  if (elo < 2000) return '🟡';
  if (elo < 2200) return '🔴';
  return '💎';
}

/**
 * Calculate game result from session data
 * 
 * @param isWin - Whether player won
 * @param isDraw - Whether game was a draw
 * @returns Result value for ELO calculation (1, 0.5, or 0)
 * 
 * Why: Converts game outcome to ELO-compatible result value
 */
export function getGameResult(isWin: boolean, isDraw: boolean = false): 1 | 0.5 | 0 {
  if (isWin) return 1;
  if (isDraw) return 0.5;
  return 0;
}
