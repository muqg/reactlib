/**
 * Checks whether a value is a boolean.
 *
 * @param value The value to be checked.
 * @deprecated This function has no benefit over using a simple comparison
 * `typeof value === "boolean"` and its usage is discouraged. It is only
 * kept for backwards compatibility and could be removed in the future.
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean"
}
