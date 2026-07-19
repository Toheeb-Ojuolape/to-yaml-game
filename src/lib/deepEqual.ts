export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a === "number" && typeof b === "number") {
    return Number.isNaN(a) && Number.isNaN(b);
  }

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false;

  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => Object.hasOwn(bObj, key) && deepEqual(aObj[key], bObj[key]));
}
