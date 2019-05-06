import {pull} from "."
import {isArray, isObject} from "../assertions"

/**
 * Creates an object with an __item__ placed at the provided __key__.
 * @param key The key to place the item at.
 * @param item The item to place.
 */
function put(key: string, item: any): object
/**
 * Places an __item__ at the provided __key__ of a __pool__ Object. If the __pool__
 * is an Array then it is disregarded and a fresh Object with the given __item__
 * at the provided __key__ is created.
 *  - If the __item__ is an Object and an Object __element__ exists at the __key__
 *      then both are combined with __item__'s values overriding the __element__ ones.
 *
 * __Note__ that the generic return type does NOT guarantee type safety and thus
 * type assertion is advised.
 * @param key The key to place the item at.
 * @param item The item to place.
 * @param pool The pool to put the item into.
 */
function put<T extends object = object>(key: string, item: any, pool: object): T

function put(key: string, item: any, pool: object = {}) {
  const splitKey = key.split(".").filter(k => k)

  let result: any = item
  for (let i = splitKey.length - 1; i >= 0; i--) {
    const currentKey = splitKey[i]
    const poolItem = pull(pool, splitKey.join(".")) || {}

    // If both items are objects then combine them. Otherwise result overwrites the poolItem.
    if (
      isObject(result) &&
      !isArray(result) &&
      (isObject(poolItem) && !isArray(poolItem))
    )
      result = {...poolItem, ...result}

    result = {
      [currentKey]: result,
    }
    splitKey.pop()
  }
  return isObject(pool) && !isArray(pool) ? {...pool, ...result} : {...result}
}

export {put}
