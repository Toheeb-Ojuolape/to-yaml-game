import { useMemo, useState } from "react";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CircleAlert, RotateCcw } from "lucide-react";
import { sampleForLevel } from "../../data/samples";
import { useProfile } from "../../context/ProfileContext";
import { jsonToYaml, yamlToJson } from "../../lib/yaml";
import { deepEqual } from "../../lib/deepEqual";
import { JsonPane } from "./JsonPane";
import { CodeEditor } from "../ui/CodeEditor";
import { HintButton } from "./HintButton";
import { ResultOverlay } from "./ResultOverlay";
import { TierBadge } from "./TierBadge";
import { Button } from "../ui/Button";

export function PlayScreen() {
  const { levelId } = useParams();
  const sample = sampleForLevel(Number(levelId));
  const { isUnlocked } = useProfile();

  if (!sample || !isUnlocked(sample.id)) {
    return <Navigate to="/play" replace />;
  }

  return <PlayScreenInner key={sample.id} sampleId={sample.id} />;
}

function PlayScreenInner({ sampleId }: { sampleId: number }) {
  const navigate = useNavigate();
  const sample = sampleForLevel(sampleId)!;
  const { recordLevelComplete } = useProfile();

  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [result, setResult] = useState<{ stars: 1 | 2 | 3; xp: number } | null>(null);

  const canonicalLines = useMemo(() => jsonToYaml(sample.json).split("\n"), [sample]);
  const nextSample = sampleForLevel(sample.id + 1);

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }

  function handleCheck() {
    if (!input.trim()) {
      setError("Type your YAML answer first.");
      triggerShake();
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const parsed = yamlToJson(input);
    if (!parsed.ok) {
      setError(parsed.error);
      triggerShake();
      return;
    }
    if (!deepEqual(parsed.data, sample.json)) {
      setError("Not quite — check the keys, nesting, and value types against the JSON.");
      triggerShake();
      return;
    }

    setError(null);
    setShake(false);
    const { entry, xpGained } = recordLevelComplete(sample.id, sample.tier, nextAttempts, revealedLines.length);
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted no-underline transition-colors hover:border-border-strong hover:text-text"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-text sm:text-lg">
                Level {sample.id} &middot; {sample.title}
              </h1>
            </div>
            <div className="mt-1">
              <TierBadge tier={sample.tier} />
            </div>
          </div>
        </div>
        {attempts > 0 && (
          <span className="text-xs text-faint">
            {attempts} attempt{attempts === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2" style={{ minHeight: "22rem" }}>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">JSON</p>
          <div className="h-64 md:h-full">
            <JsonPane data={sample.json} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Your YAML</p>
          <div className="h-64 md:h-full">
            <CodeEditor value={input} onChange={setInput} shake={shake} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-start gap-2 overflow-hidden rounded-lg border border-error/30 bg-error-soft px-3 py-2.5 text-sm text-error"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <HintButton revealedLines={revealedLines} totalLines={canonicalLines.length} onReveal={handleReveal} />
      </div>

      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setInput("")}
          className="inline-flex items-center justify-center gap-1.5 text-sm text-faint transition-colors hover:text-muted cursor-pointer"
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
            hasNext={Boolean(nextSample)}
            onNext={() => nextSample && navigate(`/play/${nextSample.id}`)}
            onBackToMap={() => navigate("/play")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
