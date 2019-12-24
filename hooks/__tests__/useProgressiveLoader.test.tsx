import {renderHook, RenderHookResult} from "@testing-library/react-hooks"
import {useProgressiveLoader, ProgressiveLoader} from "../useProgressiveLoader"

describe("Progressive Loader hook", () => {
  describe("general functionality", () => {
    const items = ["asd", "fgh"]
    let loader: RenderHookResult<any, ProgressiveLoader<any>>["result"]

    beforeEach(() => {
      loader = renderHook(() =>
        useProgressiveLoader({initial: [], load: () => items})
      ).result
    })

    it("appends items returned by the loader callback to the internal item list", async () => {
      loader.current.load()
      expect(loader.current.items).toEqual(items)

      loader = renderHook(() =>
        useProgressiveLoader({initial: [], load: () => Promise.resolve(items)})
      ).result

      await loader.current.load()
      expect(loader.current.items).toEqual(items)
    })

    test("load function returns the loader callback's result", () => {
      return expect(loader.current.load()).resolves.toEqual(items)
    })
  })

  describe("finished", () => {
    let loader: RenderHookResult<any, ProgressiveLoader<any>>["result"]
    let loadFn: jest.Mock

    beforeEach(() => {
      loadFn = jest.fn(() => null)
      loader = renderHook(() =>
        useProgressiveLoader({initial: [], load: loadFn})
      ).result
    })

    it("changes state to finished when the loader callback returns null", () => {
      expect(loader.current.finished).toBe(false)
      loader.current.load()
      expect(loader.current.finished).toBe(true)
    })

    it("does not call the loader callback when finished", () => {
      loader.current.load()
      loader.current.load()
      loader.current.load()

      expect(loadFn).toHaveBeenCalledTimes(1)
    })
  })
})
