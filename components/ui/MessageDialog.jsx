import * as React from "react"
import Dialog from "./Dialog"
// TODO: React | test component.

/**
 * @param {object} props Any valid props for Dialog in addition to:
 * - text --> The message's text.
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
