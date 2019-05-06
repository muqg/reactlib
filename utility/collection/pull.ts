import {Dict} from ".."
import {isObject} from "../assertions"

/**
 * Returns a nested array or object element, using dot notation key access.
 * @param col The subject array or object.
 * @param key The key to the element, using dot notation.
 */
function pull<T = any>(col: object, key: string): T {
  if (!key.length) return col as any

  const split = key.split(".")

  let result: any = col || null
  for (let k of split) {
    if (isObject<Dict<any>>(result)) result = result[k] || null
  }

  return result
}

export {pull}
