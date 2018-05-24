/**
 * Initial state's data.
 */
export const INITIAL_STATE = (() => {
    const stateElement = document.querySelector("#initial_state")
    return stateElement ? JSON.parse(stateElement.innerHTML) : {}
})()

/**
 * Current page's locale value.
 */
export const CURRENT_LOCALE = document.getElementsByTagName("html")[0].getAttribute("lang") || ''
