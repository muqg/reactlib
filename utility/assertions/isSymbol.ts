/**
 * Checks whether a value is a symbol.
 * @param value The value to be checked.
 */
function isSymbol(value: any): value is symbol

function isSymbol(value) {
    return typeof value === "symbol"
}


export default isSymbol
