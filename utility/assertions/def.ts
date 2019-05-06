import * as assert from "."

/**
 * Returns the provided value if it is a valid Array or the default one instead.
 * @param value The value to be tested.
 * @param defaultArray The default value.
 */
function def(value: any, defaultArray: Array<any>): Array<any>
/**
 * Returns the provided value if it is a valid boolean or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultBoolean: boolean): boolean
/**
 * Returns the provided value if it is a valid callable or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def<T extends () => any>(value: any, defaultFunction: T): T
/**
 * Returns the provided value if it is a valid callable or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def<T extends (...values: any[]) => any>(
  value: any,
  defaultFunction: T,
): T
/**
 * Returns the provided value if it is a valid number or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultNumber: number): number
/**
 * Returns the provided value if it is a valid object or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultObject: object): object
/**
 * Returns the provided value if it is a valid string or the default one instead.
 * @param value The value to be tested.
 * @param defaultValue The default value.
 */
function def(value: any, defaultString: string): string

function def(value: any, defaultValue: any) {
  if (!assert.isNull(value) && !assert.isUndefined(value)) {
    let isDefaultType = false

    let assertion = value.constructor.name
    if (!("is" + assertion in assert)) assertion = typeof value

    switch (assertion.toLowerCase()) {
      case "array":
        isDefaultType = assert.isArray(value)
        break
      case "boolean":
        isDefaultType = assert.isBoolean(value)
        break
      case "function":
        isDefaultType = assert.isFunction(value)
        break
      case "number":
        isDefaultType = assert.isNumber(value)
        break
      case "object":
        isDefaultType = assert.isObject(value)
        break
      case "string":
        isDefaultType = assert.isString(value)
        break
    }
    if (isDefaultType) return value
  }
  return defaultValue
}

export {def}
