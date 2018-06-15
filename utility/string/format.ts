import { isArray } from "../assertions";

/**
 * Formats a string by replacing valid placeholders with provided values.
 * @param str The string subject to replace in.
 * @param args A variable number of arguments which are used to replace
 * numeric placeholders or a key/value pair to replace named placeholders.
 */
export function format(str: string, ...args: any[]) {
    const namedValues = args[0] || null
    if(namedValues && isArray(namedValues)) {
        for(let key in namedValues)
            str = str.replace(`{${key}}`, namedValues[key])
    }
    else {
        for(let i = 0; i < args.length; i++)
            str = str.replace(`{${i}}`, args[i])
    }
    return str
}
