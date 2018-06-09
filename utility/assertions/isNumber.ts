/**
 * Checks whether a provided value is a number.
 * @param value The value to be checked.
 */
export function isNumber(value: any): value is number {
    return typeof value === "number" && isFinite(value)
}
