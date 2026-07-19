export type Rng = () => number;

/** Deterministic PRNG (mulberry32) — same seed always produces the same sequence. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)];
}

/** n distinct values from `values`, without replacement, order randomized. */
export function pickN<T>(rng: Rng, values: readonly T[], n: number): T[] {
  const pool = [...values];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const index = Math.floor(rng() * pool.length);
    out.push(pool[index]);
    pool.splice(index, 1);
  }
  return out;
}

/** Random integer in [min, max], inclusive on both ends. */
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randFloat(rng: Rng, min: number, max: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((rng() * (max - min) + min) * factor) / factor;
}

export function randBool(rng: Rng, trueChance = 0.5): boolean {
  return rng() < trueChance;
}

export function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
