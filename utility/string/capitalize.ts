/**
 * Capitalizes a string so that the first character is uppercase and all other
 * are lowercase.
 * @param str The string to be capitalized.
 */
function capitalize(str: string): string
/**
 * Capitalizes a string so that the first character is uppercase and all other
 * are lowercase. Optional separator may be provided to capitalize every separate
 * word.
 * @param str The string to be capitalized.
 * @param separator A separator for the individual words.
 */
function capitalize(str: string, separator?: string): string

function capitalize(str: string, separator?: string) {
    let res: string
    if (separator)
        res = str
            .split(separator)
            .map(word => cap(word))
            .join(separator)
    else res = cap(str)
    return res
}

function cap(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export {capitalize}
