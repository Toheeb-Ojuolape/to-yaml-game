import { beforeEach, describe, expect, it } from "vitest";
import { loadState, saveState } from "./storage";
import type { Profile } from "../types";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty default state when nothing is stored", () => {
    expect(loadState()).toEqual({ profiles: [], activeProfileId: null });
  });

  it("round-trips a saved state", () => {
    const profile: Profile = {
      id: "abc123",
      name: "Ada",
      avatarEmoji: "🦊",
      accentHue: 32,
      createdAt: 1,
      lastPlayedAt: 1,
      xp: 100,
      streak: 1,
      progress: { 1: { stars: 3, bestAttempts: 1, hintsUsed: 0, completedAt: 1 } },
    };
    const state = { profiles: [profile], activeProfileId: profile.id };

    saveState(state);

    expect(loadState()).toEqual(state);
  });

  it("falls back to the default state when stored JSON is corrupted", () => {
    localStorage.setItem("to-yaml:v1", "{not valid json");
    expect(loadState()).toEqual({ profiles: [], activeProfileId: null });
  });

  it("falls back to an empty profiles array if the stored shape is malformed", () => {
    localStorage.setItem("to-yaml:v1", JSON.stringify({ profiles: "oops" }));
    expect(loadState()).toEqual({ profiles: [], activeProfileId: null });
  });
});
