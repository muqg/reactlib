import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {styled} from "../../../styles"

const StyledToolbarItem = styled(ToolbarItem)`
  background-position-x: -168px;
`

interface Props {}

const ToolbarOrderedList = (_props: Props) => {
  return (
    <StyledToolbarItem
      onClick={Editor.orderedList}
      title="Ordered list"
      backgroundImage={TOOLBAR_SPRITESHEET}
    />
  )
}

export {ToolbarOrderedList}
