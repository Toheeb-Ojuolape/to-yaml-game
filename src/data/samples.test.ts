import { describe, expect, it } from "vitest";
import { samples, sampleForLevel } from "./samples";
import { jsonToYaml, yamlToJson } from "../lib/yaml";
import { deepEqual } from "../lib/deepEqual";
import type { Tier } from "../types";

const TIERS: Tier[] = ["novice", "apprentice", "expert", "master"];

describe("samples", () => {
  it("contains exactly 20 levels", () => {
    expect(samples).toHaveLength(20);
  });

  it("has sequential unique ids from 1 to 20", () => {
    expect(samples.map((s) => s.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it("assigns exactly 5 levels to each of the 4 tiers, in tier order", () => {
    const expectedTiers = TIERS.flatMap((tier) => Array(5).fill(tier));
    expect(samples.map((s) => s.tier)).toEqual(expectedTiers);
  });

  it("gives every level a non-empty title", () => {
    for (const sample of samples) {
      expect(sample.title.trim().length).toBeGreaterThan(0);
    }
  });

  it.each(samples)("level $id ($title): JSON -> YAML -> JSON round-trips losslessly", (sample) => {
    const yaml = jsonToYaml(sample.json);
    const parsed = yamlToJson(yaml);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(deepEqual(parsed.data, sample.json)).toBe(true);
    }
  });

  it("sampleForLevel returns the matching sample", () => {
    expect(sampleForLevel(1)?.title).toBe(samples[0].title);
    expect(sampleForLevel(20)?.title).toBe(samples[19].title);
  });

  it("sampleForLevel returns undefined for an out-of-range id", () => {
    expect(sampleForLevel(0)).toBeUndefined();
    expect(sampleForLevel(21)).toBeUndefined();
  });
});
