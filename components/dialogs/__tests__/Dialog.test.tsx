import * as React from "react"
import {cleanup, fireEvent, render} from "react-testing-library"
import {CHAR_CODE_ESCAPE} from "../../../utility/dom"
import {Dialog} from "../Dialog"

describe("Dialog component", () => {
    afterEach(cleanup)

    it("is focused after mounting", () => {
        const {baseElement} = render(
            <Dialog children={() => null} onClose={() => {}} />
        )
        const dialog = baseElement.children[1]

        expect(document.activeElement).toBe(dialog)
    })

    it("closes when Escape key is pressed down", () => {
        let closed = false

        const {baseElement} = render(
            <Dialog
                children={() => null}
                onClose={() => {
                    closed = true
                }}
            />
        )

        const dialog = baseElement.children[1]
        fireEvent.keyDown(dialog, {keyCode: CHAR_CODE_ESCAPE})

        expect(closed).toBeTruthy()
    })
})
