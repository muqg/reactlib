/**
 * Checks whether value is a function. Overloads may be used for better type guarding.
 * @param value The value to be checked.
 */
function isFunction<T extends () => any>(value: any): value is T
/**
 * Checks whether value is a function. Overloads may be used for better type guarding.
 * @param value The value to be checked.
 */
function isFunction<T extends (...values) => any>(value: any): value is T

function isFunction(value) {
    return typeof value === "function"
}


export default isFunction
