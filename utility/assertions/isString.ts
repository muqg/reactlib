import {isNullOrUndefined} from "./isNullOrUndefined"

/**
 * Checks whether a value is a string primitive or object. While this function
 * checks for String objects, prefer using a simple comparison such as
 * `typeof value === "string"` if String object check is not mandatory.
 *
 * @param value The value to be checked.
 */
export function isString(value: any): value is string {
  return !isNullOrUndefined(value) && value.constructor === String
}
