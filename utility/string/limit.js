/**
 * Limits a string to select length.
 * @param {string} str The subject string.
 * @param {int} maxLen String's length limit.
 * @param {boolean} addDots Whether to add dots at the end of the limited string.
 */
const limit = (str = "", maxLen = 12, addDots = true) => {
    if(str.length > maxLen)
        return str.substring(0, maxLen) + (addDots ? "..." : "")
    return str
}


export default limit
