import { useRef } from "react";
import { delay } from "../utility";

/**
 * Delays the execution of a given callback function while deboucing any
 * following calls.
 *
 * The returned callback is memoized and thus it needs not be memoized explicitly.
 *
 * @param func The callback function to delay.
 * @param timeout The time to delay in milliseconds.
 */
// @ts-ignore TS2370: A rest parameter must be of an array type.
function useDelayed<A extends any[]>(func: (...args: A) => void | Promise<void>, timeout = 250) {
    const callback = useRef(func)
    callback.current = func

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    const delayed = useRef(delay(async (...args: A) => await callback.current(...args), timeout))
    return delayed.current
}

export { useDelayed };

