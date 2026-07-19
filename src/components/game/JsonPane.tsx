import { useMemo } from "react";
import { TOKEN_CLASS, tokenizeJson } from "../../lib/highlight";

export function JsonPane({ data }: { data: unknown }) {
  const pretty = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokens = useMemo(() => tokenizeJson(pretty), [pretty]);
  const lineCount = useMemo(() => pretty.split("\n").length, [pretty]);

  return (
    <div className="border-border bg-bg-raised flex h-full overflow-auto rounded-xl border">
      <div className="border-border text-faint border-r px-3 py-4 text-right font-mono text-[13px] leading-6 select-none">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="flex-1 px-4 py-4 font-mono text-[13px] leading-6 whitespace-pre">
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
