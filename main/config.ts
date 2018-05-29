import { dig } from "../utility/collection";
import { INITIAL_STATE } from "./const";

/**
 * Returns a config value from initial state.
 * @param key Key to the config value, using dot notation.
 */
// TODO: React | Fix return type or something so that it is not any.
function config<T = {}>(key: string) : T {
    let result = dig(key, INITIAL_STATE.config)
    if(result === null)
        result = key
    return result as T
}


export default config
