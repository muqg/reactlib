import {useReducer} from "react"

/**
 * Returns a function which forces an update.
 * __To be used with caution!__
 */
function useForceUpdate() {
    return useReducer(x => x + 1, 0)[1] as () => void
}

export {useForceUpdate}
