import { useMemo, useState } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CircleAlert, RotateCcw } from "lucide-react";
import { resolveLevel, slotForLevel } from "../../data/samples";
import { useProfile } from "../../context/ProfileContext";
import { jsonToYaml, safeJsonParse, yamlToJson } from "../../lib/yaml";
import { deepEqual } from "../../lib/deepEqual";
import { JsonPane } from "./JsonPane";
import { YamlPane } from "./YamlPane";
import { CodeEditor } from "../ui/CodeEditor";
import { HintButton } from "./HintButton";
import { ResultOverlay } from "./ResultOverlay";
import { TierBadge } from "./TierBadge";
import { Button } from "../ui/Button";

export function PlayScreen() {
  const { levelId } = useParams();
  const slot = slotForLevel(Number(levelId));
  const { isUnlocked } = useProfile();

  if (!slot || !isUnlocked(slot.id)) {
    return <Navigate to="/play" replace />;
  }

  return <PlayScreenInner key={slot.id} slotId={slot.id} />;
}

function PlayScreenInner({ slotId }: { slotId: number }) {
  const navigate = useNavigate();
  // Generated once per mount, so re-entering (or replaying) a level draws a fresh question.
  const [sample] = useState(() => resolveLevel(slotId)!);
  const { recordLevelComplete } = useProfile();
  const isReverse = sample.direction === "yamlToJson";

  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [result, setResult] = useState<{ stars: 1 | 2 | 3; xp: number } | null>(null);

  const canonicalLines = useMemo(
    () => (isReverse ? JSON.stringify(sample.json, null, 2) : jsonToYaml(sample.json)).split("\n"),
    [sample, isReverse]
  );
  const nextSlot = slotForLevel(sample.id + 1);

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  function handleCheck() {
    if (!input.trim()) {
      setError(`Type your ${isReverse ? "JSON" : "YAML"} answer first.`);
      triggerShake();
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const parsed = isReverse ? safeJsonParse(input) : yamlToJson(input);
    if (!parsed.ok) {
      setError(parsed.error);
      triggerShake();
      return;
    }
    if (!deepEqual(parsed.data, sample.json)) {
      setError(
        `Not quite — check the keys, nesting, and value types against the ${isReverse ? "YAML" : "JSON"}.`
      );
      triggerShake();
      return;
    }

    setError(null);
    setShake(false);
    const { entry, xpGained } = recordLevelComplete(
      sample.id,
      sample.tier,
      nextAttempts,
      revealedLines.length
    );
    setResult({ stars: entry.stars, xp: xpGained });
  }

  function handleReveal() {
    if (revealedLines.length >= canonicalLines.length) return;
    setRevealedLines((prev) => [...prev, canonicalLines[prev.length]]);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/play"
            className="border-border text-muted hover:border-border-strong hover:text-text flex h-9 w-9 items-center justify-center rounded-lg border no-underline transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-text text-base font-semibold sm:text-lg">
                Level {sample.id} &middot; {sample.title}
              </h1>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <TierBadge tier={sample.tier} />
              {isReverse && (
                <span className="border-border text-muted rounded-full border px-2.5 py-1 text-xs font-medium">
                  YAML &rarr; JSON
                </span>
              )}
            </div>
          </div>
        </div>
        {attempts > 0 && (
          <span className="text-faint text-xs">
            {attempts} attempt{attempts === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2" style={{ minHeight: "22rem" }}>
        <div>
          <p className="text-faint mb-2 text-xs font-medium tracking-wide uppercase">
            {isReverse ? "YAML" : "JSON"}
          </p>
          <div className="h-64 md:h-full">
            {isReverse ? <YamlPane yaml={sample.yaml!} /> : <JsonPane data={sample.json} />}
          </div>
        </div>
        <div>
          <p className="text-faint mb-2 text-xs font-medium tracking-wide uppercase">
            {isReverse ? "Your JSON" : "Your YAML"}
          </p>
          <div className="h-64 md:h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              shake={shake}
              language={isReverse ? "json" : "yaml"}
              placeholder={isReverse ? '{\n  "key": "value"\n}' : undefined}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-error/30 bg-error-soft text-error mt-4 flex items-start gap-2 overflow-hidden rounded-lg border px-3 py-2.5 text-sm"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <HintButton
          revealedLines={revealedLines}
          totalLines={canonicalLines.length}
          onReveal={handleReveal}
        />
      </div>

      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setInput("")}
          className="text-faint hover:text-muted inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm transition-colors"
        >
          <RotateCcw size={13} /> Clear
        </button>
        <Button onClick={handleCheck}>Check answer</Button>
      </div>

      <AnimatePresence>
        {result && (
          <ResultOverlay
            stars={result.stars}
            xp={result.xp}
            hasNext={Boolean(nextSlot)}
            onNext={() => nextSlot && navigate(`/play/${nextSlot.id}`)}
            onBackToMap={() => navigate("/play")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
