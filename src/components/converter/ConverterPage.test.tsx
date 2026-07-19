import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConverterPage } from "./ConverterPage";

function getInput() {
  return screen.getByRole("textbox");
}

async function clearAndType(user: ReturnType<typeof userEvent.setup>, el: HTMLElement, text: string) {
  await user.click(el);
  await user.keyboard("{Control>}a{/Control}{Backspace}");
  await user.type(el, text);
}

async function expectOutput(pattern: RegExp) {
  await waitFor(() => {
    expect(screen.getByTestId("converter-output").textContent).toMatch(pattern);
  });
}

describe("ConverterPage", () => {
  it("shows a pre-filled JSON -> YAML example by default", async () => {
    render(<ConverterPage />);
    await expectOutput(/name:\s*"Tobi Ojuolape"/);
  });

  it("converts JSON input to YAML output", async () => {
    const user = userEvent.setup();
    render(<ConverterPage />);

    await clearAndType(user, getInput(), '{{"active": true}');

    await expectOutput(/active:\s*true/);
  });

  it("converts YAML input to JSON output after switching direction", async () => {
    const user = userEvent.setup();
    render(<ConverterPage />);

    await user.click(screen.getByRole("button", { name: /yaml.*json/i }));
    await clearAndType(user, getInput(), "active: true");

    await expectOutput(/"active":\s*true/);
  });

  it("shows an error for invalid input instead of stale output", async () => {
    const user = userEvent.setup();
    render(<ConverterPage />);

    await clearAndType(user, getInput(), "{{not json");

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("shows a 'Copied' confirmation after copying the output", async () => {
    const user = userEvent.setup();
    render(<ConverterPage />);

    await expectOutput(/name:\s*"Tobi Ojuolape"/);
    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });
});
