import swapValues from "./swapValues";

/**
 * Tells whether a number is in between (in range) of two other.
 * @param val The number to be checked.
 * @param a First number range.
 * @param b Second number range.
 */
function isBetween(val: number, a: number, b: number) {
    if(a > b)
        var {a, b} = swapValues(a, b)
    return val > a && val < b
}


export default isBetween
