import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"

interface Props {}

const ToolbarSuperscript = (_props: Props) => {
  return (
    <ToolbarItem onClick={Editor.superscript} title="Superscript">
      <p>
        x<sup>2</sup>
      </p>
    </ToolbarItem>
  )
}

export {ToolbarSuperscript}
