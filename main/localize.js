import { INITIAL_STATE } from "./const"
import { getElement } from "../utility/array"
import { format } from "../utility/string"

/**
 * Returns a localized element's value from initial state's locale.
 * @param {string} key Key to the localization element, using dot notation.
 * @param {any} args A variable number of arguments which are used to replace
 * numeric placeholders or a key/value pair to replace named placeholders.
 */
const localize = (key, ...args) => {
    let result = getElement(key, INITIAL_STATE.locale)
    if(result === null)
        result = key
    else if(args && typeof result === "string")
        result = format(result, ...args)
    return result
}


export default localize
