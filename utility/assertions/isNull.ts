/**
 * Checks whether a value is null.
 * @param value The value to be checked.
 */
function isNull(value: any): value is null {
    return value === null
}


export default isNull
