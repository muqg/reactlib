/**
 * Checks whether a value is null.
 *
 * @param value The value to be checked.
 * @deprecated This function has no benefit over using a simple comparison
 * `value === null` and its usage is discouraged. It is only kept for
 * backwards compatibility and could be removed in the future.
 */
export function isNull(value: any): value is null {
  return value === null
}
