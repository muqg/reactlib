/**
 * Checks whether a provided value is a number.
 * @param value The value to be checked.
 */
function isNumber(value: any): value is number

function isNumber(value) {
    return typeof value === "number" && isFinite(value)
}


export default isNumber
