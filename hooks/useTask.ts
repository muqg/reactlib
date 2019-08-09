import {useCallback, useEffect, useReducer, useRef} from "react"
import {Action} from "../utility"

export type TaskFunction<R = any, A extends any[] = any[]> = (
  ...args: A
) => Promise<R> | IterableIterator<R> | AsyncIterableIterator<R>

export type TaskStatus = "done" | "error" | "running" | null
export type RunningTask<R = any> = Promise<R | undefined>
export type TaskMiddleware<R = any> = (task: RunningTask<R>) => RunningTask<R>

type Task<R = any, A extends any[] = any> = {
  /**
   * Clears the internal state of the task runner. Note that this does not
   * attempt to cancel a currently running task, but resetting the internal
   * state would allow for a new task to be run.
   */
  clear: () => void
  /**
   * Whether the task function is currently running.
   */
  isRunning: boolean
  /**
   * Runs the task function. Only one task function can be running at a time,
   * and if one is already running its Promise result will be returned.
   *
   * Generator task functions can optionaly yield execution to the task runner
   * in order to provide it with the possibility to cancel the running task if
   * the component has unmounted, while async code was running inside the task.
   */
  run: (...args: A) => Promise<R> | null
  /**
   * Current task status.
   */
  status: TaskStatus
}

type Options<R = any> = {
  middleware: TaskMiddleware<R>[]
}

type State = {
  task: RunningTask | null
  status: TaskStatus
}

type Actions =
  | Action<"clear">
  | Action<"run", State["task"]>
  | Action<"status", TaskStatus>

const DoneStatus: TaskStatus = "done"
const ErrorStatus: TaskStatus = "error"
const RunningStatus: TaskStatus = "running"

const defaultOptions = {
  middleware: [],
}

function reducer(state: State, action: Actions): State {
  const {type} = action
  switch (action.type) {
    case "clear": {
      return {
        task: null,
        status: null,
      }
    }
    case "run": {
      return {
        task: action.value,
        status: RunningStatus,
      }
    }
    case "status": {
      return {
        ...state,
        status: action.value,
      }
    }
    default: {
      if (__DEV__) {
        throw new TypeError(`Dispatched invalid task action of type ${type}`)
      }
      return state
    }
  }
}

export function useTask<T extends ReturnType<TaskFunction>, A extends any[]>(
  func: (...args: A) => T,
  options?: Partial<Options>,
): Task<
  T extends Promise<infer R>
    ? R
    : T extends IterableIterator<infer R> | AsyncIterableIterator<infer R>
    ? R | undefined
    : never,
  A
> {
  const {middleware} = {...defaultOptions, ...options}

  const [{task, status}, dispatch] = useReducer(reducer, {
    task: null,
    status: null,
  })

  // Task cancellation is used to provide the possibility for a generator task
  // to yield its execution and be cancelled when component is unmounted, and
  // thus prevent memory leaks by updating unmounted components.
  const cancelled = useRef(false)
  useEffect(
    () => () => {
      cancelled.current = true
    },
    [],
  )

  const dispatchIfNotCancelled: typeof dispatch = (value: Actions) => {
    if (!cancelled.current) {
      dispatch(value)
    }
  }

  function run(...args: A): RunningTask | null {
    if (cancelled.current) {
      return null
    }

    let runningTask = task
    if (status !== RunningStatus) {
      runningTask = (async () => {
        try {
          let result: Promise<any>
          const currentTask = func(...args)

          if (isIterableIterator(currentTask)) {
            const unfoldGenerator = async () => {
              const generator = currentTask
              while (!cancelled.current) {
                const {done, value} = await generator.next()
                if (done) {
                  return value
                }
              }

              // This should only be reachable when task is cancelled.
              if (typeof generator.return === "function") {
                generator.return()
              }
            }

            result = unfoldGenerator()
          } else {
            result = currentTask as Promise<any>
          }

          result = applyMiddleware(middleware, result)

          // Don't forget to await for the resulting task to resolve,
          // before dispatching a status update.
          await result

          dispatchIfNotCancelled({type: "status", value: DoneStatus})
          return result
        } catch (ex) {
          dispatchIfNotCancelled({type: "status", value: ErrorStatus})
          throw ex
        }
      })()

      dispatchIfNotCancelled({type: "run", value: runningTask})
    }

    return runningTask
  }

  const clear = useCallback(() => {
    // Dispatch is the only dependency of dispatchIfNotCancelled and can thus
    // be specified in a dependency array in place of the latter, which on its
    // own is not memoized due to the fact pointed out here.
    dispatchIfNotCancelled({type: "clear", value: null})
  }, [dispatch])

  return {
    clear,
    run,
    status,

    // Kept for backwards compatibility and ease of use.
    isRunning: status === RunningStatus,
  }
}

function isIterableIterator<T = any>(
  value: any,
): value is IterableIterator<T> | AsyncIterableIterator<T> {
  return (
    typeof value[Symbol.iterator] === "function" ||
    typeof value[Symbol.asyncIterator] === "function"
  )
}

function applyMiddleware(
  middleware: TaskMiddleware[],
  task: RunningTask,
): RunningTask {
  for (let i = 0; i < middleware.length; i++) {
    task = middleware[i](task)
  }

  return task
}
