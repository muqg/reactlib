import {isNull, isUndefined} from "."

/**
 * Checks whether a value is null or undefined.
 * @param value The value to be checked.
 */
function isNullOrUndefined(val: any): val is null | undefined {
    return isNull(val) || isUndefined(val)
}

export {isNullOrUndefined}
