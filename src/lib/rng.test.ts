import { describe, expect, it } from "vitest";
import { mulberry32, pick, pickN, randBool, randFloat, randInt } from "./rng";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });

  it("always returns values in [0, 1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pick", () => {
  it("only ever returns elements from the input array", () => {
    const rng = mulberry32(1);
    const values = ["a", "b", "c"];
    for (let i = 0; i < 100; i++) {
      expect(values).toContain(pick(rng, values));
    }
  });

  it("covers the full range given enough draws", () => {
    const rng = mulberry32(1);
    const values = [1, 2, 3, 4, 5];
    const seen = new Set(Array.from({ length: 200 }, () => pick(rng, values)));
    expect(seen.size).toBe(values.length);
  });
});

describe("pickN", () => {
  it("returns n distinct elements, all from the source array", () => {
    const rng = mulberry32(3);
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = pickN(rng, values, 4);
    expect(result).toHaveLength(4);
    expect(new Set(result).size).toBe(4);
    for (const v of result) expect(values).toContain(v);
  });

  it("caps at the array length if n exceeds it", () => {
    const rng = mulberry32(3);
    expect(pickN(rng, [1, 2], 5)).toHaveLength(2);
  });
});

describe("randInt", () => {
  it("stays within [min, max] inclusive and can reach both ends", () => {
    const rng = mulberry32(9);
    const results = new Set(Array.from({ length: 500 }, () => randInt(rng, 1, 3)));
    for (const v of results) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(3);
      expect(Number.isInteger(v)).toBe(true);
    }
    expect(results).toEqual(new Set([1, 2, 3]));
  });
});

describe("randFloat", () => {
  it("stays within range and respects decimal precision", () => {
    const rng = mulberry32(11);
    for (let i = 0; i < 200; i++) {
      const v = randFloat(rng, 5, 10, 2);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(10);
      expect(Number(v.toFixed(2))).toBe(v);
    }
  });
});

describe("randBool", () => {
  it("produces both true and false over many draws", () => {
    const rng = mulberry32(5);
    const results = new Set(Array.from({ length: 100 }, () => randBool(rng)));
    expect(results).toEqual(new Set([true, false]));
  });
});
