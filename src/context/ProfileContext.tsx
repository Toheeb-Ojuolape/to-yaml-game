import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LevelProgress, Profile, Tier } from "../types";
import { loadState, saveState } from "../lib/storage";
import { calculateResult } from "../lib/scoring";

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  createProfile: (name: string, avatarEmoji: string, accentHue: number) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  recordLevelComplete: (
    levelId: number,
    tier: Tier,
    attempts: number,
    hintsUsed: number
  ) => { entry: LevelProgress; xpGained: number };
  isUnlocked: (levelId: number) => boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeProfile = useMemo(
    () => state.profiles.find((p) => p.id === state.activeProfileId) ?? null,
    [state.profiles, state.activeProfileId]
  );

  function createProfile(name: string, avatarEmoji: string, accentHue: number) {
    const profile: Profile = {
      id: makeId(),
      name: name.trim() || "Player",
      avatarEmoji,
      accentHue,
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
      xp: 0,
      streak: 0,
      progress: {},
    };
    setState((prev) => ({
      profiles: [...prev.profiles, profile],
      activeProfileId: profile.id,
    }));
  }

  function switchProfile(id: string) {
    setState((prev) => ({ ...prev, activeProfileId: id }));
  }

  function deleteProfile(id: string) {
    setState((prev) => {
      const profiles = prev.profiles.filter((p) => p.id !== id);
      const activeProfileId = prev.activeProfileId === id ? null : prev.activeProfileId;
      return { profiles, activeProfileId };
    });
  }

  function recordLevelComplete(levelId: number, tier: Tier, attempts: number, hintsUsed: number) {
    const { xp, stars } = calculateResult(tier, attempts, hintsUsed);
    const entry: LevelProgress = { stars, bestAttempts: attempts, hintsUsed, completedAt: Date.now() };

    const current = state.profiles.find((p) => p.id === state.activeProfileId) ?? null;
    const existing = current?.progress[levelId];
    const isFirstClear = !existing;
    const better = !existing || stars > existing.stars;
    const now = Date.now();
    const wasYesterdayOrToday = current ? now - current.lastPlayedAt < 1000 * 60 * 60 * 36 : false;
    const xpGained = isFirstClear ? xp : Math.round(xp * 0.15);

    setState((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) => {
        if (p.id !== prev.activeProfileId) return p;
        return {
          ...p,
          xp: p.xp + xpGained,
          streak: isFirstClear ? (wasYesterdayOrToday ? p.streak + 1 : 1) : p.streak,
          lastPlayedAt: now,
          progress: {
            ...p.progress,
            [levelId]: better ? entry : existing!,
          },
        };
      }),
    }));

    return { entry, xpGained };
  }

  function isUnlocked(levelId: number) {
    if (levelId === 1) return true;
    if (!activeProfile) return false;
    return Boolean(activeProfile.progress[levelId - 1]);
  }

  const value: ProfileContextValue = {
    profiles: state.profiles,
    activeProfile,
    createProfile,
    switchProfile,
    deleteProfile,
    recordLevelComplete,
    isUnlocked,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
