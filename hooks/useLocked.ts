import {useRef} from "react"

/**
 * Locks a function by allowing it to only be called once at a time. Once called
 * any following calls will be ignored until the first one is finished and then
 * the function may once again be called.
 *
 * @param func The callback function to be locked.
 */
function useLocked<A extends any[], R>(
    func: (...args: A) => R
): (...args: A) => Promise<R | void> {
    const locked = useRef(false)

    return async (...args: A) => {
        if (locked.current) return

        locked.current = true
        const res = await func(...args)
        locked.current = false

        return res
    }
}

export {useLocked}
