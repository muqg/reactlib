import { INITIAL_STATE } from "./const"
import { getElement } from "../utility/array"

/**
 * Returns a config value from initial state.
 * @param {string} key Key to the config value, using dot notation.
 */
const config = (key) => {
    let result = getElement(key, INITIAL_STATE.config)
    if(result === null)
        result = key
    return result
}


export default config
