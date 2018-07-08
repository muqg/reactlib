import { Collection } from "..";

/**
 * Tells whether an object or array is empty.
 * @param col The collection to be tested.
 */
function isEmpty(col: Collection): boolean {
    return Object.keys(col).length === 0
}

export { isEmpty }
