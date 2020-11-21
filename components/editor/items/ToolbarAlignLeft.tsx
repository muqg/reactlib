import {Editor} from "../../../utility/dom"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {ToolbarItem} from "../ToolbarItem"
import {styled} from "../../../styles"

const StyledToolbarItem = styled(ToolbarItem)`
  background-position-x: -48px;
`

interface Props {}

const ToolbarAlignLeft = (_props: Props) => {
  return (
    <StyledToolbarItem
      onClick={() => Editor.align("left")}
      title={"Align left"}
      backgroundImage={TOOLBAR_SPRITESHEET}
    />
  )
}

export {ToolbarAlignLeft}
