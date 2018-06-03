/**
 * Checks whether a value is null.
 * @param value The value to be checked.
 */
function isNull(value: any): value is null

function isNull(value) {
    return value === null
}


export default isNull
