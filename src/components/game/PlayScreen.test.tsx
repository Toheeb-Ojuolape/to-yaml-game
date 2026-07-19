import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProfileProvider } from "../../context/ProfileContext";
import { PlayScreen } from "./PlayScreen";
import type { Profile, RootState } from "../../types";

function seedProfile(overrides: Partial<Profile> = {}) {
  const profile: Profile = {
    id: "test-profile",
    name: "Tester",
    avatarEmoji: "🦊",
    accentHue: 32,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    xp: 0,
    streak: 0,
    progress: {},
    ...overrides,
  };
  const state: RootState = { profiles: [profile], activeProfileId: profile.id };
  localStorage.setItem("to-yaml:v1", JSON.stringify(state));
  return profile;
}

function renderPlayScreen(levelId: number) {
  return render(
    <MemoryRouter initialEntries={[`/play/${levelId}`]}>
      <ProfileProvider>
        <Routes>
          <Route path="/play/:levelId" element={<PlayScreen />} />
        </Routes>
      </ProfileProvider>
    </MemoryRouter>
  );
}

async function typeCorrectAnswer(editor: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
  await user.click(editor);
  await user.type(editor, 'business: "acme"');
  await user.keyboard("{Enter}");
  await user.type(editor, "is_registered: true");
}

describe("PlayScreen", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the level's JSON and an empty YAML editor", () => {
    seedProfile();
    renderPlayScreen(1);

    expect(screen.getByText(/Level 1/)).toBeInTheDocument();
    expect(screen.getByText('"business":')).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows an error and does not clear the level on an incorrect answer", async () => {
    const user = userEvent.setup();
    seedProfile();
    renderPlayScreen(1);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.type(editor, "business: wrong");
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(await screen.findByText(/not quite/i)).toBeInTheDocument();
    expect(screen.queryByText(/level cleared/i)).not.toBeInTheDocument();
  });

  it("shows a parse error for syntactically invalid YAML", async () => {
    const user = userEvent.setup();
    seedProfile();
    renderPlayScreen(1);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.type(editor, "business: [[unclosed");
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(await screen.findByText(/unexpected end of the stream/i)).toBeInTheDocument();
  });

  it("clears the level and shows the result overlay on a correct answer", async () => {
    const user = userEvent.setup();
    seedProfile();
    renderPlayScreen(1);

    await typeCorrectAnswer(screen.getByRole("textbox"), user);
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(await screen.findByText(/level cleared/i)).toBeInTheDocument();
  });

  it("persists XP and stars to the active profile in localStorage after a correct answer", async () => {
    const user = userEvent.setup();
    seedProfile();
    renderPlayScreen(1);

    await typeCorrectAnswer(screen.getByRole("textbox"), user);
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await screen.findByText(/level cleared/i);

    const saved = JSON.parse(localStorage.getItem("to-yaml:v1")!);
    expect(saved.profiles[0].xp).toBe(100);
    expect(saved.profiles[0].progress["1"].stars).toBe(3);
  });
});
