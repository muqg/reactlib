/**
 * Checks whether a value is a boolean.
 * @param value The value to be checked.
 */
function isBoolean(value: any): value is boolean

function isBoolean(value) {
    return typeof value === "boolean"
}


export default isBoolean
