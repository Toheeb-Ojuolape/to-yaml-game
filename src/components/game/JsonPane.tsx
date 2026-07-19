import { useMemo } from "react";
import { tokenizeJson } from "../../lib/highlight";
import type { TokenType } from "../../lib/highlight";

const TOKEN_CLASS: Record<TokenType, string> = {
  key: "text-[#7dd3fc]",
  string: "text-[#a7e0b0]",
  number: "text-[#f5a623]",
  boolean: "text-[#c9a3f5]",
  null: "text-faint",
  punct: "text-muted",
  plain: "text-muted",
};

export function JsonPane({ data }: { data: unknown }) {
  const pretty = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokens = useMemo(() => tokenizeJson(pretty), [pretty]);
  const lineCount = useMemo(() => pretty.split("\n").length, [pretty]);

  return (
    <div className="flex h-full overflow-auto rounded-xl border border-border bg-bg-raised">
      <div className="select-none border-r border-border px-3 py-4 text-right font-mono text-[13px] leading-6 text-faint">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="flex-1 whitespace-pre px-4 py-4 font-mono text-[13px] leading-6">
        <code>
          {tokens.map((t, i) => (
            <span key={i} className={TOKEN_CLASS[t.type]}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
