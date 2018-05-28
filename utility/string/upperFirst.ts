/**
 * Transforms the first character to upper-case while leaving the rest unchanged.
 * Optional separator may be provided to capitalize every separate word.
 * @param str The string to be capitalized.
 * @param separator A separator for the individual words.
 */
function upperFirst(str: string, separator?: string) {
    let res: string
    if(separator)
        res = str.split(separator).map(word => ucfirst(word)).join(separator)
    else
        res = ucfirst(str)
    return res
}

function ucfirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}


export default upperFirst
