import { motion } from "framer-motion";
import { ArrowRight, Map, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ResultOverlayProps {
  stars: 1 | 2 | 3;
  xp: number;
  hasNext: boolean;
  onNext: () => void;
  onBackToMap: () => void;
}

const burstOffsets = [
  { x: -60, y: -40 },
  { x: 60, y: -50 },
  { x: -80, y: 10 },
  { x: 80, y: 20 },
  { x: -30, y: -70 },
  { x: 30, y: 60 },
];

export function ResultOverlay({ stars, xp, hasNext, onNext, onBackToMap }: ResultOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="relative w-full max-w-sm overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {burstOffsets.map((o, i) => (
            <motion.span
              key={i}
              className="bg-accent absolute h-1.5 w-1.5 rounded-full"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: o.x, y: o.y, opacity: 0, scale: 0 }}
              transition={{ duration: 0.7, delay: 0.05 * i, ease: "easeOut" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="bg-success-soft text-success relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8">
            <motion.path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            />
          </svg>
        </motion.div>

        <h2 className="text-text relative text-lg font-semibold">Level cleared</h2>

        <div className="relative mt-3 flex items-center justify-center gap-1.5">
          {[1, 2, 3].map((n) => (
            <motion.span
              key={n}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + n * 0.1, type: "spring", stiffness: 300 }}
            >
              <Star
                size={22}
                fill={n <= stars ? "var(--color-accent)" : "transparent"}
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                className={n <= stars ? "" : "opacity-30"}
              />
            </motion.span>
          ))}
        </div>

        <p className="text-muted relative mt-3 text-sm">
          +<span className="font-mono-num text-accent font-semibold">{xp}</span> XP earned
        </p>

        <div className="relative mt-7 flex flex-col gap-2">
          {hasNext ? (
            <Button onClick={onNext} icon={<ArrowRight size={16} />} fullWidth>
              Next level
            </Button>
          ) : (
            <p className="bg-accent-soft text-accent rounded-lg px-3 py-2 text-xs font-medium">
              You've cleared every level!
            </p>
          )}
          <Button variant="secondary" onClick={onBackToMap} icon={<Map size={16} />} fullWidth>
            Back to map
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
