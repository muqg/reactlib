import * as React from "react"
import {cleanup, fireEvent, render} from "react-testing-library"
import {CHAR_CODE_ESCAPE} from "../../../utility/dom"
import {Dialog} from "../Dialog"

describe("Dialog component", () => {
    let closeFn: jest.Mock
    let dialog: Element

    beforeEach(() => {
        cleanup()

        closeFn = jest.fn()
        dialog = render(<Dialog children={() => null} onClose={closeFn} />)
            .baseElement.children[1]
    })

    it("is focused after mounting", () => {
        expect(document.activeElement).toBe(dialog)
    })

    it("closes when Escape key is pressed down", () => {
        fireEvent.keyDown(dialog, {keyCode: CHAR_CODE_ESCAPE})

        expect(closeFn).toHaveBeenCalled()
    })
})
