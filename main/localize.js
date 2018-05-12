import { INITIAL_STATE } from "./const"
import { getElement } from "../utility/array"
import { format } from "../utility/string"

const localize = (key, ...args) => {
    let result = getElement(key, INITIAL_STATE.locale)
    if(result === null)
        result = key
    else if(args && typeof result === "string")
        result = format(result, ...args)
    return result
}


export default localize
