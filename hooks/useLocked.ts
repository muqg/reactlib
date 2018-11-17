import { useRef } from "react";
import { lock } from "../utility";

/**
 * Locks a function by allowing it to only be called once at a time. Once called
 * any following calls will be ignored until the first one is finished and then
 * the function may once again be called.
 *
 * The returned callback is memoized and thus it needs not be memoized explicitly.
 *
 * @param func The callback function to be locked.
 */
// @ts-ignore TS2370: A rest parameter must be of an array type.
function useLocked<A extends any[]>(func: (...args: A) => void | Promise<void>) {
    const callback = useRef(func)
    callback.current = func

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    const locked = useRef(lock(async (...args: A) => await callback.current(...args)))
    return locked.current
}

export { useLocked };

