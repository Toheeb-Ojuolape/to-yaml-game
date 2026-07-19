import { describe, expect, it } from "vitest";
import { jsonToYaml, safeJsonParse, yamlToJson } from "./yaml";

describe("jsonToYaml", () => {
  it("converts a flat object to YAML", () => {
    expect(jsonToYaml({ active: true, count: 3 })).toBe("active: true\ncount: 3\n");
  });

  it("quotes string values", () => {
    expect(jsonToYaml({ name: "Ada" })).toBe('name: "Ada"\n');
  });

  it("renders nested objects and arrays", () => {
    const yaml = jsonToYaml({ tags: ["a", "b"], meta: { ok: true } });
    expect(yaml).toContain("tags:");
    expect(yaml).toContain('- "a"');
    expect(yaml).toContain('- "b"');
    expect(yaml).toContain("meta:");
    expect(yaml).toContain("ok: true");
  });
});

describe("yamlToJson", () => {
  it("parses valid YAML into the equivalent JS value", () => {
    const result = yamlToJson('name: "Ada"\nactive: true\ncount: 3');
    expect(result).toEqual({ ok: true, data: { name: "Ada", active: true, count: 3 } });
  });

  it("parses YAML lists", () => {
    const result = yamlToJson("tags:\n  - a\n  - b");
    expect(result).toEqual({ ok: true, data: { tags: ["a", "b"] } });
  });

  it("returns ok:false with a message for invalid YAML", () => {
    const result = yamlToJson("key: [unclosed");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe("string");
    }
  });
});

describe("safeJsonParse", () => {
  it("parses valid JSON", () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ ok: true, data: { a: 1 } });
  });

  it("returns ok:false for invalid JSON", () => {
    const result = safeJsonParse("{not json}");
    expect(result.ok).toBe(false);
  });
});

describe("round-trip", () => {
  it("jsonToYaml -> yamlToJson reproduces the original data", () => {
    const original = {
      name: "Ada Lovelace",
      born: 1815,
      tags: ["mathematics", "computing"],
      active: true,
      notes: null,
    };
    const yaml = jsonToYaml(original);
    const parsed = yamlToJson(yaml);
    expect(parsed).toEqual({ ok: true, data: original });
  });
});
