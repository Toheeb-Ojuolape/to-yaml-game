import { useMemo, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  shake?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, shake, disabled, placeholder }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = useMemo(() => value.split("\n").length, [value]);

  function handleScroll() {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + "  " + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2;
    });
  }

  return (
    <div
      className={`flex h-full overflow-hidden rounded-xl border bg-bg-raised transition-colors ${
        shake ? "animate-shake border-error/60" : "border-border focus-within:border-accent/50"
      }`}
    >
      <div
        ref={gutterRef}
        className="select-none overflow-hidden border-r border-border px-3 py-4 text-right font-mono text-[13px] leading-6 text-faint"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder ?? 'username: "arclight"\nactive: true'}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-text outline-none placeholder:text-faint/70 disabled:opacity-50"
      />
    </div>
  );
}
