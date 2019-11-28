import {fireEvent, render, RenderResult} from "@testing-library/react"
import * as React from "react"
import {CHAR_CODE_ENTER} from "../../../utility/dom"
import ConfirmationDialog from "../ConfirmationDialog"

describe("ConfirmationDialog component", () => {
  let getByText: RenderResult["getByText"]
  let closeFn: jest.Mock
  let canAccept: boolean

  beforeEach(() => {
    closeFn = jest.fn()
    canAccept = true
    getByText = render(
      <ConfirmationDialog onClose={closeFn} onAccept={() => canAccept}>
        <span>inner_element</span>
      </ConfirmationDialog>
    ).getByText
  })

  it("closes when reject button is clicked", () => {
    fireEvent.click(getByText("Cancel"))

    expect(closeFn).toHaveBeenCalled()
  })

  it("closes when accepted", () => {
    fireEvent.click(getByText("Okay"))

    expect(closeFn).toHaveBeenCalled()
  })

  it("is accepted when Enter key is pressed down", () => {
    fireEvent.keyDown(getByText("inner_element"), {
      keyCode: CHAR_CODE_ENTER,
    })

    expect(closeFn).toHaveBeenCalled()
  })

  it("does not close if accept callback returns false", () => {
    canAccept = false
    fireEvent.click(getByText("Okay"))

    expect(closeFn).not.toHaveBeenCalled()
  })
})
