import {ChangeEvent, PureComponent} from "react"
import {styled} from "../../../styles"
import {Color} from "../../../utility"
import {Editor, rgbColor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"

const StyledInput = styled.input`
  border: none;
  width: 24px;
`

interface Props {}
interface State {
  color: Color
}

class ToolbarColour extends PureComponent<Props, State> {
  state = {
    color: {
      red: 0,
      green: 0,
      blue: 0,
    } as Color,
  }

  // TODO: Lib | Implement to be Word-like color select.
  colorChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const color = rgbColor(input.value)

    this.setTextColor(color)
    this.setState({color})
  }

  setTextColor(color: Color) {
    Editor.foreColor(color.red, color.green, color.blue)
  }

  render() {
    return (
      <ToolbarItem className="color" title="Font colour">
        <StyledInput
          type="color"
          onChange={(e) => this.colorChange(e)}
          onContextMenu={(e) => {
            e.preventDefault()
            this.setTextColor(this.state.color)
          }}
        />
      </ToolbarItem>
    )
  }
}

export {ToolbarColour}
