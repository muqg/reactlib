/**
 * Calls a function if it is not undefined and returns its output.
 *
 * @param fn The function to call
 * @param args Arguments to pass to the function.
 */
// @ts-ignore A rest parameter must be of an array type.
function call<A extends any[], R = any>(func?: (...args: A) => R, ...args: A) {
    if(func)
        // @ts-ignore A rest parameter must be of an array type.
        return func(...args)
}

export { call };
