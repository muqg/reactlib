import * as React from "react";
// TODO: React | test component.

interface Props {
    children?: any
    onClose: (e: React.MouseEvent<any>) => void
    show?: boolean
    title?: string
}


class Dialog extends React.Component<Props> {
    public close: (e: React.MouseEvent<any>) => void

    constructor(public readonly props: Props) {
        super(props)
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
