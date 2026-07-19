export type TokenType = "key" | "string" | "number" | "boolean" | "null" | "punct" | "plain" | "anchor";

export interface Token {
  text: string;
  type: TokenType;
}

const TOKEN_RE =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

export function tokenizeJson(pretty: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(pretty))) {
    if (match.index > lastIndex) {
      tokens.push({ text: pretty.slice(lastIndex, match.index), type: "plain" });
    }
    const text = match[0];
    let type: TokenType = "plain";
    if (text.startsWith('"')) {
      type = text.trimEnd().endsWith(":") ? "key" : "string";
    } else if (text === "true" || text === "false") {
      type = "boolean";
    } else if (text === "null") {
      type = "null";
    } else {
      type = "number";
    }
    tokens.push({ text, type });
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < pretty.length) {
    tokens.push({ text: pretty.slice(lastIndex), type: "plain" });
  }
  return tokens;
}

export const TOKEN_CLASS: Record<TokenType, string> = {
  key: "text-syntax-key",
  string: "text-syntax-string",
  number: "text-syntax-number",
  boolean: "text-syntax-boolean",
  null: "text-faint",
  punct: "text-muted",
  plain: "text-muted",
  anchor: "text-syntax-anchor font-semibold",
};

const YAML_KEY_RE = /^((?:"(?:\\.|[^"\\])*")|(?:'(?:[^']|'')*')|(?:[^:\s#][^:]*?))(:)(\s|$)/;
const YAML_DASHES_RE = /^(-\s+)+/;

export function tokenizeYaml(text: string): Token[] {
  const lines = text.split("\n");
  const tokens: Token[] = [];
  lines.forEach((line, i) => {
    tokens.push(...tokenizeYamlLine(line));
    if (i < lines.length - 1) tokens.push({ text: "\n", type: "plain" });
  });
  return tokens;
}

function tokenizeYamlLine(line: string): Token[] {
  const tokens: Token[] = [];

  const indent = line.match(/^\s*/)?.[0] ?? "";
  if (indent) tokens.push({ text: indent, type: "plain" });
  let rest = line.slice(indent.length);

  if (rest.startsWith("#")) {
    tokens.push({ text: rest, type: "plain" });
    return tokens;
  }

  const dashes = rest.match(YAML_DASHES_RE)?.[0];
  if (dashes) {
    tokens.push({ text: dashes, type: "punct" });
    rest = rest.slice(dashes.length);
  } else if (rest === "-") {
    tokens.push({ text: rest, type: "punct" });
    return tokens;
  }

  if (!rest) return tokens;

  const keyMatch = rest.match(YAML_KEY_RE);
  if (keyMatch) {
    const [, key, colon] = keyMatch;
    tokens.push({ text: key, type: "key" });
    tokens.push({ text: colon, type: "punct" });
    tokens.push(...tokenizeYamlValue(rest.slice(key.length + 1)));
    return tokens;
  }

  tokens.push(...tokenizeYamlValue(rest));
  return tokens;
}

function tokenizeYamlValue(value: string): Token[] {
  const leadingSpace = value.match(/^\s*/)?.[0] ?? "";
  const trimmed = value.slice(leadingSpace.length);
  const tokens: Token[] = [];
  if (leadingSpace) tokens.push({ text: leadingSpace, type: "plain" });
  if (!trimmed) return tokens;

  if (trimmed.startsWith("#")) {
    tokens.push({ text: trimmed, type: "plain" });
  } else if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    tokens.push(...tokenizeJson(trimmed));
  } else if (/^[&*]\S+/.test(trimmed)) {
    // anchor definition (&name) or alias reference (*name), optionally followed by an inline value
    const m = trimmed.match(/^([&*]\S+)(\s*)([\s\S]*)$/)!;
    const [, marker, gap, remainder] = m;
    tokens.push({ text: marker, type: "anchor" });
    if (gap) tokens.push({ text: gap, type: "plain" });
    if (remainder) tokens.push(...tokenizeYamlValue(remainder));
  } else if (/^"(?:\\.|[^"\\])*"$/.test(trimmed) || /^'(?:[^']|'')*'$/.test(trimmed)) {
    tokens.push({ text: trimmed, type: "string" });
  } else if (/^(true|false)$/i.test(trimmed)) {
    tokens.push({ text: trimmed, type: "boolean" });
  } else if (/^(null|~)$/i.test(trimmed)) {
    tokens.push({ text: trimmed, type: "null" });
  } else if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) {
    tokens.push({ text: trimmed, type: "number" });
  } else if (/^[|>][+-]?\d*$/.test(trimmed)) {
    tokens.push({ text: trimmed, type: "punct" });
  } else {
    tokens.push({ text: trimmed, type: "string" });
  }
  return tokens;
}
