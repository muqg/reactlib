import {fireEvent, render} from "@testing-library/react"
import {createRef} from "react"
import {ParseableElement, parseNoNewlineString} from "../InputParsers"

const ParseableHTMLElements = ["select", "input", "textarea", "button"]

describe("parseNoNewlineString() parser", () => {
  it("works for ChangeEvents", (done) => {
    function onClick(input: any) {
      expect(parseNoNewlineString(input)).toBe("test")
      done()
    }

    const element = createRef<HTMLInputElement>()
    render(<input ref={element} onClick={onClick} value="test" />)

    fireEvent.click(element.current!)
  })

  it.each(ParseableHTMLElements)(
    "works for HTMLElements with value property (%s element)",
    (elementType) => {
      const element = document.createElement(elementType) as ParseableElement
      element.value = "test"

      if (element instanceof HTMLSelectElement) {
        const opt = document.createElement("option") as HTMLOptionElement
        opt.value = "test"
        opt.selected = true
        element.appendChild(opt)
      }

      expect(parseNoNewlineString(element)).toBe("test")
    }
  )

  it.each(["test", "t\nest", "t\n\nes\nt\n"])(
    "works for strings with different newlines",
    (input) => {
      expect(parseNoNewlineString(input)).toBe("test")
    }
  )
})
