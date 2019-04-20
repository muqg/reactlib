import * as React from "react"
import {cleanup, fireEvent, render} from "react-testing-library"
import {DialogBox} from "../DialogBox"

describe("DialogBox component", () => {
    afterEach(cleanup)

    it("closes when background is clicked", () => {
        let closed = false
        const {baseElement} = render(
            <DialogBox
                children={null}
                onClose={() => {
                    closed = true
                }}
            />
        )
        const dialog = baseElement.children[1]
        const background = dialog.getElementsByTagName("div")[0]

        fireEvent.click(background)

        expect(closed).toBeTruthy()
    })

    it("closes when close button is clicked", () => {
        let closed = false
        const {baseElement} = render(
            <DialogBox
                children={null}
                onClose={() => {
                    closed = true
                }}
            />
        )
        const dialog = baseElement.children[1]
        const closeButton = dialog.getElementsByTagName("button")[0]

        fireEvent.click(closeButton)

        expect(closed).toBeTruthy()
    })
})
