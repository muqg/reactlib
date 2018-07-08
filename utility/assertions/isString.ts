import { isUndefined, isNull } from ".";

/**
 * Checks whether a value is a string.
 * @param value The value to be checked.
 */
export function isString(value: any): value is string {
    return !isUndefined(value) && !isNull(value) && value.constructor === String
}
