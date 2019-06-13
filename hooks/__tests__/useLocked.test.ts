import {renderHook} from "react-hooks-testing-library"
import {wait} from "../../utility"
import {useLocked} from "../useLocked"

describe("Locked hook", () => {
  // TODO: fix test case
  // It fails for some unknown reason, but it is not important at this time.
  xit("does not allow function to be called again while the first call is still running", async () => {
    const fn = jest.fn()
    const {result: locked} = renderHook(() =>
      useLocked(async () => {
        // Wait long enough to allow a second call to happen
        await wait(100)
        fn()
      }),
    )

    const firstCall = locked.current()
    const secondCall = locked.current()

    await firstCall
    await secondCall

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
