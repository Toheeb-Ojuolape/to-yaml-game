import { describe, expect, it } from "vitest";
import { tokenizeJson, tokenizeYaml } from "./highlight";
import type { Token } from "./highlight";

function reconstruct(tokens: Token[]) {
  return tokens.map((t) => t.text).join("");
}

function findType(tokens: Token[], text: string) {
  return tokens.find((t) => t.text === text)?.type;
}

describe("tokenizeJson", () => {
  it("reconstructs the exact input text from its tokens", () => {
    const pretty = JSON.stringify({ name: "Ada", age: 30, ok: true, x: null }, null, 2);
    expect(reconstruct(tokenizeJson(pretty))).toBe(pretty);
  });

  it("classifies keys, strings, numbers, booleans, and null", () => {
    const pretty = JSON.stringify({ name: "Ada", age: 30, ok: true, x: null }, null, 2);
    const tokens = tokenizeJson(pretty);
    expect(findType(tokens, '"name":')).toBe("key");
    expect(findType(tokens, '"Ada"')).toBe("string");
    expect(findType(tokens, "30")).toBe("number");
    expect(findType(tokens, "true")).toBe("boolean");
    expect(findType(tokens, "null")).toBe("null");
  });

  it("handles negative and decimal numbers", () => {
    const tokens = tokenizeJson('{"a": -4.5}');
    expect(findType(tokens, "-4.5")).toBe("number");
  });
});

describe("tokenizeYaml", () => {
  it("reconstructs the exact input text from its tokens", () => {
    const yaml = 'name: "Ada"\nactive: true\ncount: 3\nnothing: null\nlist:\n  - "a"\n  - "b"';
    expect(reconstruct(tokenizeYaml(yaml))).toBe(yaml);
  });

  it("classifies mapping keys and scalar value types", () => {
    const tokens = tokenizeYaml('name: "Ada"\nactive: true\ncount: 3\nnothing: null');
    expect(findType(tokens, "name")).toBe("key");
    expect(findType(tokens, '"Ada"')).toBe("string");
    expect(findType(tokens, "active")).toBe("key");
    expect(findType(tokens, "true")).toBe("boolean");
    expect(findType(tokens, "count")).toBe("key");
    expect(findType(tokens, "3")).toBe("number");
    expect(findType(tokens, "nothing")).toBe("key");
    expect(findType(tokens, "null")).toBe("null");
  });

  it("classifies list dashes as punctuation", () => {
    const tokens = tokenizeYaml('list:\n  - "a"\n  - "b"');
    expect(tokens.some((t) => t.text === "- " && t.type === "punct")).toBe(true);
  });

  it("treats a plain unquoted scalar as a string value", () => {
    const tokens = tokenizeYaml("username: arclight");
    expect(findType(tokens, "arclight")).toBe("string");
  });

  it("preserves comment lines as plain text", () => {
    const yaml = '# a comment\nname: "Ada"';
    const tokens = tokenizeYaml(yaml);
    expect(reconstruct(tokens)).toBe(yaml);
    expect(findType(tokens, "# a comment")).toBe("plain");
  });

  it("falls back to JSON tokenizing for flow-style collections", () => {
    const yaml = 'tags: ["a", "b", 1, true, null]';
    const tokens = tokenizeYaml(yaml);
    expect(reconstruct(tokens)).toBe(yaml);
    expect(findType(tokens, '"a"')).toBe("string");
    expect(findType(tokens, "1")).toBe("number");
    expect(findType(tokens, "true")).toBe("boolean");
  });

  it("does not treat an unspaced colon (e.g. a URL) as a mapping key", () => {
    const tokens = tokenizeYaml("http://example.com");
    expect(tokens.some((t) => t.type === "key")).toBe(false);
  });

  it("classifies an anchor definition distinctly from a plain string", () => {
    const tokens = tokenizeYaml("base: &defaults");
    expect(findType(tokens, "&defaults")).toBe("anchor");
  });

  it("classifies an alias reference distinctly from a plain string", () => {
    const tokens = tokenizeYaml("config: *defaults");
    expect(findType(tokens, "*defaults")).toBe("anchor");
  });

  it("reconstructs anchor/alias/merge-key YAML exactly", () => {
    const yaml =
      "defaults: &defaults\n  adapter: postgres\ndevelopment:\n  <<: *defaults\n  database: dev_db";
    expect(reconstruct(tokenizeYaml(yaml))).toBe(yaml);
  });

  it("classifies the merge key '<<' as a key", () => {
    const tokens = tokenizeYaml("<<: *defaults");
    expect(findType(tokens, "<<")).toBe("key");
  });
});
