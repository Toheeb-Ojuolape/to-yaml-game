import type { RootState } from "../types";

const STORAGE_KEY = "to-yaml:v1";

const EMPTY_STATE: RootState = {
  profiles: [],
  activeProfileId: null,
};

export function loadState(): RootState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<RootState>;
    return {
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
      activeProfileId: parsed.activeProfileId ?? null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: RootState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
}
