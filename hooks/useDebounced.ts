import {useRef} from "react"

/**
 * Returns a function the calls to which are debounced.
 *
 * @param func The callback function to debounce.
 * @param delay The time to delay in milliseconds.
 */
function useDebounced<A extends any[]>(
    func: (...args: A) => void | Promise<void>,
    delay = 250
) {
    const timeout = useRef(-1)

    return (...args: A) => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(func, delay, ...args)
    }
}

export {useDebounced}
