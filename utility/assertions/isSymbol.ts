/**
 * Checks whether a value is a symbol.
 * @param value The value to be checked.
 */
function isSymbol(value: any): value is symbol {
    return typeof value === "symbol"
}


export default isSymbol
