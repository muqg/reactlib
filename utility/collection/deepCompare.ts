import {isNullOrUndefined, isObject} from "../assertions"
import {isEmpty} from "./isEmpty"

/**
 * Performs a deep comparison of two objects.
 * @param objA The first object to compare.
 * @param objB The second object to compare.
 */
function deepCompare(objA: object, objB: object): boolean {
  for (const a in objA) {
    for (const b in objB) {
      // @ts-ignore
      const itemA = objA[a]
      // @ts-ignore
      const itemB = objB[b]

      if (isNullOrUndefined(itemA) || isNullOrUndefined(itemB))
        return itemA === itemB

      if (itemA.constructor !== itemB.constructor) return false

      if (itemA === itemB || itemA.valueOf() === itemB.valueOf()) return true

      if (isObject(itemA) && isObject(itemB)) return deepCompare(itemA, itemB)

      return itemA.toString() === itemB.toString()
    }
  }

  return !isEmpty(objA) && !isEmpty(objB)
}

export {deepCompare}
