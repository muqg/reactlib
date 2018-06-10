import { dig } from "../utility/collection";
import { INITIAL_STATE } from "./const";
import { def } from "../utility/assertions";

/**
 * Returns a string item from the initial state or the string key if the item is
 * not found.
 * @param key Key to the state item.
 */
function state(key: string) : string
/**
 * Returns a string item from the initial state or the default one provided, if
 * the one from state is not found.
 * @param key Key to the state item.
 * @param defaultString The default string item.
 */
function state(key: string, defaultString: string) : string
/**
 * Returns an array item from the initial state or the default one provided, if
 * the one from state is not found.
 * @param key Key to the state item.
 * @param defaultArray The default array item.
 */
function state(key: string, defaultArray: Array<any>) : Array<any>
/**
 * Returns a boolean item from the initial state or the default one provided, if
 * the one from state is not found.
 * @param key Key to the state item.
 * @param defaultBoolean The default boolean item.
 */
function state(key: string, defaultBoolean: boolean) : boolean
/**
 * Returns a number item from the initial state or the default one provided, if
 * the one from state is not found.
 * @param key Key to the state item.
 * @param defaultNumber The default number item.
 */
function state(key: string, defaultNumber: number) : number
/**
 * Returns an object item from the initial state or the default one provided, if
 * the one from state is not found.
 * @param key Key to the state item.
 * @param defaultObject The default object item.
 */
function state(key: string, defaultObject: object) : object

function state(key: any, defaultValue: any = ""): any {
    let result = dig(key, INITIAL_STATE)
    return def(result, defaultValue)
}

export {
    state
}
