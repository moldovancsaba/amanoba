/**
 * Ghost Mode Tier Configuration (Madoku)
 *
 * What: Defines rank-based tiers mapping to AI level and ghost-board usage
 * Why: Auto-match difficulty to player skill for a fair, exciting challenge
 */

export type GhostTier = {
  minPercentile: number; // inclusive (0 = top)
  maxPercentile: number; // exclusive (1 = bottom)
  aiLevel: 1 | 2 | 3;
  isGhost: boolean;
  name: string;
  description: string;
};

export const GHOST_TIERS: GhostTier[] = [
  { minPercentile: 0,    maxPercentile: 0.01, aiLevel: 3, isGhost: true,  name: 'Elite Ghost',       description: "Top 1% — ultimate ghost opponent" },
  { minPercentile: 0.01, maxPercentile: 0.05, aiLevel: 2, isGhost: true,  name: 'Advanced Ghost',    description: "Top 1–5% — formidable ghost opponent" },
  { minPercentile: 0.05, maxPercentile: 0.20, aiLevel: 3, isGhost: false, name: 'Expert',            description: "Top 5–20% — toughest standard AI" },
  { minPercentile: 0.20, maxPercentile: 0.40, aiLevel: 2, isGhost: false, name: 'Intermediate',      description: "Top 20–40% — medium AI" },
  { minPercentile: 0.40, maxPercentile: 0.60, aiLevel: 1, isGhost: true,  name: 'Ghost Initiation',  description: "Top 40–60% — gentle ghost intro" },
  { minPercentile: 0.60, maxPercentile: 1.00, aiLevel: 1, isGhost: false, name: 'Training',          description: "60–100% — easy AI" },
];

export function getGhostTierByPercentile(percentile: number): GhostTier {
  const p = Math.max(0, Math.min(1, percentile));
  return (
    GHOST_TIERS.find(t => p >= t.minPercentile && p < t.maxPercentile) ||
    GHOST_TIERS[GHOST_TIERS.length - 1]
  );
}

export function getRecommendedMadokuSettings(percentile: number): { aiLevel: 1 | 2 | 3; isGhost: boolean; tier: GhostTier } {
  const tier = getGhostTierByPercentile(percentile);
  return { aiLevel: tier.aiLevel, isGhost: tier.isGhost, tier };
}