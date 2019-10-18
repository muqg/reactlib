/**
 * Checks whether a value is undefined.
 *
 * @param value The value to be checked.
 * @deprecated This function has no benefit over using a simple comparison
 * `value === undefined` and its usage is discouraged. It is only kept for
 * backwards compatibility and could be removed in the future.
 */
export function isUndefined(value: any): value is undefined {
  return value === undefined
}
