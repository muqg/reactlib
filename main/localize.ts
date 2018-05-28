import { dig } from "../utility/collection";
import { format } from "../utility/string";
import { INITIAL_STATE } from "./const";

/**
 * Returns a localized element's value from initial state's locale.
 * @param key Key to the localization element, using dot notation.
 * @param args A variable number of arguments which are used to replace
 * numeric placeholders or a key/value pair to replace named placeholders.
 */
const localize = (key: string, ...args: any[]) => {
    let result = dig(key, INITIAL_STATE.locale)
    if(result === null)
        result = key
    else if(args && typeof result === "string")
        result = format(result, ...args)
    return result
}


export default localize
