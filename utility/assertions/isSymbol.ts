/**
 * Checks whether a value is a symbol.
 * @param value The value to be checked.
 */
export function isSymbol(value: any): value is symbol {
  return typeof value === "symbol"
}
