import {ToolbarItem} from "../ToolbarItem"
import {Editor} from "../../../utility/dom"

interface Props {}

const ToolbarStrikethrough = (_props: Props) => {
  return (
    <ToolbarItem onClick={Editor.strikeThrough} title="Strikethrough">
      <s>abc</s>
    </ToolbarItem>
  )
}

export {ToolbarStrikethrough}
