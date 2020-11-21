import {fireEvent, render} from "@testing-library/react"
import {DialogBox} from "../DialogBox"

describe("DialogBox component", () => {
  let closeFn: jest.Mock
  let dialog: Element

  beforeEach(() => {
    closeFn = jest.fn()
    dialog = render(<DialogBox onClose={closeFn}>{null}</DialogBox>).baseElement
      .children[1]
  })

  it("closes when background is clicked", () => {
    const background = dialog.getElementsByTagName("div")[0]
    fireEvent.click(background)

    expect(closeFn).toHaveBeenCalled()
  })

  it("closes when close button is clicked", () => {
    const closeButton = dialog.getElementsByTagName("button")[0]
    fireEvent.click(closeButton)

    expect(closeFn).toHaveBeenCalled()
  })
})
