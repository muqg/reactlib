import {ReactNode} from "react"
import {Button, DialogBoxProps, DialogProps} from ".."
import {styled} from "../../styles"
import {CHAR_CODE_ENTER} from "../../utility/dom"
import {call} from "../../utility/function"
import {DialogBox} from "./DialogBox"

const StyledDialogBox = styled(DialogBox)`
  /* 100 more than Dialog */
  z-index: 300;
`
const Container = styled.div`
  padding: 24px 12px;
`
const ButtonsContainer = styled.div`
  margin-top: 27px;
  text-align: center;
`
const StyledButton = styled(Button)`
  margin: 0 6px;
`

interface OwnProps {
  children?: ReactNode
  /**
   * Called when dialog resolves successfully. May optionally return a boolean
   * to indicate whether the acception was successful.
   */
  onAccept?: () => void | boolean
  /**
   * Called whenever dialog is canceled (including when closed).
   */
  onReject?: () => void

  /**
   * Text for the cancel (reject) button.
   */
  textCancel?: string
  /**
   * Text for the okay (accept) button.
   */
  textOkay?: string
}
type Props = OwnProps & DialogProps & Omit<DialogBoxProps, "children">

const ConfirmationDialog = ({
  textCancel = "Cancel",
  textOkay = "Okay",
  ...props
}: Props) => {
  const accept = () => {
    const res = call(props.onAccept)
    const success = res !== undefined ? res : true

    if (success) {
      call(props.onClose)
    }
  }

  const reject = () => {
    call(props.onReject)
    call(props.onClose)
  }

  const keyDown: DialogProps["onKeyDown"] = (event) => {
    if (event.keyCode === CHAR_CODE_ENTER) {
      accept()
    }

    call(props.onKeyDown, event)
  }

  return (
    <StyledDialogBox {...props} onKeyDown={keyDown} onClose={reject}>
      <Container>
        <div>{props.children}</div>
        <ButtonsContainer>
          <StyledButton onClick={accept}>{textOkay}</StyledButton>
          <StyledButton onClick={reject}>{textCancel}</StyledButton>
        </ButtonsContainer>
      </Container>
    </StyledDialogBox>
  )
}

export default ConfirmationDialog
