/**
 * Tells whether a number is in between (in range) of two other.
 * @param val The number to be checked.
 * @param a First number range.
 * @param b Second number range.
 */
export function isBetween(val: number, a: number, b: number) {
    if(a > b)
        [b, a] = [a, b]
    return val > a && val < b
}
