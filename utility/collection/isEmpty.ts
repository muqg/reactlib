import {len} from "./len"

/**
 * Tells whether an object or array is empty.
 * @param col The collection to be tested.
 */
function isEmpty(col: object): boolean {
  return len(col) === 0
}

export {isEmpty}
