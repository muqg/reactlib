import { INITIAL_STATE } from "./const"
import { getElement } from "../utility/array"

const config = (key) => {
    let result = getElement(key, INITIAL_STATE.config)
    if(result === null)
        result = key
    return result
}


export default config
