import {Editor} from "../../../utility/dom"
import {ToolbarItem} from "../ToolbarItem"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {styled} from "../../../styles"

const StyledToolbarItem = styled(ToolbarItem)`
  background-position-x: -96px;
`

interface Props {}

const ToolbarOutdent = (_props: Props) => {
  return (
    <StyledToolbarItem
      onClick={Editor.outdent}
      title="Outdent"
      backgroundImage={TOOLBAR_SPRITESHEET}
    />
  )
}

export {ToolbarOutdent}
