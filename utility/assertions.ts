import * as assert from "./assertions";

/**
 * Returns the provided value if it is a valid Array or the default one instead.
 * @param value The value to be tested.
 * @param defaultArray The default value.
 */
export function def(value: any, defaultArray: Array<any>) : Array<any>
/**
 * Returns the provided value if it is a valid boolean or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def(value: any, defaultBoolean: boolean): boolean
/**
 * Returns the provided value if it is a valid callable or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def<T extends () => any>(value: any, defaultFunction: T): T
/**
 * Returns the provided value if it is a valid callable or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def<T extends (...values: any[]) => any>(value: any, defaultFunction: T): T
/**
 * Returns the provided value if it is a valid number or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def(value: any, defaultNumber: number): number
/**
 * Returns the provided value if it is a valid string or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def(value: any, defaultString: string): string
/**
 * Returns the provided value if it is a valid object or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
export function def(value: any, defaultObject: object): object

export function def(value: any, defaultValue: any) {
    if(!isNull(value) && !isUndefined(value)) {
        let isDefaultType = false

        let assertion = value.constructor.name
        if(!(("is" + assertion) in assert))
            assertion = typeof value

        switch(assertion.toLowerCase()) {
            case "array":
                isDefaultType = isArray(value)
                break
            case "boolean":
                isDefaultType = isBoolean(value)
                break
            case "function":
                isDefaultType = isFunction(value)
                break
            case "number":
                isDefaultType = isNumber(value)
                break
            case "object":
                isDefaultType = isObject(value)
                break
            case "string":
                isDefaultType = isString(value)
                break
        }
        if(isDefaultType)
            return value
    }
    return defaultValue
}



/**
 * Checks whether a value is an array.
 * @param value The value to be checked.
 */
export function isArray(value: any): value is Array<any> {
    return Array.isArray(value)
}



/**
 * Checks whether a value is a boolean.
 * @param value The value to be checked.
 */
export function isBoolean(value: any): value is boolean {
    return typeof value === "boolean"
}



/**
 * Checks whether value is a function. Overloads may be used for better type guarding.
 * @param value The value to be checked.
 */
export function isFunction<T extends () => any>(value: any): value is T
/**
 * Checks whether value is a function. Overloads may be used for better type guarding.
 * @param value The value to be checked.
 */
export function isFunction<T extends (...values: any[]) => any>(value: any): value is T

export function isFunction(value: any) {
    return typeof value === "function"
}



/**
 * Checks whether a value is null.
 * @param value The value to be checked.
 */
export function isNull(value: any): value is null {
    return value === null
}



/**
 * Checks whether a provided value is a number.
 * @param value The value to be checked.
 */
export function isNumber(value: any): value is number {
    return typeof value === "number" && isFinite(value)
}



/**
 * Checks whether a value is an object.
 * @param value The value to be checked.
 */
export function isObject(value: any): value is object
/**
 * Checks whether a value is an object while providing better type guard. This
 * overload works with interfaces but does not check if object is instance of
 * the constructor type.
 * @param value The value to be checked.
 */
export function isObject<T extends object>(value: any): value is T
/**
 * Checks whether a value is an object and instance of the provided constructor type.
 * @param value The value to be checked.
 */
export function isObject<T extends object>(value: any, constructor: new () => T): value is T

export function isObject(value:any, constructor?: new () => {}) {
    if(constructor)
        return value instanceof constructor
    else
        return typeof value === "object" && !isNull(value)
}



/**
 * Checks whether a value is a string.
 * @param value The value to be checked.
 */
export function isString(value: any): value is string {
    return value.constructor === String
}



/**
 * Checks whether a value is a symbol.
 * @param value The value to be checked.
 */
export function isSymbol(value: any): value is symbol {
    return typeof value === "symbol"
}



/**
 * Checks whether a value is undefined.
 * @param value The value to be checked.
 */
export function isUndefined(value: any): value is undefined {
    return value === undefined
}
