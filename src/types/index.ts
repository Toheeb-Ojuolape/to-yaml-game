export type Tier = "novice" | "apprentice" | "expert" | "master" | "reader" | "wizard";

export type Direction = "jsonToYaml" | "yamlToJson";

export interface Sample {
  id: number;
  title: string;
  tier: Tier;
  /** Which side the player must produce. Defaults to "jsonToYaml" (show JSON, write YAML). */
  direction?: Direction;
  /** Canonical data: the answer-checking target for both directions. */
  json: unknown;
  /**
   * Hand-authored YAML shown to the player for "yamlToJson" levels, so the display can use
   * idiomatic real-world style (unquoted strings, anchors/aliases) instead of the always-quoted
   * output `jsonToYaml` would produce. Must parse to exactly `json`. Required when
   * direction is "yamlToJson".
   */
  yaml?: string;
}

export interface LevelProgress {
  stars: 1 | 2 | 3;
  bestAttempts: number;
  hintsUsed: number;
  completedAt: number;
}

export interface Profile {
  id: string;
  name: string;
  avatarEmoji: string;
  accentHue: number;
  createdAt: number;
  lastPlayedAt: number;
  xp: number;
  streak: number;
  progress: Record<number, LevelProgress>;
}

export interface RootState {
  profiles: Profile[];
  activeProfileId: string | null;
}
