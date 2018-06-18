import * as React from "react";
import Dialog from "./Dialog";
// TODO: React | test component.

interface Props {
    children?: any
    onAccept?: () => void
    onReject?: () => void
    onClose: (e?: React.MouseEvent<any>) => void
    show?: boolean
    title?: string
}

class ConfirmationDialog extends React.Component<Props> {
    public onAccept: () => void
    public onReject: () => void

    constructor(public readonly props: Props) {
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
