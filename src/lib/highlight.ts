export type TokenType = "key" | "string" | "number" | "boolean" | "null" | "punct" | "plain";

export interface Token {
  text: string;
  type: TokenType;
}

const TOKEN_RE = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

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
