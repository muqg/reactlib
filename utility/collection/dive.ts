import { dig } from ".";
import { isArray, isObject } from "../assertions";


/**
 * Creates an object with an __item__ placed at the provided __key__.
 * @param key The key to place the item at.
 * @param item The item to place.
 */
function diveItem(key: string, item: any): object
/**
 * Places an __item__ at the provided __key__ of a __pool__ Object. If the __pool__
 * is an Array then it is disregarded and a fresh Object with the given __item__
 * at the provided __key__ is created.
 *  - If the __item__ is an Array and an Array __element__ exists at the __key__
 *      then the contents inside the __item__ Array are appended.
 *  - If the __item__ is an Object and an Object __element__ exists at the __key__
 *      then both are combined with __item__'s values overriding the __element__ ones.
 *
 * __Note__ that the generic return type does NOT guarantee type safety and thus
 * type assertion is advised.
 * @param key The key to place the item at.
 * @param item The item to place.
 * @param pool The pool to put the item into.
 */
function diveItem<T extends object = object>(key: string, item: any, pool: object): T
function diveItem(key: string, item: any, pool: object = {}) {
    const splitKey = key.split(".")

    let result: any = item
    for(let i = splitKey.length - 1; i >= 0; i--) {
        const currentKey = splitKey[i]
        const poolItem = dig(splitKey.join("."), pool) || {}

        // Expected insertion is Array.
        if(isArray(result)) {
            // If both items are arrays then combine them.
            if(isArray(poolItem))
                result = [...poolItem, ...result]
        }
        // Expected insertion is Object.
        // If both items are objects then combine them.
        else if(isObject(result) && isObject(poolItem)) {
            result = {...poolItem, ...result}
        }

        result = {
            [currentKey]: result
        }

        splitKey.pop()
    }

    return isObject(pool) ? {...pool, ...result} : {...result}
}

export { diveItem };

