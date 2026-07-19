import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("shows the profile picker when there is no active profile", () => {
    render(<App />);
    expect(screen.getByText("Create a profile")).toBeInTheDocument();
  });

  it("creating a profile lands on the level map", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/e\.g\./i), "Ada");
    await user.click(screen.getByRole("button", { name: /start playing/i }));

    expect(await screen.findByText(/welcome back, ada/i)).toBeInTheDocument();
  });

  it("navigates to the converter and back to play via the nav links", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText(/e\.g\./i), "Ada");
    await user.click(screen.getByRole("button", { name: /start playing/i }));
    await screen.findByText(/welcome back, ada/i);

    await user.click(screen.getAllByRole("link", { name: /converter/i })[0]);
    expect(await screen.findByRole("heading", { name: /converter/i })).toBeInTheDocument();

    await user.click(screen.getAllByRole("link", { name: /^play$/i })[0]);
    expect(await screen.findByText(/welcome back, ada/i)).toBeInTheDocument();
  });
});
