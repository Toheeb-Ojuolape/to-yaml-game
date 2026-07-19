import { motion } from "framer-motion";
import { samples } from "../../data/samples";
import type { Tier } from "../../types";
import { useProfile } from "../../context/ProfileContext";
import { LevelNode } from "./LevelNode";
import { TierBadge } from "./TierBadge";

const TIERS: Tier[] = ["novice", "apprentice", "expert", "master"];

export function LevelMap() {
  const { activeProfile, isUnlocked } = useProfile();
  const cleared = activeProfile ? Object.keys(activeProfile.progress).length : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-10">
        <h1 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
          {activeProfile ? `Welcome back, ${activeProfile.name}` : "Level map"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Translate the JSON on the left into valid YAML. {cleared}/{samples.length} levels cleared.
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(cleared / samples.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="space-y-10">
        {TIERS.map((tier) => {
          const levels = samples.filter((s) => s.tier === tier);
          return (
            <section key={tier}>
              <div className="mb-4 flex items-center gap-3">
                <TierBadge tier={tier} />
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {levels.map((sample, i) => (
                  <LevelNode
                    key={sample.id}
                    sample={sample}
                    unlocked={isUnlocked(sample.id)}
                    stars={activeProfile?.progress[sample.id]?.stars}
                    index={i}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
