import { useMemo, useRef } from "react";
import { WandSparkles } from "lucide-react";
import { TOKEN_CLASS, tokenizeJson, tokenizeYaml } from "../../lib/highlight";
import { jsonToYaml, safeJsonParse, yamlToJson } from "../../lib/yaml";

const ZERO_WIDTH_SPACE = "​";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  shake?: boolean;
  disabled?: boolean;
  placeholder?: string;
  language?: "json" | "yaml";
}

function indentForNewLine(currentLine: string, language: "json" | "yaml") {
  const indent = currentLine.match(/^\s*/)?.[0] ?? "";
  const trimmed = currentLine.trim();
  const opensBlock = language === "yaml" ? trimmed.endsWith(":") : /[{[]$/.test(trimmed);
  return opensBlock ? `${indent}  ` : indent;
}

export function CodeEditor({
  value,
  onChange,
  shake,
  disabled,
  placeholder,
  language = "yaml",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const tokens = useMemo(
    () => (language === "json" ? tokenizeJson(value) : tokenizeYaml(value)),
    [value, language]
  );

  function handleScroll() {
    const { current: textarea } = textareaRef;
    if (!textarea) return;
    if (gutterRef.current) gutterRef.current.scrollTop = textarea.scrollTop;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = textarea.scrollTop;
      highlightRef.current.scrollLeft = textarea.scrollLeft;
    }
  }

  // Mutate the DOM node synchronously (not just React state) so the browser's
  // actual textarea value/cursor are already correct before it processes the
  // next queued keystroke — waiting for React's re-render (e.g. via rAF) is racy
  // and can corrupt fast typing right after an auto-indent.
  function applyEdit(el: HTMLTextAreaElement, next: string, cursor: number) {
    el.value = next;
    el.selectionStart = el.selectionEnd = cursor;
    onChange(next);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (e.key === "Tab") {
      e.preventDefault();
      const next = value.slice(0, start) + "  " + value.slice(end);
      applyEdit(el, next, start + 2);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const insertion = "\n" + indentForNewLine(currentLine, language);
      const next = value.slice(0, start) + insertion + value.slice(end);
      applyEdit(el, next, start + insertion.length);
    }
  }

  function handleFormat() {
    if (language === "json") {
      const parsed = safeJsonParse(value);
      if (parsed.ok) onChange(JSON.stringify(parsed.data, null, 2));
    } else {
      const parsed = yamlToJson(value);
      if (parsed.ok && parsed.data !== undefined) onChange(jsonToYaml(parsed.data));
    }
  }

  return (
    <div
      className={`bg-bg-raised flex h-full overflow-hidden rounded-xl border transition-colors ${
        shake ? "animate-shake border-error/60" : "border-border focus-within:border-accent/50"
      }`}
    >
      <div
        ref={gutterRef}
        className="border-border text-faint overflow-hidden border-r px-3 py-4 text-right font-mono text-[13px] leading-6 select-none"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative flex-1">
        <pre
          ref={highlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden px-4 py-4 font-mono text-[13px] leading-6 break-words whitespace-pre-wrap"
        >
          <code>
            {tokens.map((t, i) => (
              <span key={i} className={TOKEN_CLASS[t.type]}>
                {t.text}
              </span>
            ))}
            {(value === "" || value.endsWith("\n")) && ZERO_WIDTH_SPACE}
          </code>
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="caret-text placeholder:text-faint/70 absolute inset-0 resize-none bg-transparent px-4 py-4 font-mono text-[13px] leading-6 break-words whitespace-pre-wrap text-transparent outline-none disabled:opacity-50"
        />
        {!disabled && value.trim() && (
          <button
            type="button"
            onClick={handleFormat}
            title="Format"
            aria-label="Format"
            className="border-border bg-bg-raised/90 text-muted hover:border-border-strong hover:text-accent absolute top-2 right-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border backdrop-blur-sm transition-colors"
          >
            <WandSparkles size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
