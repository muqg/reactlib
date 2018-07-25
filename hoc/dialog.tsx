import * as React from "react";
import { css, styled } from "../styles";
import { wait } from "../utility";
import { CHAR_CODE_ESCAPE } from "../utility/dom";


const ESCAPE_HOTKEY: Hotkey = {
    charCode: CHAR_CODE_ESCAPE,
    alt: false,
    ctrl: false,
    shift: false
}
const RENDER_WAIT_TIME = 30


const visibleStyle = css`
    opacity: 1;
    visibility: visible;
`
const Dialog = styled.div`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: fixed;
    top: 0;
    transition: .25s;
    transition-property: opacity, visibility;
    visibility: hidden;
    width: 100%;
    z-index: 200;

    ${(p: StyleProps) => p.visible && visibleStyle}
`


interface StyleProps {
    visible?: boolean
}

interface PrivateProps {
    /**
     * Closes the dialog.
     */
    closeDialog: () => void
    /**
     * Shows the dialog.
     */
    showDialog: () => void
}

interface PublicProps {
    /**
     * Used for styling the outermost div container for the
     * dialog. Do NOT use to stlye any children elements.
     */
    className?: string
    /**
     * A window-wide hotkey for the dialog.
     */
    globalHotkey?: Hotkey
    /**
     * Whether the dialog is currently visible or not.
     */
    isVisible: boolean
    /**
     * Called when dialog is closed.
     */
    onClose: (dialog: HTMLDivElement) => void
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
}

interface State {
    isVisible: boolean
}

interface Hotkey {
    alt: boolean
    charCode: number
    ctrl: boolean
    shift: boolean
}

export type DialogProps = PrivateProps


function dialog<OP extends {}>(WrappedComponent: React.ComponentType<OP & DialogProps>): React.ComponentType<OP & PublicProps> {

    class withDialog extends React.Component<OP & PublicProps, State> {
        static displayName: string

        state: State = {
            isVisible: false
        }
        dialog = React.createRef<HTMLDivElement>()

        componentDidMount() {
            if(this.props.globalHotkey)
                window.addEventListener("keydown", () => {})
        }

        componentWillUnmount() {
            if(this.props.globalHotkey)
                window.addEventListener("keydown", () => {})
        }

        async componentDidUpdate(prevProps: PublicProps, prevState: State) {
            const stateVisible = this.state.isVisible
            const propsVisible = this.props.isVisible

            if(propsVisible !== prevProps.isVisible && stateVisible !== propsVisible)
                this.toggle(propsVisible || false)


            const dialog = this.dialog.current
            if(!dialog)
                return

            if(stateVisible && !prevState.isVisible) {
                // Wait in order to allow for all elements to
                // fully render and allow proper interactions.
                await wait(RENDER_WAIT_TIME)
                dialog.focus()

                if(this.props.onShow)
                    this.props.onShow(dialog)
            }
            else if(!stateVisible && prevState.isVisible) {
                if(this.props.onClose)
                    this.props.onClose(dialog)
            }
        }

        toggle(visible?: boolean) {
            this.setState(prevState => {
                return {
                    isVisible: visible || !prevState.isVisible
                }
            })
        }

        click = (event: React.MouseEvent<any>) => {
            // Do NOT allow click evebt to propagate outside React.createPortal().
            event.stopPropagation()
        }

        keyDown = (event: React.KeyboardEvent) => {
            // Do NOT allow keyboard event to propagate outside React.createPortal().
            event.stopPropagation()

            const {globalHotkey} = this.props
            if(this._isPressed(ESCAPE_HOTKEY, event))
                this.toggle(false)
            else if(globalHotkey && this._isPressed(globalHotkey!, event))
                this.toggle()

            const dialog = this.dialog.current
            if(dialog && this.props.onKeyDown)
                this.props.onKeyDown(event, dialog)
        }

        _isPressed(key: Hotkey, event: KeyboardEvent | React.KeyboardEvent) {
            return (
                key.charCode === event.keyCode &&
                key.alt === event.altKey &&
                key.ctrl === event.ctrlKey &&
                key.shift === event.shiftKey
            )
        }

        render() {
            return (
                <Dialog
                    className={this.props.className}
                    innerRef={this.dialog}
                    onClick={this.click}
                    onKeyDown={this.keyDown}
                    tabIndex={-1}
                    visible={this.state.isVisible}
                >
                    <WrappedComponent
                        {...this.props}
                        closeDialog={() => this.toggle(false)}
                        showDialog={() => this.toggle(true)}
                    />
                </Dialog>
            )
        }
    }


    const name = WrappedComponent.displayName || WrappedComponent.name || "Component"
    withDialog.displayName = `Dialog(${name})`
    return withDialog
}


export { dialog };
