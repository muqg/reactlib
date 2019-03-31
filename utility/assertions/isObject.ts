import {isNull} from "."

/**
 * Checks whether a value is an object.
 * @param value The value to be checked.
 */
function isObject(value: any): value is object
/**
 * Checks whether a value is an object while providing better type guard. This
 * overload works with interfaces but does not check if object is instance of
 * the constructor type.
 * @param value The value to be checked.
 */
function isObject<T extends object>(value: any): value is T
/**
 * Checks whether a value is an object and instance of the provided constructor type.
 * @param value The value to be checked.
 */
function isObject<T extends object>(
    value: any,
    constructor: new () => T
): value is T

function isObject(value: any, constructor?: new () => {}) {
    if (constructor) return value instanceof constructor
    else return typeof value === "object" && !isNull(value)
}

export {isObject}
