import { Collection } from "../types";

/**
 * Returns a nested array or object element, using dot notation key access.
 * @param key The key to the element, using dot notation.
 * @param col The subject array or object.
 */
function dig(key: string, col: Collection) : any {
    const split = key.split(".")
    const type = typeof col
    if(type !== "object")
        throw (`Second argument must be of type object, ${type} given.`)

    let result: any = col
    for(let k of split) {
        if(typeof result === "object")
            result = result[k] || null
    }
    return result
}

export default dig
