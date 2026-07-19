import type { Tier } from "../../types";

const TIER_META: Record<Tier, { label: string; color: string }> = {
  novice: { label: "Novice", color: "var(--color-tier-novice)" },
  apprentice: { label: "Apprentice", color: "var(--color-tier-apprentice)" },
  expert: { label: "Expert", color: "var(--color-tier-expert)" },
  master: { label: "Master", color: "var(--color-tier-master)" },
  reader: { label: "Config Reader", color: "var(--color-tier-reader)" },
  wizard: { label: "Wizard", color: "var(--color-tier-wizard)" },
};

export function tierMeta(tier: Tier) {
  return TIER_META[tier];
}

export function tierTint(color: string, percent: number) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: tierTint(meta.color, 40),
        color: meta.color,
        background: tierTint(meta.color, 14),
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}
