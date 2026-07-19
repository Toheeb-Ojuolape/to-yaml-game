import type { Tier } from "../../types";

const TIER_META: Record<Tier, { label: string; color: string }> = {
  novice: { label: "Novice", color: "#3ecf8e" },
  apprentice: { label: "Apprentice", color: "#4fb8e0" },
  expert: { label: "Expert", color: "#a58cf0" },
  master: { label: "Master", color: "#f5a623" },
};

export function tierMeta(tier: Tier) {
  return TIER_META[tier];
}

export function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ borderColor: `${meta.color}40`, color: meta.color, background: `${meta.color}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}
