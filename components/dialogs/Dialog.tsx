import * as React from "react"
import {useEffect, useRef} from "react"
import {createPortal} from "react-dom"
import {createGlobalStyle, styled} from "../../styles"
import {CHAR_CODE_ESCAPE, Hotkey, isKeyPressed} from "../../utility/dom"
import {call} from "../../utility/function"

const ESCAPE_HOTKEY = new Hotkey({keyCode: CHAR_CODE_ESCAPE})

const DisabledBodyScroll = createGlobalStyle`
    body {
        overflow: hidden !important;
    }
`
const Container = styled.div`
  align-items: center;
  background: transparent;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 200;
`

export interface DialogProps {
  /**
   * Used for styling the outermost div container for the
   * dialog. Do NOT use to stlye any children elements.
   */
  className?: string
  /**
   * Called when dialog is closed.
   */
  onClose: () => void
  /**
   * Called any time a key is pressed down.
   *
   * - Escape key is bound by default to close the dialog.
   */
  onKeyDown?: (e: React.KeyboardEvent) => void
  /**
   * Called when dialog is shown.
   */
  onShow?: () => void
}

interface Dialog extends DialogProps {
  children: (close: () => void) => React.ReactNode
}

function Dialog({onClose, onKeyDown, onShow, ...props}: Dialog) {
  const dialogRef = useRef<any>(null)

  useEffect(() => {
    call(onShow)

    const dialog = dialogRef.current
    if (dialog) {
      dialog.focus()
      dialog.scrollTop = 0
    }
  }, [onClose, onShow])

  function keyDown(event: React.KeyboardEvent) {
    stopEvent(event)

    if (isKeyPressed(ESCAPE_HOTKEY, event)) {
      call(onClose)
    }
    call(onKeyDown, event)
  }

  function stopEvent(e: React.SyntheticEvent) {
    e.stopPropagation()
  }

  return createPortal(
    <Container
      className={props.className}
      ref={dialogRef}
      onKeyDown={keyDown}
      onKeyPress={stopEvent}
      onKeyUp={stopEvent}
      onClick={stopEvent}
      tabIndex={-1}
    >
      {props.children(onClose)}
      <DisabledBodyScroll />
    </Container>,
    document.body,
  )
}

export {Dialog}
