import { useRef } from "react";

/**
 * Returns a memoized function that calls the most recently
 * provided callback.
 *
 * @param func The callback to be called by the memoized function.
 */
// @ts-ignore TS2370: A rest parameter must be of an array type.
function useStatic<A extends any[], R = any>(func: (...args: A) => R) {
    const callback = useRef(func)
    callback.current = func

    // @ts-ignore TS2370: A rest parameter must be of an array type.
    const mem = useRef((...args: A) => callback.current(...args))
    return mem.current
}

export { useStatic };

