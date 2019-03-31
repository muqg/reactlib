import {useRef} from "react"

/**
 * Returns a boolean indicating whether it is the initial render of the component.
 */
function useInitialRender() {
    const ref = useRef(true)
    const initialRender = ref.current

    ref.current = false

    return initialRender
}

export {useInitialRender}
