import { useRef } from "react";

/**
 * Remembers and returns a value from the previous render. The returned
 * value is initially equal to the current value.
 *
 * @param value Current value.
 */
function usePrevValue<T>(value: T): T {
    const ref = useRef(value)
    const prev = ref.current

    ref.current = value

    return prev
}

export { usePrevValue };

