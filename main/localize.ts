import { initialState } from ".";
import { isString } from "../utility/assertions";
import { format } from "../utility/string";

const LOCALIZATION_STATE_KEY = "locale"

/**
 * Returns a localized value from initial state's locale.
 * @param key Localization key, using dot notation.
 */
function localize<T = string>(key: string): T
/**
 * Returns a localized string value from initial state's locale while attempting
 * to format it with the provided positional or named arguments.
 * @param key Localization key, using dot notation.
 * @param args A variable number of arguments which are used to replace
 * positional placeholders or key/value pairs to replace named placeholders.
 */
function localize(key: string, ...args: any[]): string

function localize(key: any, ...args: any[]): any {
    key = key ? `${LOCALIZATION_STATE_KEY}.${key}` : LOCALIZATION_STATE_KEY
    let result = initialState(key)

    // If final result is a string and there are arguments -- format the string.
    if(args && isString(result))
        result = format(result, ...args)

    return result
}

export { localize };

