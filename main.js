import * as ReactDOM from "react-dom"
import {getElement, formatString} from "./utility"


const stateElement = document.querySelector("#initial_state")

export const INITIAL_STATE = stateElement ? JSON.parse(stateElement.innerHTML) : {}
export const CURRENT_LOCALE = document.getElementsByTagName("html")[0].getAttribute("lang") || undefined

export function config(key) {
    let result = getElement(key, INITIAL_STATE.config)
    if(result === null)
        result = key
    return result
}

export function localize(key, ...args) {
    let result = getElement(key, INITIAL_STATE.locale)
    if(result === null)
        result = key
    else if(args && typeof result === "string")
        result = formatString(result, ...args)
    return result
}

export function getURI(path = '') {
    return '/' + CURRENT_LOCALE + path;
}

export function render(element) {
    ReactDOM.render(
        element,
        document.getElementById("app")
    )
}
