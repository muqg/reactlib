import { useRef, useState, useCallback } from "react"
import { clamp } from "../utility/number";


function useCounter(initialValue = 0, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const boundary = useRef({ min, max })
    const [count, setCount] = useState(initialValue)

    function set(val: number) {
        const bounds = boundary.current
        setCount(clamp(val, bounds.min, bounds.max))
    }

    return {
        decrement: useCallback(() => set(count - 1), []),
        increment: useCallback(() => set(count + 1), []),
        set: useCallback((val: number) => set(val), [count]),
        value: count
    }
}

export { useCounter };

