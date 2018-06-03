/**
 * Checks whether a value is an array.
 * @param value The value to be checked.
 */
function isArray(value: any): value is Array<any>

function isArray(value) {
    return Array.isArray(value)
}


export default isArray
