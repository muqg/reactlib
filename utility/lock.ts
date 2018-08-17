/**
 * Decorates a function, allowing it be called once and then
 * disregard any following calls until the first one returns.
 *
 * @param func The function to be locked.
 */
// @ts-ignore Odd error reporting for generic array after v.3.0.1
function lock<A extends any[]>(func: (...args: A) => Promise<void> | void) {
    let locked = false

    // @ts-ignore Odd error reporting for generic array after v.3.0.1
    return async (...args: A) => {
        if(!locked) {
            locked = true
            await func(...args)
            locked = false
        }
    }
}

export { lock };
