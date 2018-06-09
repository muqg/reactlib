/**
 * Checks whether a value is undefined.
 * @param value The value to be checked.
 */
export function isUndefined(value: any): value is undefined {
    return value === undefined
}
