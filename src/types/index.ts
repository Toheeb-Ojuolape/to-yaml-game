export type Tier = "novice" | "apprentice" | "expert" | "master";

export interface Sample {
  id: number;
  title: string;
  tier: Tier;
  json: unknown;
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
