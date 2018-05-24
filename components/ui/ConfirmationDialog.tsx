import * as React from "react";
import Dialog from "./Dialog";
// TODO: React | test component.

interface IProps {
    children?: any
    onAccept?: () => void
    onReject?: () => void
    onClose: (e?: React.MouseEvent<any>) => void
    show?: boolean
    title?: string
}

/**
 * - onAccept - A callback() for when dialog is accepted.
 * - onReject - A callback() for when dialog is rejected.
 * -----
 * From Dialog:
 * - onClose --> A valid callback() to close the dialog.
 * - show --> Whether dialog is shown.
 * - title --> The dialog's title.
 */
class ConfirmationDialog extends React.Component {
    public onAccept: () => void
    public onReject: () => void

    constructor(public props: IProps) {
        super(props)

        this.onAccept = this.props.onAccept || (() => {})
        this.onReject = this.props.onReject || (() => {})
    }

    accept() {
        this.props.onClose()
        this.onAccept()
    }

    reject() {
        this.props.onClose()
        this.onReject()
    }

    render() {
        return(
            <Dialog
                show={this.props.show}
                onClose={this.props.onClose}
                title={this.props.title}
            >
                <div className="l_dialog_content">
                    {this.props.children}
                </div>
                <div className="l_dialog_buttons">
                    <button onClick={this.accept}>Okay</button>
                    <button onClick={this.reject}>Cancel</button>
                </div>
            </Dialog>
        )
    }
}


export default ConfirmationDialog
