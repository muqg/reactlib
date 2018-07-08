import * as React from "react";
import Dialog, { DialogProps } from "../dialogs/Dialog";
import { GUI_BUTTON_CLASS } from "../const";
import "../../css/button.css"
import { isUndefined } from "util";
import { CHAR_CODE_ENTER, CHAR_CODE_ESCAPE } from "../../utility/dom";

interface OwnProps {
    children?: any
    /**
     * Called when dialog resolves successfully. May optionally return a boolean
     * to indicate whether the acception was successful.
     */
    onAccept: (container: HTMLDivElement, event: React.MouseEvent<any>) => void | boolean
    /**
     * Called whenever dialog is canceled (including when closed).
     */
    onReject?: (container: HTMLDivElement, event: React.SyntheticEvent<any>) => void
}
type Props = OwnProps & DialogProps


const ConfirmationDialog = (props: Props) => {
    const container = React.createRef<HTMLDivElement>()

    const accept = (event: React.MouseEvent<any>) => {
        const res = props.onAccept(container.current as HTMLDivElement, event)

        const success = !(isUndefined(res)) ? res : true
        if(success && props.onClose)
            props.onClose(event)
    }

    const reject = (event: React.SyntheticEvent<any>) => {
        if(props.onReject)
            props.onReject(container.current as HTMLDivElement, event)

        if(props.onClose)
            props.onClose(event)
    }

    const keyDown = (dialogElement: HTMLDivElement, event: React.KeyboardEvent) => {
        if(props.onKeyDown)
            props.onKeyDown(dialogElement, event)
        handleKeyDown(dialogElement, event)
    }

    return(
        <Dialog {...props} onClose={reject} onKeyDown={keyDown}>
            <div className="content" ref={container}>
                {props.children}
            </div>
            <div className="buttons">
                <button className={GUI_BUTTON_CLASS} onClick={accept}>Okay</button>
                <button className={GUI_BUTTON_CLASS} onClick={reject}>Cancel</button>
            </div>
        </Dialog>
    )
}

function handleKeyDown(dialogElement: HTMLDivElement | null, event: React.KeyboardEvent) {
    if(!dialogElement)
        return

    const buttons = dialogElement.querySelectorAll(".buttons > button")

    switch(event.keyCode) {
        case CHAR_CODE_ENTER:
            const acceptButton = buttons[0] as HTMLButtonElement | undefined
            if(acceptButton)
                acceptButton.click()
            break
        case CHAR_CODE_ESCAPE:
            const rejectButton = buttons[1] as HTMLButtonElement | undefined
            if(rejectButton)
                rejectButton.click()
            break
    }
}


export default ConfirmationDialog
