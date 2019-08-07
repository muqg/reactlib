import {renderHook} from "@testing-library/react-hooks"
import {wait as sleep} from "../../utility"
import {RunningTask, useTask} from "../useTask"

const generatorFn = function*() {
  yield false
  return Promise.resolve(1)
}
const asyncFn = () => Promise.resolve(1)

describe("Task hook", () => {
  it.each([["generator", generatorFn], ["async", asyncFn]])(
    "runs %s function task",
    async () => {
      const task = renderHook(() => useTask(() => Promise.resolve(1))).result

      await expect(task.current.run()).resolves.toBe(1)
    },
  )

  it("does not allow a second task to be run while one is running", async () => {
    const fn = jest.fn(() => sleep(500))
    const task = renderHook(() => useTask(fn)).result
    task.current.run()

    jest.advanceTimersByTime(50)

    task.current.run()
    task.current.run()

    jest.runAllTimers()

    await task.current.run()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("returns the currently running task on subsequent calls to run", () => {
    const fn = jest.fn(() => new Promise(() => {}))
    const task = renderHook(() => useTask(fn)).result
    const initialResult = task.current.run()

    expect(task.current.run()).toBe(initialResult)
  })

  it("applies middleware", async () => {
    let value = false
    const task = renderHook(() =>
      useTask(() => Promise.resolve(), {
        middleware: [
          async (task: RunningTask) => {
            await task
            value = true
            return task
          },
        ],
      }),
    )

    await task.result.current.run()

    expect(value).toBe(true)
  })

  it("changes status to running while waiting for a task to complete", () => {
    const fn = () => new Promise(() => {})
    const task = renderHook(() => useTask(fn)).result

    task.current.run()

    expect(task.current.status).toBe("running")
    expect(task.current.isRunning).toBe(true)
  })

  it("changes status to done on success", async () => {
    const task = renderHook(() => useTask(asyncFn)).result

    await task.current.run()

    expect(task.current.status).toBe("done")
    expect(task.current.isRunning).toBe(false)
  })

  it("changes status to error on failure", async () => {
    expect.assertions(2)

    const fn = () => Promise.reject()
    const task = renderHook(() => useTask(fn)).result

    try {
      await task.current.run()
    } catch (err) {
      expect(task.current.status).toBe("error")
      expect(task.current.isRunning).toBe(false)
    }
  })

  it("allows generators to be cancelled when unmounted", async () => {
    const task = renderHook(() => useTask(generatorFn))

    const result = task.result.current.run()
    task.unmount()

    await expect(result).resolves.toBeUndefined()
  })

  it("returns null when attempting to run task on unmounted component", () => {
    const task = renderHook(() => useTask(asyncFn))
    task.unmount()

    expect(task.result.current.run()).toBeNull()
  })

  describe("when cleared", () => {
    let task = renderHook(() => useTask(generatorFn))
    let initialResult: Promise<any> | null
    let secondResult: Promise<any> | null

    beforeEach(() => {
      task = renderHook(() => useTask(generatorFn))
      initialResult = task.result.current.run()

      task.result.current.clear()

      secondResult = task.result.current.run()
    })

    it("changes status to null", () => {
      task.result.current.clear()
      expect(task.result.current.status).toBeNull()
    })

    it("allows a new task to be run", () => {
      expect(secondResult).not.toBe(initialResult)
    })

    it("does not cancel currently running generator task", async () => {
      await expect(initialResult).resolves.toBe(1)
      await expect(secondResult).resolves.toBe(1)
    })

    it("cancels all generator tasks on unmount, including cleared ones", async () => {
      const task = renderHook(() =>
        useTask(async function*() {
          await sleep(500)
          yield false
          return 1
        }),
      )
      const initialResult = task.result.current.run()
      task.result.current.clear()
      const secondResult = task.result.current.run()

      task.unmount()
      jest.runAllTimers()

      await expect(initialResult).resolves.toBeUndefined()
      await expect(secondResult).resolves.toBeUndefined()
    })
  })
})
