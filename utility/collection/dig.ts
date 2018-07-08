import { isObject } from "util";

/**
 * Returns a nested array or object element, using dot notation key access.
 * @param key The key to the element, using dot notation.
 * @param col The subject array or object.
 */
function dig<T = any>(key: string, col: object | any[]): T {
    if(!key.length)
        return col as any

    const split = key.split(".")

    let result: any = col || null
    for(let k of split) {
        if(isObject(result))
            result = result[k] || null
    }

    return result
}

export { dig };
