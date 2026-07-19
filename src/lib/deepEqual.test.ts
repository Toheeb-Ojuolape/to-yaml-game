import { describe, expect, it } from "vitest";
import { deepEqual } from "./deepEqual";

describe("deepEqual", () => {
  it("treats identical primitives as equal", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
  });

  it("treats different primitives as unequal", () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual("a", "b")).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(1, "1")).toBe(false);
  });

  it("treats NaN as equal to NaN", () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it("compares nested objects structurally", () => {
    const a = { user: { name: "Ada", roles: ["admin", "user"] } };
    const b = { user: { name: "Ada", roles: ["admin", "user"] } };
    expect(deepEqual(a, b)).toBe(true);
  });

  it("detects differing nested values", () => {
    const a = { user: { name: "Ada" } };
    const b = { user: { name: "Grace" } };
    expect(deepEqual(a, b)).toBe(false);
  });

  it("detects differing key sets", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("is order-independent for object keys", () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it("compares arrays element-by-element and by length", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  it("does not treat an array and an object as equal", () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  it("handles empty arrays and objects", () => {
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([], {})).toBe(false);
  });
});
