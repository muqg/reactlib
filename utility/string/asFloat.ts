/**
 * Attempts to parse a string as float or returns 0 instead.
 * @param str The string to be parsed.
 */
function asFloat(str: string) {
    const res = parseFloat(str)
    const nan = isNaN(res)

    if (__DEV__) {
        if (nan) {
            console.warn(`
                asFloat function received a string argument that cannot be
                parsed as a valid number and will instead return 0. There is
                probably an error in your code's expected input.
            `)
        }
    }

    return nan ? 0 : res
}

export {asFloat}
