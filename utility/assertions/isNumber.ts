/**
 * Checks whether a provided value is a number.
 * @param value The value to be checked.
 */
function isNumber(value: any): value is number {
    return typeof value === "number"
}


export default isNumber
