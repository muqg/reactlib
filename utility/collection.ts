import { Collection } from "./types";

/**
 * Returns a nested array or object element, using dot notation key access.
 * @param key The key to the element, using dot notation.
 * @param col The subject array or object.
 */
export function dig(key: string, col: Collection): object | any[] | string | boolean | number | null {
    const split = key.split(".")

    let result: any = col || null
    for(let k of split) {
        if(result && typeof result === "object")
            result = result[k] || null
    }
    return result
}
