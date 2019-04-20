import * as React from "react"
import {cleanup, fireEvent, render} from "react-testing-library"
import {CHAR_CODE_ENTER} from "../../../utility/dom"
import ConfirmationDialog from "../ConfirmationDialog"

describe("ConfirmationDialog component", () => {
    afterEach(cleanup)

    it("closes when reject button is clicked", () => {
        let closed = false
        const {getByText} = render(
            <ConfirmationDialog
                onClose={() => {
                    closed = true
                }}
            />
        )

        fireEvent.click(getByText("Cancel"))

        expect(closed).toBeTruthy()
    })

    it("closes when accepted", () => {
        let closed = false
        const {getByText} = render(
            <ConfirmationDialog
                onClose={() => {
                    closed = true
                }}
            />
        )

        fireEvent.click(getByText("Okay"))

        expect(closed).toBeTruthy()
    })

    it("is accepted when Enter key is pressed down", () => {
        let closed = false
        const {baseElement} = render(
            <ConfirmationDialog
                onClose={() => {
                    closed = true
                }}
            />
        )

        const dialog = baseElement.children[1]
        fireEvent.keyDown(dialog, {keyCode: CHAR_CODE_ENTER})

        expect(closed).toBeTruthy()
    })

    it("does not close if accepted callback returns false", () => {
        let closed = false
        const {getByText} = render(
            <ConfirmationDialog
                onClose={() => {
                    closed = true
                }}
                onAccept={() => false}
            />
        )

        fireEvent.click(getByText("Okay"))

        expect(closed).toBeFalsy()
    })
})
