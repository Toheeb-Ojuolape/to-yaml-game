import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Sample } from "../../types";
import { tierMeta } from "./TierBadge";

interface LevelNodeProps {
  sample: Sample;
  unlocked: boolean;
  stars?: 1 | 2 | 3;
  index: number;
}

export function LevelNode({ sample, unlocked, stars, index }: LevelNodeProps) {
  const navigate = useNavigate();
  const color = tierMeta(sample.tier).color;
  const completed = Boolean(stars);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 320, damping: 22 }}
      whileHover={unlocked ? { y: -3, scale: 1.03 } : undefined}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
      disabled={!unlocked}
      onClick={() => navigate(`/play/${sample.id}`)}
      className={`group relative flex w-full flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors ${
        unlocked
          ? "cursor-pointer border-border bg-surface hover:border-border-strong hover:bg-surface-hover"
          : "cursor-not-allowed border-border-strong/70 bg-surface"
      }`}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
        style={
          unlocked
            ? { background: `${color}1f`, color, boxShadow: `0 0 0 1.5px ${color}55` }
            : { background: "var(--color-bg-raised)", color: "var(--color-muted)", boxShadow: "0 0 0 1.5px var(--color-border-strong)" }
        }
      >
        {unlocked ? (completed ? <Star size={17} fill={color} strokeWidth={0} /> : sample.id) : <Lock size={15} />}
      </span>

      <span className={`line-clamp-1 text-xs font-medium ${unlocked ? "text-text" : "text-muted"}`}>
        {sample.title}
      </span>

      {completed && (
        <span className="flex gap-0.5">
          {[1, 2, 3].map((n) => (
            <Star
              key={n}
              size={10}
              className={n <= stars! ? "" : "opacity-25"}
              fill={n <= stars! ? color : "transparent"}
              stroke={color}
              strokeWidth={1.5}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
