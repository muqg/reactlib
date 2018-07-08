import { dig } from "../utility/collection";
import { INITIAL_STATE } from "./const";

/**
 * Returns an item from the initial state JSON <meta> object.
 * @param key Key to the state item.
 */
function initialState<T = any>(key: any): T {
    let result = dig<T>(key, INITIAL_STATE)
    return result
}

export { initialState };
