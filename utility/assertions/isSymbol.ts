/**
 * Checks whether a value is a symbol.
 * @param value The value to be checked.
 * @deprecated This function has no benefit over using a simple comparison
 * `typeof value === "symbol"` and its usage is discouraged. It is only
 * kept for backwards compatibility and could be removed in the future.
 */
export function isSymbol(value: any): value is symbol {
  return typeof value === "symbol"
}
