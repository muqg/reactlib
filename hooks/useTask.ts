import { useState, useRef, useEffect, useMemo } from "react";


interface Task<R, A extends any[] = any> {
    isRunning: boolean
    run: (...args: A) => Promise<R | void>
}

/**
 * A task is a function that exposes a running state allowing to
 * manage other parts of a component based on it.
 *
 * Notice: Typically a single task at most is meant to be used within a
 * component. If more than one task is needed then consider a custom
 * implementation. This is designed for the very simple, common use cases only.
 * It may very well become obsolete once react for data fetching is available.
 *
 * @param func The function to be transformed into a task.
 */
function useTask<R, A extends any[]>(func: Task<R, A>["run"]): Task<R, A> {
    const [isRunning, setRunning] = useState(false)

    const isMounted = useRef(true)
    useEffect(() => () => { isMounted.current = false}, [])

    const run = async (...args: A) => {
        if(isRunning)
            return

        let res
	    try {
            setRunning(true)
            res = await func(...args)
        }
        finally {
            /**
             * This will prevent updates on unmounted components
             * in case of navigation or conditional rendering
             */
            if(isMounted.current)
                setRunning(false)
        }

        return res
    }

    return useMemo(
        () => { return {isRunning, run}},
        [isRunning, func]
    )
}

export { useTask };

