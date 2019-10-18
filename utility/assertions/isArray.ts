/**
 * Checks whether a value is an array.
 *
 * @param value The value to be checked.
 * @deprecated This function has no benefit over using the standard library's
 * `Array.isArray` method and its usage is discouraged. It is only kept for
 * backwards compatibility and could be removed in the future.
 */
export function isArray(value: any): value is Array<any> {
  return Array.isArray(value)
}
