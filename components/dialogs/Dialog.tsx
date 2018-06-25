import * as React from "react";
import "../../css/dialog.css";
import { StyleClass, wait } from "../../utility";
import { classNames } from "../../utility/dom";
import { CloseButton } from "..";


export interface DialogProps extends Props {}

interface Props {
    children?: any
    /**
     * Class names for the dialog .l_dialog element.
     */
    className?: string
    /**
     * Whether dialog is visible or not.
     */
    visible?: boolean
    /**
     * Dialog's title.
     */
    title?: string
    /**
     * Called when a key press down occurs on the focused dialog.
     */
    onKeyDown?: (dialogElement: HTMLDivElement | null, event: React.KeyboardEvent) => void
    /**
     * Called when dialog is closed (hidden from visibility).
     */
    onClose?: (event: React.SyntheticEvent<any>) => void
    /**
     * Called when dialog is opened (becomes visible).
     */
    onOpen?: (dialogElement: HTMLDivElement | null) => void
}

interface State {
    isVisible: boolean
}


class Dialog extends React.Component<Props, State> {
    wasClosed = true
    dialogElement = React.createRef<HTMLDivElement>()

    constructor(public readonly props: Props) {
        super(props)

        this.close = this.close.bind(this)

        this.state = {
            isVisible: this.props.visible || false
        }
    }

    async componentDidUpdate(prevProps: Props) {
        if(this.props.visible !== prevProps.visible) {
            const visibility = this.props.visible || false
            this.setState({isVisible: visibility})
            // If it becomes visible then it was already closed thus it is equal to visibility.
            this.wasClosed = visibility
        }

        if(this.wasClosed && this.state.isVisible) {
            this.wasClosed = false

            if(this.props.onOpen) {
                // Wait before calling open callback since dom interactions don't
                // always work correctly if children are not yet rendered or updated.
                await wait(30)
                this.props.onOpen(this.dialogElement.current)
            }
        }
    }

    close(event: React.SyntheticEvent<any>) {
        this.setState({isVisible: false})
        this.wasClosed = true

        if(this.props.onClose)
            this.props.onClose(event)
    }

    keyDown(event: React.KeyboardEvent) {
        if(this.props.onKeyDown)
            this.props.onKeyDown(this.dialogElement.current, event)
    }

    render() {
        const classes = classNames(
            "l_dialog",
            this.props.className,
            this.state.isVisible ? StyleClass.Active : "",
        )

        return (
            <div
                className={classes}
                onClick={e => e.stopPropagation()}
                onKeyDown={e => this.keyDown(e)}
                ref={this.dialogElement}
                tabIndex={1}
            >
                <div className="back" onClick={this.close}></div>
                <div className="wrapper">
                    <CloseButton onClick={this.close} />
                    <div className="container">
                        <p className="title">{this.props.title}</p>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}


export default Dialog
