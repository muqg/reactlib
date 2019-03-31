/**
 * Checks whether a value is of a generic type via an assertion callback.
 * @param value The value to be tested.
 * @param assertion A callback that tests whether the value satisfies a condition
 * for the target generic type.
 */
function isType<T>(value: any, assertion: (value: any) => boolean): value is T {
    return assertion(value)
}

export {isType}
