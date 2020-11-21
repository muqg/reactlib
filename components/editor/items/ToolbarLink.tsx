import {useRef, useState} from "react"
import {styled} from "../../../styles"
import {Editor} from "../../../utility/dom"
import ConfirmationDialog from "../../dialogs/ConfirmationDialog"
import {TextInput} from "../../inputs"
import {TOOLBAR_SPRITESHEET} from "../Toolbar"
import {ToolbarItem} from "../ToolbarItem"

const StyledToolbarItem = styled(ToolbarItem)`
  background-position-x: -144px;
`

/**
 * TODO: Lib | Allow link to be removed with right click.
 */
function ToolbarLink() {
  const [dialog, setDialog] = useState(false)
  // Does not work with useModel hook for some reason.
  const inputElement = useRef<HTMLInputElement>()

  const accept = () => {
    const input = inputElement.current
    if (!input || !input.value) {
      return false
    }

    Editor.createLink(input.value)
  }

  return (
    <StyledToolbarItem
      className="link tb_img"
      title="Hyperlink"
      onClick={() => setDialog(true)}
      backgroundImage={TOOLBAR_SPRITESHEET}
    >
      {dialog && (
        <ConfirmationDialog
          className="tb_link"
          onAccept={accept}
          onClose={() => setDialog(false)}
          title="Въведи адрес:"
        >
          <TextInput
            placeholder="https://example.com"
            ref={inputElement as any}
            wide
          />
        </ConfirmationDialog>
      )}
    </StyledToolbarItem>
  )
}

export {ToolbarLink}
