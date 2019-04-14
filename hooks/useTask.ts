import {useEffect, useRef, useState} from "react"
import {call} from "../utility/function"
import {isFunction} from "../utility/assertions"

interface Task<R = any, A extends any[] = any> {
    /**
     * Attempts to cancel the currently running task function.
     * - Only works for generator task functions and which may
     * allow cancellation by yielding their execution.
     * - Task will automatically cancel and clean itself up on unmount.
     */
    cancel: () => void
    /**
     * Whether the task function is currently running.
     */
    isRunning: boolean
    /**
     * Runs the task function.
     */
    run: (...args: A) => Promise<R> | null
}

type TaskFunction<R, A extends any[]> = (
    ...args: A
) => Promise<R | void> | IterableIterator<R> | AsyncIterableIterator<R>

/**
 * A task function runs asynchronously and exposes additional functionality,
 * such as running status and cancellation.
 */
function useTask<R, A extends any[]>(func: TaskFunction<R, A>): Task<R, A> {
    const [task, setTask] = useState<ReturnType<Task["run"]>>(null)

    const cancelled = useRef(false)
    useEffect(
        () => () => {
            cancelled.current = true
        },
        []
    )

    function run(...args: A) {
        try {
            if (!task) {
                setTask(
                    (async () => {
                        cancelled.current = false

                        const currentTask = func(...args) as any
                        if (
                            isFunction(currentTask[Symbol.iterator]) ||
                            isFunction(currentTask[Symbol.asyncIterator])
                        ) {
                            const generator = currentTask as IterableIterator<R>
                            while (true) {
                                const {done, value} = await generator.next()
                                if (cancelled.current || done) {
                                    call(generator.return)
                                    cancel()

                                    // Should return null instead of yielded value
                                    // when cancelled and only ever return the real
                                    // return value when the generator is done.
                                    return done ? value : null
                                }
                            }
                        } else {
                            // Don't forget to let current async task
                            // function complete before running cancellation.
                            await currentTask
                            cancel()
                            return currentTask
                        }
                    })()
                )
            }
        } catch (ex) {
            cancel()
            throw ex
        }

        return task
    }

    function cancel() {
        if (cancelled.current) {
            return
        }
        setTask(null)
        cancelled.current = true
    }

    return {
        cancel,
        isRunning: !!task,
        run,
    }
}

export {useTask}
