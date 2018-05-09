import * as React from "react"
import Dialog from "./Dialog"
// TODO: React | test component.


/**
 * - text - The dialog's text message.
 * -----
 * From Dialog:
 * - onClose --> A valid callback() to close the dialog.
 * - show --> Whether dialog is shown.
 * - title --> The dialog's title.
 */
const MessageDialog = (props) => (
    <Dialog {...props}>
        <div className="l_dialog_content">
            <p>{props.text}</p>
        </div>
        <div className="l_dialog_buttons">
            <button onClick={props.onClose}>Okay</button>
        </div>
    </Dialog>
)


export default MessageDialog
