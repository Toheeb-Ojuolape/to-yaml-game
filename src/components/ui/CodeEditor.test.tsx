import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeEditor } from "./CodeEditor";

function Controlled({ initial = "", language }: { initial?: string; language?: "json" | "yaml" }) {
  const [value, setValue] = useState(initial);
  return <CodeEditor value={value} onChange={setValue} language={language} />;
}

describe("CodeEditor", () => {
  it("inserts two spaces on Tab instead of moving focus", async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.keyboard("a{Tab}b");

    expect(editor).toHaveValue("a  b");
  });

  it("auto-indents the next line after a YAML key that opens a block", async () => {
    const user = userEvent.setup();
    render(<Controlled language="yaml" />);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.type(editor, "nested:");
    await user.keyboard("{Enter}");
    await user.type(editor, "inner: 1");

    expect(editor).toHaveValue("nested:\n  inner: 1");
  });

  it("does not add extra indent after a plain key: value line", async () => {
    const user = userEvent.setup();
    render(<Controlled language="yaml" />);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.type(editor, "a: 1");
    await user.keyboard("{Enter}");
    await user.type(editor, "b: 2");

    expect(editor).toHaveValue("a: 1\nb: 2");
  });

  it("preserves the current line's indentation on Enter", async () => {
    const user = userEvent.setup();
    render(<Controlled language="yaml" initial="  a: 1" />);

    const editor = screen.getByRole("textbox");
    await user.click(editor);
    await user.keyboard("{End}");
    await user.keyboard("{Enter}");
    await user.type(editor, "b: 2");

    expect(editor).toHaveValue("  a: 1\n  b: 2");
  });

  it("reformats messy-but-valid YAML when the Format button is clicked", async () => {
    const user = userEvent.setup();
    render(<Controlled language="yaml" initial={'business:      "acme"\nregistered:   true'} />);

    await user.click(screen.getByRole("button", { name: /format/i }));

    expect(screen.getByRole("textbox")).toHaveValue('business: "acme"\nregistered: true\n');
  });

  it("does nothing when Format is clicked on invalid content", async () => {
    const user = userEvent.setup();
    const original = "key: [unclosed";
    render(<Controlled language="yaml" initial={original} />);

    await user.click(screen.getByRole("button", { name: /format/i }));

    expect(screen.getByRole("textbox")).toHaveValue(original);
  });

  it("does not show a Format button when empty", () => {
    render(<Controlled />);
    expect(screen.queryByRole("button", { name: /format/i })).not.toBeInTheDocument();
  });

  it("reports accumulated edits via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Spied() {
      const [value, setValue] = useState("");
      return (
        <CodeEditor
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Spied />);

    await user.type(screen.getByRole("textbox"), "hi");

    expect(onChange).toHaveBeenLastCalledWith("hi");
  });
});
