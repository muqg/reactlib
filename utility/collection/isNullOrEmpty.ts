import {isNullOrUndefined} from "../assertions"
import {isEmpty} from "./isEmpty"

/**
 * Tells whether an object or array is null, undefined or empty.
 * @param col The object or array to be tested.
 */
function isNullOrEmpty(col: object | null | undefined): boolean {
  return isNullOrUndefined(col) || isEmpty(col)
}

export {isNullOrEmpty}
