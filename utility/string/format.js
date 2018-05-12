/**
 * Formats a string by replacing valid placeholders with provided values.
 * @param {string} str The string subject to replace in.
 * @param {any} args A variable number of arguments which are used to replace
 * numeric placeholders or a key/value pair to replace named placeholders.
 */
const format = (str, ...args) => {
    const type = typeof str
    if(type !== "string")
        throw (`First argument must be of type string, ${type} given.`)

    const namedValues = args[0] || null
    if(namedValues && typeof namedValues === "object" && !(namedValues instanceof Array)) {
        for(let key in namedValues)
            str = str.replace(`{${key}}`, namedValues[key])
    }
    else {
        for(let i = 0; i < args.length; i++)
            str = str.replace(`{${i}}`, args[i])
    }

    return str
}


export default format
