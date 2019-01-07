import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { styled } from "../../styles";
import { flex, position } from "../../styles/mixins";
import { CHAR_CODE_ESCAPE, Hotkey, isKeyPressed } from "../../utility/dom";
import { call } from "../../utility/function";


const ESCAPE_HOTKEY = new Hotkey({keyCode: CHAR_CODE_ESCAPE})


const Container = styled.div`
    background: transparent;
    box-sizing: border-box;
    display: none;
    height: 100%;
    overflow: auto;
    width: 100%;
    z-index: 200;
    ${position("fixed", "0", "", "", "0")}

    ${(p: StyleProps) => p.visible && flex("center", "center")}

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #aaa;
        border-radius: 12px;
    }
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
    onKeyDown?: (e: React.KeyboardEvent, dialog: HTMLDivElement) => void
    /**
     * Called when dialog is shown.
     */
    onShow?: (dialog: HTMLDivElement) => void
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

    useEffect(() => {
        if(visible !== props.isVisible)
            setVisible(props.isVisible)
    }, [props.isVisible])

    useEffect(() => {
        call(props.visibilityChange, visible)

        if(visible) {
            const dialog = dialogRef.current
            if(dialog) {
                requestAnimationFrame(() => {
                    dialog.focus()
                    dialog.scrollTop = 0
                    call(props.onShow, dialog)
                })
            }
        }
        else {
            call(props.onClose)
        }
    }, [visible])

    function keyDown(event: React.KeyboardEvent) {
        if(isKeyPressed(ESCAPE_HOTKEY, event))
            setVisible(false)

        const dialog = dialogRef.current
        if(dialog)
            call(props.onKeyDown, event, dialog)
    }

    return createPortal(
        <Container
            className={props.className}
            ref={dialogRef}
            onKeyDown={keyDown}
            tabIndex={-1}
            visible={visible}
        >
            {visible &&
                props.children(() => setVisible(false))
            }
        </Container>,
        document.body
    )
}


export { Dialog };

