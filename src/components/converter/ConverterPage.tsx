import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Check, CircleAlert, Copy } from "lucide-react";
import { jsonToYaml, safeJsonParse, yamlToJson } from "../../lib/yaml";
import { TOKEN_CLASS, tokenizeJson, tokenizeYaml } from "../../lib/highlight";
import { CodeEditor } from "../ui/CodeEditor";
import { Card } from "../ui/Card";

type Direction = "toYaml" | "toJson";

const EXAMPLE_JSON = JSON.stringify(
  { name: "Tobi Ojuolape", born: 1998, tags: ["engineering", "marvel movies"], active: true },
  null,
  2
);
const EXAMPLE_YAML = jsonToYaml(JSON.parse(EXAMPLE_JSON));

export function ConverterPage() {
  const [direction, setDirection] = useState<Direction>("toYaml");
  const [source, setSource] = useState(EXAMPLE_JSON);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!source.trim()) return { ok: true as const, text: "" };
    if (direction === "toYaml") {
      const parsed = safeJsonParse(source);
      if (!parsed.ok) return { ok: false as const, error: parsed.error };
      return { ok: true as const, text: jsonToYaml(parsed.data) };
    }
    const parsed = yamlToJson(source);
    if (!parsed.ok) return { ok: false as const, error: parsed.error };
    return { ok: true as const, text: JSON.stringify(parsed.data, null, 2) };
  }, [source, direction]);

  const outputTokens = useMemo(() => {
    if (!result.ok || !result.text) return [];
    return direction === "toYaml" ? tokenizeYaml(result.text) : tokenizeJson(result.text);
  }, [result, direction]);

  function selectDirection(next: Direction) {
    if (next === direction) return;
    setDirection(next);
    setSource(next === "toYaml" ? EXAMPLE_JSON : EXAMPLE_YAML);
  }

  function handleSwap() {
    if (result.ok && result.text) setSource(result.text);
    setDirection((d) => (d === "toYaml" ? "toJson" : "toYaml"));
  }

  async function handleCopy() {
    if (!result.ok || !result.text) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">Converter</h1>
        <p className="mt-1 text-sm text-muted">
          A standalone JSON &harr; YAML tool. Nothing here affects your game progress.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <PillButton active={direction === "toYaml"} onClick={() => selectDirection("toYaml")}>
            JSON &rarr; YAML
          </PillButton>
          <PillButton active={direction === "toJson"} onClick={() => selectDirection("toJson")}>
            YAML &rarr; JSON
          </PillButton>
        </div>
        <button
          onClick={handleSwap}
          disabled={!result.ok || !result.text}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-text disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          title="Swap direction using current output"
        >
          <ArrowLeftRight size={15} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">
            {direction === "toYaml" ? "JSON input" : "YAML input"}
          </p>
          <div className="h-72">
            <CodeEditor
              value={source}
              onChange={setSource}
              placeholder={direction === "toYaml" ? '{\n  "key": "value"\n}' : "key: value"}
              language={direction === "toYaml" ? "json" : "yaml"}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">
              {direction === "toYaml" ? "YAML output" : "JSON output"}
            </p>
            <button
              onClick={handleCopy}
              disabled={!result.ok || !result.text}
              className="inline-flex items-center gap-1.5 text-xs text-faint transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <Card className="h-72 overflow-auto p-0">
            {result.ok ? (
              <pre className="h-full whitespace-pre-wrap break-words px-4 py-4 font-mono text-[13px] leading-6 text-text">
                {result.text ? (
                  <code>
                    {outputTokens.map((t, i) => (
                      <span key={i} className={TOKEN_CLASS[t.type]}>
                        {t.text}
                      </span>
                    ))}
                  </code>
                ) : (
                  <span className="text-faint">Output will appear here.</span>
                )}
              </pre>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 p-4 text-sm text-error"
              >
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                <span>{result.error}</span>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
        active ? "text-[#1a1204]" : "text-muted hover:text-text"
      }`}
    >
      {active && (
        <motion.span layoutId="converter-pill" className="absolute inset-0 rounded-md bg-accent" />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
