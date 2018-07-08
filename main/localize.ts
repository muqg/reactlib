import { initialState } from ".";
import { isString } from "../utility/assertions";
import { format } from "../utility/string";
import { FormatArgument } from "../utility/string/format";
import { Dict } from "../utility";

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
 * @param args A variable number of arguments which are used to replace positional
 * value placeholders.
 */
function localize(key: string, ...args: FormatArgument[]): string
/**
 * Returns a localized string value from initial state's locale while attempting
 * to format it with the provided positional or named arguments.
 * @param key Localization key, using dot notation.
 * @param args An object of keys and values to use to replace named value
 * placeholders.
 */
function localize(key: string, args: Dict<FormatArgument>): string

function localize(key: any, ...args: any[]): any {
    key = key ? `${LOCALIZATION_STATE_KEY}.${key}` : LOCALIZATION_STATE_KEY
    let result = initialState(key)

    if(isString(result))
        result = format(result, ...args)

    return result
}

export { localize };

