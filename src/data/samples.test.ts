import { describe, expect, it } from "vitest";
import { load, YAML11_SCHEMA } from "js-yaml";
import { samples, sampleForLevel } from "./samples";
import { jsonToYaml, yamlToJson } from "../lib/yaml";
import { deepEqual } from "../lib/deepEqual";
import type { Tier } from "../types";

const TIERS: Tier[] = ["novice", "apprentice", "expert", "master", "reader", "wizard"];
const TOTAL_LEVELS = 30;

// The "wizard" merge-key level (`<<: *anchor`) only resolves into flattened keys under the
// YAML 1.1 schema — js-yaml's default (YAML 1.2 core) schema leaves the literal "<<" key
// unmerged. The app never parses `sample.yaml` at runtime for yamlToJson levels (the player
// types JSON directly), so this is purely an authoring-correctness check, not live behavior.
const YAML11_ONLY_IDS = new Set([27]);

describe("samples", () => {
  it(`contains exactly ${TOTAL_LEVELS} levels`, () => {
    expect(samples).toHaveLength(TOTAL_LEVELS);
  });

  it(`has sequential unique ids from 1 to ${TOTAL_LEVELS}`, () => {
    expect(samples.map((s) => s.id)).toEqual(Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1));
  });

  it("assigns exactly 5 levels to each tier, in tier order", () => {
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

  const reverseLevels = samples.filter((s) => s.direction === "yamlToJson");

  it("every yamlToJson level has a yaml field", () => {
    expect(reverseLevels.length).toBeGreaterThan(0);
    for (const sample of reverseLevels) {
      expect(sample.yaml?.trim().length).toBeGreaterThan(0);
    }
  });

  it.each(reverseLevels)("level $id ($title): the authored YAML parses to exactly `json`", (sample) => {
    const schema = YAML11_ONLY_IDS.has(sample.id) ? YAML11_SCHEMA : undefined;
    const parsed = load(sample.yaml!, schema ? { schema } : undefined);
    expect(deepEqual(parsed, sample.json)).toBe(true);
  });

  it("no jsonToYaml level carries a yaml field", () => {
    for (const sample of samples) {
      if (sample.direction !== "yamlToJson") {
        expect(sample.yaml).toBeUndefined();
      }
    }
  });

  it("sampleForLevel returns the matching sample", () => {
    expect(sampleForLevel(1)?.title).toBe(samples[0].title);
    expect(sampleForLevel(TOTAL_LEVELS)?.title).toBe(samples[TOTAL_LEVELS - 1].title);
  });

  it("sampleForLevel returns undefined for an out-of-range id", () => {
    expect(sampleForLevel(0)).toBeUndefined();
    expect(sampleForLevel(TOTAL_LEVELS + 1)).toBeUndefined();
  });
});
