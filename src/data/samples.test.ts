import { describe, expect, it } from "vitest";
import { load, YAML11_SCHEMA } from "js-yaml";
import { levelSlots, resolveLevel, slotForLevel } from "./samples";
import { mulberry32 } from "../lib/rng";
import { jsonToYaml, yamlToJson } from "../lib/yaml";
import { deepEqual } from "../lib/deepEqual";
import type { GeneratedContent, LevelSlot, Tier } from "../types";

const TIERS: Tier[] = ["novice", "apprentice", "expert", "master", "reader", "wizard"];
const TOTAL_LEVELS = 30;
const DISTINCT_SAMPLE_SIZE = 2000;
const MIN_DISTINCT = 1000;
const VALIDITY_SAMPLE_SIZE = 300;

// The "wizard" merge-key level (`<<: *anchor`) only resolves into flattened keys under the
// YAML 1.1 schema — js-yaml's default (YAML 1.2 core) schema leaves the literal "<<" key
// unmerged. The app never parses `yaml` at runtime for yamlToJson levels (the player types
// JSON directly), so this is purely an authoring-correctness check, not live behavior.
const YAML11_ONLY_IDS = new Set([27]);

function instancesFor(slot: LevelSlot, count: number): GeneratedContent[] {
  return Array.from({ length: count }, (_, seed) => slot.generate(mulberry32(seed)));
}

describe("levelSlots", () => {
  it(`contains exactly ${TOTAL_LEVELS} levels`, () => {
    expect(levelSlots).toHaveLength(TOTAL_LEVELS);
  });

  it(`has sequential unique ids from 1 to ${TOTAL_LEVELS}`, () => {
    expect(levelSlots.map((s) => s.id)).toEqual(Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1));
  });

  it("assigns exactly 5 levels to each tier, in tier order", () => {
    const expectedTiers = TIERS.flatMap((tier) => Array(5).fill(tier));
    expect(levelSlots.map((s) => s.tier)).toEqual(expectedTiers);
  });

  it("gives every level a non-empty title", () => {
    for (const slot of levelSlots) {
      expect(slot.title.trim().length).toBeGreaterThan(0);
    }
  });
});

describe.each(levelSlots)("level $id ($title)", (slot) => {
  const instances = instancesFor(slot, DISTINCT_SAMPLE_SIZE);

  it(`produces at least ${MIN_DISTINCT} distinct questions across ${DISTINCT_SAMPLE_SIZE} seeds`, () => {
    const distinct = new Set(instances.map((inst) => JSON.stringify(inst.json)));
    expect(distinct.size).toBeGreaterThanOrEqual(MIN_DISTINCT);
  });

  if (slot.direction === "yamlToJson") {
    it("always includes a non-empty yaml field", () => {
      for (const inst of instances.slice(0, VALIDITY_SAMPLE_SIZE)) {
        expect(inst.yaml?.trim().length).toBeGreaterThan(0);
      }
    });

    it("the authored YAML always parses to exactly `json`", () => {
      const schema = YAML11_ONLY_IDS.has(slot.id) ? YAML11_SCHEMA : undefined;
      for (const inst of instances.slice(0, VALIDITY_SAMPLE_SIZE)) {
        const parsed = load(inst.yaml!, schema ? { schema } : undefined);
        expect(deepEqual(parsed, inst.json)).toBe(true);
      }
    });
  } else {
    it("JSON -> YAML -> JSON round-trips losslessly", () => {
      for (const inst of instances.slice(0, VALIDITY_SAMPLE_SIZE)) {
        const yaml = jsonToYaml(inst.json);
        const parsed = yamlToJson(yaml);
        expect(parsed.ok).toBe(true);
        if (parsed.ok) {
          expect(deepEqual(parsed.data, inst.json)).toBe(true);
        }
      }
    });

    it("carries no yaml field (forward-direction levels don't need one)", () => {
      for (const inst of instances.slice(0, VALIDITY_SAMPLE_SIZE)) {
        expect(inst.yaml).toBeUndefined();
      }
    });
  }
});

describe("resolveLevel", () => {
  it("resolves a level's static metadata plus one generated instance", () => {
    const sample = resolveLevel(1, mulberry32(0))!;
    expect(sample.id).toBe(1);
    expect(sample.title).toBe(levelSlots[0].title);
    expect(sample.tier).toBe("novice");
    expect(sample.json).toBeDefined();
  });

  it("returns undefined for an out-of-range id", () => {
    expect(resolveLevel(0)).toBeUndefined();
    expect(resolveLevel(TOTAL_LEVELS + 1)).toBeUndefined();
  });

  it("produces a different instance for a different seed", () => {
    const a = resolveLevel(1, mulberry32(1))!;
    const b = resolveLevel(1, mulberry32(2))!;
    expect(deepEqual(a.json, b.json)).toBe(false);
  });

  it("is deterministic for a given seed", () => {
    const a = resolveLevel(5, mulberry32(123))!;
    const b = resolveLevel(5, mulberry32(123))!;
    expect(deepEqual(a.json, b.json)).toBe(true);
  });

  it("works with the default (unseeded) random source", () => {
    expect(() => resolveLevel(1)).not.toThrow();
  });
});

describe("slotForLevel", () => {
  it("returns the matching slot", () => {
    expect(slotForLevel(1)?.title).toBe(levelSlots[0].title);
    expect(slotForLevel(TOTAL_LEVELS)?.title).toBe(levelSlots[TOTAL_LEVELS - 1].title);
  });

  it("returns undefined for an out-of-range id", () => {
    expect(slotForLevel(0)).toBeUndefined();
  });
});
