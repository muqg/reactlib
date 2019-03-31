import * as React from "react"
import {useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import {createGlobalStyle, css, styled} from "../../styles"
import {CHAR_CODE_ESCAPE, Hotkey, isKeyPressed} from "../../utility/dom"
import {call} from "../../utility/function"
import {useInitialRender} from "../../hooks"

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
    opacity: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    transition: opacity 0.25s ease;
    z-index: -1;

    ${(p: StyleProps) =>
        p.visible &&
        css`
            opacity: 1;
            z-index: 200;
        `}
`

interface StyleProps {
    visible?: boolean
}

export interface DialogProps {
    /**
     * Used for styling the outermost div container for the
     * dialog. Do NOT use to stlye any children elements.
     */
    className?: string
    /**
     * Whether the dialog is currently visible or not.
     */
    isVisible: boolean
    /**
     * Called when dialog is closed.
     */
    onClose?: () => void
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
    /**
     * Called when dialog's visibility changes and is
     * typically used to mirror its visibility state.
     */
    visibilityChange?: (isVisible: boolean) => void
}

interface Dialog extends DialogProps {
    children: (close: () => void) => React.ReactNode
}

function Dialog(props: Dialog) {
    const [visible, setVisible] = useState(props.isVisible || false)
    const dialogRef = useRef<any>(null)
    const initialRender = useInitialRender()

    useEffect(() => {
        if (visible !== props.isVisible) {
            setVisible(props.isVisible)
        }
    }, [props.isVisible])

    useEffect(() => {
        call(props.visibilityChange, visible)

        if (visible) {
            call(props.onShow)

            const dialog = dialogRef.current
            if (dialog) {
                dialog.focus()
                dialog.scrollTop = 0
            }
        } else if (!initialRender) {
            call(props.onClose)
        }
    }, [visible])

    function keyDown(event: React.KeyboardEvent) {
        if (isKeyPressed(ESCAPE_HOTKEY, event)) setVisible(false)

        const dialog = dialogRef.current
        if (dialog) call(props.onKeyDown, event)

        stop(event)
    }

    function stop(e: React.KeyboardEvent) {
        e.stopPropagation()
    }

    return createPortal(
        <Container
            className={props.className}
            ref={dialogRef}
            onKeyDown={keyDown}
            onKeyPress={stop}
            onKeyUp={stop}
            tabIndex={-1}
            visible={visible}
        >
            {visible && (
                <>
                    {props.children(() => setVisible(false))}
                    <DisabledBodyScroll />
                </>
            )}
        </Container>,
        document.body
    )
}

export {Dialog}
