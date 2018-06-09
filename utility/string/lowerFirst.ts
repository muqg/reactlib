/**
 * Transforms the first character to lower-case while leaving the rest unchanged.
 * @param str The string to be capitalized.
 */
function lowerFirst(str: string) : string
/**
 * Transforms the first character to lower-case while leaving the rest unchanged.
 * Optional separator may be provided to capitalize every separate word.
 * @param str The string to be capitalized.
 * @param separator A separator for the individual words.
 */
function lowerFirst(str: string, separator: string) : string

function lowerFirst(str: string, separator?: string) {
    let res: string
    if(separator)
        res = str.split(separator).map(word => lcfirst(word)).join(separator)
    else
        res = lcfirst(str)
    return res
}

function lcfirst(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1)
}

export {
    lowerFirst
}
