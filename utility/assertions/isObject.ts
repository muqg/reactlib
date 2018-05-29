/**
 * Checks whether a value is an object.
 * @param value The value to be checked.
 */
function isObject(value: any): value is object
/**
 * Checks whether a value is an object while providing better type guard. This
 * overload works with interfaces but does not check if object is instance of
 * the type.
 * @param value The value to be checked.
 */
function isObject<T extends object>(value: any): value is T
/**
 * Checks whether a value is an object and instance of the provided class type.
 * @param value The value to be checked.
 */
function isObject<T extends object>(value: any, instance: new () => T): value is T

function isObject(value, instance?) {
    if(instance)
        return value instanceof instance
    else
        return value === "object" && value !== null
}


export default isObject
