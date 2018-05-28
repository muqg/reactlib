/**
 * Swaps the values of two numbers.
 * @param a First number.
 * @param b Second number.
 */
function swapValues(a: number, b: number) {
    a = a + b
    b = a - b
    a = a - b
    return {a, b}
}


export default swapValues
