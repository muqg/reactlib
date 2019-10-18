/**
 * Checks whether a value is null or undefined.
 * @param value The value to be checked.
 */
function isNullOrUndefined(val: any): val is null | undefined {
  return val === null || val === undefined
}

export {isNullOrUndefined}
