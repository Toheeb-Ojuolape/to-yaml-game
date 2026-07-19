import type { Tier } from "../types";

const TIER_MULTIPLIER: Record<Tier, number> = {
  novice: 1,
  apprentice: 1.25,
  expert: 1.5,
  master: 2,
  reader: 1.75,
  wizard: 2.5,
};

const BASE_XP = 100;
const HINT_PENALTY = 15;
const MIN_XP = 20;

export function calculateResult(tier: Tier, attempts: number, hintsUsed: number) {
  const xp = Math.max(MIN_XP, Math.round(BASE_XP * TIER_MULTIPLIER[tier] - hintsUsed * HINT_PENALTY));
  const stars = starsFor(attempts, hintsUsed);
  return { xp, stars };
}

function starsFor(attempts: number, hintsUsed: number): 1 | 2 | 3 {
  if (attempts <= 1 && hintsUsed === 0) return 3;
  if (attempts <= 3 && hintsUsed <= 1) return 2;
  return 1;
}
