import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { ProfileProvider, useProfile } from "./ProfileContext";

function wrapper({ children }: { children: ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}

describe("ProfileContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no profiles and no active profile", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current.profiles).toEqual([]);
    expect(result.current.activeProfile).toBeNull();
  });

  it("creates a profile and makes it active", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));

    expect(result.current.profiles).toHaveLength(1);
    expect(result.current.activeProfile?.name).toBe("Ada");
    expect(result.current.activeProfile?.avatarEmoji).toBe("🦊");
    expect(result.current.activeProfile?.xp).toBe(0);
    expect(result.current.activeProfile?.streak).toBe(0);
    expect(result.current.activeProfile?.progress).toEqual({});
  });

  it("falls back to 'Player' for a blank name", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("   ", "🦊", 32));
    expect(result.current.activeProfile?.name).toBe("Player");
  });

  it("switchProfile changes the active profile", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));
    act(() => result.current.createProfile("Grace", "🐙", 200));
    const adaId = result.current.profiles[0].id;

    act(() => result.current.switchProfile(adaId));

    expect(result.current.activeProfile?.name).toBe("Ada");
  });

  it("switchProfile to an unknown id clears the active profile", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));
    act(() => result.current.switchProfile(""));
    expect(result.current.activeProfile).toBeNull();
  });

  it("deleteProfile removes the profile and clears active state if it was active", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));
    const id = result.current.activeProfile!.id;

    act(() => result.current.deleteProfile(id));

    expect(result.current.profiles).toHaveLength(0);
    expect(result.current.activeProfile).toBeNull();
  });

  it("deleteProfile leaves the active profile untouched if a different profile is deleted", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));
    const adaId = result.current.activeProfile!.id;
    act(() => result.current.createProfile("Grace", "🐙", 200)); // Grace becomes active
    const graceId = result.current.profiles[1].id;
    act(() => result.current.switchProfile(adaId)); // switch back so Grace is the non-active one

    act(() => result.current.deleteProfile(graceId));

    expect(result.current.profiles).toHaveLength(1);
    expect(result.current.activeProfile?.name).toBe("Ada");
  });

  it("level 1 is always unlocked; later levels unlock only after the previous one is cleared", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));

    expect(result.current.isUnlocked(1)).toBe(true);
    expect(result.current.isUnlocked(2)).toBe(false);

    act(() => {
      result.current.recordLevelComplete(1, "novice", 1, 0);
    });

    expect(result.current.isUnlocked(2)).toBe(true);
    expect(result.current.isUnlocked(3)).toBe(false);
  });

  it("recordLevelComplete awards full XP and correct stars on first clear", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));

    let outcome!: ReturnType<typeof result.current.recordLevelComplete>;
    act(() => {
      outcome = result.current.recordLevelComplete(1, "novice", 1, 0);
    });

    expect(outcome.entry.stars).toBe(3);
    expect(outcome.xpGained).toBe(100);
    expect(result.current.activeProfile?.xp).toBe(100);
    expect(result.current.activeProfile?.progress[1]?.stars).toBe(3);
  });

  it("awards only a fraction of XP on replay, and keeps the better star rating", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));

    act(() => {
      result.current.recordLevelComplete(1, "novice", 1, 0); // 3 stars, 100 xp
    });
    let replay!: ReturnType<typeof result.current.recordLevelComplete>;
    act(() => {
      replay = result.current.recordLevelComplete(1, "novice", 4, 0); // worse: 1 star
    });

    expect(replay.xpGained).toBe(15); // round(100 * 0.15)
    expect(result.current.activeProfile?.progress[1]?.stars).toBe(3); // best result kept
    expect(result.current.activeProfile?.xp).toBe(115);
  });

  it("keeps progress isolated between profiles", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    act(() => result.current.createProfile("Ada", "🦊", 32));
    act(() => {
      result.current.recordLevelComplete(1, "novice", 1, 0);
    });
    act(() => result.current.createProfile("Grace", "🐙", 200));

    expect(result.current.activeProfile?.name).toBe("Grace");
    expect(result.current.activeProfile?.xp).toBe(0);
    expect(result.current.activeProfile?.progress).toEqual({});
    expect(result.current.isUnlocked(2)).toBe(false);
  });
});
