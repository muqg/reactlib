/**
 * Limits a string to select length.
 * @param str The subject string.
 * @param maxLen String's length limit.
 * @param addDots Whether to add dots at the end of the limited string.
 */
const limit = (str: string, maxLen = 12, addDots = true) => {
    if(str.length > maxLen)
        return str.substring(0, maxLen) + (addDots ? "..." : "")
    return str
}


export default limit
