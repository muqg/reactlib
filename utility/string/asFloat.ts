/**
 * Attempts to parse a string as float or returns 0 instead.
 * @param str The string to be parsed.
 */
function asFloat(str: string) {
    const res = parseFloat(str)
    return isNaN(res) ? 0 : res
}


export {
    asFloat
}
