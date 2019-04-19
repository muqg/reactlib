import {renderHook} from "react-hooks-testing-library"
import {wait} from "../../utility"
import {useLocked} from "../useLocked"

describe("Hook useLocked", () => {
    it("does not allow function to be called again while the first call is still running", async () => {
        let run = 0
        const {result: locked} = renderHook(() =>
            useLocked(async () => {
                // Wait long enough to allow a second call to happen
                await wait(100)
                run += 1
            })
        )

        const firstCall = locked.current()
        const secondCall = locked.current()

        await firstCall
        await secondCall

        expect(run).toBe(1)
    })
})
