/**
 * Checks whether a value is a string.
 * @param value The value to be checked.
 */
function isString(value: any): value is string {
    return typeof value === "string"
}


export default isString
