import { useRef } from "react";

// @ts-ignore TS2370: A rest parameter must be of an array type.
function useStatic<A extends any[], R = any>(func: (...args: A) => R) {
    const callback = useRef(func)
    // @ts-ignore TS2370: A rest parameter must be of an array type.
    const ptr = useRef((...args: A) => callback.current(...args))

    return ptr.current
}

export { useStatic };

