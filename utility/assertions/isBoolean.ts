/**
 * Checks whether a value is a boolean.
 * @param value The value to be checked.
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean"
}
