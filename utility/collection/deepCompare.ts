import { isObject, isNull, isUndefined } from "../assertions";

/**
 * Performs a deep comparison of two objects.
 * @param objA The first object to compare.
 * @param objB The second object to compare.
 */
function deepCompare(objA: object, objB: object): boolean {
    for(let a in objA) {
        for(let b in objB) {
            // @ts-ignore
            const itemA = objA[a]
            // @ts-ignore
            const itemB = objB[b]

            if(isNull(itemA) || isUndefined(itemA) || isNull(itemB) || isUndefined(itemB))
                return itemA === itemB

            if(itemA.constructor !== itemB.constructor)
                return false

            if(itemA === itemB || itemA.valueOf() === itemB.valueOf())
                return true

            if(isObject(itemA) && isObject(itemB))
                return deepCompare(itemA, itemB)

            return itemA.toString() === itemB.toString()
        }
    }

    return false
}

export { deepCompare }
