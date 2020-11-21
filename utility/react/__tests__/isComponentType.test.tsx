import {isComponentType} from "../isComponentType"

function TestComponent() {
  return <div />
}

describe("Is react component type", () => {
  it("matches component type correctly", () => {
    const component = <TestComponent />

    expect(isComponentType(component, TestComponent)).toBeTruthy()
    expect(isComponentType(<div />, TestComponent)).toBeFalsy()
  })
})
