import { useMemo } from "react";
import { tokenizeJson } from "../../lib/highlight";
import { CodePane } from "./CodePane";

export function JsonPane({ data }: { data: unknown }) {
  const pretty = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const tokens = useMemo(() => tokenizeJson(pretty), [pretty]);

  return <CodePane text={pretty} tokens={tokens} />;
}
