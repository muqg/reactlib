import { dig } from "../utility/collection";
import { INITIAL_STATE } from "./const";
import def from "../utility/assertions/def";

/**
 * Returns an array configuration value or throws an error if the found value is
 * not of this type or is missing.
 * @param key Key to the config array, using dot notation
 * @param defaultArray Default value to use if array is not found at this key.
 */
function config(key: string, defaultArray: Array<any>) : Array<any>
/**
 * Returns a boolean configuration value or throws an error if the found value is
 * not of this type or is missing.
 * @param key Key to the config boolean, using dot notation
 * @param defaultBoolean Default value to use if boolean is not found at this key.
 */
function config(key: string, defaultBoolean: boolean) : boolean
/**
 * Returns a number configuration value or throws an error if the found value is
 * not of this type or is missing.
 * @param key Key to the config number, using dot notation
 * @param defaultNumber Default value to use if number is not found at this key.
 */
function config(key: string, defaultNumber: number) : number
/**
 * Returns an object configuration value or throws an error if the found value is
 * not of this type or is missing.
 * @param key Key to the config object, using dot notation
 * @param defaultObject Default value to use if object is not found at this key.
 */
function config(key: string, defaultBoolean: object) : object
/**
 * Returns a string configuration value or throws an error if the found value is
 * not of this type or is missing.
 * @param key Key to the config string, using dot notation
 * @param defaultString Default value to use if string is not found at this key.
 */
function config(key: string, defaultString: string) : string

function config(key, defaultValue) {
    let result = dig(key, INITIAL_STATE.config)
    result = def(result, defaultValue)

    // Configuration value is either not of the searched type or is missing and
    // should be applied with a fix.
    if(result === defaultValue)
        throw("Config error for key: " + key)
    return result
}


export default config
