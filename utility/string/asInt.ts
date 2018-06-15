/**
 * Attempts to parse a string as integer or returns 0 instead.
 * @param str The string to be parsed.
 */
function asInt(str: string) {
    const res = parseInt(str)
    return isNaN(res) ? 0 : res
}


export {
    asInt
}
