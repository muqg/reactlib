import * as assert from ".";
import { upperFirst } from "../string";


/**
 * Returns the provided value if it is a valid boolean or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultBoolean: boolean): boolean
/**
 * Returns the provided value if it is a valid callable or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def<T extends () => any>(value: any, defaultFunction: T): T
/**
 * Returns the provided value if it is a valid callable or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def<T extends (...values) => any>(value: any, defaultFunction: T): T
/**
 * Returns the provided value if it is a valid number or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultNumber: number): number
/**
 * Returns the provided value if it is a valid object or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultObject: object): object
/**
 * Returns the provided value if it is a valid string or the default value instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultString: string): string

function def(value, defaultValue) {
    const type = typeof defaultValue
    const assertion = "is" + upperFirst(type)
    if(assert[assertion](value))
        return value
    return defaultValue
}


export default def
