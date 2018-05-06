import {getElement, formatString} from "./utility"


const stateElement = document.querySelector("#initial_state")
export const initialState = stateElement ? JSON.parse(stateElement.innerHTML) : {}

export function $const(key) {
    let result = getElement(key, initialState.const)
    if(result === null)
        result = key
    return result
}

export function localize(key, ...args) {
    let result = getElement(key, initialState.locale)
    if(result === null)
        result = key
    else if(args && typeof result === "string")
        result = formatString(result, ...args)
    return result
}
