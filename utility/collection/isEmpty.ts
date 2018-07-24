import { Collection } from "..";
import { len } from "./len";

/**
 * Tells whether an object or array is empty.
 * @param col The collection to be tested.
 */
function isEmpty(col: Collection): boolean {
    return len(col) === 0
}

export { isEmpty }
