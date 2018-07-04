import * as React from "react";
import { Color } from "../../../utility";
import { Editor, rgbColor } from "../../../utility/dom";
import ToolbarItem from "../ToolbarItem";


interface Props {
}
interface State {
    color: Color
}


class ToolbarColour extends React.PureComponent<Props, State> {
    state = {
        color: {
            red: 0,
            green: 0,
            blue: 0
        } as Color
    }

    // TODO: React | Implement to be Word-like color select.
    colorChange(event: React.ChangeEvent<HTMLInputElement>) {
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
                <input
                    type="color"
                    onChange={(e) => this.colorChange(e) }
                    onContextMenu={(e) => {
                        e.preventDefault()
                        this.setTextColor(this.state.color)
                    }}
                />
            </ToolbarItem>
        )
    }
}


export default ToolbarColour
