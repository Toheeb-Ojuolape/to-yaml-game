import { convert } from "@catalystic/json-to-yaml";
import { load, YAMLException } from "js-yaml";

export function jsonToYaml(data: unknown): string {
  return convert(data);
}

export type YamlParseResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

export function yamlToJson(text: string): YamlParseResult {
  try {
    const data = load(text);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof YAMLException) {
      const mark = err.mark;
      const location = mark ? ` (line ${mark.line + 1}, column ${mark.column + 1})` : "";
      return { ok: false, error: `${err.reason}${location}` };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Could not parse YAML" };
  }
}

export function safeJsonParse(text: string): YamlParseResult {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not parse JSON" };
  }
}
