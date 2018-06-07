import { def, isString } from "../utility/assertions";
import { dig } from "../utility/collection";
import { format } from "../utility/string";
import { INITIAL_STATE } from "./const";

/**
 * Returns a localized string value from initial state's locale or the provided
 * key if a string is not found.
 * @param key Localization key, using dot notation.
 */
function localize(key: string) : string
/**
 * Returns a localized boolean value from initial state's locale or the default
 * value if a number is not found.
 * @param key Localization key, using dot notation.
 * @param defaultNumber Default value to be used if a localized item is not found.
 */
function localize(key: string, defaultNumber: number): number
/**
 * Returns a localized boolean value from initial state's locale or the default
 * value if a boolean is not found.
 * @param key Localization key, using dot notation.
 * @param defaultBoolean Default value to be used if a localized item is not found.
 */
function localize(key: string, defaultBoolean: boolean): boolean
/**
 * Returns a localized array element from initial state's locale or the default
 * value if an array is not found.
 * @param key Localization key, using dot notation.
 * @param defaultArray Default value to be used if a localized item is not found.
 */
function localize(key: string, defaultArray: Array<any>): Array<any>
/**
 * Returns a localized object element from initial state's locale or the default
 * value if an object is not found.
 * @param defaultObject Default value to be used if a localized item is not found.
 * @param key Localization key, using dot notation.
 */
function localize(key: string, defaultObject: object): object
/**
 * Returns a localized string value from initial state's locale or the provided
 * key if a string is not found.
 * @param key Localization key, using dot notation.
 * @param args A variable number of arguments which are used to replace
 * numeric placeholders or a key/value pair to replace named placeholders.
 */
function localize(key: string, ...args: any[]): string

function localize(key: any, defaultValue = key, ...args: any[]) {
    // Accounts for the first case where localization is looking for a string.
    if(isString(defaultValue) && key !== defaultValue) {
        args.unshift(defaultValue)
        defaultValue = key
    }

    let result = dig(key, INITIAL_STATE.locale)
    // Accounts for all cases where localization is NOT looking for a string.
    result = def(result, defaultValue)
    // If final result is a string and there are arguments -- format the string.
    if(args && isString(result))
        result = format(result, ...args)

    return result
}


export default localize
