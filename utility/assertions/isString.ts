/**
 * Checks whether a value is a string.
 * @param value The value to be checked.
 */
function isString(value: any): value is string {
    return value.constructor === String
}


export default isString
