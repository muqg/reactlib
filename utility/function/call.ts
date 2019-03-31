/**
 * Calls a function if it is not undefined and returns its output.
 *
 * @param fn The function to call
 * @param args Arguments to pass to the function.
 */
function call<A extends any[], R = any>(func?: (...args: A) => R, ...args: A) {
    if (func) {
        return func(...args)
    }
}

export {call}
