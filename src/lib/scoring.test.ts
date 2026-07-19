import { describe, expect, it } from "vitest";
import { calculateResult } from "./scoring";

describe("calculateResult", () => {
  it("awards 3 stars for a first-try, hint-free clear", () => {
    expect(calculateResult("novice", 1, 0).stars).toBe(3);
  });

  it("awards 2 stars for a clear within 3 attempts with at most 1 hint", () => {
    expect(calculateResult("novice", 2, 0).stars).toBe(2);
    expect(calculateResult("novice", 3, 1).stars).toBe(2);
  });

  it("awards 1 star otherwise", () => {
    expect(calculateResult("novice", 4, 0).stars).toBe(1);
    expect(calculateResult("novice", 1, 2).stars).toBe(1);
  });

  it("does not award 3 stars if a hint was used, even on the first attempt", () => {
    expect(calculateResult("novice", 1, 1).stars).toBe(2);
  });

  it("scales base XP by tier multiplier", () => {
    expect(calculateResult("novice", 1, 0).xp).toBe(100);
    expect(calculateResult("apprentice", 1, 0).xp).toBe(125);
    expect(calculateResult("expert", 1, 0).xp).toBe(150);
    expect(calculateResult("master", 1, 0).xp).toBe(200);
  });

  it("deducts XP per hint used", () => {
    expect(calculateResult("novice", 2, 1).xp).toBe(85);
    expect(calculateResult("novice", 2, 2).xp).toBe(70);
  });

  it("never drops XP below the floor", () => {
    expect(calculateResult("novice", 5, 10).xp).toBe(20);
  });
});
