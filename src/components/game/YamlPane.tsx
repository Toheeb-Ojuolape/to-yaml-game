import { useMemo } from "react";
import { tokenizeYaml } from "../../lib/highlight";
import { CodePane } from "./CodePane";

export function YamlPane({ yaml }: { yaml: string }) {
  const tokens = useMemo(() => tokenizeYaml(yaml), [yaml]);

  return <CodePane text={yaml} tokens={tokens} />;
}
