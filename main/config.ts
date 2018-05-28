import { dig } from "../utility/collection";
import { INITIAL_STATE } from "./const";

/**
 * Returns a config value from initial state.
 * @param key Key to the config value, using dot notation.
 */
const config = (key: string): any => {
    let result = dig(key, INITIAL_STATE.config)
    if(result === null)
        result = key
    return result
}


export default config
