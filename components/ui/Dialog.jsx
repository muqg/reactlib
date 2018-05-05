import * as React from "react"
// TODO: React | test component.

class Dialog extends React.Component {
    /**
     * A base Dialog component.
     * @param {object} props
     * - show --> Whether dialog is shown.
     * - onClose --> Callback to close the dialog.
     * - title --> The dialog's title.
     */
    constructor(props) {
        super(props)

        if(typeof this.props.onClose !== "function")
            throw("Dialog onClose property is required and must be a valid callback.")
        this.close = this.props.onClose
    }

    render() {
        if(!this.props.show)
            return null

        return (
            <React.Fragment>
                <div className="l_dialog_back" onClick={this.close}></div>
                <div className="l_dialog_wrapper">
                    <button className="l_dialog_close" onClick={this.close}>X</button>
                    <div className="l_dialog_container">
                        <h2 className="l_dialog_title">{this.props.title}</h2>
                        {this.props.children}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default Dialog
