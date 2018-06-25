import * as React from "react"
import Dialog, { DialogProps } from "../dialogs/Dialog"


interface OwnProps {
    text: string
}
type Props = OwnProps & DialogProps


const MessageDialog = (props: Props) => (
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
