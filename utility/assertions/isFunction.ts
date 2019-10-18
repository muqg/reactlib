/**
 * Checks whether value is a function. Prefer using a simple comparison such as
 * `typeof value === "function"` whenever the resulting type is properly inferred
 * and only ever use this function a function typings escape hatch.
 *
 * @param value The value to be checked.
 */
function isFunction<T extends () => any>(value: any): value is T
/**
 * Checks whether value is a function. Prefer using a simple comparison such as
 * `typeof value === "function"` whenever the resulting type is properly inferred
 * and only ever use this function a function typings escape hatch.
 * @param value The value to be checked.
 */
function isFunction<T extends (...values: any[]) => any>(value: any): value is T

function isFunction(value: any) {
  return typeof value === "function"
}

export {isFunction}
