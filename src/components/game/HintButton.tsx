import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface HintButtonProps {
  revealedLines: string[];
  totalLines: number;
  onReveal: () => void;
}

export function HintButton({ revealedLines, totalLines, onReveal }: HintButtonProps) {
  const exhausted = revealedLines.length >= totalLines;

  return (
    <div className="rounded-xl border border-border bg-bg-raised p-3">
      <button
        onClick={onReveal}
        disabled={exhausted}
        className="flex w-full items-center justify-between text-left text-sm text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer disabled:hover:text-muted"
      >
        <span className="flex items-center gap-2">
          <Lightbulb size={15} className="text-accent" />
          {revealedLines.length === 0 ? "Reveal a line (costs XP)" : "Reveal another line"}
        </span>
        <span className="font-mono-num text-xs text-faint">
          {revealedLines.length}/{totalLines}
        </span>
      </button>

      <AnimatePresence>
        {revealedLines.length > 0 && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden whitespace-pre-wrap rounded-lg bg-black/30 px-3 py-2 font-mono text-[12px] leading-5 text-accent"
          >
            {revealedLines.join("\n")}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}
