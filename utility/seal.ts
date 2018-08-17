const sealedElements: Array<string> = []

/**
 * Decorates a function, allowing it to be executed only the
 * first time it is called on the current object instance.
 *
 * @param func The function to be sealed.
 */
// @ts-ignore Odd error reporting for generic array after v.3.0.1
function seal<A extends any[]>(func: (...args: A) => Promise<void> | void): (...args: A) => Promise<void>
/**
 * Decorates a function with a key. Only the first function call amongst all
 * functions decorated with this same key will be executed.
 *
 * @param func The function to be sealed.
 *
 * @param key A key to seal the function with. Once the key is sealed any
 * following calls to a sealed function for this key are discarded.
 */
// @ts-ignore Odd error reporting for generic array after v.3.0.1
function seal<A extends any[]>(func: (...args: A) => Promise<void> | void, key?: string): (...args: A) => Promise<void>

// @ts-ignore Odd error reporting for generic array after v.3.0.1
function seal<A extends any[]>(func: (...args: A) => Promise<void> | void, key?: string) {
    let sealed = false

    // @ts-ignore Odd error reporting for generic array after v.3.0.1
    return async (...args: A) => {
        if(sealed || (key && sealedElements.includes(key)))
            return

        if(key)
            sealedElements.push(key)

        sealed = true
        await func(...args)
    }
}

export { seal };
